import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XyPadComponent } from './xy-pad.component';

describe('XyPadComponent', () => {
  let component: XyPadComponent;
  let fixture: ComponentFixture<XyPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XyPadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XyPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
