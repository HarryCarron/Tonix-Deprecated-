import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectRackComponent } from './effect-rack.component';

describe('EffectRackComponent', () => {
  let component: EffectRackComponent;
  let fixture: ComponentFixture<EffectRackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectRackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
