import { Injectable } from '@angular/core';
import { UtilitiesService } from './../../../../services/utilities.service';
import { FLOOR, CIEL } from './envelope.constants';

import { EnvelopeHandleType, CurveType, EnvelopeSector } from './envelope-objects/envelope.objects';

@Injectable({
  providedIn: 'root'
})
export class EnvelopeService {

  constructor(private utils: UtilitiesService) { }

  public renderer;

  private readonly envStyle = 'stroke:white; stroke-linecap:round; stroke-width:3px; stroke-linejoin:round; fill: white;';
  private readonly partStyle = 'stroke:white; stroke-linecap:round; stroke-width:3px; stroke-linejoin:round; fill: white;';

  public getEnvHandle (callback, handletype: EnvelopeHandleType) {
    const handle = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(handle, 'r', '3');
    this.renderer.setAttribute(handle, 'stroke', '1');
    this.renderer.setAttribute(handle, 'fill-opacity', '0.2');
    this.renderer.setAttribute(handle, 'cursor', 'move');
    this.renderer.setAttribute(handle, 'stroke-width', '2');
    this.renderer.setAttribute(handle, 'stroke', 'white');
    this.renderer.setAttribute(handle, 'fill', 'white');
    this.renderer.setAttribute(handle, 'id', handletype);
    this.renderer.listen(handle, 'mousedown', () => {  callback(handle); });
    return handle;
  }

  public qHandle () {
    const qhandle = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(qhandle, 'r', '3');
    this.renderer.setAttribute(qhandle, 'stroke-width', '1');
    this.renderer.setAttribute(qhandle, 'fill', 'white');
    this.renderer.setAttribute(qhandle, 'stroke', 'yellow');
    this.renderer.setAttribute(qhandle, 'fill-opacity', '0.2');
    return qhandle;
  }

  public limitContainer() {
    const part = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(part, 'fill', 'white');
    this.renderer.setAttribute(part, 'fill-opacity', 0.1);
    this.renderer.setAttribute(part, 'stroke', 'white');
    this.renderer.setAttribute(part, 'stroke-width', 1);
    this.renderer.setAttribute(part, 'stroke-dasharray', 4);
    this.renderer.setAttribute(part, 'cursor', 'pointer');
    this.renderer.setAttribute(part, 'opacity', 0);
  }

  public getEnvBody (xMargin, rightMargin) {
    const body = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(body, 'fill-opacity', '0.3');
    this.renderer.setAttribute(body, 'stroke', 'white');
    this.renderer.setAttribute(body, 'stroke-width', '1');
    this.renderer.setAttribute(body, 'stroke-linecap', 'round');
    this.renderer.setAttribute(body, 'fill', 'white');
    this.renderer.setAttribute(body, 'stroke-linejoin', 'round');

    // const line = this.renderer.createElement('line', 'svg');
    // this.renderer.setAttribute(line, 'x1', xMargin);
    // this.renderer.setAttribute(line, 'y1', FLOOR);

    // this.renderer.setAttribute(line, 'x2', xMargin);
    // this.renderer.setAttribute(line, 'y2', CIEL);
    // this.renderer.setAttribute(line, 'stroke', 'white');
    // this.renderer.setAttribute(line, 'stroke-width', 1);
    // this.renderer.setAttribute(line, 'stroke-dasharray', 4);
    // this.renderer.setAttribute(line, 'id', 'hey');


    // this.renderer.appendChild(body, line);
    return body;
  }

    public getEnvSector (f: (any) => any, type: EnvelopeSector) {

        const sector = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(sector, 'fill', 'white');
        this.renderer.setAttribute(sector, 'fill-opacity', 0.3);
        this.renderer.setAttribute(sector, 'stroke', 'white');
        this.renderer.setAttribute(sector, 'stroke-width', 1);
        this.renderer.setAttribute(sector, 'transition', 0.4);
        this.renderer.setAttribute(sector, 'cursor', 'pointer');
        this.renderer.setAttribute(sector, 'opacity', 0);
        this.renderer.listen(sector, 'mouseenter', (evt: any) => {
            this.renderer.setAttribute(sector, 'opacity', 0.7);
            });
        this.renderer.listen(sector, 'mouseleave', (evt: any) => {
            this.renderer.setAttribute(sector, 'opacity', 0);
        });
        this.renderer.listen(sector, 'click', () => { f(type); });

        return sector;
    }

    public getEnvContainer (height: number, width: number, xMargin: number, yMargin: number) {
        const container = this.renderer.createElement('svg');
        this.renderer.setAttribute(container, 'height', height + 'px', 'svg');
        this.renderer.setAttribute(container, 'width', width + 'px', 'svg');
        return container;
    }

}

type QArray = [number, number];

abstract class EnvelopePartBase {

    protected floor: number;
    protected ciel: number;
    protected _output: QArray;
    protected releaseType: CurveType;
    protected decayType: CurveType;
    protected attackType: CurveType;
    protected xMargin: number;
    protected data: any;

    protected isStaccato: boolean;

    get Qoutput(): QArray {
        // round all numbers of data
        if (!this._output) { return; }
        return this._output.map((d) => Math.round(d)) as QArray;
    }

    set Qoutput(d) { this._output = d; }

    protected pointOutput = [];

    calculate: (d: any) => any;

    constructor(input) {
        this.floor          = FLOOR;
        this.ciel           = CIEL;
        this.attackType     = input.attackCurve;
        this.decayType      = input.decayCurve;
        this.releaseType    = input.releaseCurve;
        this.xMargin        = input.Xmargin;
        this.data           = input;
    }

    public asArray = (): QArray => {
        return this.Qoutput;
    }

    asString = () => ` Q${this.Qoutput[0]},${this.Qoutput[1]} ${this.pointOutput[0]},${this.pointOutput[1]}`;

}

export class Begin extends EnvelopePartBase {
    constructor(data) {
        super(data);
    }

    public asString = (): string => `M${this.xMargin} ${this.floor}`;

}

export class Sustain extends EnvelopePartBase {


    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = () => {
        /*
        * Not actually a curve but a Q value is needed to complete the path.
        * Calculate will return a a Q value which just keeps the sustain line flat.
        */
       const d = this.data;
       this.pointOutput = [d.s.x, d.s.y];


        this.Qoutput = [
            d.s.x,
            d.s.y
        ];
    }
}

export class Release extends EnvelopePartBase {

    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = () => {
        const d = this.data;

        this.pointOutput = [d.r.x, d.r.y];

        switch (d.releaseCurve) {
            case CurveType.linear: {
                this.Qoutput = [
                    d.s.x + ((d.r.x - d.s.x) / 2),
                    d.s.y + ((d.r.y - d.s.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.Qoutput = [d.s.x, d.b.y];
                break;
            }
            case CurveType.cosine: {
                this.Qoutput = [d.r.x, d.s.y];
            }
        }
    }

    asString = () => ` Q${this.Qoutput[0]},${this.Qoutput[1]} ${this.pointOutput[0]},${this.pointOutput[1]}`;
}

export class Attack extends EnvelopePartBase {

    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = (): void => {
        const d = this.data;

        this.pointOutput = [d.a.x, d.a.y];

        switch (d.attackCurve) {
            case CurveType.linear: {
                this.Qoutput = [
                    d.b.x + (Math.round(d.a.x - d.b.x) / 2),
                    d.a.y + ((d.b.y - d.a.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.Qoutput = [d.a.x, d.b.y];
                break;
            }
            case CurveType.cosine: {
                this.Qoutput = [d.b.x, d.a.y];
            }
        }
    }


}

export class Decay extends EnvelopePartBase {
    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = () => {
        const d = this.data;

        this.pointOutput = [d.d.x, d.d.y];

        switch (d.decayCurve) {
            case CurveType.linear: {
                this.Qoutput = [
                    d.a.x + ((d.d.x - d.a.x) / 2),
                    d.a.y + ((d.d.y - d.a.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.Qoutput = [d.a.x, d.d.y];
                break;
            }
            case CurveType.cosine: {
                this.Qoutput = [d.d.x, d.a.y];
            }
        }
    }

}
export class StacattoRelease {

    constructor(data) {
        this.data = data;
        this.calculate();
    }

    data: any;
    pointOutput: [number, number];
    Qoutput: [number, number];

    calculate() {
        const d = this.data;

        this.pointOutput = [d.r.x, d.r.y];

        switch (d.releaseCurve) {
            case CurveType.linear: {
                this.Qoutput = [
                    d.a.x + ((d.r.x - d.a.x) / 2),
                    d.a.y + ((d.b.y - d.a.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.Qoutput = [d.a.x, FLOOR];
                break;
            }
            case CurveType.cosine: {
                this.Qoutput = [d.r.x, d.a.y];
            }
        }
    }

    asArray = (): QArray => {
        return this.Qoutput;
    }

    asString() {
        return ` Q${this.Qoutput[0]},${this.Qoutput[1]} ${this.pointOutput[0]},${this.pointOutput[1]}`;
    }

}
