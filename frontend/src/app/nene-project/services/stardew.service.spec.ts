import { TestBed } from '@angular/core/testing';

import { StardewService } from './stardew.service';

describe('StardewService', () => {
  let service: StardewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StardewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
