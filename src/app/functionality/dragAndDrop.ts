import { ElementRef } from '@angular/core';
import { noop } from 'rxjs';
import { dragAndDropOrientation } from './../objects/types';


export class DragAndDrop {

    private _control: ElementRef;

    private mouseDownAt: number;


    private dragActive: boolean;

    private callback;

    private orientation: dragAndDropOrientation;

    set control(control) {
        this._control = (control.nativeElement) ? control.nativeElement : control;
    }

    get control() {
        return this._control;
    }

    private _upperLimit: number;
    private _lowerLimit: number;

    set lowerLimit(l: number | null) {
        this._lowerLimit = l || 0;
    }

    set upperLimit(u) {
        this._upperLimit = u;
    }

    get lowerLimit() {
        return this._lowerLimit;
    }

    get upperLimit() {
        return this._lowerLimit;
    }


    private dragging() {

    }

    private endDrag() {

    }

    private recordMoveXY(e) {
        if (this.orientation === dragAndDropOrientation['yOnly']) { // todo: other orientations

            let a = Math.min( e.clientY - this.mouseDownAt);
            a = Math.max(a, 0);

            this.callback( (a / this.upperLimit) * 240 - 160);
        }
    }

    public result() {

    }

    private wrapEvents() {
        // mouse down

        const existingMouseDown = (this.control as any).onmousedown || noop;
        (this.control as any).onmousedown = (e) => {
            this.dragActive = true;
            existingMouseDown();
        };

        // mouse up
        const existingMouseUp = (this.control as any).onmouseup || noop;
        (this.control as any).onmouseup = (e) => {
            this.mouseDownAt = e.clientY;
            this.dragActive = false;
            existingMouseUp();
        };

        const existingMouseMove = (this.control as any).onmousemove || noop;
        (this.control as any).onmousemove = (e) => {
            if (this.dragActive) {
                this.recordMoveXY(e);
            } else {
                existingMouseMove();
            }
        };

    }

    constructor(
        control: ElementRef,
        lowerLimit: number,
        upperLimit: number,
        orientation: dragAndDropOrientation,
        callback: any
        ) {

        this.control = control;
        this._upperLimit = upperLimit;
        this.lowerLimit = lowerLimit;
        this.wrapEvents();
        this.orientation = orientation;
        this.callback = callback;
    }
}
