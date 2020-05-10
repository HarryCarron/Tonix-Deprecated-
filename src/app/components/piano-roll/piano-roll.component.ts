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
    OCTAVE_DEFINITION
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

    private _piano;

    private keyContainerX: number;

    @ViewChild('piano', {static: true})
    set piano(p) {this._piano = p.nativeElement; }
    get piano() { return this._piano; }

    private _pianoContainer;
    @ViewChild('pianoContainer', {static: true})
    set pianoContainer(p) { this._pianoContainer = p.nativeElement; }
    get pianoContainer() { return this._pianoContainer; }

    private getAndSetPianoDimensions() {
        this.pianoContainerHeight = this.pianoContainer.clientHeight;
        this.pianoContainerWidth = this.pianoContainer.clientWidth;
        this.renderer.setAttribute(this.piano, 'height', this.pianoContainerHeight.toString());
        this.renderer.setAttribute(this.piano, 'width', this.pianoContainerWidth.toString());
    }

    get roll() {
        const output = [];
        Array.from({length: NUMBER_OF_OCTAVES}).forEach( (_, i) => {
            OCTAVE_DEFINITION.forEach((k) => {
                k.octave = i + 1;
                output.push(k);
            });
        });
        return output;
    }

    private getAndSetKeys() {

        this.keyContainerX = this.pianoContainerHeight / this.roll.length;

        this.roll.forEach( (t, i, o) => {
            const k = this.pianoRollServ.getKey(t.color, this.keyContainerX, 40);
            this.renderer.setAttribute(k, 'y', (this.keyContainerX * i).toString());
            this.renderer.appendChild(this.piano, k);
        } );
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.getAndSetPianoDimensions();
        this.getAndSetKeys();
    }

}
