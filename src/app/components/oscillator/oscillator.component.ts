import { Component, OnInit, Input } from '@angular/core';
import { LedComponent } from './../led/led.component';
import { SettingsRackComponent } from './settings-rack/settings-rack.component';
import { VoiceService } from './../../services/voice/voice.service';
import { Subscription, Observable } from 'rxjs';
// import { PartialsComponent } from './partials/partials.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.css']
})
export class OscillatorComponent implements OnInit {

    constructor(private voiceService: VoiceService) { }


    @Input() data; // todo: type

    subscription: Observable<any>;

    private _showPartials = false;

    @Input()
    set showPartials (show) { this._showPartials = show; }

    get showPartials() { return this._showPartials; }

    togglePartials(oscId: number, manual: boolean) {
        if (manual || manual === false) {
            this.showPartials = manual;
            return;
        }

        const t = !this.showPartials === true;
        this.showPartials = t;
        if (t) {
            this.voiceService.partialOpened(oscId);
        }

    }

    private handleMessage(oscId) {
        if (oscId !== this.data.number) {
            this.togglePartials(this.data.number, false);
        }
    }

    private listenForOpeningPartial(): void {
        this.subscription = this.voiceService.getMessages();
        this.subscription.subscribe(message => { this.handleMessage(message); });
    }

    ngOnInit(): void {
        this.listenForOpeningPartial();

    }

}
