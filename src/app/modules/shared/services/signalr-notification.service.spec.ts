import { TestBed } from '@angular/core/testing';

import { SignalrNotificationService } from './signalr-notification.service';

describe('SignalrNotificationService', () => {
  let service: SignalrNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
