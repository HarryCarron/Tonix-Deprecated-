import { Injectable, HostListener } from '@angular/core';
import { Subject, Observable, noop } from 'rxjs';

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

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(e) {
      console.log(e);
    }

    public enableDragAndDrop(mouseupCallback, mousemoveCallback) {
        // window.addEventListener('mouseup',
        //     (event) => {
        //     mouseupCallback(); this.destroyEvents(); });

        // window.addEventListener('mousemove',
        //     ({clientX, clientY}) => { mousemoveCallback({x: clientX, y: clientY}); });
    }

    public destroyEvents() {
        window.removeEventListener('mousemove', (event) => {
            noop();
        });

    }

  constructor() { }
}
