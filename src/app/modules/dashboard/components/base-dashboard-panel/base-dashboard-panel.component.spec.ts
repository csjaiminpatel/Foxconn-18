import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDashboardPanelComponent } from './base-dashboard-panel.component';

describe('BaseDashboardPanelComponent', () => {
  let component: BaseDashboardPanelComponent;
  let fixture: ComponentFixture<BaseDashboardPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDashboardPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDashboardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
