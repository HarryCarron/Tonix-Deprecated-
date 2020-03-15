import { Component, OnInit } from '@angular/core';
import { EffectsRackComponent } from './effects-rack/effects-rack.component';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';

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

  constructor() { }

  selectedMenuItem = 1;

  get envelopeSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.envelope;
  }

  get effectsSelected(): boolean {
    return this.selectedMenuItem === settingsRackMenuItem.effects;
  }

  selectMenuItem(menuItem: settingsRackMenuItem): void {
    this.selectedMenuItem = menuItem;
  }

  ngOnInit(): void {
  }

}
