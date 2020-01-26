import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DragAndDrop } from './../../functionality/dragAndDrop';
import { dragAndDropOrientation } from './../../objects/types';

export type degree = number;

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements AfterViewInit {

    @ViewChild('knob') knobElement: ElementRef;

    private _knob: ElementRef;

    private lowLimit: number;
    private highLimit: number;

    private clientY: number;

    beginDrag = (e: any) => {
    }

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

    // private initKob() { this.setRotation(120); }

    constructor() { }


    ngAfterViewInit() {
        this.knob = this.knobElement;
        const x = new DragAndDrop(this.knob, 10, 0, dragAndDropOrientation['yOnly'], (e) => { this.setRotation(e); });
        // this.lowLimit = 0;
        // this.highLimit = 10;
    }

}
