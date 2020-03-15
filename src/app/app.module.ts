import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { KnobModule } from 'ng2-knob';
import { NgSwitcheryModule } from 'angular-switchery-ios';
import { OscillatorComponent } from './components/oscillator/oscillator.component';
import { LedComponent } from './components/led/led.component';
import { SettingsRackComponent } from './components/settings-rack/settings-rack.component';
import { EffectsRackComponent } from './components/settings-rack/effects-rack/effects-rack.component';
import { AdsrEnvelopeComponent } from './components/settings-rack/adsr-envelope/adsr-envelope.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    OscillatorComponent,
    LedComponent,
    SettingsRackComponent,
    EffectsRackComponent,
    AdsrEnvelopeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    KnobModule,
    NgSwitcheryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
