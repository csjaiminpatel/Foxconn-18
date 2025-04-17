import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSelectDialogComponent } from './dashboard-select-dialog.component';

describe('DashboardSelectDialogComponent', () => {
  let component: DashboardSelectDialogComponent;
  let fixture: ComponentFixture<DashboardSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
