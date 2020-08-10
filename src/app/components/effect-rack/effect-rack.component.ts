import { Component, OnInit } from '@angular/core';
import { effects } from './objects/effects-rack.objects';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-effect-rack',
  templateUrl: './effect-rack.component.html',
  styleUrls: ['./effect-rack.component.css']
})
export class EffectRackComponent implements OnInit {

  constructor(private utils: UtilitiesService) { }

  effectsOptions = this.utils.definitionArrayFromEnum(effects);

  ngOnInit(): void {
  }

}
