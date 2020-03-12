import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { DragAndDrop } from './../../functionality/dragAndDrop';
import { dragAndDropOrientation } from './../../objects/types';

export type degree = number;

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements AfterViewInit {

    @ViewChild('knob', { static: true })

    set knob(nElement: ElementRef) {
        if (nElement.nativeElement) {
            this._knob = nElement.nativeElement;
        }
    }

    @Input() name: string;

    private relativeTravel = 0; // todo fix


    @Input() lowerRotationLimit: number;
    @Input() upperRotationLimit: number;

    @Input() lowerOutputRange: number;
    @Input() upperOutputRange: number;

    public current: number;
    private before: number;

    private downAtY: number;


    private freeze = false;

    private _knob: ElementRef;

    private dragActive = false;

    private droppedY = 0;

    get knob() { return this._knob; }

    private setRotation(amm: degree): void {
        (this.knob as any).style.transform = `rotate(${amm}deg)`;
    }

    private killBrowserMouseMove() {
        (window as any).onmousemove = null;
        (window as any).onmouseup = null;
    }

    initiateDrag(e) {

        this.dragActive = true;

        this.downAtY = e.clientY + 1;
        (window as any).onmousemove = (ev: any) => {

            let at = Math.min(this.downAtY - ev.clientY);

            if (this.dragActive && at) {

                at = Math.max(at);
                const r = ((at / this.upperOutputRange) * 240) - 160;
                if (r < this.upperRotationLimit) {
                    console.log(r);
                    this.setRotation(r);
                }
            }

        };
        (window as any).onmouseup = () => {
            this.dragActive = false;
            this.killBrowserMouseMove();
        };
    }

    private calculate(): void {
        const radius = 360 - ((360 - this.upperRotationLimit) + this.lowerRotationLimit);
        this.relativeTravel = radius / (this.upperOutputRange);
    }

    constructor() { }


    ngAfterViewInit() {
        this.setRotation(this.lowerRotationLimit);
        this.calculate();
    }

}
