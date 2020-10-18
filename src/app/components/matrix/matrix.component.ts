import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
  NgZone
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
  constructor(private render: Renderer2, private  zone: NgZone) {}

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
    if (id[0] > -1 && id[1] > -1) {
      return this.nodes[id[0]][id[1]];
    }
    return null;

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

  private getAnimationRuns(nodeID: [number, number], numberOfRuns: number) {
    return [
      (id) => {
        id[0] = id[0] - numberOfRuns; // above
        return this.getNode(id);
      },
      (id) => {
        id[0] = id[0] - numberOfRuns;
        id[1] = id[1] + numberOfRuns; // above right
        return this.getNode(id);
      },
      (id) => {
        id[1] = id[1] - numberOfRuns; // right
        return this.getNode(id);
      },
      (id) => {
        id[0] = id[0] + numberOfRuns; // below right
        id[1] = id[1] - numberOfRuns;
        return this.getNode(id);
      },
      (id) => {
        id[0] = id[0] + numberOfRuns; // below
        return this.getNode(id);
      },
      (id) => {
        id[0] = id[0] + numberOfRuns; // below left
        id[1] = id[1] - numberOfRuns;
        return this.getNode(id);
      },
      (id) => {
        id[1] = id[1] - numberOfRuns; // left
        return this.getNode(id);
      },
      (id) => {
        id[0] = id[0] - numberOfRuns; // above left
        id[1] = id[1] - numberOfRuns;
        return this.getNode(id);
      },
    ]
      .map((f) => f([...nodeID]))
      .filter((n) => !!n);
  }

  private beginAnimation(node: any): void {

    const [rowID, colID] = this.parseID(node.id);
    const surroundingNodes = this.getAnimationRuns([rowID, colID], 1);


    let requestId = null;
    let time = 1; // todo nmake dynamic!!!
    const interval = 0.05;
    let stage = 1;

    const animate = () => {
      time = time - interval;
      if (stage === 1) {

        surroundingNodes.forEach((n) => {
          this.render.setAttribute(n, 'fill', this.NOTE_ON_COL);
        });
        if (time <= 0.5) {
          stage = 2;
        }
      }
      if (stage === 2) {
        time = time - interval;
        surroundingNodes.forEach((n) => {
          this.render.setAttribute(n, 'fill', this.NOTE_OFF_COL);
          if (time >= 1) {
            stage = 3;
          }
        });
      }
      if (stage === 3) {
        // interval = 0.05;
        // surroundingNodeOpac = surroundingNodeOpac + interval;
        // surroundingNodes.forEach((n) => {
        //   this.render.setAttribute(n, 'opacity', surroundingNodeOpac.toString());
        //   if (surroundingNodeOpac >= 1) {
        //     stage = 4;
        //   }
        // });
        cancelAnimationFrame(requestId);
      }
      if (stage === 4) {
        cancelAnimationFrame(requestId);
      }
      requestId = requestAnimationFrame(animate);
    };

    this.zone.runOutsideAngular(
      () => {
        requestId = requestAnimationFrame(animate);
      }
    );
  }

  private renderNodes(): void {
    const newNode = (id: string, nodeSetting: NodeSetting) => {
      const n = this.render.createElement("rect", "svg");
      this.render.setAttribute(n, "x", nodeSetting.x.toString());
      this.render.setAttribute(n, "y", nodeSetting.y.toString());
      // this.render.setStyle(n, "transition", "1s");
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
