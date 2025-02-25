import { TestBed } from '@angular/core/testing';

import { SupplyVisibilityPredefinedCommentService } from './supply-visibility-predefined-comment.service';

describe('SupplyVisibilityPredefinedCommentService', () => {
  let service: SupplyVisibilityPredefinedCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyVisibilityPredefinedCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
