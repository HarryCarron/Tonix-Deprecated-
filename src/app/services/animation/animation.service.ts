import { Injectable, NgZone } from "@angular/core";

export interface AnimationRun {
  value: number;
  incrementerValue: number;
  completed?: boolean;
  ID?: number;
  manipulate: () => number;
  finished: () => boolean;
  next: (v: number) => void;
  done?: (v: AnimationRun) => void;
}

@Injectable({
  providedIn: "root",
})
export class AnimationService {

  constructor(private zone: NgZone) {}
  private reqID: number;
  private run: AnimationRun[] = [];
  private runID: number = -1;
  private isRunning = false;


  private startEngine(): void {

    const turn = () => {
      this.run.forEach((r: AnimationRun) => {
        const manipulatedVal = r.manipulate();
        r.next(manipulatedVal);
        if (r.finished()) {
          r.completed = true;
          if (r.done) {
            r.done({ ...r });
          }
          this.removeFromEngine(r.ID);
        }
      });

      if (!this.run.length) {
          this.stop();
      } else {
        this.reqID = requestAnimationFrame(turn);
      }



    };
    this.zone.runOutsideAngular(() => {
      this.reqID = requestAnimationFrame(turn);
    });
  }

  public removeFromEngine(runID: number): number {
    const runsIndex = this.run.findIndex(r => r.ID === runID);
    this.run.splice(runsIndex, 1);
    return runID;
  }

  public addRunToEngine(run: AnimationRun) {

    if (!this.isRunning) {
      this.start();
    }
    this.runID++;
    run.ID = this.runID;
    this.run.push(run);
  }

  public start(): void {
      this.zone.runOutsideAngular(() => {
        this.startEngine();
        this.isRunning = true;
      });
  }

  public stop(): void {
    cancelAnimationFrame(this.reqID);
    this.isRunning = false;
  }
}
