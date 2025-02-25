import { TestBed } from '@angular/core/testing';

import { SupplyVisibilityService } from './supply-visibility.service';

describe('SupplyVisibilityService', () => {
  let service: SupplyVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
