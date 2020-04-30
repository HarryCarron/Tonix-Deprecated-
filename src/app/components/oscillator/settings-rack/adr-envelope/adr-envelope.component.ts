import { EnvelopeService, envelopePart } from './envelope.service';
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

  private containerLimit;

    private envBody;
    private envBeginHandle;
    private envPointHandle;
    private envEndHandle;

    private attackPart;
    private releasePart;

    private env = {
        begin: {
            x: null,
            y: null
        },
        point: {
            x: null,
            y: null
        },
        end: {
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

    private manipulateEnvelope() {

    const b = this.env.begin;
    const p = this.env.point;
    const e = this.env.end;

    this.renderer.setAttribute(this.envBody, 'd',
        [
            'M',
            b.x,
            ',',
            b.y,
            ' ',
            'L',
            p.x,
            ',',
            p.y,
            ' ',
            'L',
            e.x,
            ',',
            e.y
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
    }

    private giveTestCords() {
    this.env.begin.x = 20;
    this.env.begin.y = 100;

    this.env.point.x = 30;
    this.env.point.y = 20;

    this.env.end.x = 210;
    this.env.end.y = 100;
    }

    private initContainer() {
        this.renderer.setAttribute(this.envelopeContainer, 'height', (this.svgContainer as any).clientHeight);
        this.renderer.setAttribute(this.envelopeContainer, 'width', (this.svgContainer as any).clientWidth);
        this.renderer.appendChild(this.envelopeContainer, this.envBody);

        this.renderer.appendChild(this.envelopeContainer, this.attackPart);
        this.renderer.appendChild(this.envelopeContainer, this.releasePart);
        this.renderer.appendChild(this.envelopeContainer, this.envBody);

        this.renderer.appendChild(this.envelopeContainer, this.envBeginHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envPointHandle);
        this.renderer.appendChild(this.envelopeContainer, this.envEndHandle);
    }

    ngAfterViewInit(): void {
    this.giveTestCords();
    this.initContainer();
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

        this.attackPart = this.envService.getEnvPart();
        this.releasePart = this.envService.getEnvPart();

        this.renderer.listen(this.envBody, 'click', this.toggleBoundingBox);


    document.onkeydown = () => {
        this.env.point.x = (this.env.point.x + 2);
        this.manipulateEnvelope();
    };

    }

}
