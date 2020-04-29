import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-adr-envelope',
  templateUrl: './adr-envelope.component.html',
  styleUrls: ['./adr-envelope.component.css']
})
export class AdrEnvelopeComponent implements OnInit, AfterViewInit {

  constructor() { }

  begin = {};
  point = {};
  end = {};

  @ViewChild('beginCirle', {static: true})
  set beginCircle(e) {
      this.begin['circle'] = e.nativeElement;
  }

  @ViewChild('pointCirle', {static: true})
  set pointCircle(e) {
      this.point['circle'] = e.nativeElement;
  }

  @ViewChild('endCirle', {static: true})
  set endCircle(e) {
      this.end['circle'] = e.nativeElement;
  }

  @ViewChild('att', {static: true})
  set att(e) {
      this.begin['line'] = e.nativeElement;
  }

  @ViewChild('att', {static: true})
  set dec(e) {
      this.end['line'] = e.nativeElement;
  }

  selectLine(mode): void {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

}
