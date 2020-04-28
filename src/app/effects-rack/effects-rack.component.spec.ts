import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsRackComponent } from './effects-rack.component';

describe('EffectsRackComponent', () => {
  let component: EffectsRackComponent;
  let fixture: ComponentFixture<EffectsRackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectsRackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectsRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
