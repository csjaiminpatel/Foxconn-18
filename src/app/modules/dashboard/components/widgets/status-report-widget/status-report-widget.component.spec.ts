import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusReportWidgetComponent } from './status-report-widget.component';

describe('StatusReportWidgetComponent', () => {
  let component: StatusReportWidgetComponent;
  let fixture: ComponentFixture<StatusReportWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusReportWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusReportWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
