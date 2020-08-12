import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor() { }

  _options: any[];

  @Input('options')
  set options(o) {
    this._options = o;
  }

  get options() {
      return this._options;
  }

  searchBarOpen = false;

  closeCountdown;

  setOpenState(mode: boolean) {


    if (mode) {
        console.log('opened');
        this.searchBarOpen = true;
        if (this.closeCountdown) {
            console.log('cancelled');
            clearTimeout(this.closeCountdown);
        }
    } else {
        console.log('closed');
        this.closeCountdown = setTimeout(_ => {
            this.searchBarOpen = false;
        }, 2500);
    }
  }



  ngOnInit(): void {
  }

}
