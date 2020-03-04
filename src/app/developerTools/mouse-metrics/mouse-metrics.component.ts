import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-mouse-metrics',
  templateUrl: './mouse-metrics.component.html',
  styleUrls: ['./mouse-metrics.component.css']
})
export class MouseMetricsComponent implements OnInit {

    x: number;
    y: number;
    clicked: boolean;

    constructor() { }

    @Input() on: boolean;

    ngOnInit() {
    }

    private mouseMoveListener(): void {
        (<any>window).addEventListener('mousemove', e => {
            this.x = e.clientX;
            this.y = e.clientY;
        });
    }

    private mouseClickListener(): void {
        (<any>window).addEventListener('mousedown', e => {
            this.clicked = true;
        });
        (<any>window).addEventListener('mouseup', e => {
            this.clicked = false;
        });
    }

    private addMouseMoveListeners() {
        this.mouseClickListener();
        this.mouseMoveListener();
    }

    ngOnChanges() {
        if (this.on) {
            this.addMouseMoveListeners();
        }
    }

}
