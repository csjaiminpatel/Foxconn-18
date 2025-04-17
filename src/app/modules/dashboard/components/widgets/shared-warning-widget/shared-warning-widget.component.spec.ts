import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWarningWidgetComponent } from './shared-warning-widget.component';

describe('SharedWarningWidgetComponent', () => {
  let component: SharedWarningWidgetComponent;
  let fixture: ComponentFixture<SharedWarningWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedWarningWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedWarningWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
