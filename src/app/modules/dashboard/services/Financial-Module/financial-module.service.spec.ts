import { TestBed } from '@angular/core/testing';

import { FinancialModuleService } from './financial-module.service';

describe('FinancialModuleService', () => {
  let service: FinancialModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
