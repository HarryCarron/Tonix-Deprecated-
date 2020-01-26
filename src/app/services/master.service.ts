import { Injectable } from '@angular/core';
import { waveType, defaultWaveForm, waveTypeEnum} from './../objects/types';
import { UtilitiesService } from './utilities.service';

const BASE_OSC_NAME = 'OSCILLATOR';
const BASE_OSC_PITCH = 0.00;
const BASE_OSC_GAIN = 5;


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

        return this.utils.a(3).map((i) => new Oscillator(i, waveTypeIn, i === 0, null, null));
    }

}

export class Oscillator {

    private waveType: waveType;
    private _name: string;
    private utils = new UtilitiesService();
    public availableWaveForms: string[] = this.utils.definitionArrayFromEnum(waveTypeEnum);
    public isOn = false;
    public detune: number;
    public pitch: number;
    public gain: number;

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

    constructor(nameIn: string | number, waveTypeIn: waveType, isOn: boolean, detune: number, pitch: number) {
        this.waveType = waveTypeIn || defaultWaveForm;
        this.name = nameIn;
        this.isOn = isOn;
        this.detune = detune || BASE_OSC_PITCH;
        this.pitch = pitch || BASE_OSC_PITCH;
        this.gain = pitch || BASE_OSC_GAIN;
    }

}
