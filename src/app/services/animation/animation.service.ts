import { Injectable } from "@angular/core";
import { interval } from "rxjs";

export interface AnimationRun {
  value: number;
  incrementer: (v: number) => number;
  finished: (v: number) => boolean;
  next: (v: number) => void;
  done: (r: AnimationRun) => void;
  completed?: boolean;
  ID?: number;
}

@Injectable({
  providedIn: "root",
})
export class AnimationService {

  constructor() {}
  private reqID;
  private runID = -1;
  private runs: AnimationRun[] = [];
  private isRunning = false;

  private engine(): void {

    const turn = () => {
      this.runs.forEach((r: AnimationRun) => {
        r.value = r.incrementer(r.value);
        if (r.finished(r.value)) {
          r.done({ ...r, completed: true } as AnimationRun);
          this.removeFromEngine(r.ID);
        } else {
          r.next(r.value);
        }
      });

      this.reqID = requestAnimationFrame(turn);
    };


    this.reqID = requestAnimationFrame(turn);
  }

  public removeFromEngine(runID: number): number {
    const runsIndex = this.runs.findIndex(r => r.ID === runID);
    this.runs.splice(runsIndex, 1);
    return runID;
  }

  public addToEngine(input: AnimationRun | AnimationRun[]): number | number[] {

    if (Array.isArray(input)) {
      input.map((i) => {
        this.runID ++;
        this.runs.push({...i, ID: this.runID});
        return this.runID;
      });
    } else {
      this.runID ++;
      this.runs.push({...input, ID: this.runID});
      return this.runID;
    }
  }

  public start(): void {
    if (!this.isRunning) {
      this.engine();
      this.isRunning = true;
    }
  }

  public stop(): void {
    if (this.isRunning) {
      cancelAnimationFrame(this.reqID);
      this.isRunning = false;
    }
  }
}
