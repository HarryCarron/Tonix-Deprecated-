import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-adsr-envelope',
  templateUrl: './adsr-envelope.component.html',
  styleUrls: ['./adsr-envelope.component.css']
})
export class AdsrEnvelopeComponent implements AfterViewInit {

    constructor() { }

    svgHeight = 0;
    svgWidth = 0;

    @ViewChild('svg', { static: true }) _svg: ElementRef;

    get svg() {
        return (this._svg.nativeElement) ? this._svg.nativeElement : this._svg;

    }

    get Ypad() {
        return Math.min(this.svgHeight / 8);
    }

    private getSVGsizes(): void {
        this.svgHeight = this.svg.clientHeight;
        this.svgWidth = this.svg.clientWidth;
    }

    ngAfterViewInit() {
        let i = 0;
        i ++;
        if (i <= 1) {
            this.getSVGsizes();
        }
    }

}
