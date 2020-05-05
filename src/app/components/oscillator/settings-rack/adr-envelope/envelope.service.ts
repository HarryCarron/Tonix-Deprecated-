import { Injectable } from '@angular/core';

export enum EnvelopePart {
    attack,
    release
}

export enum CurveType {
    linear,
    exponential,
    cosine
}

@Injectable({
  providedIn: 'root'
})
export class EnvelopeService {

  constructor() { }

  public renderer;

  private readonly envStyle = 'stroke:white; stroke-linecap:round; stroke-width:3px; stroke-linejoin:round; fill: white;';
  private readonly partStyle = 'stroke:white; stroke-linecap:round; stroke-width:3px; stroke-linejoin:round; fill: white;';

  public getEnvHandle () {
    const handle = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(handle, 'r', '4');
    this.renderer.setAttribute(handle, 'stroke', '4');
    this.renderer.setAttribute(handle, 'style', this.envStyle);
    this.renderer.setAttribute(handle, 'fill-opacity', '0.2');
    return handle;
  }

  public qHandle () {
    const qhandle = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(qhandle, 'r', '4');
    this.renderer.setAttribute(qhandle, 'stroke-width', '2');
    this.renderer.setAttribute(qhandle, 'fill', 'white');
    this.renderer.setAttribute(qhandle, 'stroke', 'white');
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

  public getEnvBody () {
    const body = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(body, 'fill-opacity', '0.3');
    this.renderer.setAttribute(body, 'stroke', 'white');
    this.renderer.setAttribute(body, 'stroke-width', '2');
    this.renderer.setAttribute(body, 'stroke-linecap', 'round');
    this.renderer.setAttribute(body, 'fill', 'white');
    this.renderer.setAttribute(body, 'stroke-linejoin', 'round');
    return body;
  }

  public getEnvPart (f, type: EnvelopePart) {

    const part = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(part, 'fill', 'white');
    this.renderer.setAttribute(part, 'fill-opacity', 0.3);
    this.renderer.setAttribute(part, 'stroke', 'white');
    this.renderer.setAttribute(part, 'stroke-width', 1);
    this.renderer.setAttribute(part, 'transition', 0.4);
    this.renderer.setAttribute(part, 'cursor', 'pointer');
    this.renderer.setAttribute(part, 'opacity', 0);
    this.renderer.listen(part, 'mouseenter', (evt: any) => {
        this.renderer.setAttribute(part, 'opacity', 0.7);
      });
    this.renderer.listen(part, 'mouseleave', (evt: any) => {
        this.renderer.setAttribute(part, 'opacity', 0);
    });
    this.renderer.listen(part, 'click', () => { f(type); });

    return part;
  }

  public getEnvContainer (height: number, width: number, xMargin: number, yMargin: number) {
    const container = this.renderer.createElement('svg');
    this.renderer.setAttribute(container, 'height', height + 'px', 'svg');
    this.renderer.setAttribute(container, 'width', width + 'px', 'svg');
    return container;
  }

}

type QArray = [number, number];

abstract class Curve {

    protected floor: number;
    protected ciel: number;
    protected _output: QArray;
    protected releaseType: CurveType;
    protected attackType: CurveType;
    protected xMargin: number;
    protected data: any;

    get output(): QArray {
        // round all numbers of data
        return this._output.map((d) => Math.round(d)) as QArray;
    }

    set output(d) { this._output = d; }

    calculate: (d: any) => any;

    constructor(input) {
        this.floor          = input.floor;
        this.ciel           = input.ciel;
        this.attackType     = input.attackType;
        this.releaseType    = input.releaseType;
        this.xMargin        = input.xMargin;
        this.data           = input.data;
    }

    public asString = (): string => {
        return `Q${this.output[0]},${this.output[1]}`;
    }

    public asArray = (): QArray => {
        return this.output;
    }
}

export class ReleaseCurve extends Curve {

    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = () => {
        const d = this.data;

        switch (this.releaseType) {
            case CurveType.linear: {
                this.output = [
                    d.p.x + (d.e.x - d.p.x) / 2,
                    d.p.y + ((d.e.y - d.p.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.output = [d.p.x, d.b.y];
                break;
            }
            case CurveType.cosine: {
                this.output = [d.e.x, d.p.y];
            }
        }
    }
}

export class AttackCurve extends Curve {

    constructor(data) {
        super(data);
        this.calculate();
    }

    calculate = () => {
        const d = this.data;

        switch (this.attackType) {
            case CurveType.linear: {
                this.output = [
                    d.b.x +  ((d.p.x - d.b.x) / 2),
                    d.p.y + ((d.e.y - d.p.y) / 2)
                ];
                break;
            }
            case CurveType.exponential: {
                this.output = [d.p.x, d.b.y];
                break;
            }
            case CurveType.cosine: {
                this.output = [d.b.x, d.p.y];
            }
        }
    }
}

