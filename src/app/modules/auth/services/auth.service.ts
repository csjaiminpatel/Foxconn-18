import { v4 as uuidv4 } from 'uuid';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedResult, EventTypes, OidcSecurityService, PublicEventsService, ValidationResult } from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';
import { detectIncognito } from 'detectincognitojs';
import {
  EnumAuthVars,
  EnumAuthFlags,
  EnumSharedSessionEvents,
  SessionExchangeFormat,
  authUrlPaths,
  DateTypeRights,
  UserRights,
} from '../models/auth.model';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../shared/helper';
import { SetUserRole, SetUserRights, SetManageCommitsRights } from '../store/authentication.actions';
import { Store } from '@ngxs/store';
import { SignalRService } from '../../shared/services/signal-r.service';
import { jwtDecode } from 'jwt-decode';
import { RefreshSessionComponent } from '../components/refresh-session/refresh-session.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenExpireComponent } from '../components/token-expire/token-expire.component';

@Injectable({ providedIn: 'root' })
export class AuthService {

  //#region Private Variables
  private isPrivateMode: boolean = false;
  private hasStorage?: boolean;
  private writeLogs: boolean = true;
  private readonly tabId: string = uuidv4();
  private readonly idleTimeOutInMilliseconds: number = environment.tokenConfig.idleTimeOutInMilliseconds;
  private readonly tokenExpireOffsetInSeconds: number = environment.tokenConfig.tokenExpireOffsetInSeconds;
  private idleTimeOut: number = this.idleTimeOutInMilliseconds / 1000;
  private idleTimeOutChecker: any = undefined;
  private idleTimeOutCheckerIntervalInSeconds = 10;
  private renewTokenExpireTimeInMilliseconds?: number;
  private readonly CACHED_FLAG_VALUE = 'cache';
  private isAuthenticated = false;
  private refreshSessionHandler: any;
  private expiredSessionHandler?: any;
  private isRefreshingSession = false;
  private ignoreUrls: string[] = [];
  private readonly authResultKeySuffix = '_authnResult';

  private cancellationToken$ = new Subject();
  private isNewLogin$ = new Subject<boolean>();
  private isCancellationTokenEnable: boolean = true;


  // private refreshSessionDialogRef: MatDialogRef<RefreshSessionComponent, any>;
  private refreshSessionDialogRef: any;
  private readonly readOtherTabsTimeoutMilliseconds: number = 1000;

  //#endregion

  //#region Public Variables
  idToken: any;
  isAuthenticated$: boolean = false;
  //#endregion

  //#region Dependencies Injection
  private readonly router = inject(Router);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly httpClient = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly signalRService = inject(SignalRService);
  // private readonly eventService = inject(PublicEventsService);

  //#endregion

  //#region Constructor
  constructor(
    private readonly dialog: MatDialog,
    private readonly eventService: PublicEventsService,
  ) {
    this.setIdleTimeoutChecker();


    this.oidcSecurityService.checkAuth().subscribe({
      next: (auth) => {
        if (auth.isAuthenticated) {
          console.log("🔥🔥")
          this.isAuthenticated = true;

          this.initialConfigLoaded(auth);

        } else {
          console.log("❌ OIDC Auth Status:", auth.isAuthenticated);
          this.isAuthenticated = false;

          this.writeLogs ? this.writeLog("[01-130] init LogOffLocal - True") : null
          const { currentPath } = this.getCurrentPath();
          currentPath != '/' && currentPath != '/home' ? this.setRedirectUrl(currentPath) : null;
          this.redirectOnAuthentication(false);

        }
      },
      error: (err) => {
        this.isAuthenticated = false;
        console.error("❌ OIDC Auth Error:", err);
      },
      complete: () => {
        console.log("🔄 OIDC Auth Check Complete");
      }
    });

    detectIncognito()
      .then((browserInfo) => {
        this.isPrivateMode = browserInfo.isPrivate;
        this.writeLogs ? this.writeLog("[01-021] Incognito Mode is detected") : null
      })
      .catch((error) => {
        console.log('Private mode error:-' + error);
        this.writeLogs ? this.writeLog("[01-022] Incognito Mode is not detected") : null
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

    //Attaching Listener to listen other orion tabs and other applications
    this.localStorageListener();

    //Subscribing Oidc Lib Events (Authentication Events)
    this.subscribeOidcEvents();

    this.oidcSecurityService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated$ = isAuthenticated.isAuthenticated;
    });

    this.writeLogs ? this.writeLog("[01-023] Constructor for authentication is completed") : null

  }

  public invokeCancellationToken() {
    this.cancellationToken$.next(undefined);
  }

  public getCancellationTokenObservable() {
    return this.cancellationToken$.asObservable();
  }

  public setLoginStatus(isLogin: boolean) {
    this.isNewLogin$.next(isLogin);
  }

  public getLoginStatus() {
    return this.isNewLogin$.asObservable();
  }

  public setCancellationToken(event: boolean, calledFor?: string) {
    this.writeLog(`[01-048] Cancellation token ${(event == true) ? 'enabled' : 'disabled'} for ${calledFor}`);
    this.isCancellationTokenEnable = event;
  }

  public getCancellationToken() {
    return this.isCancellationTokenEnable;
  }

  loginAdfs() {
    // this.store.dispatch(new SetDefaultDashboardSettings(true, 'isLogin'));
    localStorage.setItem('isFirstLogin', 'true');
    this.oidcSecurityService.authorize();
  }

  /**
   * Stores the URL so we can redirect after signing in.
   */
  public getRedirectUrl(): string | null {
    if (this.hasStorage) {
      return sessionStorage.getItem('redirectUrl');
    }
    return null;
  }

  public setRedirectUrl(url: string): void {
    if (this.hasStorage) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }

  public removeRedirectUrl(): void {
    sessionStorage.removeItem('redirectUrl');
  }
  async getUserName() {
    const { upn, email, name } = await firstValueFrom(
      this.oidcSecurityService.getPayloadFromIdToken(),
    );
    let emailSplit: string[] = [];
    emailSplit = email ? email.split('@') : [];

    const username = (name ? name : emailSplit.shift()) as string;

    return username || email || upn;
  }

  async getEmailUserName() {
    const { email } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    const emailSplit: string[] = email.split('@');
    const username = emailSplit.shift();
    return username;
  }

  async getUpn() {
    const { upn, email } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    return email || upn;
  }

  async getAuthTime() {
    const { auth_time } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    return auth_time;
  }


  async getIdTokenExpireTime(): Promise<number> {
    let { exp } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    exp = isNaN(exp) ? 0 : +exp * 1000;
    return exp;
  }

  async getGroupNames(): Promise<string[]> {
    let { GroupsName } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    try {
      return GroupsName ? <string[]>GroupsName : [];
    } catch (Error) {
      return (GroupsName = []);
    }
  }

  async getPrimarySid() {
    const { primarysid } = await firstValueFrom(
      this.oidcSecurityService.getPayloadFromIdToken(),
    );
    return primarysid;
  }


  getIsAuthorized() {
    return this.oidcSecurityService.isAuthenticated$;
  }
  _getIsAuthorized(): boolean {
    return this.isAuthenticated;
  }
  getIdToken() {
    return this.oidcSecurityService.getIdToken();
  }

  getToken() {
    return this.oidcSecurityService.getAccessToken();
  }

  getPayloadFromIdToken() {
    return this.oidcSecurityService.getPayloadFromIdToken();
  }

  public async refreshTokens() {
    const that = this;

    try {
      that.isRefreshingSession = true;

      const { currentPath } = that.getCurrentPath();
      that.setRedirectUrl(currentPath);
      let Error = null;
      let res = await that.oidcSecurityService
        .forceRefreshSession()
        .toPromise()
        .catch((error) => {
          res = undefined;
          Error = error;
        });

      if (Error) {

        that.writeLogs ? that.writeLog('[01-047] Orion Auth Server - Failed to refresh token by server', Error) : null;
      }

      if (res) {
        setTimeout(() => {
          that.setUserRights();
          that.resetRefreshSessionVars();
          that.setRefreshSessionHandler();
          if (sessionStorage.length) {
            that.sendLocalStorageEvent(EnumSharedSessionEvents.RenewToken, sessionStorage);
          }
        }, 500);
        this.writeLog('[01-017] Token was successfully refreshed.');
      } else {
        that.logoutAdfs();
        that.writeLogs ? that.writeLog('[01-018] Refreshing Tokens Failed', res) : null;
      }
    } catch (e) {
      that.logoutAdfs();
      that.writeLogs ? that.writeLog('forceRefreshSession-failed', console.error(e)) : null;
    }
  }

  logoutAdfs() {
    this.idToken = this.getIdToken();
    localStorage.setItem('lastUrlBeforeLogout', window.location.href);
    localStorage.setItem(EnumAuthFlags.IsLoggedOffLocal, this.CACHED_FLAG_VALUE);
    this.sendLocalStorageEvent(EnumSharedSessionEvents.Logout);
    this.writeLogs ? this.writeLog('logoutAdfs') : null;
    this.refreshSessionDialogRef ? this.refreshSessionDialogRef.close() : null;
    this.refreshSessionHandler ? clearTimeout(this.refreshSessionHandler) : null;
    this.expiredSessionHandler ? clearTimeout(this.expiredSessionHandler) : null;
    sessionStorage.clear();
    console.log('[Dialog Testing] logout calling from logoutAdfs');
    this.logoutHandler();
  }

  loginApplication({ username, password }: { username: string; password: string; }): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGIN}`, { username, password });
  }

  logout(): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGOUT}`, null);
  }

  /**
   *  Log in user via domain
   * @param domain Selected domain by user
   * @param username User login name
   * @param password User password
   * @param plant Selected plant by user
   */
  loginApplicationDomain({ domain, username, password, plant }: { domain: string; username: string; password: string; plant: string }): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}`, {
      domain,
      username,
      password,
      plant,
    });
  }

  /**
   * Log in user via active directory
   * @param data User login data
   */
  activeDirectory(data: any): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}`, data);
  }


  /**
   * Log out user logged by domain
   */
  logoutDomain(): Observable<any> {
    const apiDomainLogautURL = environment.login.apiLogoutUrl;
    return this.httpClient.get(`${apiDomainLogautURL}`);
  }

  /**
   * Fetches plants from configuration
   * @returns list of plants
   */
  fetchPlants() {
    return environment.modulesBaseUrl.plants;
  }

  //#region oidc-11 events listeners

  private subscribeOidcEvents() {
    this.eventService.registerForEvents().subscribe((notification) => {
      switch (notification.type) {
        case EventTypes.CheckSessionReceived:
          this.onCheckSessionReceived(notification.value);
          break;
        case EventTypes.ConfigLoaded:
          this.onConfigLoaded(notification.value);
          break;
        case EventTypes.IdTokenExpired:
          this.onIdTokenExpired(notification.value);
          break;
        case EventTypes.NewAuthenticationResult:
          this.onNewAuthorizationResult(notification.value);
          break;
        case EventTypes.TokenExpired:
          this.onTokenExpired(notification.value);
          break;
        case EventTypes.UserDataChanged:
          this.onUserDataChanged(notification.value);
          break;
      }
    });
  }
  private onCheckSessionReceived(data: any) {
    // this.writeLogs ? this.writeLog('onCheckSessionReceived', data) : null;
  }

  private onConfigLoaded(data: any) {
    const that = this;
    // starts check authentication process
    //ask data from other tabs On Init
    that.sharedSessionStatus = 'Waiting';
    sessionStorage.setItem(EnumAuthFlags.OidcInitiated, this.CACHED_FLAG_VALUE);
    that.sendLocalStorageEvent(EnumSharedSessionEvents.Request);

    if (data && data.wellknown) {
      that.ignoreUrls = [
        data.wellknown['jwksUri'],
        data.wellknown['authorizationEndpoint'],
        data.wellknown['tokenEndpoint'],
        //, 'notificationHub'
      ];
    } else {
      that.ignoreUrls = [];
    }

    if (!localStorage.getItem(EnumAuthFlags.IsLoggedOffLocal)) {
      this.writeLogs ? this.writeLog("[01-031] LogOffLocal - False") : null
      that.checkAuthTimeoutHandler = setTimeout(() => {
        this.writeLogs ? this.writeLog("[01-032] Timeout of reading other tabs orion tabs") : null
        that.checkAuth(true);
        that.oidcSecurityService.isAuthenticated$.subscribe((isAuthenticated) => {
          that.isAuthenticated = isAuthenticated.isAuthenticated;
        });
      }, that.readOtherTabsTimeoutMilliseconds);
      this.writeLogs ? this.writeLog("[01-029] Started timeout to read other orion tabs") : null
    } else {
      this.writeLogs ? this.writeLog("[01-030] LogOffLocal - True") : null
      const { currentPath } = this.getCurrentPath();
      currentPath != '/' && currentPath != '/home' ? this.setRedirectUrl(currentPath) : null;
      this.redirectOnAuthentication(false);
    }

    that.writeLogs ? that.writeLog('onConfigLoaded', data) : null;
  }

  

  private initialConfigLoaded(data: any) {
    console.log('initialConfigLoaded', data);
    this.sharedSessionStatus = 'Waiting';
    sessionStorage.setItem(EnumAuthFlags.OidcInitiated, this.CACHED_FLAG_VALUE);
    this.sendLocalStorageEvent(EnumSharedSessionEvents.Request);

    this.oidcSecurityService.preloadAuthWellKnownDocument().subscribe(endpoints => {
      if (endpoints) {
        if(endpoints.jwksUri) {
          this.ignoreUrls.push(endpoints.jwksUri);
        }
        if(endpoints.authorizationEndpoint) {
          this.ignoreUrls.push(endpoints.authorizationEndpoint);
        }
        if(endpoints.tokenEndpoint) {
          this.ignoreUrls.push(endpoints.tokenEndpoint);
        }

      } else {
        this.ignoreUrls = [];
      }
      console.log('Ignore URLs:', this.ignoreUrls);
    });

    

    this.IfAuthenticated();
    this.writeLogs ? this.writeLog('init onConfigLoaded', data) : null;
  }

  IfAuthenticated() {
    this.setRefreshSessionHandler();
    this.setUserRights();
    if (this.isFirstLogin()) {
      this.setLoginStatus(true);
      this.setFirstLoginFlag();
    }
    setTimeout(() => {
      this.setSignalR();
    }, 200);
  }



  private onIdTokenExpired(data: any) {
    if (this.checkIfRefreshingProcess()) {
      return;
    }
    this.writeLog('[01-010] onIdTokenExpired', data);
    this.refreshTokens();
  }

  private onNewAuthorizationResult(data: any) {
    if (!data) {
      return;
    }
    switch (data.authorizationState) {
      case 'Authorized':
        if (localStorage.getItem(EnumAuthFlags.IsLoggedOffLocal)) {
          return;
        }
        // NOTE Gets the redirect URL from authentication service.
        // If no redirect has been set, uses the default.
        this.checkAuthTimeoutHandler ? clearTimeout(this.checkAuthTimeoutHandler) : null;

        if (this.getRedirectUrl()) {
          this.writeLog('[01-004] redirecting...');
          const redirectUrl = this.getRedirectUrl();
          const path = Helper.getUrlPaths();
          // ServerErrorInterceptor.unauthorizedErrorOccurred = false;
          this.removeRedirectUrl();
          if (redirectUrl && path != redirectUrl) {
            this.router.navigateByUrl(redirectUrl);
          }
        } else {
          this.writeLog('[01-003] redirecting...');
          // this.router.navigate(['/dashboard']);
        }

        setTimeout(() => {
          sessionStorage.setItem(EnumAuthFlags.IsAuthFinished, this.CACHED_FLAG_VALUE);
        }, 200);

        break;

      case 'Unauthorized':
        this.writeLog('[01-005] Unauthorized...');
        if (data.validationResult === ValidationResult.MaxOffsetExpired ||
          data.validationResult === ValidationResult.IncorrectAtHash ||
          data.validationResult === ValidationResult.SecureTokenServerError) {
          this.router.navigate(['/unauthorized']);
        } else {
          this.redirectOnUnAuthorize();
        }
        break;
      case 'Unknown':
        this.writeLog('[01-006] Auth Unknown Issue Occurred...');
        this.redirectOnUnAuthorize();
        break;

      default:
        this.writeLog('[01-007]');
        this.redirectOnUnAuthorize();
        break;
    }
    this.writeLogs ? this.writeLog('onNewAuthorizationResult', data) : null;
  }

  private onTokenExpired(data: any) {
    this.logoutAdfs();
    this.writeLogs ? this.writeLog('onTokenExpired', data) : null;
  }

  private onUserDataChanged(data: any) {
    this.writeLogs ? this.writeLog('onUserDataChanged', data) : null;
  }

  public ignoreUrlsForToken(reqUrl: string) {
    return !this.ignoreUrls.find((url) => reqUrl.indexOf(url) != -1);
  }

  private isFirstLogin(): boolean {
    return localStorage.getItem('isFirstLogin') !== 'false';
  }

  private setFirstLoginFlag(): void {
    localStorage.setItem('isFirstLogin', 'false');
  }

  private checkAuth(includingServer?: boolean) {

    const that = this;
    if (includingServer) {
      that.oidcSecurityService.checkAuthIncludingServer().subscribe((isAuthenticated) => {
        that.sharedSessionStatus = 'Idle';

        if (isAuthenticated.isAuthenticated) {
          that.setRefreshSessionHandler(); //setiing up auto refresh bearer token handler
          that.setUserRights();
          if (this.isFirstLogin()) {
            this.setLoginStatus(true);
            this.setFirstLoginFlag();
          }
          setTimeout(() => {
            that.setSignalR();
            //share other tabs latest data
            if (sessionStorage.length) {
              this.writeLogs ? this.writeLog("[01-033] Sharing latest Data to Other tabs") : null
              that.sendLocalStorageEvent(EnumSharedSessionEvents.RenewToken, sessionStorage);
            }
          }, 200);
        }

        that.writeLogs
          ? that.writeLog('checkAuthIncludingServer ', `isAuthenticated ${isAuthenticated.isAuthenticated}`)
          : null;
        //NOTE ignore on first call
        if (!sessionStorage.getItem(EnumAuthFlags.IsAuthFinished)) {
          return;
        }

        // NOTE Handle Refresh navigation here
        this.writeLog('[01-002] redirecting...');
        that.redirectOnAuthentication(isAuthenticated.isAuthenticated);
      });
    } else {
      that.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => {
        that.writeLogs ? that.writeLog('checkAuth ', `isAuthenticated ${isAuthenticated}`) : null;
        if (isAuthenticated.isAuthenticated) {
          that.setRefreshSessionHandler();
          that.setUserRights();
          setTimeout(() => {
            that.setSignalR();
          }, 200);
        }
        that.oidcSecurityService.isAuthenticated$.subscribe((isAuthenticated) => {
          that.isAuthenticated = isAuthenticated.isAuthenticated;
        });
        //NOTE ignore on first call
        if (!sessionStorage.getItem(EnumAuthFlags.IsAuthFinished)) {
          return;
        }

        // NOTE Handle Refresh navigation
        this.writeLog('[01-001] redirecting...');
        that.redirectOnAuthentication(isAuthenticated.isAuthenticated);
      });
    }
  }

  private async setSignalR(): Promise<void> {
    if (this.signalRService.isAppHubConnected) {
      this.signalRService.reconnectSignalRService(await firstValueFrom(this.getIdToken()));
    } else {
      this.signalRService.initSignalRService(await firstValueFrom(this.getIdToken()));
    }
    this.signalRService.setTokenReady(true);
  }

  public localStorageEvents(event: any) {
    const that = this;
    if (!event) {
      event = window.event;
    } // ie suq
    if (!event.newValue) return; // do nothing if no value to work with

    switch (event.key) {
      case EnumSharedSessionEvents.Request:
        that.onSharedRequest(event.newValue);
        break;

      case EnumSharedSessionEvents.Reply:
        that.onSharedReply(event.newValue);
        break;

      case EnumSharedSessionEvents.RenewToken:
        that.onSharedRenewToken(event.newValue);
        break;

      case EnumSharedSessionEvents.SessionExpired:
        that.onSharedSessionExpired(event.newValue);
        break;

      case EnumSharedSessionEvents.Logout:
        that.onSharedLogout(event.newValue);
        break;

      //NOTE add other events;

      default:
        break;
    }
  }

  //#region Shared Events Implementation
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

  formatTabData(tabData: any): SessionExchangeFormat | undefined {
    try {
      return JSON.parse(tabData);
    } catch (e) {
      return undefined;
    }
  }

  private onSharedRequest(sharedData: any) {
    const that = this;

    const tabData: SessionExchangeFormat | undefined = this.formatTabData(sharedData);

    that.writeLogs ? that.writeLog('SharedSessionEvents.Request') : null;

    //Condition on which tab should not reply
    if (
      tabData?.tabId == this.tabId ||
      localStorage.getItem(EnumAuthFlags.IsLoggedOffLocal) ||
      this.isAuthenticated == false
    ) {
      return;
    }

    that.sendLocalStorageEvent(EnumSharedSessionEvents.Reply, sessionStorage);
  }
  private sharedSessionStatus: 'Waiting' | 'Idle' = 'Idle';
  checkAuthTimeoutHandler: any;

  private onSharedReply(sharedData: any) {
    const that = this;
    that.checkAuthTimeoutHandler ? clearTimeout(that.checkAuthTimeoutHandler) : null;

    const tabData: SessionExchangeFormat | undefined = this.formatTabData(sharedData);

    if (!tabData || that.sharedSessionStatus == 'Idle' || tabData.tabId == this.tabId) {
      return;
    }

    that.sharedSessionStatus = 'Idle';

    const data = tabData.tabPayload;

    //remove incompatible fields between tabs
    if (data) {
      data['redirectUrl'] ? delete data['redirectUrl'] : null;
    }

    for (const key in data) {
      sessionStorage.setItem(key, data[key]);
    }

    const currentTimeMillis = that.getCurrentTime();

    setTimeout(async () => {
      if (currentTimeMillis > await that.calculateRenewTokenExpireTimeInMS()) {
        //Received Expired Refresh Token From Other Tab
        that.writeLog('[01-019] Logging out....');
        that.logoutAdfs();
      } else if (currentTimeMillis < await that.getIdTokenExpireTime()) {
        //Received Expired Id Token From Other Tab
        that.writeLog('[01-020] Authenticating....');
        that.checkAuth(true);
      } else {
        //Received Data From Other Tab Successfully
        that.checkAuth();
      }
    }, 200);

    that.writeLogs ? that.writeLog('SharedSessionEvents.Reply') : null;
  }

  private onSharedRenewToken(sharedData: any) {
    const that = this;
    that.refreshSessionDialogRef ? that.refreshSessionDialogRef.close() : null;
    this.resetRefreshSessionVars();

    const tabData: SessionExchangeFormat | undefined = this.formatTabData(sharedData);

    if (!tabData || tabData.tabId == this.tabId) {
      return;
    }

    const data = tabData.tabPayload;

    //removed incompatible fields between tabs
    if (data) {
      data['redirectUrl'] ? delete data['redirectUrl'] : null;
    }

    for (const key in data) {
      sessionStorage.setItem(key, data[key]);
    }

    setTimeout(() => {
      that.setSignalR();
      that.setUserRights();
      that.setRefreshSessionHandler();
    }, 200);
    that.writeLogs ? that.writeLog('SharedSessionEvents.RenewToken') : null;
  }

  private onSharedSessionExpired(sharedData: any) {
    this.idToken = this.getIdToken();
    const tabData: SessionExchangeFormat | undefined = this.formatTabData(sharedData);
    if (!tabData || tabData.tabId == this.tabId) {
      return;
    }
    const that = this;
    that.writeLogs ? that.writeLog('SharedSessionEvents.SessionExpired') : null;
    that.invokeRefreshSession(that);
  }
  private onSharedLogout(sharedData: any) {
    const that = this;
    const tabData: SessionExchangeFormat | undefined = this.formatTabData(sharedData);
    if (!tabData || tabData.tabId == this.tabId) {
      return;
    }
    that.writeLogs ? that.writeLog('SharedSessionEvents.Logout') : null;
    that.refreshSessionDialogRef ? that.refreshSessionDialogRef.close() : null;
    that.refreshSessionHandler ? clearTimeout(that.refreshSessionHandler) : null;
    this.expiredSessionHandler ? clearTimeout(this.expiredSessionHandler) : null;
    console.log('[Dialog Testing] logout calling from onSharedLogout');
    this.logoutHandler();
  }

  //#endregion Shared Events Implementation

  logoutHandler() {
    // console.log('[Dialog Testing] logout Session!');
    // this.oidcSecurityService.logoff();

    // call LogOut API
    window.location.href = 'https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/logout?id_token_hint=' + this.idToken + '&post_logout_redirect_uri=' + encodeURIComponent(window.location.origin + '/login');
    this.router.navigate(['/home']);
    /*
    if (this.isDebugMode) {
      console.log('Logout invoked!');
      this.oidcSecurityService.logoffLocal();
      this.router.navigate(['/home']);
    } else {
      if (this.isPrivateMode) {
        this.oidcSecurityService.logoff();
        this.router.navigate(['/home']);
      } else {
        this.oidcSecurityService.logoffLocal();
        this.router.navigate(['/home']);
      }
    }
    */
  }

  redirectOnAuthentication(isAuthenticated: boolean) {
    this.writeLogs ? this.writeLog('redirectOnAuthentication') : null;

    const redirectUrl = this.getRedirectUrl();
    const { currentPath, directoryPath } = this.getCurrentPath();

    if (isAuthenticated) {
      if (redirectUrl) {
        redirectUrl ? this.removeRedirectUrl() : null;
        currentPath != redirectUrl ? this.router.navigateByUrl(redirectUrl) : null;
      } else {
        directoryPath != '' && directoryPath != '/home'
          ? this.router.navigateByUrl(currentPath)
          : this.router.navigate(['/dashboard']);
      }
    } else {
      //TODO save url
      this.router.navigate(['/home']);
    }
  }
  private redirectOnUnAuthorize() {
    this.writeLogs ? this.writeLog('redirectOnUnAuthorize') : null;
    console.log('Unauthorized Found');
    try {
      // this.oidcSecurityService.isAuthenticated$.subscribe(
      //   (isAuthenticated) => {
      //     isAuthenticated ? this.logoutAdfs() : this.router.navigate(['/home']);
      //   },
      //   (error) => {
      //     Helper.printError(null, '[01-002] redirectOnUnAuthorize');
      //     this.router.navigate(['/home']);
      //   }
      // );
    } catch (e) {
      Helper.printError(e, '[01-001] redirectOnUnAuthorize');
    }
  }
  public getCurrentPath() {
    const parsedUrl = new URL(window.location.href);
    const path = `${parsedUrl.pathname}${parsedUrl.search}`;
    return { currentPath: path, directoryPath: parsedUrl.pathname };
  }

  public isIdTokenExpired(token: string, isFromJwt?: boolean) {
    // return this.tokenValidationService.hasIdTokenExpired(
    //   token,
    //   isFromJwt ? 3400 : this.tokenExpireOffsetInSeconds
    // );
  }

  private writeLog(key: string, data?: any) {
    console.log(key);
    data ? console.log(data) : null;
  }

  private async calculateIdTokenExpireTimeInSeconds(): Promise<number | undefined> {
    let expireTimeInMillis: number, currentTimeMillis, result;

    currentTimeMillis = new Date().getTime();

    //DEPRECATED
    //const keys: string[] = Object.keys(sessionStorage);
    //const accessTokenKey = keys.find(key => key.includes('access_token_expires_at')) || 'null';
    //expireTimeInMillis = parseInt(sessionStorage.getItem(accessTokenKey));

    expireTimeInMillis = await this.getIdTokenExpireTime();

    if (!isNaN(expireTimeInMillis)) {
      const formattedOffset: number = this.tokenExpireOffsetInSeconds * 1000;
      expireTimeInMillis = expireTimeInMillis - formattedOffset;
      result = (expireTimeInMillis - currentTimeMillis) / 1000;
      result = result > 0 ? result : 0;
      this.writeLogs ? this.writeLog(`Token Expires In ${result} Seconds`) : null;
    }
    return result;
  }

  private async calculateRenewTokenExpireTimeInMS(): Promise<number> {
    const authTime = await this.getAuthTime();
    let expireTime: number | undefined;

    if (!isNaN(authTime)) {
      expireTime = (+authTime + 82800) * 1000;
    } else {
      expireTime = new Date().getTime();
    }
    return expireTime;
  }

  // Retrieve the auth result from sessionStorage
  private getAuthResult(): any {
    const authResultKey = this.findAuthResultKey();
    if (!authResultKey) {
      console.log('[session dialog] No auth result key found in session storage.');
      return null;
    }

    const authResult = sessionStorage.getItem(authResultKey);
    console.log('[session dialog] calling getAuthResult....');
    return authResult ? JSON.parse(authResult) : null;
  }

  // Find the key that ends with _authnResult
  private findAuthResultKey(): string | null {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.endsWith(this.authResultKeySuffix)) {
        return key;
      }
    }
    return null;
  }

  // Get the refresh token expired In
  public getRefreshTokenExpirationIn(): number | undefined {
    const authResult = this.getAuthResult();
    console.log('[session dialog] get authResult :', authResult);
    if (authResult && authResult.refresh_expires_in) {
      // The 'refresh_expires_in' is in seconds
      console.log('[session dialog] refresh token expired in :', authResult.refresh_expires_in);
      return authResult.refresh_expires_in;
    }
    return undefined;
  }

  public async setRefreshSessionHandler(immediate: boolean = false): Promise<void> {
    const that = this;
    if (that.checkIfRefreshingProcess()) {
      this.writeLogs ? this.writeLog("[01-034] setRefreshSessionHandler - Ignoring Refresh Process - Already Process Found") : undefined
      return;
    } //SKIP refresh session as it is under process

    that.refreshSessionHandler ? clearTimeout(that.refreshSessionHandler) : undefined;
    this.expiredSessionHandler ? clearTimeout(this.expiredSessionHandler) : undefined;

    let expirationTimeInSeconds: number | undefined;
    let refreshTokenExpirationTimeInSeconds: number | undefined;

    try {
      expirationTimeInSeconds = await that.calculateIdTokenExpireTimeInSeconds(); //Bearer Token
    }
    catch (e) {
      this.writeLogs ? this.writeLog("[01-035] Error calculateIdTokenExpireTimeInSeconds", e) : undefined
    }

    try {
      that.renewTokenExpireTimeInMilliseconds = await that.calculateRenewTokenExpireTimeInMS(); //Refresh Token
    }
    catch (e) {
      this.writeLogs ? this.writeLog("[01-036] Error calculateRenewTokenExpireTimeInMS", e) : undefined
    }

    try {
      refreshTokenExpirationTimeInSeconds = that.getRefreshTokenExpirationIn(); //Refresh Token Expired In
    }
    catch (e) {
      this.writeLogs ? this.writeLog("[01-036] Error getRefreshTokenExpirationIn", e) : undefined
    }

    this.writeLogs ? this.writeLog("[01-034] Ignoring Refresh Process - Already Process Found") : undefined

    if (expirationTimeInSeconds !== undefined && !isNaN(expirationTimeInSeconds)) {
      that.refreshSessionHandler = setTimeout(() => {
        //BlockGuards Start
        if (this.checkIfRefreshingProcess()) {
          this.writeLogs ? this.writeLog("[01-037] setRefreshSessionHandler - Ignoring Refresh Process - Already Process Found") : undefined
          return;
        } //SKIP already processing
        if (that.checkIfRefreshTokenExpired(that, that.getCurrentTime())) {
          that.writeLog('[01-016] Session Expired');
          this.logoutAdfs();
          return;
        }
        //BlockGuards End
        //NOTE refresh token in background
        that.writeLog('[01-013] Session Expired, Now Refreshing...');
        that.refreshTokens();
      }, expirationTimeInSeconds * 1000);
    } else {
      that.writeLogs ? that.writeLog('expirationTimeInSeconds', 'isNan') : undefined;
    }
    if (refreshTokenExpirationTimeInSeconds && !isNaN(refreshTokenExpirationTimeInSeconds)) {
      that.expiredSessionHandler = setTimeout(() => {
        // // console.log('[session dialog] Session is expired!');
        that.writeLog('Refresh token Expired!');
        this.refreshSessionDialogRef ? this.refreshSessionDialogRef.close() : undefined;
        this.invokeTokenExpirationDialog(that);
      }, refreshTokenExpirationTimeInSeconds * 1000);
    }
  }

  private invokeRefreshSession(self: AuthService): void {
    console.log('[Dialog Testing] Dialog opened!');
    self.openRefreshSessionDialog();
  }

  private invokeTokenExpirationDialog(self: AuthService): void {
    console.log('[session dialog] Dialog opening...');
    self.openTokenExpireDialog();
  }

  //Function to prevent refreshing token
  checkIfRefreshingProcess(): boolean {
    if (this.refreshSessionDialogRef) {
      this.writeLogs ? this.writeLog("[01-038] checkIfRefreshingProcess - Refresh Session Dialog is Open") : null
      return true;
    }
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

  private resetRefreshSessionVars(): void {
    this.writeLogs ? this.writeLog("[01-41] Started resetRefreshSessionVars") : null
    sessionStorage.removeItem(EnumAuthVars.SessionCounter);
    this.refreshSessionDialogRef = null;
    this.isRefreshingSession = false;
    this.writeLogs ? this.writeLog("[01-42] Ended resetRefreshSessionVars") : null
  }

  public openRefreshSessionDialog() {
    const that = this;
    const dialogRef = this.dialog.open(RefreshSessionComponent, {
      width: '400px',
      hasBackdrop: true,
      disableClose: true,
    });

    that.refreshSessionDialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        that.resetRefreshSessionVars();
        that.setUserRights();
        //sessionStorage.removeItem(EnumAuthVars.SessionCounter);

        if (EnumAuthFlags.Logout == result) {
          this.writeLogs ? this.writeLog("[01-43] Logout by dialog") : null
          that.logoutAdfs();
          console.log('[Dialog Testing] Logged out successfully! (after Clicked on ---> No, signed me out)');
          console.log('Logged out...');
        }
        if (EnumAuthFlags.RefreshSession == result) {
          this.writeLogs ? this.writeLog("[01-44] refreshed by dialog") : null
          that.setRefreshSessionHandler();
          that.setSignalR();
          if (sessionStorage.length) {
            this.writeLogs ? this.writeLog("[01-45] RenewToken Sharing by dialog") : null
            that.sendLocalStorageEvent(EnumSharedSessionEvents.RenewToken, sessionStorage);
          }
          console.log('[Dialog Testing] Success, session refreshed successfully! (after Clicked on ---> Yes, keep me signed in)');
          console.log('refreshed Session...');
        }
      }
    });
  }

  public openTokenExpireDialog() {
    const that = this;
    const dialogRef = this.dialog.open(TokenExpireComponent, {
      width: '400px',
      data: {
        title: 'Session Expired',
        content: "Your session is expired.",
        button: "Ok"
      },
      hasBackdrop: true,
      disableClose: true,
    });
    console.log('[session dialog] Dialog opened!');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('[session dialog] OK clicked');
        that.logoutAdfs();
      }
    });
  }


  resetIdleTimeout() {
    this.idleTimeOut = this.idleTimeOutInMilliseconds / 1000;
  }

  resetIdleTimeoutChecker() {
    clearInterval(this.idleTimeOutChecker)
    this.idleTimeOut = this.idleTimeOutInMilliseconds / 1000;
  }

  setIdleTimeoutChecker() {
    try {
      const that = this;
      this.idleTimeOutChecker = setInterval(() => {
        that.checkIfIdleTimeout(that);
      }, this.idleTimeOutCheckerIntervalInSeconds * 1000)
    } catch (ex) {
      this.writeLogs ? this.writeLog("Session Info", ex) : null
    }
  }
  /**
   * use in JWT Inceptors
   */
  checkIfIdleTimeout(that: AuthService): boolean {
    if (!that.isAuthenticated) return true;
    if (that.idleTimeOut > 0) {
      that.idleTimeOut -= 10;
      return false;
    }
    if (that.checkIfRefreshTokenExpired(that, that.getCurrentTime())) return false;
    if (that.checkIfRefreshingProcess()) return false;
    that.invokeRefreshSession(that);
    that.sendLocalStorageEvent(EnumSharedSessionEvents.SessionExpired);
    return true;
  }

  checkIfRefreshTokenExpired(that: AuthService, currentTimeMillis: any) {
    if (that.renewTokenExpireTimeInMilliseconds && that.renewTokenExpireTimeInMilliseconds < currentTimeMillis) {
      const { currentPath } = that.getCurrentPath();
      that.setRedirectUrl(currentPath); //TODO check if its home or not
      that.logoutAdfs();
      return true;
    } else {
      return false;
    }
  }

  getCurrentTime(): number {
    return new Date().getTime();
  }
  getLastActivityTimestamp(): number {
    return +(localStorage.getItem(EnumAuthVars.LastActivityTimestamp) || 0);
  }
  setLastActivityTimestamp(): void {
    localStorage.setItem(EnumAuthVars.LastActivityTimestamp, `${new Date().getTime()}`);
  }

  private localStorageListener() {
    const that = this;
    // listen for changes to localStorage
    try {
      if (window.addEventListener) {
        window.addEventListener('storage', (event) => that.localStorageEvents(event), false);
        this.writeLogs ? this.writeLog("[01-027]setting window storage localstorage listener") : undefined
      } else {
        (window as any).attachEvent('onstorage', (event: any) => that.localStorageEvents(event));
        this.writeLogs ? this.writeLog("[01-028] attaching onstorage localstorage listener") : undefined
      }
    } catch (e) {
      this.writeLogs ? this.writeLog("[01-026] Error in setting localstorage listener") : undefined
    }
  }
  //#endregion oidc-11 events listeners

  //#region User Rights

  // implement one method to set rights
  async setUserRights(): Promise<void> {
    const groupNames: string[] = await this.getGroupNames();
    let userRights: UserRights = {};
    let datetypes: DateTypeRights = {};
    let datetypeslist: string[] = [];
    let menuAccessRightList: string[] = [];
    let widgetAccessRightList: string[] = [];
    let statusRightList: string[] = [];
    let rolesList: string[] = ['Orion_SCM_Analyst', 'Orion_SCM_Buyer', 'Orion_SCM_Customer', 'Orion_SCM_Supplier_Commit', 'Orion_SCM_ReadOnly', 'Orion_SCM_Supplier_No_Commit', 'Orion_SCM_Supplier_ROP', 'Orion_SCM_Engineering', 'Orion_SCM_Customer_Commit', 'Orion_Logistics_Logistic', 'Orion_Finance_Accountant', 'Orion_SCM_Sourcing', 'Orion_Administrator', 'Orion_AI', 'Orion_SCM_Master_Buyer'];

    for (let groupNamesIndex = 0; groupNamesIndex < groupNames.length; groupNamesIndex++) {
      if (rolesList.includes(groupNames[groupNamesIndex])) {
        this.store.dispatch(new SetUserRole(groupNames[groupNamesIndex]));
        datetypes = { ...userRights.dateTypeRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.dateTypeRights }
        const tempRoleDateTypeList: string[] = Helper.getUserRightByRole(groupNames[groupNamesIndex])?.dateTypeRightList || [];
        datetypeslist = datetypeslist.concat(tempRoleDateTypeList)

        const tempRoleMenuAccessRightList: string[] = Helper.getUserRightByRole(groupNames[groupNamesIndex])?.menuAccessRightList || [];
        menuAccessRightList = menuAccessRightList.concat(tempRoleMenuAccessRightList)
        if (groupNames.includes('Orion_Administrator')) {
          menuAccessRightList.push('Global Notifications');
        }

        const tempRoleWidgetAccessRightList: string[] = Helper.getUserRightByRole(groupNames[groupNamesIndex])?.widgetAccessRightList || [];
        widgetAccessRightList = widgetAccessRightList.concat(tempRoleWidgetAccessRightList)

        const tempRoleStatusList: string[] = Helper.getUserRightByRole(groupNames[groupNamesIndex])?.statusRightList || [];
        statusRightList = statusRightList.concat(tempRoleStatusList)

        //userRights = { ...userRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex]) } /*issue with concat as group structure*/

        userRights.commitsModuleRights = { ...userRights.commitsModuleRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.commitsModuleRights }
        userRights.configurationRights = { ...userRights.configurationRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.configurationRights }
        userRights.dashboardRights = { ...userRights.dashboardRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.dashboardRights }
        userRights.finantialModuleRights = { ...userRights.finantialModuleRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.finantialModuleRights }

        userRights.supplyVisibilityRights = { ...userRights.supplyVisibilityRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.supplyVisibilityRights }
        userRights.vendorListRights = { ...userRights.vendorListRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.vendorListRights }

        userRights.widgetRights = { ...userRights.widgetRights, ...Helper.getUserRightByRole(groupNames[groupNamesIndex])?.widgetRights }

        userRights.dateTypeRights = datetypes
        userRights.dateTypeRightList = datetypeslist
        userRights.menuAccessRightList = menuAccessRightList
        userRights.widgetAccessRightList = widgetAccessRightList
        userRights.statusRightList = statusRightList

        this.store.dispatch(new SetUserRights(userRights));
        //this.writeLogs ? this.writeLog('setUserRights', userRights) : undefined;
        //break;
      }
      if (groupNames[groupNamesIndex] == 'Orion_SCM_Supplier_Commit') {
        this.store.dispatch(new SetManageCommitsRights(true));
      }
      //#endregion User Rights
    }
  }


  get isWriteLogsIsOn() {
    return this.writeLogs;
  }
}
