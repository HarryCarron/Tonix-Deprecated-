// todo: change naming convention: 'parts' to be called 'sectors'
// todo: remove dynamic container width code: not needed: move container size to constants
// todo: type all props


import { WindowEventsService } from '../../../../services/events/window-events.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UtilitiesService } from './../../../../services/utilities.service';

import {
    EnvelopeModel,
    ModelToCoordData,
    EnvelopeSector,
    CurveType,
    CurveTypeShort,
    EnvelopeHandleType,
} from './envelope-objects/envelope.objects';

import {
    ModelToCoord,
    CoordsToModel
} from './envelope-objects/model-coord-interface.object';

import { AnimationService } from './../../../../services/animation/animation.service';

import {
    EnvelopeService,
    Begin,
    Release,
    StacattoRelease,
    Attack,
    Decay,
    Sustain
} from './envelope.service';

import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Renderer2,
    forwardRef,
    Input,
    HostListener
} from '@angular/core';

import { FLOOR, CIEL } from './envelope.constants';

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
        private utils: UtilitiesService,
        private animation: AnimationService
    ) {
        this.envService.renderer = renderer;
    }

    // #region [ Props ]

    arr = [0, 1, 2, 3];
    FLOOR = FLOOR;
    CIEL = CIEL;
    test;

    sectorForLoop = ['attack', 'decay', 'sustain', 'release']; // todo: get from enum

    CurveType = CurveTypeShort;
    viewEnvValues;
    private leftMargin;
    private rightMargin;
    private travelUnit;
    private secondSector;

    onChange;

    _isOn: boolean;

    @Input() staccato = false;

    @Input()
    set isOn(o) {
        this._isOn = o;
        this.turnOn(o);
    }

    private containerLimit = {
        h: null,
        w: null
    };

    private containerWidth = null;
    private containerHeight = null;

    public Xmargin = null;
    private readonly envWidth = 240;

    private envBody;
    availableTravel: number;

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

    private attackSector;
    private decaySector;
    private sustainSector;
    private releaseSector;

    private limitContainer;

    private handleCurrentlyClicked = false;

    private activeHandle;

    private envelopeData;
    // #endregion

    // #region [ TemplateBinding ]

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

    // #endregion

    // #region [ ModelAccessor ]

    onTouched = () => {};

    registerOnTouched(fn: () => void): void {}

    setDisabledState(isDisabled: boolean): void {}

    writeValue(envelopeValues: EnvelopeModel): void {

        if (envelopeValues) {
            this.envData = new ModelToCoord(
                {
                    envelopModelValues: envelopeValues,
                    travelUnits: this.travelUnit,
                    xMargin: this.Xmargin,
                    staccato: this.staccato
                }
            );
            this.render();
        }
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    private updateModel(): void {}

    // #endregion

    // #region [ Render ]

    private render(animatedCurve?: EnvelopeSector) {

        const data = this.envData;

        const b = data.b;
        const a = data.a;
        const d = data.d;
        const s = data.s;
        const r = data.r;

        // envelope line

        if (animatedCurve) {
            const ra = new StacattoRelease(data);
            const current = new StacattoRelease(data);
            data.releaseCurve = this.curveToggle(ra.data.releaseCurve);
            const finish = new StacattoRelease(data);

            this.animation.valueToValueAnimation(
                (de) => {


                this.renderer.setAttribute(this.qReleaseHandle, 'cx',
                de[0]);
                this.renderer.setAttribute(this.qReleaseHandle, 'cy',
                de[1]);

                this.renderer.setAttribute(this.envBody, 'd',
                    [
                        new Begin(data).asString(),
                        new Attack(data).asString(),
                        this.staccato ? '' : new Decay(data).asString(),
                        this.staccato ? '' : new Sustain(data).asString(),
                        `Q${de[0]},${de[1]}, ${de[2]},${de[3]},`
                    ].join('')
                );
                // Q${this.Qoutput[0]},${this.Qoutput[1]} ${this.pointOutput[0]},${this.pointOutput[1]}`

            },
            [
                current.asArray()[0],
                current.asArray()[1],
                current.pointOutput[0],
                current.pointOutput[1]
            ]
            ,
            [
                finish.asArray()[0],
                finish.asArray()[1],
                finish.pointOutput[0],
                finish.pointOutput[1]
            ]);
        }

        this.renderer.setAttribute(this.envBody, 'd',
            [
                new Begin(data).asString(),
                new Attack(data).asString(),
                this.staccato ? '' : new Decay(data).asString(),
                this.staccato ? '' : new Sustain(data).asString(),
                this.staccato ? new StacattoRelease(data).asString() : new Release(data).asString(),
            ].join('')
        );



        // begin handle

        this.renderer.setAttribute(this.beginHandle, 'cx', b.x);
        this.renderer.setAttribute(this.beginHandle, 'cy', b.y.toString());

        // attack handle

        this.renderer.setAttribute(this.attackHandle, 'cx', a.x);
        this.renderer.setAttribute(this.attackHandle, 'cy', a.y);

        if (!this.staccato) {

            // decay handle
            this.renderer.setAttribute(this.decayHandle, 'cx', d.x);
            this.renderer.setAttribute(this.decayHandle, 'cy', d.y);

            // decay q point
            this.renderer.setAttribute(this.qDecayHandle, 'cx', new Decay(data).asArray()[0].toString());
            this.renderer.setAttribute(this.qDecayHandle, 'cy', new Decay(data).asArray()[1].toString());

            // sustain handle
            this.renderer.setAttribute(this.sustainHandle, 'cx', s.x);
            this.renderer.setAttribute(this.sustainHandle, 'cy', s.y);
        }

        // release handle
        this.renderer.setAttribute(this.releaseHandle, 'cx', r.x);
        this.renderer.setAttribute(this.releaseHandle, 'cy', r.y);

        // attack q point
        this.renderer.setAttribute(this.qAttackHandle, 'cx', new Attack(data).asArray()[0].toString());
        this.renderer.setAttribute(this.qAttackHandle, 'cy', new Attack(data).asArray()[1].toString());


        // attack sector

        this.renderer.setAttribute(this.attackSector, 'x', b.x);
        this.renderer.setAttribute(this.attackSector, 'y', a.y);
        this.renderer.setAttribute(this.attackSector, 'width', (a.x - this.Xmargin).toString());
        this.renderer.setAttribute(this.attackSector, 'height', (FLOOR - a.y).toString());

        // release sector

        this.renderer.setAttribute(this.releaseSector, 'x', a.x);
        this.renderer.setAttribute(this.releaseSector, 'y', a.y);
        this.renderer.setAttribute(this.releaseSector, 'width', (r.x - a.x).toString());
        this.renderer.setAttribute(this.releaseSector, 'height', (FLOOR - a.y).toString());

        // release q handle
        this.renderer.setAttribute(this.qReleaseHandle, 'cx',
        this.staccato ?  new StacattoRelease(data).asArray()[0].toString() : new Release(data).asArray()[0].toString());
        this.renderer.setAttribute(this.qReleaseHandle, 'cy',
        this.staccato ? new StacattoRelease(data).asArray()[1].toString() : new Release(data).asArray()[1].toString());

        const e = new CoordsToModel(
            {
            coords: this.envData,
            staccato: this.staccato
            }
        );
        this.viewEnvValues = e;
        this.onChange(e);
    }

    private newHandlePoint(
        handletype,
        x: number,
        y: number
        ): void {
        switch (handletype) {
            case(EnvelopeHandleType.attack): {
                if (this.staccato) {
                    this.envData.a.x = (x <= this.envData.b.x)
                    ? this.envData.a.x
                    : (x >= this.envData.r.x)
                    ? this.envData.r.x
                    : x;
                    break;
                } else {
                    this.envData.a.x = (x <= this.envData.b.x)
                    ? this.envData.a.x
                    : (x >= this.envData.d.x)
                    ? this.envData.d.x
                    : x;
                    break;
                }

            }
            case(EnvelopeHandleType.decay): {
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
            case(EnvelopeHandleType.sustain): {
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
            case(EnvelopeHandleType.release): {
                if (this.staccato) {
                    this.envData.r.x = (x <= this.envData.a.x)
                    ? this.envData.a.x
                    :  (x < this.rightMargin)
                    ? x
                    : this.envData.r.x;
                } else {
                    this.envData.r.x = (x <= this.envData.s.x)
                    ? this.envData.s.x
                    :  (x < this.rightMargin)
                    ? x
                    : this.envData.r.x;
                }

            }
        }
    }

    // #endRegion

    // #region [ Initialisation ]

    private initContainer() {

        this.containerHeight = (this.svgContainer as any).clientHeight;
        this.containerWidth = (this.svgContainer as any).clientWidth;
        this.availableTravel = this.containerWidth - (this.Xmargin * 2);
        this.test = this.availableTravel / 4;

        this.travelUnit = this.availableTravel / 40;

        this.containerLimit.h = this.containerHeight;
        this.containerLimit.w = this.containerWidth;

        this.Xmargin = (this.containerWidth - this.envWidth) / 2;

        this.leftMargin = this.Xmargin;
        this.rightMargin = this.containerWidth - this.Xmargin;

        [0, 1, 2, 3].forEach(n => this.renderer.appendChild(this.envelopeContainer,
            this.envService.gridLines(this.Xmargin, n, this.availableTravel, 4)
        ));

        this.renderer.setAttribute(this.envelopeContainer, 'height', this.containerHeight);
        this.renderer.setAttribute(this.envelopeContainer, 'width', this.containerWidth);
        this.renderer.appendChild(this.envelopeContainer, this.envBody);

        this.renderer.appendChild(this.envelopeContainer, this.qAttackHandle);
        this.renderer.appendChild(this.envelopeContainer, this.qReleaseHandle);

        this.renderer.appendChild(this.envelopeContainer, this.attackSector);
        this.renderer.appendChild(this.envelopeContainer, this.releaseSector);

        if (!this.staccato) {
            this.renderer.appendChild(this.envelopeContainer, this.qDecayHandle);
            this.renderer.appendChild(this.envelopeContainer, this.decayHandle);
        }

        if (!this.staccato) {
            this.renderer.appendChild(this.envelopeContainer, this.sustainHandle);
        }
        this.renderer.appendChild(this.envelopeContainer, this.releaseHandle);

        this.renderer.appendChild(this.envelopeContainer, this.beginHandle);
        this.renderer.appendChild(this.envelopeContainer, this.attackHandle);



    }

    showSectorHighlighter(renderer, sectorHighlighter) {
        if (!this.handleCurrentlyClicked) {
            renderer.setAttribute(sectorHighlighter, 'opacity', 1);
        }

    }

    ngOnInit(): void {
        this.envBody = this.envService.getEnvBody(this.Xmargin, this.rightMargin);

        this.beginHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.begin);
        this.attackHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.attack);

        this.attackSector = this.envService.getEnvSector(
            this.sectorClicked,
            EnvelopeSector.attack,
            (rendered, sectorHighlighter) => this.showSectorHighlighter(rendered, sectorHighlighter));

        this.releaseSector = this.envService.getEnvSector(
            this.sectorClicked,
            EnvelopeSector.release,
            (rendered, sectorHighlighter) =>  this.showSectorHighlighter(rendered, sectorHighlighter));

        if (!this.staccato) {
            this.decayHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.decay);
            this.qDecayHandle = this.envService.qHandle();
        }
        this.releaseHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.release);
        this.sustainHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.sustain);

        this.qAttackHandle = this.envService.qHandle();
        this.qReleaseHandle = this.envService.qHandle();

    }

    ngAfterViewInit(): void {
        this.initContainer();
    }

    // #endregion


 // #region [ Events ]


    private turnOn(on): void {
        if (this.attackHandle) {
            this.renderer.setAttribute(this.attackHandle, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.beginHandle, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.releaseHandle, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.envBody, 'opacity', on ? '1' : '0.6');
            this.renderer.setAttribute(this.qAttackHandle, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.qReleaseHandle, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.attackSector, 'visibility', on ? 'visible' : 'hidden');
            this.renderer.setAttribute(this.releaseSector, 'visibility', on ? 'visible' : 'hidden');
        }
    }

    private curveToggle = (currentCurve): number =>  {
        if (currentCurve >= 2) {
            return 0;
        } else {
            currentCurve++;
            return currentCurve;
        }
    };

    sectorClicked = (type) => {

        const curveToggle = (currentCurve): number =>  {
            if (currentCurve === 1) {
                return 0;
            } else {
                currentCurve++;
                return currentCurve;
            }
        };

        switch (type) {
            case EnvelopeSector.attack: {
                // this.envData.attackCurve = curveToggle(this.envData.attackCurve);
                break;
            }
            case EnvelopeSector.decay: {
                // this.envData.decayCurve = curveToggle(this.envData.decayCurve);
                break;
            }
            case EnvelopeSector.release: {
                // this.envData.releaseCurve = curveToggle(this.envData.releaseCurve);
            }
        }
        this.render(type);
    }



    @HostListener('document:mousemove', ['$event'])
    mouseMove({x, y}): void {
        if (this.handleCurrentlyClicked) {
            const newX = x - this.svgContCoords.left;
            const newY = y - this.svgContCoords.top;
            this.newHandlePoint(
                this.activeHandle,
                (newX < 0) ? 0 : newX,
                (newY < 0) ? 0 : newY,
            );
            this.render();
        }
    }

    @HostListener('document:mouseup', ['$event'])
    mouseUp() {
        this.handleCurrentlyClicked = false;
    }


    public handleClicked = (handle) => {

        this.handleCurrentlyClicked = true;
        this.activeHandle = parseInt(handle.id, 10);
    }
 // #endregion

}
