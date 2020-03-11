import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { MouseMetricsComponent } from './developerTools/mouse-metrics/mouse-metrics.component';
import { KnobModule } from 'angular2-knob';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    MouseMetricsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    KnobModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
