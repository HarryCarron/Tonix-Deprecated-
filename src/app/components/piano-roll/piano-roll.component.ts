import {
    Component,
    OnInit,
    ViewChild,
    Renderer2,
    AfterViewInit
} from '@angular/core';
import {
    PianoRollService,
    keysColor,
    NUMBER_OF_OCTAVES,
    OCTAVE_DEFINITION,
    PIANO_ROLL_KEY_PADDING
} from './piano-roll.service';
import { NumberValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-piano-roll',
  templateUrl: './piano-roll.component.html',
  styleUrls: ['./piano-roll.component.css']
})
export class PianoRollComponent implements OnInit, AfterViewInit {

    constructor(private renderer: Renderer2, private pianoRollServ: PianoRollService) {
        this.pianoRollServ.renderer = renderer;
    }

    private pianoContainerWidth: number;
    private pianoContainerHeight: number;

    private rollContainerWidth: number;
    private rollContainerHeight: number;

    private _pianoRollContainer;
    private _pianoRoll;

    private rowHeight: number;

    private keyContainerX: number;

    @ViewChild('pianoRoll', {static: true})
    set pianoRoll(p) {this._pianoRoll = p.nativeElement; }
    get pianoRoll() { return this._pianoRoll; }

    private _pianoContainer;
    @ViewChild('pianoRollContainer', {static: true})
    set pianoRollContainer(p) { this._pianoRollContainer = p.nativeElement; }
    get pianoRollContainer() { return this._pianoRollContainer; }

    private setContainerDimensions() {
        this.pianoContainerHeight = this.pianoRollContainer.clientHeight;
        this.pianoContainerWidth = this.pianoRollContainer.clientWidth;

        this.rowHeight = this.pianoContainerHeight / this.rollKeys.length;

        this.renderer.setAttribute(this.pianoRoll, 'height', this.pianoContainerHeight.toString());
        this.renderer.setAttribute(this.pianoRoll, 'width', this.pianoContainerWidth.toString());
    }

    get rollKeys() {
        const output = [];
        Array.from({length: NUMBER_OF_OCTAVES}).forEach( (_, i) => {
            OCTAVE_DEFINITION.forEach((k) => {
                k.octave = i + 1;
                output.push(k);
            });
        });
        return output;
    }


    private getAndSetRoll(): void {
        this.rollKeys.forEach( (t, i, o) => {
            const r = this.pianoRollServ.getRollRow(
                t.color,
                this.rowHeight,
                this.pianoContainerWidth,
                i,
                o.length
                );
            this.renderer.appendChild(this.pianoRoll, r);
        } );
    }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.setContainerDimensions();
        this.getAndSetRoll();
    }

}
