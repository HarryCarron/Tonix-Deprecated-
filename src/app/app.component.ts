import { Component, OnInit } from '@angular/core';
import { MasterService, Oscillator } from './services/master.service';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from './controls/knob/knob.component';
import { MouseMetricsComponent } from './developerTools/mouse-metrics/mouse-metrics.component';
import { KnobModule } from 'angular2-knob';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private masterSrv: MasterService) {

    }

    // knOptions = {
    //     readOnly: true,
    //     size: 140,
    //     unit: '%',
    //     textColor: '#000000',
    //     fontSize: '32',
    //     fontWeigth: '700',
    //     fontFamily: 'Roboto',
    //     valueformat: 'percent',
    //     value: 0,
    //     max: 100,
    //     trackWidth: 19,
    //     barWidth: 20,
    //     trackColor: '#D8D8D8',
    //     barColor: '#FF6F17',
    //     subText: {
    //       enabled: true,
    //       fontFamily: 'Verdana',
    //       font: '14',
    //       fontWeight: 'bold',
    //       text: 'Overall',
    //       color: '#000000',
    //       offset: 7
    //     },
    // };
    // value = 45;


    oscillators: Oscillator[] = this.masterSrv.oscillators;

    ngOnInit() {
    }
}
