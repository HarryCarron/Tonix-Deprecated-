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

    showShadow = false;

    partialCount: number;

    @Input() showPartials: boolean;

    @Input() partials: number[];

    partialSelectionDisabled = false;

    updatePartials(partialCount: number): void {
        if (this.partials.length < partialCount)  {
            this.partials = (this.partials || []).concat([0]);
        } else {
            this.partials = this.partials.filter((p, i, o) => i + 1 !== o.length);
        }
    }

    private triggerShadow(): void {
        const mode = !!(this.showPartials === true);
        setTimeout(() => {
            this.showShadow = mode;
        }, mode ? 50 : 0);
    }

    ngOnChanges() {
        this.partialCount = this.partials.length;
        this.triggerShadow();
    }

}
