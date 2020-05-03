import { EnvelopeService, EnvelopePart, CurveType } from './envelope.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-adr-envelope',
  templateUrl: './adr-envelope.component.html',
  styleUrls: ['./adr-envelope.component.css']
})
export class AdrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, private envService: EnvelopeService) {
      this.envService.renderer = renderer;
  }

    activeReleaseCurve = CurveType.linear;

    private containerLimit = {
        h: null,
        w: null
    };

    private floor = 110;
    private ciel = 20;

    private containerWidth = null;
    private containerHeight = null;

    private readonly padding = 20;
    private Xmargin = null;
    private readonly envWidth = 220;

    private envBody;
    private envBeginHandle;
    private envPointHandle;
    private envEndHandle;
    private qHandle;

    private attackPart;
    private releasePart;



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

    private _envelopeContainer: ElementRef;
    @ViewChild('envelopeContainer')
    set envelopeContainer(e) {this._envelopeContainer = e.nativeElement; }
    get envelopeContainer() {return this._envelopeContainer; }

    private getReleaseCurve(asString: boolean) {

        const p = this.env.p;
        const e = this.env.e;
        const b = this.env.b;
        let q = null;

        switch (this.activeReleaseCurve) {
            case CurveType.linear: {
                if (asString) {
                    q = `Q${p.x + (e.x - p.x / 2)},${e.y - p.y / 2}`;
                } else {
                    return [e.x - p.x / 2, e.y - p.y / 2];
                }
                console.log([e.x - p.x / 2, e.y - p.y / 2]);
                break;
            }
            case CurveType.exponential: {
                if (asString) {
                    q = `Q${p.x},${ this.floor }`;
                } else {
                    return [p.x, this.floor];
                }
                break;
            }
            case CurveType.cosine: {
                if (asString) {
                    q = `Q${p.x},${ e.y }`;
                } else {
                    return [p.x, e.y];
                }
            }
        }
        return q + ` ${e.x} ${e.y}`;
    }

    private getAttackCurve() {

        const p = this.env.p;

        return [
            'L',
            p.x,
            ',',
            p.y,
        ].join('');

    }

    private manipulateEnvelope() {

    const b = this.env.b;
    const p = this.env.p;
    const e = this.env.e;

    this.renderer.setAttribute(this.envBody, 'd',
        [
            'M',
            b.x,
            ',',
            b.y,
            ' ',
            this.getAttackCurve(),
            ' ',
            this.getReleaseCurve(true)
        ].join('')
        );

        this.renderer.setAttribute(this.attackPart, 'x', b.x);
        this.renderer.setAttribute(this.attackPart, 'y', p.y);
        this.renderer.setAttribute(this.attackPart, 'width', (p.x - b.x).toString());
        this.renderer.setAttribute(this.attackPart, 'height', ( b.y - p.y).toString());

        this.renderer.setAttribute(this.releasePart, 'x', p.x);
        this.renderer.setAttribute(this.releasePart, 'y', p.y);
        this.renderer.setAttribute(this.releasePart, 'width', (e.x - p.x).toString());
        this.renderer.setAttribute(this.releasePart, 'height', ( e.y - p.y).toString());

        this.renderer.setAttribute(this.envBeginHandle, 'cy', b.y);

        this.renderer.setAttribute(this.envBeginHandle, 'cx', b.x);
        this.renderer.setAttribute(this.envBeginHandle, 'cy', b.y);

        this.renderer.setAttribute(this.envPointHandle, 'cx', p.x);
        this.renderer.setAttribute(this.envPointHandle, 'cy', p.y);

        this.renderer.setAttribute(this.envEndHandle, 'cx', e.x);
        this.renderer.setAttribute(this.envEndHandle, 'cy', e.y);

        this.renderer.setAttribute(this.qHandle, 'cx', this.getReleaseCurve(false)[0]);
        this.renderer.setAttribute(this.qHandle, 'cy', this.getReleaseCurve(false)[1]);

    }

    private giveTestCords() {
    this.env.b.x = this.Xmargin;
    this.env.b.y = this.floor;

    this.env.p.x = 70;
    this.env.p.y = 20;

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

        this.renderer.appendChild(this.envelopeContainer, this.envBeginHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envPointHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envEndHandle);

        this.renderer.appendChild(this.envelopeContainer, this.envBody);

        this.renderer.appendChild(this.envelopeContainer, this.attackPart);
        this.renderer.appendChild(this.envelopeContainer, this.releasePart);

        this.renderer.appendChild(this.envelopeContainer, this.qHandle);

    }

    ngAfterViewInit(): void {
        this.initContainer();
        this.giveTestCords();
        this.manipulateEnvelope();
    }

    toggleBoundingBox() {
        this.renderer.setAttribute(this.attackPart, 'visibility', 'visible');
        this.renderer.setAttribute(this.releasePart, 'visibility', 'visible');
    }

    ngOnInit(): void {
        this.envBody = this.envService.getEnvBody(this.toggleBoundingBox);
        this.envBeginHandle = this.envService.getEnvHandle();
        this.envPointHandle = this.envService.getEnvHandle();
        this.envEndHandle = this.envService.getEnvHandle();
        this.qHandle = this.envService.qHandle();

        this.attackPart = this.envService.getEnvPart(this.partClicked, EnvelopePart.attack);
        this.releasePart = this.envService.getEnvPart(this.partClicked, EnvelopePart.release);


    document.onkeydown = () => {
        this.env.p.x = (this.env.p.x + 2);
        this.manipulateEnvelope();
    };

    }

    partClicked = (type) => {
        if (this.activeReleaseCurve === 2) {
            this.activeReleaseCurve = 0;
        } else {
            this.activeReleaseCurve = this.activeReleaseCurve + 1;
        }
        this.manipulateEnvelope();
    }

}
