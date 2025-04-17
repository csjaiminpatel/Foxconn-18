import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyVisibilityDashboardComponent } from './supply-visibility-dashboard.component';

describe('SupplyVisibilityDashboardComponent', () => {
  let component: SupplyVisibilityDashboardComponent;
  let fixture: ComponentFixture<SupplyVisibilityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyVisibilityDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyVisibilityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
