import { Component, OnInit, Input } from '@angular/core';

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
