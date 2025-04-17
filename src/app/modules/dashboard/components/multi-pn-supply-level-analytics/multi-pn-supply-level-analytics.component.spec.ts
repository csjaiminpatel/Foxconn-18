import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPnSupplyLevelAnalyticsComponent } from './multi-pn-supply-level-analytics.component';

describe('MultiPnSupplyLevelAnalyticsComponent', () => {
  let component: MultiPnSupplyLevelAnalyticsComponent;
  let fixture: ComponentFixture<MultiPnSupplyLevelAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPnSupplyLevelAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPnSupplyLevelAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
