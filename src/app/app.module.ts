import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { OscillatorComponent } from './components/oscillator/oscillator.component';
import { LedComponent } from './components/led/led.component';
import { SettingsRackComponent } from './components/settings-rack/settings-rack.component';
import { EffectsRackComponent } from './components/settings-rack/effects-rack/effects-rack.component';
import { AdsrEnvelopeComponent } from './components/settings-rack/adsr-envelope/adsr-envelope.component';
import { PartialsComponent } from './components/oscillator/partials/partials.component';

import { from, fromEventPattern } from 'rxjs';
import { PartialsSelectorComponent } from './components/oscillator/partials/partials-selector/partials-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    OscillatorComponent,
    LedComponent,
    SettingsRackComponent,
    EffectsRackComponent,
    AdsrEnvelopeComponent,
    PartialsComponent,
    PartialsSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
