import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MasterService, Oscillator } from './services/master.service';
import { FormsModule } from '@angular/forms';
import { MouseMetricsComponent } from './developerTools/mouse-metrics/mouse-metrics.component';

import { OscillatorComponent } from './components/oscillator/oscillator.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private masterSrv: MasterService) {

    }

    oscillators: Oscillator[] = this.masterSrv.oscillators;

    ngOnInit() {
    }
}
