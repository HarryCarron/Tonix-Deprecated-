import { TestBed } from '@angular/core/testing';

import { PianoRollService } from './piano-roll.service';

describe('PianoRollService', () => {
  let service: PianoRollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PianoRollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
