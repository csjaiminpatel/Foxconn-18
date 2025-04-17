import { TestBed } from '@angular/core/testing';

import { AsSplitService } from './as-split.service';

describe('AsSplitService', () => {
  let service: AsSplitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsSplitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
