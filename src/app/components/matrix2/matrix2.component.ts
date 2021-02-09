import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  NgZone,
} from "@angular/core";

import {
  MatrixService,
  RampToPeak,
  RampToRest,
  RollOff,
  AnimationType,
  RampOptions,
} from "./matrix.service";

import {
  AnimationService,
  AnimationRun,
} from "./../../services/animation/animation.service";
import { noop } from "rxjs";

enum NodeMode {
  on,
  off,
  animate,
}

type Node = [number, number];

@Component({
  selector: "app-matrix2",
  templateUrl: "./matrix2.component.html",
  styleUrls: ["./matrix2.component.css"],
})
export class Matrix2Component implements OnInit, AfterViewInit {
  constructor(
    private render: Renderer2,
    private zone: NgZone,
    private animationEngine: AnimationService,
    private matrixService: MatrixService
  ) {}

  private nodeDimension: number;

  private activeNodes: any[] = [];
  private readonly PAD = 1.5;
  private offColor = "rgb(37, 44, 51, 1)";
  private readonly NUMBER_OF_NODES = 16;
  private readonly ROW_IDS = Array.from(Array(this.NUMBER_OF_NODES).keys());

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

    this.ROW_IDS.forEach((rowID, rowI) => {
      this.ROW_IDS.map((colID, colI) => {
        this.paint([[rowID, colID]], this.offColor, false);
      });
    });
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private getAnimationNodes(clickedNode: Node, radius: number): any {
    const s = (v) => v.join("-");

    const sClickedNode = s(clickedNode);

    const nodes = [];

    const xStart = clickedNode[0] - radius;
    const xStop = clickedNode[0] + radius;
    const yStart = clickedNode[1] - radius;
    const yStop = clickedNode[1] + radius;

    for (let x = xStart; x <= xStop; x++) {
      const sides = [xStart, xStop].includes(x);

      for (let y = yStart; y <= yStop; y++) {
        const tops = [yStart, yStop].includes(y);

        if (s([x, y]) !== sClickedNode) {
          if (sides || tops) {
            nodes.push([x, y]);
          }
        }
      }
    }

    return nodes;
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

    const isOn = this.toggleNode([clickedX, clickedY]);

    if (isOn) {
      this.handleOn([clickedX, clickedY]);
    } else {
      this.paint([[clickedX, clickedY]], this.offColor, true);
    }
  }

  private handleOn(pos) {
    const run1 = this.getAnimationNodes(pos, 1);
    const run2 = this.getAnimationNodes(pos, 2);
    const run3 = this.getAnimationNodes(pos, 3);

    const ripple: AnimationRun[] = [
      {
        ...new RollOff({
          clickType: AnimationType.ripple,
          value: 20,
          incrementerValue: 1,
          finishedValue: 0,
        } as RampOptions),
        next: (v) => {
          this.paint(run1, `rgba(225, 225, 255, ${v / 100})`, true);
          if (v < 10) {
            this.animationEngine.addRunToEngine(ripple[1]);
          }
        },
        done: () => {},
      },
      {
        ...new RollOff({
          clickType: AnimationType.ripple,
          value: 30,
          incrementerValue: 1,
          finishedValue: 0,
        } as RampOptions),
        next: (v) => this.paint(run2, `rgba(225, 225, 255, ${v / 100})`, true),
        done: () => {},
      },
    ];

    const nodeClick: AnimationRun[] = [
      {
        ...new RampToPeak({ clickType: AnimationType.click }),
        next: (v) =>
          this.paint(
            [[pos[0], pos[1]]],
            `rgba(225, 225, 255, ${v / 10})`,
            false
          ),
        done: () => this.animationEngine.addRunToEngine(nodeClick[1]),
      },
      {
        ...new RampToRest({ clickType: AnimationType.click }),
        next: (v) => {
          this.paint(
            [[pos[0], pos[1]]],
            `rgba(225, 225, 255, ${v / 10})`,
            true
          );
        },
        done: () => this.animationEngine.addRunToEngine(ripple[0]),
      },
    ];

    this.animationEngine.addRunToEngine(nodeClick[0]);
  }

  private toggleNode(node: [number, number]): boolean {
    const id = node.join("-");
    const ind = this.activeNodes.indexOf(id);
    const currentlyActive = ind > -1;
    if (currentlyActive) {
      this.activeNodes.splice(ind, 1);
    } else {
      this.activeNodes.push(id);
    }
    return !currentlyActive;
  }

  /**
   * Performs manipulation of the canvas
   * @param nodes - The Nodes to be manipulated
   * @param color -  The new color of the given Node
   * @param addBaseOffCol - If true, the base off color will be paintedbelow the accent color.
   * This is important for animating decending opacity levels
   */
  private paint(nodes: Node[], color: string, addBaseOffCol?: boolean) {
    const begin = (n, override?: string) => {
      this.canvasDraw.fillStyle = override || color;
      this.canvasDraw.fillRect(
        this.nodeDimension * n[0] + this.PAD,
        this.nodeDimension * n[1] + this.PAD,
        this.nodeDimension - this.PAD * 2,
        this.nodeDimension - this.PAD * 2
      );
      this.canvasDraw.stroke();
    };

    nodes.forEach((n) => {
      if (addBaseOffCol) {
        begin(n, this.offColor);
      }
      begin(n);
    });
  }

  private nodeIsActive(node: [number, number]): boolean {
    return this.activeNodes.indexOf(node.join("-")) > -1;
  }

  initOffscreenCanvas() {
    const offscreen = this.canvas.transferControlToOffscreen();
    const worker = new Worker("matrix2.component.ts");
    worker.postMessage({ canvas: offscreen }, [offscreen]);
  }

  ngOnInit(): void {}
}
