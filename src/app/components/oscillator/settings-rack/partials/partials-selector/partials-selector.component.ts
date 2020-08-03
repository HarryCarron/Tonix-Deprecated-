import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PARTIAL_CONTAINER_HEIGHT } from './../../../../../services/master.service';
import { noop } from 'rxjs';

@Component({
    selector: 'app-partials-selector',
    templateUrl: './partials-selector.component.html',
    styleUrls: ['./partials-selector.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PartialsSelectorComponent),
        multi: true
    }]
})
export class PartialsSelectorComponent implements AfterViewInit {

    height = PARTIAL_CONTAINER_HEIGHT;

    constructor() { }

    onTouched;
    onChange;
    partials: number[];

    private _partialCanvas: HTMLCanvasElement;

    @ViewChild('partialCanvas', { static: true })

    set partialsCanvas(e) {
        this._partialCanvas = (e as any).nativeElement;
    }

    get partialCanvasContext() {
        return this.partialsCanvas.getContext('2d');
    }

    private readonly PARTIAL_FILL_COL = 'white';

    get partialsCanvas(): HTMLCanvasElement {
        return this._partialCanvas;
    }

    private partialSelectorHeight = PARTIAL_CONTAINER_HEIGHT;
    private partialSelectorWidth: number;

    private pWidth = 0;

    private setCanvasDimensions(): void {
        this.partialSelectorWidth = this.partialsCanvas.offsetWidth;
        this.partialSelectorHeight = this.partialsCanvas.offsetHeight;

        this.partialsCanvas.width = this.partialSelectorWidth;
        this.partialsCanvas.height = this.partialSelectorHeight;
    }

    writeValue(partials: number[]): void {
        this.partials = partials;
        if (this.partials) {
            this.pWidth = Math.ceil(this.partialSelectorWidth / this.partials.length);
            this.draw();
        }
    }

    draw(): void {
        // this.partialCanvasContext.clearRect(0, 0, this.partialSelectorWidth, 100);

        // this.partials.forEach( (p, i) => {
        //     this.partialCanvasContext.beginPath();
        //     // this.partialCanvasContext.fillStyle = this.PARTIAL_FILL_COL;
        //     this.partialCanvasContext.strokeStyle = '#FF0000';
        //     this.partialCanvasContext.lineWidth = 1;
        //     // this.partialCanvasContext.fill();
        //     this.partialCanvasContext.strokeRect(this.pWidth * i, 100, this.pWidth, ((p * 100) || 0.1) * -1);

        // });
    }

    partialsClicked(): void {

    }


    ngAfterViewInit() {
        this.setCanvasDimensions();
    }

    // NGMODEL FUNCTIONS

    registerOnTouched(fn: () => void): void {}

    setDisabledState(isDisabled: boolean): void { noop(); }

    registerOnChange(fn: (partials: number[]) => void): void { this.onChange = fn; }

}
