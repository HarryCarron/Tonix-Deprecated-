import { Component, OnInit, Input, OnChanges, forwardRef, HostListener, ViewChild } from '@angular/core';
import { VoiceService } from './../../../../services/voice/voice.service';
import { PARTIAL_CONTAINER_HEIGHT } from './../../../../services/master.service';
import { WindowEventsService } from '../../../../services/events/window-events.service';

@Component({
  selector: 'app-partials',
  templateUrl: './partials.component.html',
  styleUrls: ['./partials.component.css']
})
export class PartialsComponent implements OnChanges {

    constructor(
        private windowEvnt: WindowEventsService
    ) { }

    private _partialSelector;

    @ViewChild('partialsSelector', {static: true})

    set partialSelector({nativeElement: e}) {
        this._partialSelector = e;
    }

    get partialUnit(): number {
        return this.partialsSelectorBounding.width / this.partials.length;
    }

    get partialSelector() {
        return this._partialSelector;
    }

    get partialsSelectorBounding() {
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

    @HostListener('window:mousemove', ['$event'])
    partialEntryActive({clientX: x, clientY: y}) {
        if (this.partialEntryMoving) {
            const newx = x - this.partialsSelectorBounding.x;
            const newy = this.partialsSelectorBounding.bottom - y;

            if (newy >= 101 || newy === 0 || newx <= 0) { return; }

            const hoveredPartial = Math.floor(
                newx / (this.partialsSelectorBounding.width /
                    this.partials.length)
            );
            if (!!this.partials[hoveredPartial] || this.partials[hoveredPartial] === 0) {
                this.partials[hoveredPartial] = parseFloat((newy / 100).toFixed(2));
            }
        }
    }

    randomisePartials() {

        const r = u => Math.floor(Math.random() * u) + 1;

        this.partials = Array
        .from({length: r(32)})
        .map(a => r(10) / 10);

        console.log(this.partials);
    }

    updatePartials(mode: boolean): void {
        if (mode && this.partials.length < 32)  {
            this.partials.push(0);
        } else if (!mode && this.partials.length > 0) {
            this.partials.pop();
        }
    }

    ngOnChanges() {
        this.partialCount = this.partials.length;
        console.log(this.partials);
    }

}
