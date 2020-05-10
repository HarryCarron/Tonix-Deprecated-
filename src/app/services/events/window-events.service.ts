import { Injectable, HostListener } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum windowEventType {
    mouseup,
    mousemove
}

@Injectable({
  providedIn: 'root'
})
export class WindowEventsService {

    private mouseUp = null;
    private mouseMove = null;

    private mouseUpSubject = new Subject();
    private mouseMoveSubject = new Subject();

    @HostListener('window:mouseup', ['$event'])

    public enableDragAndDrop(mouseupCallback, mousemoveCallback) {
        this.mouseUp = window.addEventListener('mouseup',
            (event) => {
            mouseupCallback(); this.destroyEvents(); });

        this.mouseMove = window.addEventListener('mousemove',
            ({clientX, clientY}) => { mousemoveCallback({x: clientX, y: clientY}); });
    }

    public destroyEvents() {
        this.mouseUp = null;
        this.mouseMove = null;
    }

  constructor() { }
}
