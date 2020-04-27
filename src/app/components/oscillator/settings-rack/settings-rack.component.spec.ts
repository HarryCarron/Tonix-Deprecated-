import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRackComponent } from './settings-rack.component';

describe('SettingsRackComponent', () => {
  let component: SettingsRackComponent;
  let fixture: ComponentFixture<SettingsRackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsRackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
