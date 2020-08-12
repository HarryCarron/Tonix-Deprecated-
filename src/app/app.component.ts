import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MasterService, Oscillator } from './services/master.service';
import { FormsModule } from '@angular/forms';
import { MouseMetricsComponent } from './developerTools/mouse-metrics/mouse-metrics.component';

import { OscillatorComponent } from './components/oscillator/oscillator.component';

import * as Tone from 'tone';
import { Frequency } from 'tone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private masterSrv: MasterService) {}

    private voice;
    private now;
    private currentOctave = 4;
    private ampEnv  = new Tone.AmplitudeEnvelope({
        attack: 0.2,
        decay: 0.2,
        sustain: 1.0,
        release: 0.8
    }).toDestination();

    oscillators: Oscillator[] = this.masterSrv.oscillators;

    @HostListener('document:keydown', ['$event'])
    keyPress({which, repeat}) {


        if (repeat) { return; }

        let note = null;
        let nextOctave = null;


        switch (which) {
            case 65: note = 'C';            break; // a
            case 87: note = 'C#';           break; // w
            case 83: note = 'D';            break; // s
            case 69: note = 'D#';           break; // e
            case 68: note = 'E';            break; // d
            case 70: note = 'F';            break; // f
            case 84: note = 'F#';           break; // t
            case 71: note = 'G';            break; // g
            case 89: note = 'G#';           break; // y
            case 72: note = 'A';            break; // h
            case 85: note = 'A#';           break; // u
            case 74: note = 'B';            break; // j
            case 75: {                             // k
                note = 'C';
                nextOctave = this.currentOctave + 1;
                break;
            }
            case 88: {                             // x
                if (this.currentOctave < 7) {
                    this.currentOctave ++;
                }
                break;
            }
            case 90: {                             // z
                if (this.currentOctave > 0) {
                    this.currentOctave --;
                }
                break;
            }
            default: return;
        }
        const ampEnv = new Tone.AmplitudeEnvelope({
            attack: 0.1,
            decay: 0.2,
            sustain: 0.3,
            release: 0.2
        }).toDestination();
        // create an oscillator and connect itdh
        const reverb = new Tone.Reverb(1000);
        const osc = new Tone.Oscillator(note + (nextOctave || this.currentOctave))
        .connect(ampEnv)
        .connect(reverb).start();
        // trigger the envelopes attack and release "8t" apart
        ampEnv.triggerAttackRelease(3);
    }

    ngOnInit() {


        

        this.now = Tone.now();
    }
}
