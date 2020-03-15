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

    @Input() upperOutputLimit: number;

    public current: number;
    private before: number;

    private dragStartedAt: number;

    private value: number;


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

        this.dragStartedAt = e.clientY;

        this.dragActive = true;

        // let r: number;

        (window as any).onmousemove = (ev: any) => {
            const limit = 100;
            const offset = ev.clientY - this.value || 0 + 1;
            this.value += offset;
            this.value = Math.min(offset, limit);
            this.value = Math.max(this.value, 0);

            if (this.dragActive) {
                const turn = this.lowerRotationLimit + ((this.value / limit) * (this.upperRotationLimit - this.lowerRotationLimit));
                console.log(turn);
                console.log((this.value / 100) * 100);
                this.setRotation(turn);
            }

        };
        (window as any).onmouseup = () => {
            this.dragActive = false;
            this.killBrowserMouseMove();
        };
    }

    constructor() { }


    ngAfterViewInit() {
        this.setRotation(this.lowerRotationLimit); // todo: create initRotation param!
    }

}
