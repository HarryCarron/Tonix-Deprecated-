import { Component, OnInit } from '@angular/core';
import { EffectsRackComponent } from './effects-rack/effects-rack.component';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';

import { VoiceService } from './../../services/voice/voice.service';
import { Subscription } from 'rxjs';

enum settingsRackMenuItem {
    envelope = 1,
    effects = 2
}

@Component({
  selector: 'app-settings-rack',
  templateUrl: './settings-rack.component.html',
  styleUrls: ['./settings-rack.component.css']
})
export class SettingsRackComponent implements OnInit {

  constructor(private voiceService: VoiceService) { }

  selectedMenuItem = 1;

  subscription: Subscription;

  get envelopeSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.envelope;
  }

  get effectsSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.effects;
  }

  selectMenuItem(menuItem: settingsRackMenuItem): void {
    this.selectedMenuItem = menuItem;
  }

  private handleMessage(m) {
      return 1;
  }

  ngOnInit(): void {
    this.subscription = this.voiceService.getMessages().subscribe(message => { this.handleMessage(message); });
    this.voiceService.sendMessage('hey!');
  }

}
