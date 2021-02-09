import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { KnobComponent } from "./controls/knob/knob.component";
import { OscillatorComponent } from "./components/oscillator/oscillator.component";
import { LedComponent } from "./components/led/led.component";
import { SettingsRackComponent } from "./components/oscillator/settings-rack/settings-rack.component";
import { PartialsComponent } from "./components/oscillator/settings-rack/partials/partials.component";
import { AdsrEnvelopeComponent } from "./components/oscillator/settings-rack/adsr-envelope/adsr-envelope.component";
import { PianoRollComponent } from "./components/piano-roll/piano-roll.component";
import { SimpleEqComponent } from "./components/simple-eq/simple-eq.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SettingsMenuComponent } from "./settings-menu/settings-menu.component";
import { XyPadComponent } from "./components/effect-rack/xy-pad/xy-pad.component";
// import { MatrixComponent } from './components/matrix/matrix.component';
// import { Matrix2Component } from './components/matrix2/matrix2.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    OscillatorComponent,
    LedComponent,
    SettingsRackComponent,
    PartialsComponent,
    AdsrEnvelopeComponent,
    PianoRollComponent,
    SimpleEqComponent,
    SettingsMenuComponent,
    XyPadComponent,
    // MatrixComponent,
    // Matrix2Component,
  ],
  imports: [BrowserModule, FormsModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
