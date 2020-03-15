import { Component, OnInit, Input } from '@angular/core';
import { LedComponent } from './../led/led.component';
import { SettingsRackComponent } from './../../components/settings-rack/settings-rack.component';


@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.css']
})
export class OscillatorComponent implements OnInit {

  constructor() { }

  @Input() data; // todo: type

  ngOnInit(): void {
  }

}
