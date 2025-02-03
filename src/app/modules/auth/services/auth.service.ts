import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';
import { detectIncognito } from 'detectincognitojs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isPrivateMode: boolean = false;
  isAuthenticated$ : boolean = false;
  idToken: any;
  private hasStorage?: boolean;
  private writeLogs:boolean = true; //NOTE Turn on for debug login flow log
  private readonly tabId: string = uuidv4();
  private readonly idleTimeOutInMilliseconds: number = environment.tokenConfig.idleTimeOutInMilliseconds;
  private idleTimeOut: number = this.idleTimeOutInMilliseconds / 1000;
  private idleTimeOutChecker: any = null;
  private idleTimeOutCheckerIntervalInSeconds = 10;
  private renewTokenExpireTimeInMilliseconds?: number;
  private readonly CACHED_FLAG_VALUE = 'cache';
  private isAuthenticated = false; // NOTE it will init on OIDC Config Load;
  private refreshSessionHandler?: number;
  private expiredSessionHandler?: number;
  // private refreshSessionDialogRef: MatDialogRef<RefreshSessionComponent, any>;
  private isRefreshingSession = false;

  constructor(
    private readonly router: Router,
    private readonly oidcSecurityService: OidcSecurityService,
  ) {
    this.setIdleTimeoutChecker();

    detectIncognito()
      .then((browserInfo) => {
        this.isPrivateMode = browserInfo.isPrivate;
        this.writeLogs
          ? this.writeLog('[01-021] Incognito Mode is detected')
          : null;
      })
      .catch((error) => {
        console.log('Private mode error:-' + error);
        this.writeLogs
          ? this.writeLog('[01-022] Incognito Mode is not detected')
          : null;
      });

          //Required to work with session/local storage
    this.hasStorage = typeof Storage !== 'undefined';
    if (this.hasStorage) {
      this.writeLogs ? this.writeLog("[01-024] Has Permission of Session/Local Storage") : null
    } else {
      this.writeLogs ? this.writeLog("[01-025] does not have Permission of Session/Local Storage") : null
    }

    localStorage.setItem(EnumAuthVars.LastActivityTimestamp, 'Init');
    sessionStorage.removeItem(EnumAuthFlags.OidcInitiated);

    this.oidcSecurityService.isAuthenticated$.subscribe((authResult) => {
      this.isAuthenticated$ = authResult.isAuthenticated;
    });

    this.writeLogs ? this.writeLog("[01-023] Constructor for authentication is completed") : false;
  }

  setIdleTimeoutChecker() {
    try {
      const that = this;
      this.idleTimeOutChecker = setInterval(() => {
        that.checkIfIdleTimeout(that);
      }, this.idleTimeOutCheckerIntervalInSeconds * 1000);
    } catch (ex) {
      this.writeLogs ? this.writeLog('Session Info', ex) : null;
    }
  }

  checkIfIdleTimeout(that: AuthService): boolean {
    if (that.isAuthenticated) {
      if (that.idleTimeOut > 0) {
        that.idleTimeOut = that.idleTimeOut - 10;
        return false;
      } else {
        const currentTimeMillis = that.getCurrentTime();

        if (that.checkIfRefreshTokenExpired(that, currentTimeMillis)) {
          return false;
        }
        if (that.checkIfRefreshingProcess()) {
          return false;
        }

        that.invokeRefreshSession(that);
        that.sendLocalStorageEvent(EnumSharedSessionEvents.SessionExpired);
        return true;
      }
    } else {
      return true;
    }
  }

  private invokeRefreshSession(self: AuthService): void {
    console.log('[Dialog Testing] Dialog opened!');
    // self.openRefreshSessionDialog();
  }


  private sendLocalStorageEvent(eventName: string, data?: any) {
    const tabData: SessionExchangeFormat = {
      tabId: this.tabId,
      tabPayload: data,
    };
    localStorage.setItem(eventName, JSON.stringify(tabData));
    setTimeout(() => {
      localStorage.removeItem(eventName);
    }, 200);
  }

  checkIfRefreshTokenExpired(that: AuthService, currentTimeMillis: any) {
    if (
      that.renewTokenExpireTimeInMilliseconds &&
      that.renewTokenExpireTimeInMilliseconds < currentTimeMillis
    ) {
      const { currentPath } = that.getCurrentPath();
      that.setRedirectUrl(currentPath); //TODO check if its home or not
      that.logoutAdfs();
      return true;
    } else {
      return false;
    }
  }
  logoutAdfs() {
    this.idToken = this.getIdToken();
    localStorage.setItem('lastUrlBeforeLogout', window.location.href);
    localStorage.setItem(
      EnumAuthFlags.IsLoggedOffLocal,
      this.CACHED_FLAG_VALUE,
    );
    this.sendLocalStorageEvent(EnumSharedSessionEvents.Logout);
    this.writeLogs ? this.writeLog('logoutAdfs') : null;
    // this.refreshSessionDialogRef ? this.refreshSessionDialogRef.close() : null;
    this.refreshSessionHandler
      ? clearTimeout(this.refreshSessionHandler)
      : null;
    this.expiredSessionHandler
      ? clearTimeout(this.expiredSessionHandler)
      : null;
    sessionStorage.clear();
    console.log('[Dialog Testing] logout calling from logoutAdfs');
    this.logoutHandler();
  }
  //Function to prevent refreshing token
  checkIfRefreshingProcess(): boolean {
    // if (this.refreshSessionDialogRef) {
    //   this.writeLogs ? this.writeLog("[01-038] checkIfRefreshingProcess - Refresh Session Dialog is Open") : null
    //   return true;
    // }
    if (this.isRefreshingSession) {
      this.writeLogs ? this.writeLog("[01-039] checkIfRefreshingProcess - Refreshing Session") : null
      return true;
    }
    if (!sessionStorage.getItem(EnumAuthFlags.IsAuthFinished)) {
      this.writeLogs ? this.writeLog("[01-40] checkIfRefreshingProcess - EnumAuthFlags.IsAuthFinished Not Present In Session ") : null
      return true;
    }
    //ADD other condition to monitor refresh session

    return false;
  }

  logoutHandler() {
    console.log('[Dialog Testing] logout Session!');
    this.oidcSecurityService.logoff();

    // call LogOut API
    window.location.href =
      'https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/logout?id_token_hint=' +
      this.idToken +
      '&post_logout_redirect_uri=' +
      encodeURIComponent(window.location.origin + '/login');
    this.router.navigate(['/home']);
  }

  getIdToken() {
    return this.oidcSecurityService.getIdToken();
  }

  public setRedirectUrl(url: string): void {
    if (this.hasStorage) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }

  public getCurrentPath() {
    const parsedUrl = new URL(window.location.href);
    const path = `${parsedUrl.pathname}${parsedUrl.search}`;
    return { currentPath: path, directoryPath: parsedUrl.pathname };
  }

  getCurrentTime(): number {
    return new Date().getTime();
  }

  private writeLog(key: string, data?: any) {
    console.log(key);
    data ? console.log(data) : null;
  }
  
  
}

export enum EnumSharedSessionEvents {
  Request = 'SharedEvent_1',
  Reply = 'SharedEvent_2',
  RenewToken = 'SharedEvent_3',
  SessionExpired = 'SharedEvent_4',
  //IMPLEMENT :- Other Events

  Logout = 'SharedEvent_20',
}

export enum EnumAuthFlags {
  IsAuthFinished = 'AuthFlag_1',
  IsTokenRenewByInterval = 'AuthFlag_2',
  RefreshSession = 'AuthFlag_3',
  ImmediateRefreshSession = 'AuthFlag_4',
  OidcInitiated = 'AuthFlag_5',
  //IMPLEMENT :- Other Flags

  IsLoggedOffLocal = 'AuthFlag_19',
  Logout = 'AuthFlag_20',
}

export enum EnumAuthVars {
  SessionCounter = 'AuthVar_1',
  LastActivityTimestamp = 'AuthVar_2',
  idleTimeOutChecker = 'AuthVar_3',
}

export interface SessionExchangeFormat {
  tabId: string;
  tabPayload?: any;
}
