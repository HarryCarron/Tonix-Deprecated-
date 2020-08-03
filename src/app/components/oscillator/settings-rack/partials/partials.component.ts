import { Component, OnInit, Input, OnChanges, forwardRef, HostListener, ViewChild } from '@angular/core';
import { VoiceService } from './../../../../services/voice/voice.service';
import { PARTIAL_CONTAINER_HEIGHT } from './../../../../services/master.service';
import { WindowEventsService } from '../../../../services/events/window-events.service';

@Component({
  selector: 'app-partials',
  templateUrl: './partials.component.html',
  styleUrls: ['./partials.component.css']
})
export class PartialsComponent implements OnChanges, OnInit {

    constructor(
        private windowEvnt: WindowEventsService
    ) { }

    private _partialSelector;

    @ViewChild('partialsSelector', {static: true})

    set partialSelector({nativeElement: e}) {
        this._partialSelector = e;
    }

    get partialSelector() {
        return this._partialSelector;
    }

    get partialsSelectorBounding() {
        console.log(this.partialSelector.getBoundingClientRect());
        return this.partialSelector.getBoundingClientRect();
    }

    get partialsSelectorWidth() {
        return this.partialSelector.width;
    }

    defaultHeight = PARTIAL_CONTAINER_HEIGHT;

    partialCount: number;

    @Input() showPartials: boolean;

    @Input() partials: number[];

    partialSelectionDisabled = false;

    partialEntryMoving = false;

    clickIsWithinContainer(e): boolean { // todo: tidy this shit up
        if (e.clientX < this.partialsSelectorBounding.x) {
            return false;
        }
        if (e.clientX > (this.partialsSelectorBounding.x + this.partialsSelectorBounding.width)) {
            return false;
        }
        if (e.clientY < (this.partialsSelectorBounding.y)) {
            return false;
        }
        if (e.clientY > (this.partialsSelectorBounding.y +  + this.partialsSelectorBounding.height)) {
            return false;
        }

        return true;

    }


    @HostListener('window:mousedown', ['$event'])
    startPartialEntry(r) {
         if (this.clickIsWithinContainer(r)) {
            this.partialEntryMoving = true;
         }
    }

    @HostListener('window:mouseup', ['$event'])
    endPartialEntry() {
        this.partialEntryMoving = false;
    }

    @HostListener('window:click', ['$event'])
    mouseClick({clientX: x, clientY: y}) {
        this.partialEntryActive({clientX: x, clientY: y});
    }

    @HostListener('window:mousemove', ['$event'])
    partialEntryActive({clientX: x, clientY: y}) {
        if (this.partialEntryMoving) {
            const newx = x - this.partialsSelectorBounding.x;
            const newy = this.partialsSelectorBounding.bottom - y;
            if (newy >= 100 || newy === 0) { return; }
            console.log(newy);
            if (newx < this.partialsSelectorWidth / this.partials.length) {
                this.partials[1] = y;
            } else {
                this.partials[
                    parseInt(((newx) / 100).toFixed(), 10)
                ] = newy;
            }
            console.log(this.partials);

        }
    }

    mouseMove = (e) => {
        console.log('mouse moving', e);
    }

    mouseUp = () => {
        console.log('events destoyed');
    }

    setPartials(): void {
        this.windowEvnt.enableDragAndDrop(
            this.mouseUp,
            this.mouseMove
        );
    }

    hideP(n: number): boolean {
        return (n * 10) < (0.1 * 10);
    }

    updatePartials(partialCount: number): void {
        if (this.partials.length < partialCount)  {
            this.partials = (this.partials || []).concat([0]);
        } else {
            this.partials = this.partials.filter((p, i, o) => i + 1 !== o.length);
        }
    }

    ngOnChanges() {
        this.partialCount = this.partials.length;
    }

    ngOnInit() {
        console.log(this.partials);
    }

}
