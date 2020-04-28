import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { OscillatorComponent } from './components/oscillator/oscillator.component';
import { LedComponent } from './components/led/led.component';
import { SettingsRackComponent } from './components/oscillator/settings-rack/settings-rack.component';
import { PartialsComponent } from './components/oscillator/partials/partials.component';

import { from, fromEventPattern } from 'rxjs';
import { PartialsSelectorComponent } from './components/oscillator/partials/partials-selector/partials-selector.component';
import { EffectsRackComponent } from './effects-rack/effects-rack.component';
import { AdrEnvelopeComponent } from './components/oscillator/settings-rack/adr-envelope/adr-envelope.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    OscillatorComponent,
    LedComponent,
    SettingsRackComponent,
    PartialsComponent,
    PartialsSelectorComponent,
    EffectsRackComponent,
    AdrEnvelopeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
