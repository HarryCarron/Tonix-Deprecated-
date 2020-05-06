import { WindowEventsService } from './../../../../services/events/window-events.service';

import {
    EnvelopeService,
    EnvelopePart,
    CurveType,
    ReleaseCurve,
    AttackCurve,
    handleType
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
export class AdrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor(
        private renderer: Renderer2,
        private envService: EnvelopeService,
        private windowEvents: WindowEventsService
    ) {
      this.envService.renderer = renderer;
  }

    activeReleaseCurve = CurveType.linear;
    activeAttackCurve = CurveType.linear;


    curvesSelectorItems = ['Lin', 'Exp', 'Cos'];

    private containerLimit = {
        h: null,
        w: null
    };

    private floor = 110;
    private ciel = 20;

    private containerWidth = null;
    private containerHeight = null;

    private readonly Ymargin = 20;
    private Xmargin = null;
    private readonly envWidth = 200;

    private envBody;
    private envBeginHandle;
    private envPointHandle;
    private envEndHandle;
    private qAttackHandle;
    private qReleaseHandle;

    private attackPart;
    private releasePart;

    private limitContainer;

    private handleCurrentlyClicked = false;

    private activeHandle;

    private env = {
        b: {
            x: null,
            y: null
        },
        p: {
            x: null,
            y: null
        },
        e: {
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

    private getReleaseCurve(asString: boolean) {

    }

    private manipulateEnvelope() {

    const b = this.env.b;
    const p = this.env.p;
    const e = this.env.e;

    const d = {
        floor:              this.floor,
        ciel:               this.ciel,
        data:               this.env,
        attackType:         this.activeAttackCurve,
        releaseType:        this.activeReleaseCurve,
        xMargin:            this.Xmargin
    };

    this.renderer.setAttribute(this.envBody, 'd',
        [
            'M',
            b.x,
            ',',
            b.y,
            ' ',
            new AttackCurve(d).asString(),
            ' ',
            p.x,
            ',',
            p.y,
            new ReleaseCurve(d).asString(),
            ' ',
            e.x,
            ',',
            e.y
        ].join('')
        );

        this.renderer.setAttribute(this.attackPart, 'x', b.x);
        this.renderer.setAttribute(this.attackPart, 'y', p.y);
        this.renderer.setAttribute(this.attackPart, 'width', (p.x - b.x).toString());
        this.renderer.setAttribute(this.attackPart, 'height', (b.y - p.y).toString());

        this.renderer.setAttribute(this.releasePart, 'x', p.x);
        this.renderer.setAttribute(this.releasePart, 'y', p.y);
        this.renderer.setAttribute(this.releasePart, 'width', (e.x - p.x).toString());
        this.renderer.setAttribute(this.releasePart, 'height', (e.y - p.y).toString());

        this.renderer.setAttribute(this.envBeginHandle, 'cy', b.y);

        this.renderer.setAttribute(this.envBeginHandle, 'cx', b.x);
        this.renderer.setAttribute(this.envBeginHandle, 'cy', b.y);

        this.renderer.setAttribute(this.envPointHandle, 'cx', p.x);
        this.renderer.setAttribute(this.envPointHandle, 'cy', p.y);

        this.renderer.setAttribute(this.envEndHandle, 'cx', e.x);
        this.renderer.setAttribute(this.envEndHandle, 'cy', e.y);

        this.renderer.setAttribute(this.qReleaseHandle, 'cx', new ReleaseCurve(d).asArray()[0].toString());
        this.renderer.setAttribute(this.qReleaseHandle, 'cy', new ReleaseCurve(d).asArray()[1].toString());

        this.renderer.setAttribute(this.qAttackHandle, 'cx', new AttackCurve(d).asArray()[0].toString());
        this.renderer.setAttribute(this.qAttackHandle, 'cy', new AttackCurve(d).asArray()[1].toString());

    }

    private giveTestCords() { // todo: remove me when taking values from ng-model
        this.env.b.x = this.Xmargin;
        this.env.b.y = this.floor;

        this.env.p.x = 70;
        this.env.p.y = 40;

        this.env.e.x = this.containerWidth - this.Xmargin;
        this.env.e.y = this.floor;
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
        this.renderer.appendChild(this.envelopeContainer, this.releasePart);

        this.renderer.appendChild(this.envelopeContainer, this.qAttackHandle);
        this.renderer.appendChild(this.envelopeContainer, this.qReleaseHandle);

        this.renderer.appendChild(this.envelopeContainer, this.envBeginHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envPointHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envEndHandle);

    }

    private newHandlePoint(handletype, x: number, y: number): void {
        const handle = handleType[handletype];
        switch (handletype) {
            case(handleType[0]): {
                // this.env.b.x = x;
                break;
            }
            case(handleType[1]): {
                this.env.p.x = x <= this.env.b.x ? this.env.b.x : x >= this.env.e.x ? this.env.e.x : x;
                this.env.p.y = y;
                break;
            }
            case(handleType[2]): {
                this.env.e.x = x;
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
        this.envBeginHandle = this.envService.getEnvHandle(this.handleClicked, handleType.begin);
        this.envPointHandle = this.envService.getEnvHandle(this.handleClicked, handleType.point);
        this.envEndHandle = this.envService.getEnvHandle(this.handleClicked, handleType.end);
        this.qAttackHandle = this.envService.qHandle();
        this.qReleaseHandle = this.envService.qHandle();

        this.attackPart = this.envService.getEnvPart(this.partClicked, EnvelopePart.attack);
        this.releasePart = this.envService.getEnvPart(this.partClicked, EnvelopePart.release);
        // this.limitContainer = this.envService.limitContainer();
        // this.renderer.setAttribute(this.limitContainer, 'height', this.containerHeight);
        // this.renderer.setAttribute(this.limitContainer, 'width', this.containerWidth);
        // this.renderer.setAttribute(this.limitContainer, 'height', this.containerHeight);
        // this.renderer.setAttribute(this.limitContainer, 'width', this.containerWidth);

    document.onkeydown = () => {
        this.env.p.x = (this.env.p.x + 2);
        this.manipulateEnvelope();
    };

    }

    partClicked = (type) => {

        if (type === EnvelopePart.attack) {
            if (this.activeAttackCurve === 2) {
                this.activeAttackCurve = 0;
            } else {
                this.activeAttackCurve = this.activeAttackCurve + 1;
            }
        }

        if (type === EnvelopePart.release) {
            if (this.activeReleaseCurve === 2) {
                this.activeReleaseCurve = 0;
            } else {
                this.activeReleaseCurve = this.activeReleaseCurve + 1;
            }
        }
        this.manipulateEnvelope();
    }

        // hostlistener events

        public handleClicked = (handle) => {
            this.windowEvents.enableEvents();
            this.handleCurrentlyClicked = true;
            this.activeHandle = handleType[parseInt(handle.id, 10)];

            const browserMouseUp = this.windowEvents.getMouseUpMessages();
            const browserMouseMove = this.windowEvents.getMouseMoveMessages();

            browserMouseUp.subscribe( () => {
                this.handleCurrentlyClicked = false;
                this.windowEvents.destroyEvents();
            } );

            browserMouseMove.subscribe( ({x, y}) => {
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
        }

        // hostlistener events end

}


