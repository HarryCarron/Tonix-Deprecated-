import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from "@angular/core";

@Component({
  selector: "app-matrix",
  templateUrl: "./matrix.component.html",
  styleUrls: ["./matrix.component.css"],
})
export class MatrixComponent implements OnInit, AfterViewInit {
  constructor(private render: Renderer2) {}

  private _svg;

  @ViewChild("svg", { static: true })
  set svg(s) {
    this._svg = (s as any).nativeElement;
  }

  private _matrixContainer;
  @ViewChild("matrixContainer", { static: true })
  set matrixContainer(m) {
    this._matrixContainer = (m as any).nativeElement;
  }

  ngAfterViewInit(): void {
    this.initSVG();
  }

  private initSVG() {
    this.render.setAttribute(
      this._svg,
      'height',
      this._matrixContainer.offsetHeight
    );
    this.render.setAttribute(
      this._svg,
      'width',
      this._matrixContainer.offsetWidth
    );
  }

  ngOnInit(): void {}
}
