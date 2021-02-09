import { Injectable } from "@angular/core";
import { NumberValueAccessor } from '@angular/forms';
import { AnimationRun } from './../../services/animation/animation.service';

interface AnimationRunForPreset extends AnimationRun {
  color: string;
}

@Injectable({
  providedIn: "root",
})

export class MatrixService {
  constructor() {}
}

export enum AnimationType {
  click,
  ripple,
}
export enum RampType {
  toPeak,
  toRest,
  toOff,
  rollOff,
}

export interface RampOptions {
  clickType: AnimationType;
  value?: number;
  incrementerValue?: number;
  finishedValue?: number;
}


abstract class Ramp {

  constructor(rampOptions: RampOptions, rampType: RampType) {

    const clickType = AnimationType.click === rampOptions.clickType;

    this.isIncrementer = rampType === RampType.toPeak;

    switch (rampType) {
      case RampType.toPeak : {
        this.finishedValue = clickType ? 10 : 4;
        this.value = 0;
      } break;
      case RampType.toRest : {
        this.finishedValue = clickType ? 7 : 1;
        this.value = clickType ? 10 : 4;
      } break;
      case RampType.toOff : {
        this.value = clickType ? 10 : 4;
        this.finishedValue = 0;
        this.incrementerValue = 1;
      } break;
      case RampType.rollOff: {
        this.value = 3;
        this.finishedValue = 0;
        this.incrementerValue = 1;
      }
    }

    if (rampOptions.incrementerValue) {
      this.incrementerValue = rampOptions.incrementerValue;
    }
    if (rampOptions.value) {
      this.value = rampOptions.value;
    }
    if (rampOptions.finishedValue) {
      this.finishedValue = rampOptions.finishedValue;
    }

  }
  /**
   * Initial animation value, the same value is returned to the animation
   * engine upon manipulation, and provided as a paramter to the next method
   */
  value: number;
  /**
  * Animation service will stop manipulating the value when finished method compares against this value and resolves to true
  */
  protected finishedValue: number;
  incrementerValue = 1;
  /**
   * Whether chosen Ramp implemtation increments or decrements value
   */
  private isIncrementer: boolean;

  /**
   * Takes a number and converts to a single decimal place if required, to account for floating point numbers
   * @param v - The number to normalise
   */
  private normalise = (v) => {
    const decimalPlaces = v.toString().split('.')[1].length;
    return parseFloat(v.toPrecision(decimalPlaces));
  }
  /**
   * Basic implementation of manipulate. Simply increments or decrements value by the incrementer value based on Ramp type.
   * Can be overwritten for bespoke implementation.
   */
  public manipulate = (): number => {
    if (this.isIncrementer) {
      this.value = this.value + this.incrementerValue;
    } else {
      this.value = this.value - this.incrementerValue;
    }
    console.log(this.value);
    return this.value;
  }
  /**
   * Animation engine will stop manipulating value when finsihed method returns true.
   * Finished method can be overwritten for bespoke implementation.
   */
  public finished = () => {
    if (this.isIncrementer) {
      return this.value >= this.finishedValue;
    } else {
      return this.value <= this.finishedValue;
    }
  }

}

/**
 * RampToPeak class holds function to perform the first stage of a pulse animation run.
 * Visually it ramps the nodes opacity to its peak value.
 */
export class RampToPeak extends Ramp {

  readonly description = 'RAMP TO PEAK';

  constructor(rampOptions: RampOptions) {
    super(rampOptions, RampType.toPeak);
  }
}

/**
 * RampToPeak class holds function to perform the second stage of a pulse animation run.
 * Visually it ramps the nodes opacity back down to it's resting opacity.
 */
export class RampToRest extends Ramp {

  readonly description = 'RAMP TO REST';

  constructor(rampOptions: RampOptions) {
    super(rampOptions, RampType.toRest);
  }
}

/**
 * RampToPeak class holds function to perform the first stage of a pulse animation run.
 * Visually it ramps the nodes opacity back down to it's the nodes' off opacity.
 */
export class RampToOff extends Ramp {

  readonly description = 'RAMP TO OFF';

  constructor(rampOptions: RampOptions) {
    super(rampOptions, RampType.toOff);
  }
}

/**
 * RampToPeak class holds function to perform the first stage of a pulse animation run.
 * Visually it ramps the nodes opacity back down to it's the nodes' off opacity.
 */
export class RollOff extends Ramp {

  readonly description = 'ROLL OFF';

  constructor(rampOptions: RampOptions) {
    super(rampOptions, RampType.rollOff);
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker('./matrix.worker', { type: 'module' });
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}