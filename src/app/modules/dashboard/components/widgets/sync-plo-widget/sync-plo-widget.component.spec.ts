import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPloWidgetComponent } from './sync-plo-widget.component';

describe('SyncPloWidgetComponent', () => {
  let component: SyncPloWidgetComponent;
  let fixture: ComponentFixture<SyncPloWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncPloWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncPloWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
