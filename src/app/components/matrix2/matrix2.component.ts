import { variable } from "@angular/compiler/src/output/output_ast";
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

const NUMBER_OF_NODES = 16;

const ROW_IDS = Array.from(Array(NUMBER_OF_NODES).keys());

const NODE_ON_REST_HEX = "ebeced";
const NODE_ON_PEAK_HEX = "ffffff";
const NODE_OFF_HEX = "252c33";
const NODE_ANIMATE_HEX = "2e3740";

@Component({
  selector: "app-matrix2",
  templateUrl: "./matrix2.component.html",
  styleUrls: ["./matrix2.component.css"],
})
export class Matrix2Component implements OnInit, AfterViewInit {
  constructor(private render: Renderer2, private zone: NgZone) {}

  private nodeDimension: number;

  private activeNodes: any[] = [];

  private grid: Grid;

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
    this.nodeDimension = this._matrixContainer.offsetHeight / NUMBER_OF_NODES;
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.grid = new Grid(this.canvasDraw, 10, this.nodeDimension);
    this.grid.init();
  }

  private draw(activeNode, color: string): void {
    this.canvasDraw.beginPath();

    this.canvasDraw.fillStyle = color;

    // if (nodeMode === NodeMode.off) {
    //   this.canvasDraw.clearRect(
    //     this.nodeDimension * nodeID[0],
    //     this.nodeDimension * nodeID[1],
    //     this.nodeDimension,
    //     this.nodeDimension
    //   );
    // }
    this.canvasDraw.fillStyle = color;
    // this.canvasDraw.fillRect(
    //   this.nodeDimension * nodeID[0] + this.PAD,
    //   this.nodeDimension * nodeID[1] + this.PAD,
    //   this.nodeDimension - this.PAD * 2,
    //   this.nodeDimension - this.PAD * 2
    // );
    this.canvasDraw.stroke();
  }
  canvasClicked(event) {
    const domRect = this.canvas.getBoundingClientRect();
    const parsedX = event.clientX - domRect.left;
    const parsedY = event.clientY - domRect.top;

    const clickedX = Math.floor(
      parsedX / (this._matrixContainer.offsetWidth / NUMBER_OF_NODES)
    );
    const clickedY = Math.floor(
      parsedY / (this._matrixContainer.offsetWidth / NUMBER_OF_NODES)
    );


    this.grid.toggle([clickedX, clickedY]);

  }





  private nodeIsActive(node: [number, number]): boolean {
    return this.activeNodes.indexOf(node.join("-")) > -1;
  }

  ngOnInit(): void {}
}

class Node {
  public readonly id: string;
  public readonly pos: [number, number];
  initValue: number;
  mode: NodeMode = NodeMode.off;

  /**
   * Creates a Tonematrix node.
   * @param position - The X Y position of the active node.
   */
  constructor(pos: [number, number]) {
    this.id = pos.join("-");
    this.pos = pos;
  }

  public turnOn(): void {
    this.mode = NodeMode.on;
  }

  public turnOff(): void {
    this.mode = NodeMode.off;
  }
}

class Grid {
  private readonly NODE_ON_REST_NUM: number;
  private readonly NODE_ON_PEAK_NUM: number;
  private readonly NODE_OFF_NUM: number;
  private readonly NODE_ANIMATE_NUM: number;
  private readonly runs: number;
  private readonly nodeDimension: number;
  private onColor = 'rgb(233, 236, 240, X)';
  private offColor = 'rgb(37, 44, 51, 1)';
  private readonly PAD = 1.5;

  context;
  nodes = {};

  /**
   * Tonematrix grid. Contains and tracks active nodes
   */
  constructor(context, runs: number, nodeDimension: number) {
    this.context = context;
    this.runs = runs;
    this.nodeDimension = nodeDimension;
  }

  public static numberToHexColor(number: number): string {
    return `#${number.toString(16)}`;
  }

  public static makeIDfromArray(id: [number, number]) {
    return id.join("-");
  }

  public isActive(node: Node | [number, number]) {
    let id: string;
    if (Array.isArray(node)) {
      id = Grid.makeIDfromArray(node);
    } else {
      id = node.id;
    }
    return this.nodes[id].isOn;
  }

  init() {
    ROW_IDS.forEach((rowID, rowI) => {
      ROW_IDS.map((colID, colI) => {
        const node = new Node([colI, rowI]);
        this.nodes[node.id] = node;
        this.render(node);
      });
    });
  }

  private paint(node, color, size = 0) {
    this.context.fillStyle = color;
      this.context.clearRect(
      this.nodeDimension * node.pos[0] - (size + 1),
      this.nodeDimension * node.pos[1] - (size + 1),
      this.nodeDimension + size,
      this.nodeDimension + size
    );
    this.context.fillRect(
      this.nodeDimension * node.pos[0] + this.PAD - size,
      this.nodeDimension * node.pos[1] + this.PAD - size,
      this.nodeDimension - this.PAD * 2 + size,
      this.nodeDimension - this.PAD * 2 + size
    );
    this.context.stroke();
  }

  private animateOn(node: Node, fn) {
    let inc = 0.1;
    let val = 0;
    let stage = 1;
    let req;
    let initStage = true;

    const animate = () => {

      if (stage === 1) {
        val = val + inc;
        fn(
          parseFloat(val.toFixed(1))
        );
        if (val >= 1) {
          inc = 0.1;
          stage = 2;
          initStage = true;
        }
      }

      if (stage === 2) {
        cancelAnimationFrame(req);
      } else {
        req = requestAnimationFrame(animate);
      }
    };

    req = requestAnimationFrame(animate);
  }

  // private getAnimationNodes(node: [number, number], radius: number): any {
  //   const nodes = [];

  //   const a = (n) => Array.from(Array(n).keys());

  //   const odds = a(100).filter((n) => n % 2);

  //   const startAt = Math.floor(odds[radius] / 2);

  //   [0, 1, 2, 3].forEach((s, i) => {
  //     const _node = [...node];

  //     switch (s) {
  //       case 0:
  //         {
  //           // above
  //           _node[1] = _node[1] - radius;
  //           _node[0] = _node[0] - startAt;
  //           a(odds[radius]).forEach((_, ii) => {
  //             _node[0] = ii === 0 ? _node[0] : _node[0] + 1;
  //             const __node = [..._node];
  //             if (!this.nodeIsActive(__node as [number, number])) {
  //               nodes.push(__node);
  //             }
  //           });
  //         }
  //         break;
  //       case 1:
  //         {
  //           // right
  //           _node[0] = _node[0] + radius;
  //           _node[1] = _node[1] - startAt;
  //           a(odds[radius]).forEach((_, iii) => {
  //             _node[1] = iii === 0 ? _node[1] : _node[1] + 1;
  //             const __node = [..._node];
  //             if (!this.nodeIsActive(__node as [number, number])) {
  //               nodes.push(__node);
  //             }
  //           });
  //         }
  //         break; // below
  //       case 2:
  //         {
  //           _node[1] = _node[1] + radius;
  //           _node[0] = _node[0] - startAt;
  //           a(odds[radius]).forEach((_, i) => {
  //             _node[0] = i === 0 ? _node[0] : _node[0] + 1;
  //             const __node = [..._node];
  //             if (!this.nodeIsActive(__node as [number, number])) {
  //               nodes.push(__node);
  //             }
  //           });
  //         }
  //         break;
  //       case 3: {
  //         // left
  //         _node[0] = _node[0] - radius;
  //         _node[1] = _node[1] - startAt;
  //         a(odds[radius]).forEach((_, i) => {
  //           _node[1] = i === 0 ? _node[1] : _node[1] + 1;
  //           const __node = [..._node];
  //           if (!this.nodeIsActive(__node as [number, number])) {
  //             nodes.push(__node);
  //           }
  //         });
  //       }
  //     }
  //   });
  //   return nodes;
  // }

  private render(node: Node) {
    switch (node.mode) {
      case NodeMode.off:
        {
          this.paint(node, this.offColor);
        }
        break;

      case NodeMode.on: {
        this.animateOn(node, (cn: number) => this.paint(node, `rgb(233, 236, 240, ${cn})`, cn)
        );
      }
    }
  }

  public toggle(pos: [number, number]): void {
    const activeNode: Node = this.nodes[Grid.makeIDfromArray(pos)];
    activeNode.mode === NodeMode.on ? activeNode.turnOff() : activeNode.turnOn();

    this.render(activeNode);
  }

  public turnOff(activeNode: Node): void {
    this.nodes[activeNode.id].isOn = false;
  }
}

