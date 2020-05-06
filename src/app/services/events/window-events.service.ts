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
    handleMouseDown() {
        this.mouseUpSubject.next(true);
    }

    public enableEvents() {
        this.mouseUp = window.addEventListener('mouseup', (event) => {
            this.mouseUpSubject.next(true);
          });
          this.mouseMove = window.addEventListener('mousemove', (event) => {
            this.mouseMoveSubject.next({x: event.clientX, y: event.clientY});
        });
    }

    public destroyEvents() {
        this.mouseUp = null;
        this.mouseMove = null;
    }

    public getMouseUpMessages(): Observable<any> {
        return this.mouseUpSubject.asObservable();
    }

    public getMouseMoveMessages(): Observable<any> {
        return this.mouseMoveSubject.asObservable();

    }








  constructor() { }
}
