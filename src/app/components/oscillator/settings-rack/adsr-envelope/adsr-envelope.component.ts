import { WindowEventsService } from '../../../../services/events/window-events.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, } from '@angular/forms';
import { UtilitiesService } from './../../../../services/utilities.service';

import {
    EnvelopeService,
    EnvelopePart,
    CurveType,
    ReleaseCurve,
    AttackCurve,
    DecayCurve,
    handleType,
    SustainCurve
} from './envelope.service';

import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Renderer2,
    HostListener,
    forwardRef
} from '@angular/core';

import {FLOOR, CIEL } from './envelope.service';

export interface Ienvelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    attackCurve: string;
    decayCurve: string;
    releaseCurve: string;
}


@Component({
  selector: 'app-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AdsrEnvelopeComponent),
    multi: true
}]
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor(
        private renderer: Renderer2,
        private envService: EnvelopeService,
        private windowEvents: WindowEventsService,
        private utils: UtilitiesService
    ) {
        this.envService.renderer = renderer;
    }

    private leftMargin;
    private rightMargin;
    private travelUnit;
    private secondSector;

    onChange;

    curvesSelectorItems = ['Lin', 'Exp', 'Cos'];

    private containerLimit = {
        h: null,
        w: null
    };

    private containerWidth = null;
    private containerHeight = null;

    private Xmargin = null;
    private readonly envWidth = 240;

    private envBody;
    private availableTravel: number;

    private attackCurve;
    private decayCurve;
    private releaseCurve;

    private envData;

    private beginHandle;
    private attackHandle;
    private decayHandle;
    private sustainHandle;
    private sustainEndHandle;
    private releaseHandle;

    private qAttackHandle;
    private qReleaseHandle;
    private qDecayHandle;

    private limitContainer;

    private handleCurrentlyClicked = false;

    private activeHandle;

    private envelopeData;

    private _svgContainer: ElementRef;
    @ViewChild('svgContainer')
    set svgContainer(e) {
    this._svgContainer = e.nativeElement;
    }
    get svgContainer() { return this._svgContainer; }

    get svgContCoords() {
        return (this.svgContainer as any).getBoundingClientRect();
    }

    private _envelopeContainer: ElementRef;
    @ViewChild('envelopeContainer')
    set envelopeContainer(e) {this._envelopeContainer = e.nativeElement; }
    get envelopeContainer() {return this._envelopeContainer; }


    private manipulateEnvelope() {

    const data = this.envData;

    const b = data.b;
    const a = data.a;
    const d = data.d;
    const s = data.s;
    const r = data.r;

    this.renderer.setAttribute(this.envBody, 'd',
            [
                'M',
                this.Xmargin,
                ',',
                FLOOR,
                new AttackCurve(data).asString(),
                a.x,
                ',',
                a.y,
                new DecayCurve(data).asString(),
                d.x,
                ',',
                d.y,
                new SustainCurve(data).asString(),
                s.x,
                ',',
                s.y,
                new ReleaseCurve(data).asString(),
                r.x,
                ',',
                r.y
            ].join('')
        );

        this.renderer.setAttribute(this.beginHandle, 'cx', b.x);
        this.renderer.setAttribute(this.beginHandle, 'cy', b.y.toString());

        this.renderer.setAttribute(this.attackHandle, 'cx', a.x);
        this.renderer.setAttribute(this.attackHandle, 'cy', a.y);

        this.renderer.setAttribute(this.decayHandle, 'cx', d.x);
        this.renderer.setAttribute(this.decayHandle, 'cy', d.y);

        this.renderer.setAttribute(this.sustainHandle, 'cx', s.x);
        this.renderer.setAttribute(this.sustainHandle, 'cy', s.y);

        this.renderer.setAttribute(this.releaseHandle, 'cx', r.x);
        this.renderer.setAttribute(this.releaseHandle, 'cy', r.y);

        this.renderer.setAttribute(this.qAttackHandle, 'cx', new AttackCurve(data).asArray()[0].toString());
        this.renderer.setAttribute(this.qAttackHandle, 'cy', new AttackCurve(data).asArray()[1].toString());

        this.renderer.setAttribute(this.qDecayHandle, 'cx', new DecayCurve(data).asArray()[0].toString());
        this.renderer.setAttribute(this.qDecayHandle, 'cy', new DecayCurve(data).asArray()[1].toString());

        this.renderer.setAttribute(this.qReleaseHandle, 'cx', new ReleaseCurve(data).asArray()[0].toString());
        this.renderer.setAttribute(this.qReleaseHandle, 'cy', new ReleaseCurve(data).asArray()[1].toString());

        this.envData.coordsToModel();
    }

    private updateModel(): void {

    }

    private initContainer() {
        this.containerHeight = (this.svgContainer as any).clientHeight;
        this.containerWidth = (this.svgContainer as any).clientWidth;
        this.availableTravel = this.containerWidth - (this.Xmargin * 2);

        this.travelUnit = this.availableTravel / 40;

        this.containerLimit.h = this.containerHeight;
        this.containerLimit.w = this.containerWidth;

        this.Xmargin = (this.containerWidth - this.envWidth) / 2;

        this.leftMargin = this.Xmargin;
        this.rightMargin = this.containerWidth - this.Xmargin;

        this.renderer.setAttribute(this.envelopeContainer, 'height', this.containerHeight);
        this.renderer.setAttribute(this.envelopeContainer, 'width', this.containerWidth);
        this.renderer.appendChild(this.envelopeContainer, this.envBody);

        this.renderer.appendChild(this.envelopeContainer, this.envBody);


        this.renderer.appendChild(this.envelopeContainer, this.qAttackHandle);
        this.renderer.appendChild(this.envelopeContainer, this.qDecayHandle);
        this.renderer.appendChild(this.envelopeContainer, this.qReleaseHandle);

        this.renderer.appendChild(this.envelopeContainer, this.beginHandle);
        this.renderer.appendChild(this.envelopeContainer, this.attackHandle);
        this.renderer.appendChild(this.envelopeContainer, this.decayHandle);
        this.renderer.appendChild(this.envelopeContainer, this.sustainHandle);
        this.renderer.appendChild(this.envelopeContainer, this.releaseHandle);


    }

    private newHandlePoint(handletype, x: number, y: number): void {
        const handle = handleType[handletype];
        switch (handletype) {
            case(handleType[1]): {
                this.envData.a.x = (x <= this.envData.b.x)
                ? this.envData.a.x
                : (x >= this.envData.d.x)
                ? this.envData.d.x
                : x;
                break;
            }
            case(handleType[2]): {
                this.envData.d.x = (x <= this.envData.a.x)
                ? this.envData.a.x
                : (x < this.envData.s.x)
                ? x
                : this.envData.s.x;
                ['d', 's'].forEach( k => {
                    this.envData[k].y = (y <= this.envData.a.y)
                    ? this.envData.a.y
                    : (y >= this.envData.b.y)
                    ? this.envData.b.y
                    : y;
                });
                break;
            }
            case(handleType[3]): {
                this.envData.s.x = (x <= this.envData.d.x)
                ? this.envData.d.x
                :  (x < this.envData.r.x)
                ? x
                : this.envData.r.x;
                ['d', 's'].forEach( k => {
                    this.envData[k].y = (y <= this.envData.a.y)
                    ? this.envData.a.y
                    : (y >= this.envData.b.y)
                    ? this.envData.b.y
                    : y;
                });
                break;
            }
            case(handleType[4]): {
                this.envData.r.x = (x <= this.envData.s.x)
                ? this.envData.s.x
                :  (x < this.rightMargin)
                ? x
                : this.envData.r.x;
            }
        }
    }

    ngAfterViewInit(): void {
        this.initContainer();
    }

    ngOnInit(): void {
        this.envBody = this.envService.getEnvBody();
        this.beginHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopePart.begin);
        this.attackHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopePart.attack);
        this.decayHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopePart.decay);
        this.sustainHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopePart.sustain);
        this.releaseHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopePart.release);

        this.qAttackHandle = this.envService.qHandle();
        this.qDecayHandle = this.envService.qHandle();
        this.qReleaseHandle = this.envService.qHandle();

    }

    partClicked = (type) => {

        const curveToggle = (currentCurve): number =>  {
            if (currentCurve === 2) {
                return 0;
            } else {
                currentCurve++;
                return currentCurve;
            }
        };

        switch (type) {
            case EnvelopePart.attack: {
                this.envData.attackCurve = curveToggle(this.envData.attackCurve);
                break;
            }
            case EnvelopePart.decay: {
                this.envData.decayCurve = curveToggle(this.envData.decayCurve);
                break;
            }
            case EnvelopePart.release: {
                this.envData.releaseCurve = curveToggle(this.envData.releaseCurve);
            }
        }
        this.manipulateEnvelope();
    }

    public handleClicked = (handle) => {

        this.handleCurrentlyClicked = true;
        this.activeHandle = handleType[parseInt(handle.id, 10)];

        const mouseUp = (() => {
            this.handleCurrentlyClicked = false;
        });

        const mouseMove = (({x, y}) => {
            if (this.handleCurrentlyClicked) {
                const newX = x - this.svgContCoords.left;
                const newY = y - this.svgContCoords.top;
                this.newHandlePoint(
                    this.activeHandle,
                    (newX < 0) ? 0 : newX,
                    (newY < 0) ? 0 : newY,
                );
                this.manipulateEnvelope();
            }
        });

        this.windowEvents.enableDragAndDrop(mouseUp, mouseMove);
    }


    // modelaccessor functions

    onTouched = () => {};

    registerOnTouched(fn: () => void): void {

    }

    setDisabledState(isDisabled: boolean): void {}


    writeValue(envValues: Ienvelope): void {

        if (envValues) {
            this.envData = new EnvelopeCoords(envValues, this.travelUnit, this.Xmargin);
            this.manipulateEnvelope();
        }
    }

    registerOnChange(fn: (rating: boolean) => void): void {
        this.onChange = fn;
    }

}


class EnvelopeCoords {

    public attackCurve: number;

    public decayCurve: number;

    public releaseCurve: number;

    public Xmargin: number;

    public begin = {
        x: null,
        y: null,
    };

    get b() { return this.begin; }

    public attack = {
        x: null,
        y: null,
    };

    get a() { return this.attack; }

    public decay = {
        x: null,
        y: null,
    };

    get d() { return this.decay; }

    public sustain = {
        x: null,
        y: null,
    };

    get s() { return this.sustain; }

    public release = {
        x: null,
        y: null,
    };

    get r() { return this.release; }

    private travelUnit;

    public coordsToModel() {
        return {
            attack: (((this.attack.x - this.begin.x) / this.travelUnit) / 10).toFixed(1),
            decay: (((this.decay.x - this.attack.x) / this.travelUnit) / 10).toFixed(1),
            sustain: (((this.sustain.x - this.decay.x) / this.travelUnit) / 10).toFixed(1),
            release: (((this.release.x - this.sustain.x) / this.travelUnit) / 10).toFixed(1),
        };
    }

    constructor(data: any, travelUnit: number, Xmargin: number) {

        this.travelUnit =       travelUnit;

        this.begin.x =          Xmargin;
        this.begin.y =          FLOOR;

        this.attack.x =         this.begin.x + ((data.attack * 10) * travelUnit);
        this.attack.y =         CIEL;

        this.decay.x =          this.attack.x + ((data.decay * 10) * travelUnit);

        this.sustain.y =        (data.sustain * 10) * travelUnit;

        this.decay.y =          (data.sustain * 10) * travelUnit;

        this.sustain.x =        this.decay.x + ((0.4 * 10) * travelUnit);

        this.release.x =        this.sustain.x + (data.release * 10) * travelUnit;
        this.release.y =        FLOOR;

        this.attackCurve =      data.attackCurve;
        this.decayCurve =       data.decayCurve;
        this.releaseCurve =     data.releaseCurve;

        this.Xmargin =          Xmargin;

        const t = this.coordsToModel();
        console.log(t);
    }
}
