import { WindowEventsService } from '../../../../services/events/window-events.service';

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
    HostListener
} from '@angular/core';

@Component({
  selector: 'app-adr-envelope',
  templateUrl: './adr-envelope.component.html',
  styleUrls: ['./adr-envelope.component.css']
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor(
        private renderer: Renderer2,
        private envService: EnvelopeService,
        private windowEvents: WindowEventsService
    ) {
        this.envService.renderer = renderer;
    }

    activeReleaseCurve = CurveType.linear;
    activeAttackCurve = CurveType.linear;
    activeDecayCurve = CurveType.linear;


    curvesSelectorItems = ['Lin', 'Exp', 'Cos'];

    private containerLimit = {
        h: null,
        w: null
    };

    private floor = 110;
    private ciel = 20;

    private containerWidth = null;
    private containerHeight = null;

    // private readonly Ymargin = 20;
    private Xmargin = null;
    private readonly envWidth = 240;

    private envBody;

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

    private env = {
        b: {
            x: null,
            y: null
        },
        a: {
            x: null,
            y: null
        },
        d: {
            x: null,
            y: null
        },
        s: {
            x: null,
            y: null
        },
        r: {
            x: null,
            y: null
        }
    };

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

    const b = this.env.b;
    const a = this.env.a;
    const d = this.env.d;
    const s = this.env.s;
    const r = this.env.r;

    const data = {
        floor:              this.floor,
        ciel:               this.ciel,
        data:               this.env,
        attackType:         this.activeAttackCurve,
        decayType:         this.activeDecayCurve,
        releaseType:        this.activeReleaseCurve,
        xMargin:            this.Xmargin
    };

    this.renderer.setAttribute(this.envBody, 'd',
            [
                'M',
                b.x,
                ',',
                b.y,
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
        this.renderer.setAttribute(this.beginHandle, 'cy', b.y);

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


    }

    private giveTestCords() { // todo: remove me when taking values from ng-model
        this.env.b.x = this.Xmargin;
        this.env.b.y = this.floor;

        this.env.a.x = 70;
        this.env.a.y = 30;

        this.env.d.x = 100;
        this.env.d.y = 50;
        this.env.s.x = 200;
        this.env.s.y = 50;

        this.env.r.x = this.containerWidth - this.Xmargin;
        this.env.r.y = this.floor;
    }

    private initContainer() {
        this.containerHeight = (this.svgContainer as any).clientHeight;
        this.containerWidth = (this.svgContainer as any).clientWidth;

        this.containerLimit.h = this.containerHeight;
        this.containerLimit.w = this.containerWidth;

        this.Xmargin = (this.containerWidth - this.envWidth) / 2;

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
        switch (handletype) {
            case(handleType[1]): {
                this.env.a.x = (x <= this.env.b.x)
                ? this.env.a.x
                : (x >= this.env.d.x)
                ? this.env.d.x
                : x;
                break;
            }
            case(handleType[2]): {
                this.env.d.x = (x <= this.env.a.x)
                ? this.env.a.x
                : (x < this.env.s.x)
                ? x
                : this.env.s.x;
                ['d', 's'].forEach( k => {
                    this.env[k].y = (y <= this.env.a.y)
                    ? this.env.a.y
                    : (y >= this.env.b.y)
                    ? this.env.b.y
                    : y;
                });
                break;
            }
            case(handleType[3]): {
                this.env.s.x = (x <= this.env.d.x)
                ? this.env.d.x
                :  (x < this.env.r.x)
                ? x
                : this.env.r.x;
                ['d', 's'].forEach( k => {
                    this.env[k].y = (y <= this.env.a.y)
                    ? this.env.a.y
                    : (y >= this.env.b.y)
                    ? this.env.b.y
                    : y;
                });
            }
        }
    }

    ngAfterViewInit(): void {
        this.initContainer();
        this.giveTestCords();
        this.manipulateEnvelope();
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

        switch (type) {
            case EnvelopePart.attack: {
                if (this.activeAttackCurve === 2) {
                    this.activeAttackCurve = 0;
                } else {
                    this.activeAttackCurve = this.activeAttackCurve + 1;
                }
                break;
            }
            case EnvelopePart.decay: {
                if (this.activeDecayCurve === 2) {
                    this.activeDecayCurve = 0;
                } else {
                    this.activeDecayCurve = this.activeDecayCurve + 1;
                }
                break;
            }
            case EnvelopePart.release: {
                if (type === EnvelopePart.release) {
                    if (this.activeReleaseCurve === 2) {
                        this.activeReleaseCurve = 0;
                    } else {
                        this.activeReleaseCurve = this.activeReleaseCurve + 1;
                    }
                }
            }

        }
        this.manipulateEnvelope();
    }

    public handleClicked = (handle) => {

        this.handleCurrentlyClicked = true;
        this.activeHandle = handleType[parseInt(handle.id, 10)];

        const mouseUp = (() => {
            this.handleCurrentlyClicked = false;
        } );

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

}


