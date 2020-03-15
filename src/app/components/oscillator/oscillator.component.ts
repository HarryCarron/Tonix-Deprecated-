import { Component, OnInit, Input } from '@angular/core';
import { LedComponent } from './../led/led.component';
import { SettingsRackComponent } from './../../components/settings-rack/settings-rack.component';
import { VoiceService } from './../../services/voice/voice.service';
import { Subscription } from 'rxjs';
import { PartialsComponent } from './partials/partials.component';


@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.css']
})
export class OscillatorComponent implements OnInit {

    constructor(private voiceService: VoiceService) { }


    @Input() data; // todo: type
    subscription: Subscription;

    showPartials = false;

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

    ngOnInit(): void {
        this.subscription = this.voiceService.getMessages().subscribe(message => { this.handleMessage(message); });

    }

}
