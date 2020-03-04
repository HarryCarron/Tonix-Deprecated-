import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KnobComponent } from './controls/knob/knob.component';
import { MouseMetricsComponent } from './developerTools/mouse-metrics/mouse-metrics.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    MouseMetricsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
