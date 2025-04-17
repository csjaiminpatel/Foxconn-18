import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyVisibilityConfigureWidgetComponent } from './supply-visibility-configure-widget.component';

describe('SupplyVisibilityConfigureWidgetComponent', () => {
  let component: SupplyVisibilityConfigureWidgetComponent;
  let fixture: ComponentFixture<SupplyVisibilityConfigureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyVisibilityConfigureWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyVisibilityConfigureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
