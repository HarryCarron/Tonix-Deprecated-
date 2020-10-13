import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  HostListener,
} from "@angular/core";

@Component({
  selector: "app-xy-pad",
  templateUrl: "./xy-pad.component.html",
  styleUrls: ["./xy-pad.component.css"],
})
export class XyPadComponent implements OnInit, AfterViewInit {
  constructor(private renderer: Renderer2) {}

  readonly PAD = 5;

  readonly points = [null, null];

  private limits = {
    up: null,
    down: null,
    left: null,
    right: null,
  };

  private travelUnits = {
    x: null,
    y: null,
  };

  private handleCurrentlyClicked = false;

  _svgContainer;
  @ViewChild("svgContainer")
  set svgContainer(s: ElementRef) {
    this._svgContainer = s.nativeElement;
  }
  get svgContainer() {
    return this._svgContainer;
  }

  _svg;
  @ViewChild("svg")
  set svg(s: ElementRef) {
    this._svg = s.nativeElement;
  }
  get svg() {
    return this._svg;
  }

  get svgBounding() {
    return this._svg.getBoundingClientRect();
  }

  handleNode;

  private setSVGdimensions() {
    this.renderer.setAttribute(
      this.svg,
      "height",
      (this.svgContainer as any).offsetHeight
    );
    this.renderer.setAttribute(
      this.svg,
      "width",
      (this.svgContainer as any).offsetWidth
    );
  }

  @HostListener("document:mouseup", ["$event"])
  mouseUp() {
    this.handleCurrentlyClicked = false;
  }

  @HostListener("document:mousemove", ["$event"])
  mouseMove({ x, y }): void {
    if (this.handleCurrentlyClicked) {
      const newX = x - this.svgBounding.x;
      const newY = y - this.svgBounding.y;
      this.points[0] =
        newX <= this.limits.left
          ? this.limits.left
          : newX >= this.limits.right
          ? this.limits.right
          : newX;
      this.points[1] =
        newY <= this.limits.up
          ? this.limits.up
          : newY >= this.limits.down
          ? this.limits.down
          : newY;
      this.render();

      const min = 0;
      const max = 1;

      console.log(
        this.points[0] - 5
      );

    }
  }

  private animatedHandle() {
    const r = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;

    const randHandle = this.renderer.createElement("circle", "svg");
    this.renderer.setAttribute(randHandle, "r", "1");
    this.renderer.setAttribute(randHandle, "fill", "white");
    this.renderer.setAttribute(randHandle, "fill-opacity", "0.1");
    this.renderer.setAttribute(randHandle, "cx", this.points[0]);
    this.renderer.setAttribute(randHandle, "cy", this.points[1]);
    return randHandle;
  }

  private initHandle() {
    const handle = this.renderer.createElement("circle", "svg");
    this.renderer.setAttribute(handle, "r", "3");
    this.renderer.setAttribute(handle, "stroke-width", "3");
    this.renderer.setAttribute(handle, "fill", "#f6c90e");
    this.renderer.setAttribute(handle, "stroke", "#f6c90e");
    this.renderer.setAttribute(handle, "style", "cursor: pointer");
    this.renderer.listen(handle, "mousedown", (e) => {
      this.handleCurrentlyClicked = true;
      // this.beginAnimation();
    });

    this.handleNode = handle;
    this.renderer.appendChild(this.svg, this.handleNode);
  }

  private beginAnimation(): void {
    let radius = 1;
    let opacity = 0.3;
    let reqID;

    const animate = (): void => {
      radius = radius + 0.5;
      this.renderer.setAttribute(h, "r", radius.toString());
      if (radius >= 5) {
        opacity = opacity - 0.005;
        this.renderer.setAttribute(h, "fill-opacity", opacity.toString());
      }
      if (radius > 40) {
        cancelAnimationFrame(reqID);
        this.renderer.removeChild(this.svg, h);
      } else {
        reqID = requestAnimationFrame(animate);
      }
    };

    const h = this.animatedHandle();
    this.renderer.appendChild(this.svg, h);
    reqID = requestAnimationFrame(animate);
  }

  private render() {
    this.renderer.setAttribute(
      this.handleNode,
      "cx",
      this.points[0].toString()
    );
    this.renderer.setAttribute(
      this.handleNode,
      "cy",
      this.points[1].toString()
    );
  }

  private initLimits() {
    this.limits.up = this.PAD;
    this.limits.down = (this.svgContainer as any).offsetHeight - (this.PAD);
    this.limits.left = this.PAD;
    this.limits.right = (this.svgContainer as any).offsetWidth - (this.PAD);
    console.log(
      this.limits
    );
  }
  private initContainer() {
    this.renderer.listen(this.svg, "mousedown", (e) => {
      this.handleCurrentlyClicked = true;
      this.mouseMove(e);
    });
  }
  private initPoints() {
    this.points[0] = this.limits.left;
    this.points[1] = this.limits.down;
  }

  private initTravelUnits() {
    const xAbs = (this.svg as any).clientHeight - (this.PAD);
    const yAbs = (this.svg as any).clientWidth - (this.PAD);
    this.travelUnits.x = xAbs / 100;
    this.travelUnits.y = yAbs / 100;
  }

  ngAfterViewInit() {
    this.setSVGdimensions();
    this.initLimits();
    this.initPoints();
    this.initTravelUnits();
    this.initContainer();
    this.initHandle();
    this.render();
  }

  ngOnInit(): void {}
}
