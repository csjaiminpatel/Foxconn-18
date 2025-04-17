import { TestBed } from '@angular/core/testing';

import { BufferRulesService } from './buffer-rules.service';

describe('BufferRulesService', () => {
  let service: BufferRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BufferRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
