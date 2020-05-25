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

    activeReleaseCurve = CurveType.linear;
    activeAttackCurve = CurveType.linear;
    activeDecayCurve = CurveType.linear;

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


    private beginHandle;
    private attackHandle;
    private decayHandle;
    private sustainHandle;
    private sustainEndHandle;
    private releaseHandle;

    private qAttackHandle;
    private qReleaseHandle;
    private qDecayHandle;

    /*
    * Parts: Parts refer to a bounding box which enclose each section of the envelope.
    * They also have a click handler for manipulating curve type.
    */
    private attackPart;
    private decayPart;
    private sustainPart;
    private releasePart;

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

    const data = new EnvelopeForSVG(this.envelopeData, this.travelUnit, this.Xmargin);

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

        this.renderer.setAttribute(this.attackPart, 'x', b.x);
        this.renderer.setAttribute(this.attackPart, 'y', a.y);
        this.renderer.setAttribute(this.attackPart, 'width', (a.x - b.x).toString());
        this.renderer.setAttribute(this.attackPart, 'height', (b.y - a.y).toString());

        this.renderer.setAttribute(this.decayPart, 'x', a.x);
        this.renderer.setAttribute(this.decayPart, 'y', a.y);
        this.renderer.setAttribute(this.decayPart, 'width', (d.x - a.x).toString());
        this.renderer.setAttribute(this.decayPart, 'height', (b.y - a.y).toString());


        this.renderer.setAttribute(this.sustainPart, 'x', d.x);
        this.renderer.setAttribute(this.sustainPart, 'y', d.y);
        this.renderer.setAttribute(this.sustainPart, 'width', (s.x - d.x).toString());
        this.renderer.setAttribute(this.sustainPart, 'height', (b.y - s.y).toString());

        this.renderer.setAttribute(this.releasePart, 'x', s.x);
        this.renderer.setAttribute(this.releasePart, 'y', s.y);
        this.renderer.setAttribute(this.releasePart, 'width', (r.x - s.x).toString());
        this.renderer.setAttribute(this.releasePart, 'height', (b.y - s.y).toString());

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

        this.updateModel();
    }

    private updateModel(): void {

    }

    private initContainer() {
        this.containerHeight = (this.svgContainer as any).clientHeight;
        this.containerWidth = (this.svgContainer as any).clientWidth;
        this.availableTravel = this.containerWidth - (this.Xmargin * 2);
        // this.secondSector = this.availableTravel / 5;
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

        this.renderer.appendChild(this.envelopeContainer, this.attackPart);
        this.renderer.appendChild(this.envelopeContainer, this.decayPart);
        this.renderer.appendChild(this.envelopeContainer, this.sustainPart);
        this.renderer.appendChild(this.envelopeContainer, this.releasePart);

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
        const env = this.envelopeData;
        switch (handletype) {
            case(handleType[1]): {
                console.log(x);
                this.envelopeData.attack = (x === this.envelopeData.begin)
                ? this.envelopeData.begin
                : (x >= this.envelopeData.decay)
                ? this.envelopeData.decay
                : x;
                break;
            }
            // case(handleType[2]): {
                // this.envelopeData.decay = (x <= this.envelopeData.attack)
                // ? this.envelopeData.attack
                // : (x < this.envelopeData.sustain)
                // ? x
                // : this.envelopeData.sustain;
                // ['decay', 'sustain'].forEach( k => {
                //     this.envelopeData[k].y = (y <= this.envelopeData.attack.y)
                //     ? this.envelopeData.attack.y
                //     : (y >= this.envelopeData.begin.y)
                //     ? this.envelopeData.begin.y
                //     : y;
                // });
                // break;
            // }
            // case(handleType[3]): {
            //     this.envelopeData.sustain.x = (x <= this.envelopeData.decay.x)
            //     ? this.envelopeData.decay.x
            //     :  (x < this.envelopeData.release.x)
            //     ? x
            //     : this.envelopeData.release.x;
            //     ['decay', 'ssustain'].forEach( k => {
            //         this.envelopeData[k].y = (y <= this.envelopeData.attack.y)
            //         ? this.envelopeData.attack.y
            //         : (y >= this.envelopeData.begin.y)
            //         ? this.envelopeData.begin.y
            //         : y;
            //     });
            //     break;
            // }
            // case(handleType[4]): {
            //     env.r.x = (x <= env.s.x)
            //     ? env.s.x
            //     :  (x < this.rightMargin)
            //     ? x
            //     : env.r.x;
            // }
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

        this.attackPart = this.envService.getEnvPart(this.partClicked, EnvelopePart.attack);
        this.decayPart = this.envService.getEnvPart(this.partClicked, EnvelopePart.decay);
        this.sustainPart = this.envService.getEnvPart(this.partClicked, EnvelopePart.sustain);
        this.releasePart = this.envService.getEnvPart(this.partClicked, EnvelopePart.release);
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
                this.envelopeData.attackCurve = curveToggle(this.envelopeData.attackCurve);
                break;
            }
            case EnvelopePart.decay: {
                this.envelopeData.decayCurve = curveToggle(this.envelopeData.decayCurve);
                break;
            }
            case EnvelopePart.release: {
                this.envelopeData.releaseCurve = curveToggle(this.envelopeData.releaseCurve);
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
                const a = (x - this.svgContCoords.left) - this.Xmargin;
                const newX = ((a / 10) / this.travelUnit);
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
            this.envelopeData = envValues;
            this.manipulateEnvelope();
        }
    }

    registerOnChange(fn: (rating: boolean) => void): void {
        this.onChange = fn;
    }

}


class EnvelopeForSVG {

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

    constructor(data: any, travelUnit: number, Xmargin: number) {
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
    }
}


// env to px calculation : envValues.attack * 10)  * this.travelUnit

