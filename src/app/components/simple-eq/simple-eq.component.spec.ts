import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleEqComponent } from './simple-eq.component';

describe('SimpleEqComponent', () => {
  let component: SimpleEqComponent;
  let fixture: ComponentFixture<SimpleEqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleEqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
