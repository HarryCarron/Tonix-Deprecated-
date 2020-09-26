import { Component, OnInit, Input, OnChanges, forwardRef, HostListener, ViewChild } from '@angular/core';
import { VoiceService } from './../../../../services/voice/voice.service';
import { PARTIAL_CONTAINER_HEIGHT } from './../../../../services/master.service';
import { WindowEventsService } from '../../../../services/events/window-events.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { AnimationService } from './../../../../services/animation/animation.service';
import { UtilitiesService } from './../../../../services/utilities.service';

@Component({
  selector: 'app-partials',
  templateUrl: './partials.component.html',
  styleUrls: ['./partials.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PartialsComponent),
    multi: true
}]
})
export class PartialsComponent {

    constructor(
        private windowEvnt: WindowEventsService,
        private animation: AnimationService,
        private utils: UtilitiesService
    ) { }

    private _partialSelector;

    private onChange;

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


    hoveredPartial = {};

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

    t = () => console.log(this.hoveredPartial);


    @HostListener('window:mousedown', ['$event'])
    startPartialEntry(r) {
         if (this.clickIsWithinContainer(r)) {
            this.partialEntryMoving = true;
            this.partialEntryActive(r);
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
            const newy = (this.partialsSelectorBounding.bottom - y) + 8;

            const hoveredPartial = Math.floor(
                newx / (this.partialsSelectorBounding.width /
                    this.partials.length)
            );
            const newValue = parseFloat((newy / 100).toFixed(2));

            if (!!this.partials[hoveredPartial] || this.partials[hoveredPartial] === 0) {
                if (newValue >= 1) {
                    this.partials[hoveredPartial] = 1;
                } else if (newValue <= 0) {
                    this.partials[hoveredPartial] = 0;
                } else {
                    this.partials[hoveredPartial] = newValue;
                }
            }
            this.onChange(this.partials);
        }
    }

    randomisePartials() {
        const r = u => Math.floor(Math.random() * u) + 1;

        const randomPs = this.partials = Array
        .from({length: r(32)})
        .map(a => r(10) / 10);

        this.animation.valueToValueAnimation(
            (d) => {this.partials = d; console.log(d); },
            randomPs.map(p => 0),
            randomPs
        );


        this.onChange(this.partials);
    }

    updatePartials(mode: boolean): void {
        if (mode && this.partials.length < 32)  {
            this.partials.push(0);
        } else if (!mode && this.partials.length > 0) {
            this.partials.pop();
        }
    }

    onTouched = () => {};

    registerOnTouched(fn: () => void): void {}

    setDisabledState(isDisabled: boolean): void {}

    writeValue(partialValues): void {
        if (partialValues) {
            this.animation.valueToValueAnimation(
                (d) => {this.partials = d; console.log(d); },
                partialValues.map(p => 0),
                partialValues
            );
        }
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

}
