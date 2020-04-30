import { Injectable } from '@angular/core';

export enum envelopePart {
    attack,
    release
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

  public getEnvBody (callback) {
    const body = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(body, 'style', this.envStyle);
    this.renderer.setAttribute(body, 'fill-opacity', '0.3');
    this.renderer.setAttribute(body, 'cursor', 'pointer');

    return body;
  }



  public getEnvPart () {

    const part = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(part, 'fill', 'white');
    this.renderer.setAttribute(part, 'fill-opacity', '0.3');
    this.renderer.setAttribute(part, 'stroke', 'white');
    this.renderer.setAttribute(part, 'stroke-width', '1');

    return part;
  }

  public getEnvContainer (height: number, width: number) {
    const container = this.renderer.createElement('svg');
    this.renderer.setAttribute(container, 'height', height + 'px', 'svg');
    this.renderer.setAttribute(container, 'width', width + 'px', 'svg');
    return container;
  }

}
