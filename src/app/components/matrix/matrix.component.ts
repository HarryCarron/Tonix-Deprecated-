import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from "@angular/core";

interface NodeSetting {
  x: number;
  y: number;
}

@Component({
  selector: "app-matrix",
  templateUrl: "./matrix.component.html",
  styleUrls: ["./matrix.component.css"],
})
export class MatrixComponent implements OnInit, AfterViewInit {
  constructor(private render: Renderer2) {}

  readonly NOTE_ON_COL = "white";
  readonly NOTE_OFF_COL = "#252c33";

  nodeDimension: number;
  readonly numberOfNodes = 16;
  readonly nodePadding = 2;
  nodeAnimationSpread = 5;

  private _svg;

  readonly rowIDs = Array.from(Array(this.numberOfNodes).keys());
  private nodes = {};

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
    this.initContainer();
    this.renderNodes();
  }

  private parseID(id: string) {
    return id.split("-").map((v) => parseInt(v, 10));
  }

  private getNode(id) {
    return this.nodes[id[0]][id[1]];
  }

  private turnOn(id) {
    const n = this.getNode(id);
    n.isOn = !n.isOn;
    this.render.setAttribute(
      n,
      "fill",
      n.isOn ? this.NOTE_ON_COL : this.NOTE_OFF_COL
    );
    this.beginAnimation(n);
  }

  private getAnimationRuns(nodeID: [number, number]) {
    return [
      (id) => {
        --id[0];
        if (id[0] <= this.numberOfNodes) {
          return this.getNode(id);
        }
      },
      (id) => {
        --id[0];
        ++id[1];
        if (id[0] <= this.numberOfNodes && id[1] >= 0) {
          return this.getNode(id);
        }
      },
      (id) => {
        ++id[1];
        if (id[1] <= this.numberOfNodes) {
          return this.getNode(id);
        }
      },
      (id) => {
        ++id[0];
        ++id[1];
        if (id[0] <= this.numberOfNodes && id[1] <= this.numberOfNodes) {
          return this.getNode(id);
        }
      },
      (id) => {
        ++id[0];
        if (id[0] <= this.numberOfNodes) {
          return this.getNode(id);
        }
      },
      (id) => {
        ++id[0];
        --id[1];
        if (id[0] <= this.numberOfNodes && id[1] >= 0) {
          return this.getNode(id);
        }
      },
      (id) => {
        --id[1];
        if (id[1] >= 0) {
          return this.getNode(id);
        }
      },
      (id) => {
        --id[0];
        --id[1];
        if (id[0] >= 0 && id[1] >= 0) {
          return this.getNode(id);
        }
      },
    ]
      .map((f) => f([...nodeID]))
      .filter((n) => !!n);
  }

  private beginAnimation(node: any, numberOfRuns: number): void {
    const [rowID, colID] = this.parseID(node.id);
    const rippleNodes = this.getAnimationRuns([rowID, colID]);
    rippleNodes.forEach((an) => {
      this.render.setAttribute(an, "fill", "white");
      this.render.setAttribute(an, "fill-opacity", "0.3");
      this.render.setAttribute(an, "filter", "url(#animationBlur)");
    });
  }

  private renderNodes(): void {
    const newNode = (id: string, nodeSetting: NodeSetting) => {
      const n = this.render.createElement("rect", "svg");
      this.render.setAttribute(n, "x", nodeSetting.x.toString());
      this.render.setAttribute(n, "y", nodeSetting.y.toString());
      this.render.setAttribute(
        n,
        "height",
        (this.nodeDimension - this.nodePadding).toString()
      );
      this.render.setAttribute(
        n,
        "width",
        (this.nodeDimension - this.nodePadding).toString()
      );
      this.render.setAttribute(n, "fill", this.NOTE_OFF_COL);
      this.render.setAttribute(n, "rx", "2");
      this.render.setAttribute(n, "id", id);
      this.render.appendChild(this._svg, n);
      n.isOn = false;
      this.render.listen(n, "click", ({ srcElement }) =>
        this.turnOn(this.parseID(srcElement.id))
      );
      return n;
    };

    this.rowIDs.forEach((rowID, rowI) => {
      this.nodes[rowID] = this.rowIDs.map((colID, colI) =>
        newNode(`${rowID}-${colI}`, {
          x: this.nodeDimension * colI,
          y: this.nodeDimension * rowI,
        })
      );
    });
    console.log(this.nodes);
  }

  private initContainer() {
    this.render.setAttribute(
      this._svg,
      "height",
      this._matrixContainer.offsetHeight
    );
    this.render.setAttribute(
      this._svg,
      "width",
      this._matrixContainer.offsetWidth
    );
    this.nodeDimension =
      this._matrixContainer.offsetHeight / this.numberOfNodes;
  }

  ngOnInit(): void {}
}
