export interface EnvelopeModel {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    attackCurve: string;
    decayCurve: string;
    releaseCurve: string;
}

export interface ModelToCoordData {
    envelopModelValues: any;
    travelUnits: number;
    xMargin: number;
    staccato: boolean;
}

// ! EnvelopeSector enum formally known as EnvelopePart
export enum EnvelopeSector {
    attack,
    decay,
    sustain,
    release
}

export enum EnvelopeHandleType {
    begin,
    attack,
    decay,
    sustain,
    release,
    end
}

export enum CurveType {
    linear,
    exponential,
    cosine
}

export enum CurveTypeShort {
    lin,
    exp,
    cos
}
