import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  NgZone,
} from "@angular/core";

@Component({
  selector: "app-matrix2",
  templateUrl: "./matrix2.component.html",
  styleUrls: ["./matrix2.component.css"],
})
export class Matrix2Component implements OnInit, AfterViewInit {
  constructor(private render: Renderer2, private zone: NgZone) {}

  readonly NUMBER_OF_NODES = 16;
  readonly PAD = 1.5;

  private nodeDimension: number;

  readonly NOTE_ON_COL = "white";

  readonly NOTE_OFF_COL = "#252c33";

  private activeNodes: any[] = [];

  readonly rowIDs = Array.from(Array(this.NUMBER_OF_NODES).keys());

  _matrixContainer;
  @ViewChild("matrixContainer")
  set matrixContainer(e) {
    this._matrixContainer = e.nativeElement;
  }

  _canvas;
  @ViewChild("canvas")
  set canvas(e) {
    this._canvas = e.nativeElement;
  }

  get canvasDraw() {
    return this._canvas.getContext("2d");
  }
  get canvas() {
    return this._canvas;
  }

  private initCanvas() {
    this.render.setAttribute(
      this.canvas,
      "height",
      this._matrixContainer.offsetHeight
    );
    this.render.setAttribute(
      this.canvas,
      "width",
      this._matrixContainer.offsetWidth
    );
    this.canvasDraw.translate(0.5, 0.5);
    this.nodeDimension =
      this._matrixContainer.offsetHeight / this.NUMBER_OF_NODES;
  }

  ngAfterViewInit(): void {
    this.initCanvas();

    this.initNodes();
  }

  private toggleNode(nodeID: [number, number], isOn: boolean): void {
    this.canvasDraw.beginPath();
    this.canvasDraw.fillStyle = isOn ? this.NOTE_ON_COL : this.NOTE_OFF_COL;

    if (!isOn) {
      this.canvasDraw.clearRect(
        this.nodeDimension * nodeID[0],
        this.nodeDimension * nodeID[1],
        this.nodeDimension,
        this.nodeDimension
      );
    }
    this.canvasDraw.fillRect(
      this.nodeDimension * nodeID[0] + this.PAD,
      this.nodeDimension * nodeID[1] + this.PAD,
      this.nodeDimension - this.PAD * 2,
      this.nodeDimension - this.PAD * 2
    );
    this.canvasDraw.stroke();
    if (isOn) {
      this.beginAnimation(nodeID);
    }
  }
  canvasClicked(event) {
    const domRect = this.canvas.getBoundingClientRect();
    const parsedX = event.clientX - domRect.left;
    const parsedY = event.clientY - domRect.top;

    const clickedX = Math.floor(
      parsedX / (this._matrixContainer.offsetWidth / this.NUMBER_OF_NODES)
    );
    const clickedY = Math.floor(
      parsedY / (this._matrixContainer.offsetWidth / this.NUMBER_OF_NODES)
    );

    const key = [clickedX, clickedY].join("-");

    const index = this.activeNodes.indexOf(key);

    if (index === -1) {
      this.activeNodes.push(key);
      this.toggleNode([clickedX, clickedY], true);
    } else {
      this.activeNodes.splice(index, 1);
      this.toggleNode([clickedX, clickedY], false);
    }
  }

  private getAnimationRun() {}

  private beginAnimation(node: any): void {
    let requestId = null;
    let time = 1; // todo nmake dynamic!!!
    const interval = 0.05;
    let stage = 1;

    const animate = () => {
      if (stage === 1) {
      }
      requestId = requestAnimationFrame(animate);
      if (stage === 4) {
        cancelAnimationFrame(requestId);
      }
    };

    this.zone.runOutsideAngular(() => {
      requestId = requestAnimationFrame(animate);
    });
  }

  private initNodes() {
    this.rowIDs.forEach((rowID, rowI) => {
      this.rowIDs.map((colID, colI) => {
        this.canvasDraw.beginPath();
        this.canvasDraw.fillStyle = this.NOTE_OFF_COL;
        this.canvasDraw.fillRect(
          this.nodeDimension * colI + this.PAD,
          this.nodeDimension * rowI + this.PAD,
          this.nodeDimension - this.PAD * 2,
          this.nodeDimension - this.PAD * 2
        );
        this.canvasDraw.stroke();
      });
    });
  }

  ngOnInit(): void {}
}
