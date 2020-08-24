import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent implements OnInit {

    constructor() { }


    get testSettingsKeys() {
        return Object.keys(this.testSettings);
    }

    testSettings = {
        bpm: {
            icon: 'fa-tachometer-alt',
            title: 'BPM'
        },
        drumPattern: {
            icon: 'fa-drum',
            title: 'Drum Pattern'
        }
    };

    ngOnInit(): void {
    }

}
