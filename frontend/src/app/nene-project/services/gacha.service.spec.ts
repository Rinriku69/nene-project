import { TestBed } from '@angular/core/testing';

import { GachaService } from './gacha.service';

describe('GachaService', () => {
  let service: GachaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GachaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
