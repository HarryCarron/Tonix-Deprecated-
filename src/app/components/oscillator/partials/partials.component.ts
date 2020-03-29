import { Component, OnInit, Input, OnChanges, forwardRef } from '@angular/core';
import { VoiceService } from './../../../services/voice/voice.service';
import { PARTIAL_CONTAINER_HEIGHT } from './../../../services/master.service';

@Component({
  selector: 'app-partials',
  templateUrl: './partials.component.html',
  styleUrls: ['./partials.component.css']
})
export class PartialsComponent implements OnChanges {

  constructor() { }

    defaultHeight = PARTIAL_CONTAINER_HEIGHT;

    partialCount: number;

    @Input() showPartials: boolean;

    _partials: number[];

    partialSelectionDisabled = false;

    @Input()
    set partials(p) { this._partials = p; }
    get partials() { return this._partials; }

    ngOnChanges() {
        this.partialCount = this.partials.length;
    }

}
