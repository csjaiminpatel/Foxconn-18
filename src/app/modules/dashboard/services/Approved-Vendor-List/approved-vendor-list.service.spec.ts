import { TestBed } from '@angular/core/testing';

import { ApprovedVendorListService } from './approved-vendor-list.service';

describe('ApprovedVendorListService', () => {
  let service: ApprovedVendorListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovedVendorListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
