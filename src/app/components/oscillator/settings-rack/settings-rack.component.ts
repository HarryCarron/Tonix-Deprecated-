import { Component, OnInit, ViewChild } from '@angular/core';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';

import { VoiceService } from '../../../services/voice/voice.service';
import { Subscription } from 'rxjs';

enum settingsRackMenuItem {
    overview,
    envelope,
    partials
}

@Component({
  selector: 'app-settings-rack',
  templateUrl: './settings-rack.component.html',
  styleUrls: ['./settings-rack.component.css']
})
export class SettingsRackComponent implements OnInit {

  constructor(private voiceService: VoiceService) { }

  private _settingsHolder: any;




  selectedMenuItem = 0;

  menu = [
      {
          label: 'Overview',
          id: settingsRackMenuItem.overview
      },
      {
        label: 'Envelope',
        id: settingsRackMenuItem.envelope
    },
    {
        label: 'Partials',
        id: settingsRackMenuItem.partials
    },
  ];

  subscription: Subscription;

  get overviewSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.overview;
  }

  get envelopeSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.envelope;
  }

  get partialsSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.partials;
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
