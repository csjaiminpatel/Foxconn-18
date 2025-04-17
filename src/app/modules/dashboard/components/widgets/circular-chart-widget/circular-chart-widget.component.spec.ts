import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularChartWidgetComponent } from './circular-chart-widget.component';

describe('CircularChartWidgetComponent', () => {
  let component: CircularChartWidgetComponent;
  let fixture: ComponentFixture<CircularChartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularChartWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
