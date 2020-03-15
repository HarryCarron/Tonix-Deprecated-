import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VoiceService {

  constructor() {}

  private subject = new Subject();

  sendMessage(message: string) {
      this.subject.next( { text: message } );
  }

  clearMessage() {
    this.subject.next();
  }

  getMessages() {
      return this.subject.asObservable();
  }
}
