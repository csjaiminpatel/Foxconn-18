import { TestBed } from '@angular/core/testing';

import { BuyersPartnumbersListService } from './buyers-partnumbers-list.service';

describe('BuyersPartnumbersListService', () => {
  let service: BuyersPartnumbersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyersPartnumbersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
