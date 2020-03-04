import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseMetricsComponent } from './mouse-metrics.component';

describe('MouseMetricsComponent', () => {
  let component: MouseMetricsComponent;
  let fixture: ComponentFixture<MouseMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouseMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouseMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
