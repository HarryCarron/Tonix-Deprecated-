// todo: change naming convention: 'parts' to be called 'sectors'
// todo: remove dynamic container width code: not needed: move container size to constants
// todo: type all props
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import {
  EnvelopeModel,
  EnvelopeSector,
  CurveTypeShort,
  EnvelopeHandleType,
} from "./envelope-objects/envelope.objects";

import {
  ModelToCoord,
  CoordsToModel,
} from "./envelope-objects/model-coord-interface.object";

import {
  EnvelopeService,
  Begin,
  Release,
  StacattoRelease,
  Attack,
  Decay,
  Sustain,
} from "./envelope.service";

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  forwardRef,
  Input,
  HostListener,
} from "@angular/core";

import { FLOOR, CIEL } from "./envelope.constants";

@Component({
  selector: "app-adsr-envelope",
  templateUrl: "./adsr-envelope.component.html",
  styleUrls: ["./adsr-envelope.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdsrEnvelopeComponent),
      multi: true,
    },
  ],
})
export class AdsrEnvelopeComponent implements OnInit, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private envService: EnvelopeService
  ) {
    this.envService.renderer = renderer;
  }

  // #region [ Props ]

  FLOOR = FLOOR;
  CIEL = CIEL;

  CurveType = CurveTypeShort;
  viewEnvValues; // todo think of more elegrant solution to this
  private rightMargin;
  private travelUnit;

  onChange;

  _isOn: boolean;

  @Input()
  set isOn(o) {
    this._isOn = o;
    this.turnOn(o);
  }

  @Input() staccato = false;

  private containerWidth = null;
  private containerHeight = null;

  public Xmargin = null;
  private readonly ENV_WIDTH = 240;

  private envBody;
  availableTravel: number;

  private envData;

  // private svgnode_beginHandle;
  private svgnode_attackHandle;
  private svgnode_decayHandle;
  private svgnode_sustainHandle;
  private svgnode_sustainEndHandle;
  private svgnode_releaseHandle;

  private svgnode_qAttackHandle;
  private svgnode_qReleaseHandle;
  private svgnode_qDecayHandle;

  private svgnode_attackSector;
  private svgnode_releaseSector;

  private handleCurrentlyClicked = false;

  private activeHandle;

  // #endregion

  // #region [ TemplateBinding ]

  private _svgContainer: ElementRef;
  @ViewChild("svgContainer")
  set svgContainer(e) {
    this._svgContainer = e.nativeElement;
  }
  get svgContainer() {
    return this._svgContainer;
  }

  get svgContCoords() {
    return (this.svgContainer as any).getBoundingClientRect();
  }

  private _envelopeContainer: ElementRef;
  @ViewChild("envelopeContainer")
  set envelopeContainer(e) {
    this._envelopeContainer = e.nativeElement;
  }
  get envelopeContainer() {
    return this._envelopeContainer;
  }

  // #endregion

  // #region [ ModelAccessor ]

  onTouched = () => {};

  registerOnTouched(fn: () => void): void {}

  setDisabledState(isDisabled: boolean): void {}

  writeValue(envelopeValues: EnvelopeModel): void {
    if (envelopeValues) {
      this.envData = new ModelToCoord({
        envelopModelValues: envelopeValues,
        travelUnits: this.travelUnit,
        xMargin: this.Xmargin,
        staccato: this.staccato,
      });
      this.render();
    }
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  private updateModel(): void {}

  // #endregion

  // #region [ Render ]

  private render(animatedCurve?: EnvelopeSector) {
    const data = this.envData;

    const b = data.b;
    const a = data.a;
    const d = data.d;
    const s = data.s;
    const r = data.r;

    this.renderer.setAttribute(
      this.envBody,
      "d",
      [
        new Begin(data).asString(),
        new Attack(data).asString(),
        this.staccato ? "" : new Decay(data).asString(),
        this.staccato ? "" : new Sustain(data).asString(),
        this.staccato
          ? new StacattoRelease(data).asString()
          : new Release(data).asString(),
      ].join("")
    );

    // begin handle

    // this.renderer.setAttribute(this.svgnode_beginHandle, 'cx', b.x);
    // this.renderer.setAttribute(this.svgnode_beginHandle, 'cy', b.y.toString());

    // attack handle

    this.renderer.setAttribute(this.svgnode_attackHandle, "cx", a.x);
    this.renderer.setAttribute(this.svgnode_attackHandle, "cy", a.y);

    if (!this.staccato) {
      // decay handle
      this.renderer.setAttribute(this.svgnode_decayHandle, "cx", d.x);
      this.renderer.setAttribute(this.svgnode_decayHandle, "cy", d.y);

      // decay q point
      this.renderer.setAttribute(
        this.svgnode_qDecayHandle,
        "cx",
        new Decay(data).asArray()[0].toString()
      );
      this.renderer.setAttribute(
        this.svgnode_qDecayHandle,
        "cy",
        new Decay(data).asArray()[1].toString()
      );

      // sustain handle
      this.renderer.setAttribute(this.svgnode_sustainHandle, "cx", s.x);
      this.renderer.setAttribute(this.svgnode_sustainHandle, "cy", s.y);
    }

    // release handle
    this.renderer.setAttribute(this.svgnode_releaseHandle, "cx", r.x);
    this.renderer.setAttribute(this.svgnode_releaseHandle, "cy", r.y);

    // attack q point
    this.renderer.setAttribute(
      this.svgnode_qAttackHandle,
      "cx",
      new Attack(data).asArray()[0].toString()
    );
    this.renderer.setAttribute(
      this.svgnode_qAttackHandle,
      "cy",
      new Attack(data).asArray()[1].toString()
    );

    // attack sector

    this.renderer.setAttribute(this.svgnode_attackSector, "x", b.x);
    this.renderer.setAttribute(this.svgnode_attackSector, "y", a.y);
    this.renderer.setAttribute(
      this.svgnode_attackSector,
      "width",
      (a.x - this.Xmargin).toString()
    );
    this.renderer.setAttribute(
      this.svgnode_attackSector,
      "height",
      (FLOOR - a.y).toString()
    );

    // release sector

    this.renderer.setAttribute(this.svgnode_releaseSector, "x", a.x);
    this.renderer.setAttribute(this.svgnode_releaseSector, "y", a.y);
    this.renderer.setAttribute(
      this.svgnode_releaseSector,
      "width",
      (r.x - a.x).toString()
    );
    this.renderer.setAttribute(
      this.svgnode_releaseSector,
      "height",
      (FLOOR - a.y).toString()
    );

    // release q handle
    this.renderer.setAttribute(
      this.svgnode_qReleaseHandle,
      "cx",
      this.staccato
        ? new StacattoRelease(data).asArray()[0].toString()
        : new Release(data).asArray()[0].toString()
    );
    this.renderer.setAttribute(
      this.svgnode_qReleaseHandle,
      "cy",
      this.staccato
        ? new StacattoRelease(data).asArray()[1].toString()
        : new Release(data).asArray()[1].toString()
    );

    const dataForModel = new CoordsToModel({
      coords: this.envData,
      staccato: this.staccato,
    });
    this.viewEnvValues = dataForModel;
    this.onChange(dataForModel);
  }

  private newHandlePoint(handletype, x: number, y: number): void {
    switch (handletype) {
      case EnvelopeHandleType.attack: {
        if (this.staccato) {
          this.envData.a.x =
            x <= this.envData.b.x
              ? this.envData.a.x
              : x >= this.envData.r.x
              ? this.envData.r.x
              : x;
          break;
        } else {
          this.envData.a.x =
            x <= this.envData.b.x
              ? this.envData.a.x
              : x >= this.envData.d.x
              ? this.envData.d.x
              : x;
          break;
        }
      }
      case EnvelopeHandleType.decay: {
        this.envData.d.x =
          x <= this.envData.a.x
            ? this.envData.a.x
            : x < this.envData.s.x
            ? x
            : this.envData.s.x;
        ["d", "s"].forEach((k) => {
          this.envData[k].y =
            y <= this.envData.a.y
              ? this.envData.a.y
              : y >= this.envData.b.y
              ? this.envData.b.y
              : y;
        });
        break;
      }
      case EnvelopeHandleType.sustain: {
        this.envData.s.x =
          x <= this.envData.d.x
            ? this.envData.d.x
            : x < this.envData.r.x
            ? x
            : this.envData.r.x;
        ["d", "s"].forEach((k) => {
          this.envData[k].y =
            y <= this.envData.a.y
              ? this.envData.a.y
              : y >= this.envData.b.y
              ? this.envData.b.y
              : y;
        });
        break;
      }
      case EnvelopeHandleType.release: {
        if (this.staccato) {
          this.envData.r.x =
            x <= this.envData.a.x
              ? this.envData.a.x
              : x < this.rightMargin
              ? x
              : this.envData.r.x;
        } else {
          this.envData.r.x =
            x <= this.envData.s.x
              ? this.envData.s.x
              : x < this.rightMargin
              ? x
              : this.envData.r.x;
        }
      }
    }
  }

  // #endRegion

  // #region [ Initialisation ]

  // {'opacity' : staccato ? '0.6' : '1'}

  dimIfStaccato() {
    return { opacity: this.staccato ? "0.6" : "1" };
  }

  private initContainer() {
    this.containerHeight = (this.svgContainer as any).clientHeight;
    this.containerWidth = (this.svgContainer as any).clientWidth;
    this.Xmargin = Math.abs(this.containerWidth - this.ENV_WIDTH) / 2;
    this.availableTravel = this.containerWidth - this.Xmargin * 2;

    this.travelUnit = this.availableTravel / 40;
    this.rightMargin = this.containerWidth - this.Xmargin;

    [0, 1, 2, 3, 4].forEach((n) => {
      this.renderer.appendChild(
        this.envelopeContainer,
        this.envService.gridLines(this.Xmargin, n, this.availableTravel, 4)
      );
      this.renderer.appendChild(
        this.envelopeContainer,
        this.envService.gridNumber(this.Xmargin, n, this.availableTravel, 4)
      );
    });

    this.renderer.setAttribute(
      this.envelopeContainer,
      "height",
      this.containerHeight
    );
    this.renderer.setAttribute(
      this.envelopeContainer,
      "width",
      this.containerWidth
    );
    this.renderer.appendChild(this.envelopeContainer, this.envBody);

    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_qAttackHandle
    );
    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_qReleaseHandle
    );

    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_attackSector
    );
    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_releaseSector
    );

    if (!this.staccato) {
      this.renderer.appendChild(
        this.envelopeContainer,
        this.svgnode_qDecayHandle
      );
      this.renderer.appendChild(
        this.envelopeContainer,
        this.svgnode_decayHandle
      );
    }

    if (!this.staccato) {
      this.renderer.appendChild(
        this.envelopeContainer,
        this.svgnode_sustainHandle
      );
    }
    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_releaseHandle
    );

    // this.renderer.appendChild(this.envelopeContainer, this.svgnode_beginHandle);
    this.renderer.appendChild(
      this.envelopeContainer,
      this.svgnode_attackHandle
    );
  }

  showSectorHighlighter(renderer, sectorHighlighter) {
    if (!this.handleCurrentlyClicked) {
      renderer.setAttribute(sectorHighlighter, "opacity", 1);
    }
  }

  ngOnInit(): void {
    this.envBody = this.envService.getEnvBody(this.Xmargin, this.rightMargin);

    // this.svgnode_beginHandle = this.envService.getEnvHandle(this.handleClicked, EnvelopeHandleType.begin);
    this.svgnode_attackHandle = this.envService.getEnvHandle(
      this.handleClicked,
      EnvelopeHandleType.attack
    );

    this.svgnode_attackSector = this.envService.getEnvSector(
      this.sectorClicked,
      EnvelopeSector.attack,
      (rendered, sectorHighlighter) =>
        this.showSectorHighlighter(rendered, sectorHighlighter)
    );

    this.svgnode_releaseSector = this.envService.getEnvSector(
      this.sectorClicked,
      EnvelopeSector.release,
      (rendered, sectorHighlighter) =>
        this.showSectorHighlighter(rendered, sectorHighlighter)
    );

    if (!this.staccato) {
      this.svgnode_decayHandle = this.envService.getEnvHandle(
        this.handleClicked,
        EnvelopeHandleType.decay
      );
      this.svgnode_qDecayHandle = this.envService.qHandle();
    }
    this.svgnode_releaseHandle = this.envService.getEnvHandle(
      this.handleClicked,
      EnvelopeHandleType.release
    );
    this.svgnode_sustainHandle = this.envService.getEnvHandle(
      this.handleClicked,
      EnvelopeHandleType.sustain
    );

    this.svgnode_qAttackHandle = this.envService.qHandle();
    this.svgnode_qReleaseHandle = this.envService.qHandle();
  }

  ngAfterViewInit(): void {
    this.initContainer();
  }

  // #endregion

  // #region [ Events ]

  private turnOn(on): void {
    // todo: sort this
    if (this.svgnode_attackHandle) {
      this.renderer.setAttribute(
        this.svgnode_attackHandle,
        "visibility",
        on ? "visible" : "hidden"
      );
      // this.renderer.setAttribute(this.svgnode_beginHandle, 'visibility', on ? 'visible' : 'hidden');
      this.renderer.setAttribute(
        this.svgnode_releaseHandle,
        "visibility",
        on ? "visible" : "hidden"
      );
      this.renderer.setAttribute(this.envBody, "opacity", on ? "1" : "0.6");
      this.renderer.setAttribute(
        this.svgnode_qAttackHandle,
        "visibility",
        on ? "visible" : "hidden"
      );
      this.renderer.setAttribute(
        this.svgnode_qReleaseHandle,
        "visibility",
        on ? "visible" : "hidden"
      );
      this.renderer.setAttribute(
        this.svgnode_attackSector,
        "visibility",
        on ? "visible" : "hidden"
      );
      this.renderer.setAttribute(
        this.svgnode_releaseSector,
        "visibility",
        on ? "visible" : "hidden"
      );
    }
  }

  private curveToggle = (currentCurve): number => {
    if (currentCurve >= 2) {
      return 0;
    } else {
      currentCurve++;
      return currentCurve;
    }
  };

  sectorClicked = (type) => {
    const curveToggle = (currentCurve): number => {
      if (currentCurve === 2) {
        return 0;
      } else {
        currentCurve++;
        return currentCurve;
      }
    };

    switch (type) {
      case EnvelopeSector.attack: {
        this.envData.attackCurve = curveToggle(this.envData.attackCurve);
        break;
      }
      case EnvelopeSector.decay: {
        this.envData.decayCurve = curveToggle(this.envData.decayCurve);
        break;
      }
      case EnvelopeSector.release: {
        this.envData.releaseCurve = curveToggle(this.envData.releaseCurve);
      }
    }
    this.render(type);
  };

  @HostListener("document:mousemove", ["$event"])
  mouseMove({ x, y }): void {
    if (this.handleCurrentlyClicked) {
      const newX = x - this.svgContCoords.left;
      const newY = y - this.svgContCoords.top;
      this.newHandlePoint(
        this.activeHandle,
        newX < 0 ? 0 : newX,
        newY < 0 ? 0 : newY
      );
      this.render();
    }
  }

  @HostListener("document:mouseup", ["$event"])
  mouseUp() {
    this.handleCurrentlyClicked = false;
  }

  public handleClicked = (handle) => {
    this.handleCurrentlyClicked = true;
    this.activeHandle = parseInt(handle.id, 10);
  };
  // #endregion
}
