import { FLOOR, CIEL } from "../envelope.constants";
import { ModelToCoordData } from "./envelope.objects";

export class CoordsToModel {
  public attackCurve: number;
  public decayCurve: number;
  public releaseCurve: number;
  public attack: number;
  public decay: number;
  public release: number;
  public sustain: number;

  private r = (n: number) => parseFloat(n.toFixed(1));

  constructor(data) {
    this.attack = this.r(
      (data.coords.attack.x - data.coords.begin.x) / data.coords.travelUnit / 10
    );
    if (data.staccato) {
      this.release = this.r(
        (data.coords.release.x - data.coords.attack.x) /
          data.coords.travelUnit /
          10
      );
    } else {
      this.decay = this.r(
        (data.coords.decay.x - data.coords.attack.x) /
          data.coords.travelUnit /
          10
      );
      this.sustain = this.r(
        FLOOR - ((FLOOR - CIEL) / 10) * (data.coords.sustain.y / 10)
      );
      this.release = this.r(
        (data.coords.release.x - data.coords.sustain.x) /
          data.coords.travelUnit /
          10
      );
    }
    this.attackCurve = data.coords.attackCurve;
    this.decayCurve = data.coords.decayCurve;
    this.releaseCurve = data.coords.releaseCurve;
  }
}

export class ModelToCoord {
  public attackCurve: number;
  public decayCurve: number;
  public releaseCurve: number;
  public Xmargin: number;

  public begin = {
    x: null,
    y: null,
  };

  get b() {
    return this.begin;
  }

  public attack = {
    x: null,
    y: null,
  };

  get a() {
    return this.attack;
  }

  public decay = {
    x: null,
    y: null,
  };

  get d() {
    return this.decay;
  }

  public sustain = {
    x: null,
    y: null,
  };

  get s() {
    return this.sustain;
  }

  public release = {
    x: null,
    y: null,
  };

  get r() {
    return this.release;
  }

  private travelUnit;

  public coordsToModel() {}

  constructor(data: ModelToCoordData) {
    this.travelUnit = data.travelUnits;

    this.begin.x = data.xMargin;
    this.begin.y = FLOOR;
    this.attack.x =
      this.begin.x + data.envelopModelValues.attack * 10 * data.travelUnits;
    this.attack.y = CIEL;
    if (data.staccato) {
      this.release.x =
        this.attack.x + data.envelopModelValues.release * 10 * data.travelUnits;
      this.release.y = FLOOR;
    } else {
      this.decay.x =
        this.attack.x + data.envelopModelValues.decay * 10 * data.travelUnits;
      this.sustain.y =
        ((FLOOR - CIEL) / 10) * (data.envelopModelValues.sustain * 10);
      this.decay.y = this.sustain.y;
      this.sustain.x =
        this.decay.x + 0.4 * 10 * data.envelopModelValues.travelUnit;
      this.release.x =
        this.sustain.x +
        data.envelopModelValues.release * 10 * data.travelUnits;
      this.release.y = FLOOR;
    }

    this.attackCurve = data.envelopModelValues.attackCurve;
    this.decayCurve = data.envelopModelValues.decayCurve;
    this.releaseCurve = data.envelopModelValues.releaseCurve;
    this.Xmargin = data.xMargin;
  }
}
