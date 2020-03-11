import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { KnobModule } from 'ng2-knob';
import { NgSwitcheryModule } from 'angular-switchery-ios';
import { OscillatorComponent } from './components/oscillator/oscillator.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    OscillatorComponent,
    // MouseMetricsComponent,
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
