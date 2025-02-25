import { TestBed } from '@angular/core/testing';

import { VirtualPnGroupsService } from './virtual-pn-groups.service';

describe('VirtualPnGroupsService', () => {
  let service: VirtualPnGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualPnGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
