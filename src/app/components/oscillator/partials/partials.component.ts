import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VoiceService } from './../../../services/voice/voice.service';

@Component({
  selector: 'app-partials',
  templateUrl: './partials.component.html',
  styleUrls: ['./partials.component.css']
})
export class PartialsComponent implements OnChanges {

  constructor() { }

  @Input() showPartials: boolean;

  ngOnChanges() {

  }

}
