import { TestBed } from '@angular/core/testing';

import { SafeZoneService } from './safe-zone.service';

describe('SafeZoneService', () => {
  let service: SafeZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
