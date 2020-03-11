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

    @ViewChild('knob', { static: true }) knobElement: ElementRef;

    @Input() name: string;

    private _knob: ElementRef;

    private lowLimit: number;
    private highLimit: number;

    private clientY: number;

    private dragActive = false;

    private droppedY = 0;

    set knob(nElement: ElementRef) {
        if (nElement.nativeElement) {
            this._knob = nElement.nativeElement;
        }
    }



    get knob() { return this._knob; }

    private setRotation(amm: degree): void {
        (this.knob as any).style.transform = `rotate(${amm}deg)`;
        console.log(amm);
    }

    private killBrowserMouseMove() {
        (window as any).onmousemove = null;
        (window as any).onmouseup = null;
        // todo
    }

    initiateDrag(e) {
        this.killBrowserMouseMove();
        this.droppedY = e.clientY;
        (window as any).onmousemove = () => {
            (this.knob as any).style.transform = `rotate(${this.droppedY++}deg)`;
        };
        (window as any).onmouseup = () => {
            this.killBrowserMouseMove();
        };
    }

    constructor() { }


    ngAfterViewInit() {
        this.knob = this.knobElement;
    }

}
