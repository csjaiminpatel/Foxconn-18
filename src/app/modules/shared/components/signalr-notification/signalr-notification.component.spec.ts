import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalrNotificationComponent } from './signalr-notification.component';

describe('SignalrNotificationComponent', () => {
  let component: SignalrNotificationComponent;
  let fixture: ComponentFixture<SignalrNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalrNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalrNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
