import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePnExcelExportComponent } from './single-pn-excel-export.component';

describe('SinglePnExcelExportComponent', () => {
  let component: SinglePnExcelExportComponent;
  let fixture: ComponentFixture<SinglePnExcelExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePnExcelExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePnExcelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
