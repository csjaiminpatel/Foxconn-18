import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SupplyVisibilitySidenavService {
  private sidenav?: MatSidenav;

  /**
   * Set Sidenav
   * @param {MatSidenav} sidenav
   */
  public setSidenav(sidenav?: MatSidenav) {
    this.sidenav = sidenav;
  }

  /**
   * open Sidenav
   * @returns
   * @memberof SupplyVisibilitySidenavService
   */
  public open() {
    return this.sidenav?.open();
  }

  /**
   * close Sidenav
   * @returns
   * @memberof SupplyVisibilitySidenavService
   */
  public close() {
    return this.sidenav?.close();
  }

  /**
   * Toggle Sidenav
   * @memberof SupplyVisibilitySidenavService
   */
  public toggle(): void {
    this.sidenav?.toggle();
  }

  public isOpen(): boolean  | undefined{
    return this.sidenav?.opened;
  }
}
