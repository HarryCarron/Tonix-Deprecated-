
import { Injectable } from '@angular/core';
import { waveType, defaultWaveForm, waveTypeEnum} from './../objects/types';
import { UtilitiesService } from './utilities.service';
import { CurveType } from './../components/oscillator/settings-rack/adsr-envelope/envelope-objects/envelope.objects';



const BASE_OSC_NAME = 'OSCILLATOR';
const BASE_OSC_PITCH = 0.00;
const BASE_OSC_GAIN = 5;


export class Oscillator {

    public readonly number: number;
    private waveType: waveType;
    private _name: string;

    public isOn = false;
    public detune: number;
    public pitch: number;
    public gain: number;
    public partials: number[];
    public amp = { // todo temp
        attack : 0.3,
        decay : 0.3,
        sustain : 1,
        release : 2.7,
        attackCurve: CurveType.linear,
        decayCurve: CurveType.linear,
        releaseCurve: CurveType.linear
    };

    public isLastOsc: boolean;

    private utils = new UtilitiesService();
    public availableWaveForms: string[] = this.utils.definitionArrayFromEnum(waveTypeEnum);

    set name(n: string | number) {
        this._name = BASE_OSC_NAME + ' ' + n;
    }

    get name() {
        return this._name;
    }

    public selectWaveForm = (waveForm: waveType) => {
        this.waveType = waveForm;
    }

    public limitDetune = (detuneValue: number) => {
        if (detuneValue >= 0.99) {
            this.detune = 0.99;
        } else if (detuneValue <= -0.99) {
            this.detune = -0.99;
        }
    }

    constructor(number: number,
        nameIn: string | number,
        waveTypeIn: waveType,
        isOn: boolean,
        detune: number,
        pitch: number,
        partialCount: number[],
        isLastOsc: boolean) {

        this.number = number;
        this.waveType = waveTypeIn || defaultWaveForm;
        this.name = nameIn;
        this.isOn = isOn;
        this.detune = detune || BASE_OSC_PITCH;
        this.pitch = pitch || BASE_OSC_PITCH;
        this.gain = pitch || BASE_OSC_GAIN;
        this.partials = partialCount;
        this.isLastOsc = isLastOsc;

    }

}


@Injectable({
  providedIn: 'root'
})
export class MasterService {

    public oscillators: Oscillator[];

  constructor(private utils: UtilitiesService) {
    this.oscillators = this.makeOscillators(null);
  }

    private makeOscillators = (waveTypeIn: waveType | null): any => { // todo: return type, osc type

        // pass true for isOn prop so only first oscillator is active

        return this.utils.a(2).map((i, v, o) =>
            new Oscillator(
            i + 1, i,
            waveTypeIn,
            true,
            null,
            null,
            [0.1, 0.5, 0.9, 0.1, 0.1, 0.9, 0.4],
            i + 1 === o.length)
            );

    }

}

export const PARTIAL_CONTAINER_HEIGHT = 120;
export const WINDOW_DPI = window.devicePixelRatio;
