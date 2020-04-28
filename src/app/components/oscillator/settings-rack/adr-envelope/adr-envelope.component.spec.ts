import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrEnvelopeComponent } from './adr-envelope.component';

describe('AdrEnvelopeComponent', () => {
  let component: AdrEnvelopeComponent;
  let fixture: ComponentFixture<AdrEnvelopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdrEnvelopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdrEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
