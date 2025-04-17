import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPnExcelExportComponent } from './multi-pn-excel-export.component';

describe('MultiPnExcelExportComponent', () => {
  let component: MultiPnExcelExportComponent;
  let fixture: ComponentFixture<MultiPnExcelExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPnExcelExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPnExcelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
