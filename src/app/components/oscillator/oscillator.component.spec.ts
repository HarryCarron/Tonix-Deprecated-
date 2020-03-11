import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscillatorComponent } from './oscillator.component';

describe('OscillatorComponent', () => {
  let component: OscillatorComponent;
  let fixture: ComponentFixture<OscillatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscillatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscillatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
