import { TestBed } from '@angular/core/testing';

import { WindowEventsService } from './window-events.service';

describe('WindowEventsService', () => {
  let service: WindowEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
