import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav?: MatSidenav;

  private action = new Subject<any>();
  action$ = this.action.asObservable();

  /**
   * @param {MatSidenav} sidenav
   */
  public setSidenav(sidenav?: MatSidenav) {
    this.sidenav = sidenav;
  }

  /**
   * open sidenav
   */
  public open() {
    return this.sidenav?.open();
  }

  /**
   * close sidenav
   */
  public close() {
    return this.sidenav?.close();
  }

  /**
   * @param {void}
   */
  public toggle(): void {
    this.sidenav?.toggle();
  }

  setAction(action: any) {
    this.action.next(action);
  }
}
