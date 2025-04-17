import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsSplitService {
  resizeEventsSubject: Subject<any> = new Subject<any>();

  sideNavStateSubject: Subject<any> = new Subject<any>();
  sideNavState: any;
  constructor() {}

  setSideNavState(data : any) {
    this.sideNavState = data;
    this.sideNavStateSubject.next(data);
  }

  getSideNavState() {
    return this.sideNavStateSubject.asObservable();
  }

  setSplitEvents(data :any) {
    this.resizeEventsSubject.next(data);
  }

  getSplitEvents() {
    return this.resizeEventsSubject.asObservable();
  }
}
