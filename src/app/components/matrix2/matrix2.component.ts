import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  NgZone,
} from "@angular/core";

enum NodeMode {
  on,
  off,
  animate,
}

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

  readonly NODE_ON_COL = "white";

  readonly NODE_OFF_COL = "#252c33";

  readonly NODE_ANIMATE_COL = "#45525F";

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

  private toggleNode(nodeID: [number, number], nodeMode: NodeMode): void {
    this.canvasDraw.beginPath();
    switch (nodeMode) {
      case NodeMode.on:
        this.canvasDraw.fillStyle = this.NODE_ON_COL;
        break;
      case NodeMode.off:
        this.canvasDraw.fillStyle = this.NODE_OFF_COL;
        break;
      case NodeMode.animate:
        this.canvasDraw.fillStyle = this.NODE_ANIMATE_COL;
    }

    if (nodeMode === NodeMode.off) {
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
      this.toggleNode([clickedX, clickedY], NodeMode.on);
      this.beginAnimation([clickedX, clickedY]);
    } else {
      this.activeNodes.splice(index, 1);
      this.toggleNode([clickedX, clickedY], NodeMode.off);
    }
  }

  private getAnimationNodes(node: [number, number], radius: number): any {

    const nodes = [];

    const a = (n) => Array.from(Array(n).keys());

    const odds = a(100).filter(n => n % 2);

    const startAt = Math.floor(odds[radius] / 2);




    [
      (v) => { v[1] = v[1] - radius; return v; }, // above
      (v) => { v[1] = v[1] + radius; return v; },  // right
      (v) => { v[0] = v[0] - radius; return v; }, // left
      (v) => { v[0] = v[0] + radius; return v; }, // below
    ].forEach((f, i) => {
      const _node = f([...node]);
      i = i + 1;
      if (i % 2) {
        _node[0] = _node[0] - startAt;
        a(
          odds[radius]
        ).forEach((_, i) => {

          _node[0] = i === 0 ? _node[0] : (_node[0] + 1);
          const __node = [..._node];
          if (!this.nodeIsActive(__node as [number, number])) {
            nodes.push(__node);
          }
        });

      }
      // if (!this.nodeIsActive(_node as [number, number])) {
      //   nodes.push([..._node]);
      // }
    });
    return nodes;
  }

  private beginAnimation(node: any): void {
    let requestId = null;
    let time = 1;
    const interval = 0.60;
    let stage = 1;
    let initaliseStage = true;
    let animationNodes = [];

    const animate = () => {
      if (initaliseStage) {
        animationNodes.forEach((an) => this.toggleNode(an, NodeMode.off));
        time = 1;
        animationNodes = this.getAnimationNodes(node, stage);
        initaliseStage = false;
        animationNodes.forEach((an) => this.toggleNode(an, NodeMode.animate));
      }

      time = time - interval;

      if (time <= 0) {
        stage++;
        initaliseStage = true;
      }

      if (stage === 10) {
        animationNodes.forEach((an) => this.toggleNode(an, NodeMode.off));
        cancelAnimationFrame(requestId);
      }
        requestId = requestAnimationFrame(animate);
    };

    this.zone.runOutsideAngular(() => {
      requestId = requestAnimationFrame(animate);
    });

  }

  private nodeIsActive(node: [number, number]): boolean {
    return this.activeNodes.indexOf(node.join("-")) > -1;
  }

  private initNodes() {
    this.rowIDs.forEach((rowID, rowI) => {
      this.rowIDs.map((colID, colI) => {
        this.toggleNode([colI, rowI], NodeMode.off);
      });
    });
  }

  ngOnInit(): void {}
}
