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
    let nodes = [];
    if (radius === 1) {
      return nodes = [
        () => {
          const _node = [...node];
          _node[1] = _node[1] - 1; // above
          return _node;
        },
        () => {
          const _node = [...node];
          _node[0] = _node[0] + 1; // right
          return _node;
        },
        () => {
          const _node = [...node];
          _node[1] = _node[1] + 1; // below
          return _node;
        },
        () => {
          const _node = [...node];
          _node[0] = _node[0] - 1; // left
          return _node;
        }
      ].map(f => f()).filter((n) => !this.nodeIsActive(n as [number, number]));
    } else {
      const a = (v) => Array.from(Array(v).keys());


      const startPoint = Math.floor(radius / 2);

      node[1] = node[1] - radius;
      node[0] = node[0] - startPoint;

      const isOdd = n => n % 2;

      a(radius).forEach((i) => {
        const _node = [...node];
        _node[0] = node[0] + (i + 1);
        nodes.push(_node);
      });

      const rightNodes = [...node];
      rightNodes[1] = rightNodes[1] - startPoint;
      rightNodes[0] = rightNodes[0] + radius;

      a(radius).forEach(_ => {
        rightNodes[1] = rightNodes[1] + 1;
        nodes.push(rightNodes);
      });

      const bottomNodes = [...node];
      bottomNodes[0] = bottomNodes[0] - startPoint;
      bottomNodes[1] = bottomNodes[1] + radius;

      a(radius).forEach(_ => {
        bottomNodes[1] = bottomNodes[1] + 1;
        nodes.push(bottomNodes);
      });

      const leftNodes = [...node];
      leftNodes[1] = leftNodes[1] - startPoint;
      leftNodes[0] = leftNodes[0] - radius;

      a(radius).forEach(_ => {
        leftNodes[1] = leftNodes[1] + 1;
        nodes.push(leftNodes);
      });


      return nodes.filter((n) => !this.nodeIsActive(n as [number, number]));
    }
    // switch (run) {
    //   case 1: {

    //     ];
    //   } break;
    //   case 2: {
    //     nodes = [
    //       () => {
    //         const _node = [...node];
    //         _node[1] = _node[1] - 2; // above
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] + 1;
    //         _node[1] = _node[1] - 2; // above right

    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] + 2;
    //         _node[1] = _node[1] - 1; // right above

    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] + 2; // right
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] + 2; // below right
    //         _node[1] = _node[1] + 1;
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] + 1; // right below
    //         _node[1] = _node[1] + 2;
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[1] = _node[1] + 2; // below
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[1] = _node[1] + 2; // below left
    //         _node[0] = _node[0] - 1;
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] - 2;
    //         _node[1] = _node[1] + 1; // left below

    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] - 2; // left
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] - 2;
    //         _node[1] = _node[1] - 1; // left above
    //         return _node;
    //       },
    //       () => {
    //         const _node = [...node];
    //         _node[0] = _node[0] - 1;
    //         _node[1] = _node[1] - 2; // above left
    //         return _node;
    //       },

    //     ];
    //   }
    // }

  }

  private beginAnimation(node: any): void {
    let requestId = null;
    let time = 1;
    const interval = 0.20;
    let stage = 2;
    let initaliseStage = true;
    let animationNodes = [];

    const animate = () => {
      // if (stage === 1) {
      //   if (initaliseStage) {
      //     animationNodes = this.getAnimationNodes(node, 1);
      //     initaliseStage = false;
      //     animationNodes.forEach((an) => this.toggleNode(an, NodeMode.animate));
      //   }
      //   time = time - interval;
      //   if (time <= 0) {
      //     stage = 2;
      //     initaliseStage = true;
      //     animationNodes.forEach((an) => this.toggleNode(an, NodeMode.off));
      //   }
      // }

      if (stage === 2) {
        if (initaliseStage) {
          time = 1;
          animationNodes = this.getAnimationNodes(node, 2);
          initaliseStage = false;
          animationNodes.forEach((an) => this.toggleNode(an, NodeMode.animate));
        }
        time = time - interval;
        if (time <= 0) {
          stage = 3;
          /// animationNodes.forEach((an) => this.toggleNode(an, NodeMode.off));
        }
      }

      if (stage === 3) {
        cancelAnimationFrame(requestId);
        console.log('cancelled');
      } else {
        requestId = requestAnimationFrame(animate);
      }
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
