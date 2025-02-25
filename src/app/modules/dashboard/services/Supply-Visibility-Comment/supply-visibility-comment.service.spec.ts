import { TestBed } from '@angular/core/testing';

import { SupplyVisibilityCommentService } from './supply-visibility-comment.service';

describe('SupplyVisibilityCommentService', () => {
  let service: SupplyVisibilityCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyVisibilityCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
