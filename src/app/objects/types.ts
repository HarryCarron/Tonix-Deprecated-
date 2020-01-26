export enum waveTypeEnum {
    sine = 0,
    square = 1,
    saw = 2 // todo: more types
}

export type waveType = 'sine' | 'square' | 'saw';

export const defaultWaveForm = 'sine';

export enum dragAndDropOrientation {
    xOnly = 0,
    yOnly = 0,
    all = 0
}
