import { Component, OnInit } from '@angular/core';
import { effects, PingPongDelayEffect } from './objects/effects-rack.objects';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-effect-rack',
  templateUrl: './effect-rack.component.html',
  styleUrls: ['./effect-rack.component.css']
})
export class EffectRackComponent implements OnInit {

  constructor(private utils: UtilitiesService) { }

  effectsOptions = this.utils.definitionArrayFromEnum(effects);

  selectConfig = {
      search: true
  };

    liveEffects = [];

  effects =  [
      {
        displayName: 'Auto Pan',
        id: effects.AutoPan,
        description: 'Alters the volume of your signal from left, to right of your stereo output'
      },
      {
        displayName: 'Auto Filter',
        id: effects.AutoFilter,
      },
      {
        displayName: 'Auto Wah',
        id: effects.AutoWah,
      },
      {
        displayName: 'Bitcrusher',
        id: effects.Bitcrusher,
      },
      {
        displayName: 'Chorus',
        id: effects.Chorus,
      },
      {
        displayName: 'Distortion',
        id: effects.Distortion,
      },
      {
        displayName: 'Feedback Delay',
        id: effects.FeedbackDelay,
      },
      {
        displayName: 'Freeverb',
        id: effects.Freeverb,
      },
      {
        displayName: 'Frequency Shifter',
        id: effects.FrequencyShifter,
      },
      {
        displayName: 'Phaser',
        id: effects.Phaser,
      },
      {
        displayName: 'Ping-Pong Delay',
        id: effects.PingPongDelay,
      },
      {
        displayName: 'Pitch Shift',
        id: effects.PitchShift,
      },
      {
        displayName: 'Reverb',
        id: effects.Reverb,
      },
      {
        displayName: 'Stereo Widener',
        id: effects.StereoWidener,
      },
      {
        displayName: 'Tremelo',
        id: effects.Tremolo,
      },
      {
        displayName: 'Vibrato',
        id: effects.Vibrato,
      }
    ];

    FXselectionMade(fxID: effects): void {

        switch (fxID) {
            case(effects.PingPongDelay) : {
                this.liveEffects.push(
                    new PingPongDelayEffect()
                );
            }
        }
    }

    removeLiveEffect(fxIndex: number) {
        this.liveEffects.splice(fxIndex, 1);
    }


    ngOnInit(): void {
    }

}
