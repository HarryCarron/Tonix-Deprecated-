import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Matrix2Component } from './matrix2.component';

describe('Matrix2Component', () => {
  let component: Matrix2Component;
  let fixture: ComponentFixture<Matrix2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Matrix2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Matrix2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
