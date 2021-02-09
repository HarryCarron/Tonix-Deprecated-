import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

export type degree = number;

@Component({
  selector: "app-knob",
  templateUrl: "./knob.component.html",
  styleUrls: ["./knob.component.css"],
})
export class KnobComponent implements AfterViewInit, AfterViewInit {
  private mouseDownAt: number;
  private mouseDroppedAt: number;

  private yTopLimit: number;
  private yBottomLimit: number;

  readonly inputRange = 100;

  output: number;

  metrics = {
    output: {
      upperLimit: 1,
      lowerLimit: 0,
      scaleUnit: null,
    },
    rotation: {
      upperLimit: 330,
      lowerLimit: 30,
      scaleUnit: null,
    },
  };

  readonly rotationLowerLimit = 30;
  readonly rotationUpperLimit = 330;

  readonly scaleUnit: number;

  @ViewChild("top", { static: true })
  set knob(nElement: ElementRef) {
    if (nElement.nativeElement) {
      this._knob = nElement.nativeElement;
    }
  }

  // @ViewChild('arc', {static: false})
  // set arc(nElement: ElementRef) {
  //     if (nElement.nativeElement) {
  //         this._arc = nElement.nativeElement;
  //     }
  // }

  // get arc() { return this._arc; }

  // private _arc: any;

  private relativeTravel = 0; // todo fix

  private startKnob = 0.7 * Math.PI;
  // private endKnob = 0.3 * Math.PI;

  private _knob: ElementRef;

  get knob() {
    return this._knob;
  }

  private setDragMouseIcon(mode): void {
    (document as any).body.style.cursor = mode ? "move" : "";
  }

  private setRotation(amm: number): void {
    const calculatedDegree = Math.floor(this.metrics.rotation.scaleUnit * amm);
    if (calculatedDegree > this.rotationUpperLimit) {
      return;
    }
    if (calculatedDegree < this.rotationLowerLimit) {
      return;
    }
    (this.knob as any).setAttribute("transform", `rotate(${calculatedDegree})`);
  }

  private killBrowserMouseMove(ev: any): void {
    (window as any).onmousemove = null;
    (window as any).onmouseup = null;
    this.setDragMouseIcon(false);
    this.mouseDroppedAt = ev.clientY;
  }

  private produceOutput(amm: number) {
    const m = this.metrics.output;
    const calculatedDegree = m.scaleUnit * amm;
    if (calculatedDegree > m.upperLimit) {
      return;
    }
    if (calculatedDegree < m.lowerLimit) {
      return;
    }
    this.output = Math.round(calculatedDegree * 100);
    console.log(calculatedDegree);
  }

  initiateDrag(e): void {
    this.setDragMouseIcon(true);

    (window as any).onmousemove = (ev: any) => {
      const travel = ev.clientY - this.yBottomLimit;
      this.setRotation(travel);
      this.produceOutput(travel);
      this.drawArc(travel);
    };
    (window as any).onmouseup = (ev) => {
      this.killBrowserMouseMove(ev);
    };
  }

  constructor() {}

  drawArc(travel) {
    const a = this.describeArc(30, 30, 15, 0, travel);
    // (<any>this.arc).setAttribute('d', a);
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  calculateScaleUnits() {
    Object.keys(this.metrics).forEach((m) => {
      this.metrics[m].scaleUnit = this.metrics[m].upperLimit / this.inputRange;
    });
  }

  ngAfterViewInit() {
    this.yBottomLimit = Math.floor(
      (this.knob as any).getBoundingClientRect().top
    );
    this.yTopLimit =
      Math.floor((this.knob as any).getBoundingClientRect().top) + 100;
    this.calculateScaleUnits();
    this.setRotation(10);

    // this.drawArc(this.startKnob);
  }
}
