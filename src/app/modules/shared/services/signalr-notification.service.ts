import { Injectable } from '@angular/core';
import { ReceiveNotificationMessage } from './signal-r.service';
import { Observable, Subject } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignalrNotificationService {
  public subject = new Subject<ReceiveNotificationMessage>();
  public keepAfterRouteChange = true;
  
  constructor(
    public router: Router
  ) { 
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  showNotification(message: string, shortMessage: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<ReceiveNotificationMessage>{
      Title: message,
      ShortMessage: shortMessage,
    });
  }

  clear() {
    this.subject.next({} as ReceiveNotificationMessage);
  }
}
