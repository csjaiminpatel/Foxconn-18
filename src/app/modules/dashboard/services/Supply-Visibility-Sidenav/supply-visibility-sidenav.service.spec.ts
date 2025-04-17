import { TestBed } from '@angular/core/testing';

import { SupplyVisibilitySidenavService } from './supply-visibility-sidenav.service';

describe('SupplyVisibilitySidenavService', () => {
  let service: SupplyVisibilitySidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyVisibilitySidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
