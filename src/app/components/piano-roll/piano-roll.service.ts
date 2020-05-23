import { Injectable } from '@angular/core';

export enum keysColor {
    white,
    black
}

export const PIANO_ROLL_KEY_WIDTH = 40;

export const PIANO_ROLL_KEY_PADDING = 2;

export const NUMBER_OF_OCTAVES = 2;

export const OCTAVE_DEFINITION = [

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
        note: 'D^',
        color: keysColor.black,
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

    public getKey(type: keysColor, height: number, width: number, index: number) {
        const key = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(key, 'width', PIANO_ROLL_KEY_WIDTH - PIANO_ROLL_KEY_PADDING);
        this.renderer.setAttribute(key, 'height', (height - PIANO_ROLL_KEY_PADDING).toString());
        this.renderer.setAttribute(key, 'fill', type === keysColor.white ? '#f9ebeb' : '#f18a6d');
        this.renderer.setAttribute(key, 'ry', '2');

        return key;

    }

    public getRollRow(type: keysColor, height: number, width: number, i: number, rowLength: number): void {
        const rc = this.renderer.createElement('svg', 'svg');
        this.renderer.setAttribute(rc, 'height', height);
        this.renderer.setAttribute(rc, 'width', width);
        this.renderer.setAttribute(rc, 'y', height * i);

        const k = this.getKey(type, height, width, i);
        this.renderer.appendChild(rc, k);
        this.renderer.setAttribute(k, 'y', PIANO_ROLL_KEY_PADDING);
        this.renderer.setAttribute(k, 'height', height - PIANO_ROLL_KEY_PADDING);

        const innerContainer = () => {
            const row = this.renderer.createElement('rect', 'svg');
            this.renderer.setAttribute(row, 'width', width / 4);
            this.renderer.setAttribute(row, 'height', height);
            this.renderer.setAttribute(row, 'x', '0');
            this.renderer.setAttribute(row, 'y', '0');
            this.renderer.setAttribute(row, 'fill', '#f9ebeb');
            this.renderer.setAttribute(row, 'fill-opacity', 0.4);
            this.renderer.setAttribute(row, 'ry', '2');

            return row;
        };

        // Array.from({ length: 4 }).forEach();
        return rc;
    }

}
