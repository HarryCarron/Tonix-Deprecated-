import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { DragAndDrop } from './../../functionality/dragAndDrop';
import { dragAndDropOrientation } from './../../objects/types';
import { HtmlParser } from '@angular/compiler';
import { WINDOW_DPI } from './../../services/master.service';

export type degree = number;

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements AfterViewInit, AfterViewInit {

    @ViewChild('knob', { static: true })

    set knob(nElement: ElementRef) {
        if (nElement.nativeElement) {
            this._knob = nElement.nativeElement;
        }
    }

    @ViewChild('arc', {static: false})
    set arc(nElement: ElementRef) {
        if (nElement.nativeElement) {
            this._arc = nElement.nativeElement;
        }
    }

    get arc() { return this._arc; }

    private _arc: any;

    private _canvasKnob;

    @Input() name: string;

    private relativeTravel = 0; // todo fix

    private startKnob = 0.7 * Math.PI;
    private endKnob = 0.3 * Math.PI;


    @Input() lowerRotationLimit: number;
    @Input() upperRotationLimit: number;

    @Input() upperOutputLimit: number;

    private _knob: ElementRef;

    get knob() { return this._knob; }

    private setRotation(amm: degree): void {
        (this.knob as any).setAttribute('transform', `rotate(${amm})`);
    }

    private killBrowserMouseMove() {
        (window as any).onmousemove = null;
        (window as any).onmouseup = null;
    }

    initiateDrag(e): void {

        (window as any).onmousemove = (ev: any) => {

        };
        (window as any).onmouseup = () => {

        };
    }

    constructor() { }

    drawArc(deg) {
        const a = this.describeArc(24.5, 24.4, 22, 0, deg);
        (<any>this.arc).setAttribute('d', a);
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees) * Math.PI / 180;

        return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
        };
      }

      describeArc(x, y, radius, startAngle, endAngle) {

          const start = this.polarToCartesian(x, y, radius, endAngle);
          const end = this.polarToCartesian(x, y, radius, startAngle);

          const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

          return [
              'M', start.x, start.y,
              'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
          ].join(' ');

      }




    ngAfterViewInit() {

        this.drawArc(0);
        this.setRotation(this.startKnob); // todo: create initRotation param!
        console.log((this.knob as any).getBoundingClientRect());
    }

}
