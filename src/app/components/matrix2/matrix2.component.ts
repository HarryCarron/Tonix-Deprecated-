
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  NgZone,
} from "@angular/core";

import { AnimationService, AnimationRun } from './../../services/animation/animation.service';

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
  constructor(
      private render: Renderer2,
      private zone: NgZone,
      private animationEngine: AnimationService
    ) {}

  private nodeDimension: number;

  private activeNodes: any[] = [];
  private readonly PAD = 1.5;
  private offColor = 'rgb(37, 44, 51, 1)';
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
    this.nodeDimension = this._matrixContainer.offsetHeight / this.NUMBER_OF_NODES;

    this.ROW_IDS.forEach((rowID, rowI) => {
      this.ROW_IDS.map((colID, colI) => {
        this.paint([rowID, colID], this.offColor, false);
      });
    });
  }

  ngAfterViewInit(): void {
    this.animationEngine.start(); // todo: move to parent component
    this.initCanvas();
  }

  private getAnimationNodes(clickedNode: Node, radius: number): any {

    const nodes = [];

    const xStart = clickedNode[0] - radius;
    const xStop = clickedNode[0] + radius;
    const yStart = clickedNode[0] - radius;
    const yStop = clickedNode[0] + radius;

    // for (let x = xStart; x <= xStop; x++) {
    //   for (let y = yStart; y <= yStop; y++) {

    //   }
    // }
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
      this.animationEngine.addToEngine({
          value: 0,
          incrementer: (v) => { v = v + 0.1; return v; },
          finished: (v) => v >= 1,
          callback: (v) => this.paint([clickedX, clickedY], `rgba(255,255,255, ${ v })`, false),
          done: (v) => {
            this.animationEngine.addToEngine({
              value: 1,
              incrementer: (v) => { v = v - 0.1; return v; },
              finished: (v) => v <= 0.5,
              callback: (v) => this.paint([clickedX, clickedY], `rgba(255,255,255, ${ v })`, true),
              done: (v2) => console.log('RUN TWO FINISHED!'),
            });
          },
        });
    }
  }

  private toggleNode(node: [number, number]): boolean {
    const id = node.join('-');
    const ind = this.activeNodes.indexOf(id);
    const currentlyActive = ind > -1;
    if (currentlyActive) {
      this.activeNodes.splice(ind, 1);
    } else {
      this.activeNodes.push(id);
    }
    return !currentlyActive;
  }

  private paint(node, color, clear: boolean) {
    if (clear) {
      this.canvasDraw.clearRect(
        this.nodeDimension * node[0],
        this.nodeDimension * node[1],
        this.nodeDimension,
        this.nodeDimension
      );
    }
    this.canvasDraw.fillStyle = color;
    this.canvasDraw.fillRect(
      this.nodeDimension * node[0] + this.PAD,
      this.nodeDimension * node[1] + this.PAD,
      this.nodeDimension - this.PAD * 2,
      this.nodeDimension - this.PAD * 2,
    );
    this.canvasDraw.stroke();
  }

  private nodeIsActive(node: [number, number]): boolean {
    return this.activeNodes.indexOf(node.join("-")) > -1;
  }

  ngOnInit(): void {}
}
