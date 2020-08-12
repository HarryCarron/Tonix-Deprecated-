export enum effects {
    AutoPan,
    AutoFilter,
    AutoWah,
    Bitcrusher,
    Chorus,
    Distortion,
    FeedbackDelay,
    Freeverb,
    FrequencyShifter,
    Phaser,
    PingPongDelay,
    PitchShift,
    Reverb,
    StereoWidener,
    Tremolo,
    Vibrato,
}

// abstract class LiveEffect {
//     /**
//      *
//      */

//     public name: string;
//     public id: effects;

//     constructor(effectName: string, effectID: effects) {
//         this.name = effectName;
//         this.id = effectID;
//     }

// }

export class PingPongDelayEffect {
    /**
     *
     */
    public params = ['Delay Time', 'Feedback', 'Wet'];
    public name = 'Ping Pong Delay';
    public id = effects.PingPongDelay;
    public delayTime: string; // todo: use tonejs interfaces
    public feedback: string; // todo: use tonejs interfaces

    constructor() {
    }
}
