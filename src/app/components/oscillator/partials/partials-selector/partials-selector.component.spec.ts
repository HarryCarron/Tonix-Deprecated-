import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialsSelectorComponent } from './partials-selector.component';

describe('PartialsSelectorComponent', () => {
  let component: PartialsSelectorComponent;
  let fixture: ComponentFixture<PartialsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
