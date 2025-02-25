import { TestBed } from '@angular/core/testing';

import { SupplyVisibilityNotesService } from './supply-visibility-notes.service';

describe('SupplyVisibilityNotesService', () => {
  let service: SupplyVisibilityNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyVisibilityNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
