import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoRollComponent } from './piano-roll.component';

describe('PianoRollComponent', () => {
  let component: PianoRollComponent;
  let fixture: ComponentFixture<PianoRollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoRollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
