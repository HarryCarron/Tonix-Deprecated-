import { Injectable } from '@angular/core';

export enum keysColor {
    white,
    black
}

export const NUMBER_OF_OCTAVES = 2;

export const OCTAVE_DEFINITION = [

    {
        note: 'B^',
        color: keysColor.black,
        octave: null
    },
    {
        note: 'B',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'A^',
        color: keysColor.black,
        octave: null
    },
    {
        note: 'A',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'G^',
        color: keysColor.black,
        octave: null
    },
    {
        note: 'G',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'F^',
        color: keysColor.black,
        octave: null
    },
    {
        note: 'F',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'E',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'D',
        color: keysColor.white,
        octave: null
    },
    {
        note: 'C^',
        color: keysColor.black,
        octave: null
    },

    {
        note: 'C',
        color: keysColor.white,
        octave: null
    }

];

@Injectable({
  providedIn: 'root'
})
export class PianoRollService {

    constructor() { }

    public renderer;

    public getKey(type: keysColor, height: number, width: number) {
        const key = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(key, 'width', width);
        this.renderer.setAttribute(key, 'height', (height - 4).toString());
        this.renderer.setAttribute(key, 'fill', type === keysColor.white ? '#f9ebeb' : '#f18a6d');
        this.renderer.setAttribute(key, 'ry', '2');

        return key;

    }

}
