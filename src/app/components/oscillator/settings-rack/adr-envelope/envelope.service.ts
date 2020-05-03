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
    this.renderer.setAttribute(qhandle, 'r', '6');
    this.renderer.setAttribute(qhandle, 'stroke-width', '2');
    this.renderer.setAttribute(qhandle, 'fill', 'white');
    this.renderer.setAttribute(qhandle, 'stroke', 'white');
    this.renderer.setAttribute(qhandle, 'fill-opacity', '0.2');
    return qhandle;
  }

  public getEnvBody (callback) {
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
