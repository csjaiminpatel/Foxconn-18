import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilterWidgetComponent } from './dashboard-filter-widget.component';

describe('DashboardFilterWidgetComponent', () => {
  let component: DashboardFilterWidgetComponent;
  let fixture: ComponentFixture<DashboardFilterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFilterWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFilterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
