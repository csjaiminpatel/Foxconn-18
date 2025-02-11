import { v4 as uuidv4 } from 'uuid';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedResult, OidcSecurityService } from 'angular-auth-oidc-client';
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
  private refreshSessionDialogRef:any;

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

  //#endregion

  //#region Constructor
  constructor() {
    this.setIdleTimeoutChecker();
    this.detectPrivateMode();
    this.checkStoragePermission();
    this.initializeAuthState();
  }
  //#endregion

  //#region Initialization
  private detectPrivateMode() {
    detectIncognito()
      .then((browserInfo) => {
        console.log('Private mode:-' + browserInfo.browserName + ' ' + browserInfo.isPrivate);
        this.isPrivateMode = browserInfo.isPrivate;
        this.writeLogs ? this.writeLog('[01-021] Incognito Mode is detected') : undefined;
      })
      .catch((error) => {
        console.log('Private mode error:-' + error);
        this.writeLogs ? this.writeLog('[01-022] Incognito Mode is not detected') : undefined;
      });
  }

  private checkStoragePermission() {
    this.hasStorage = typeof Storage !== 'undefined';
    this.writeLogs ? this.writeLog(this.hasStorage ? '[01-024] Has Permission of Session/Local Storage' : '[01-025] Does not have Permission of Session/Local Storage') : undefined;
  }

  private initializeAuthState() {
    localStorage.setItem(EnumAuthVars.LastActivityTimestamp, 'Init');
    sessionStorage.removeItem(EnumAuthFlags.OidcInitiated);
    this.oidcSecurityService.isAuthenticated$.subscribe((authResult) => {
      this.isAuthenticated$ = authResult.isAuthenticated;
    });
    this.writeLogs ? this.writeLog('[01-023] Constructor for authentication is completed') : undefined;
  }
  
  //#endregion

  //#region Idle Timeout Management
  setIdleTimeoutChecker() {
    try {
      this.idleTimeOutChecker = setInterval(() => {
        this.checkIfIdleTimeout(this);
      }, this.idleTimeOutCheckerIntervalInSeconds * 1000);
    } catch (ex) {
      this.writeLogs ? this.writeLog('Session Info', ex) : undefined;
    }
  }

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
  //#endregion

  //#region Session Management

  
  private invokeRefreshSession(self: AuthService): void {
    console.log('[Dialog Testing] Dialog opened!');
  }

  private sendLocalStorageEvent(eventName: string, data?: any) {
    const tabData: SessionExchangeFormat = { tabId: this.tabId, tabPayload: data };
    localStorage.setItem(eventName, JSON.stringify(tabData));
    setTimeout(() => localStorage.removeItem(eventName), 200);
  }

  checkIfRefreshTokenExpired(that: AuthService, currentTimeMillis: any) {
    if (that.renewTokenExpireTimeInMilliseconds && that.renewTokenExpireTimeInMilliseconds < currentTimeMillis) {
      const { currentPath } = that.getCurrentPath();
      that.setRedirectUrl(currentPath);
      that.logoutAdfs();
      return true;
    }
    return false;
  }
  //#endregion

  //#region Authentication Handling
  logoutAdfs() {
    this.idToken = this.getIdToken();
    localStorage.setItem('lastUrlBeforeLogout', window.location.href);
    localStorage.setItem(EnumAuthFlags.IsLoggedOffLocal, this.CACHED_FLAG_VALUE);
    this.sendLocalStorageEvent(EnumSharedSessionEvents.Logout);
    this.writeLogs ? this.writeLog('logoutAdfs') : undefined;
    this.refreshSessionDialogRef ? this.refreshSessionDialogRef.close() : undefined;
    this.refreshSessionHandler
      ? clearTimeout(this.refreshSessionHandler)
      : undefined;
    this.expiredSessionHandler
      ? clearTimeout(this.expiredSessionHandler)
      : undefined;
    sessionStorage.clear();
    console.log('[Dialog Testing] logout calling from logoutAdfs');
    this.logoutHandler();
  }

  logoutHandler() {
    console.log('[Dialog Testing] logout Session!');
    this.oidcSecurityService.logoff();
    window.location.href = `https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/logout?id_token_hint=${this.idToken}&post_logout_redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`;
    this.router.navigate(['/home']);
  }

  logoutDomain(): Observable<any> {
    const apiDomainLogautURL = environment.login.apiLogoutUrl;
    return this.httpClient.get(`${apiDomainLogautURL}`);
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

    loginAdfs() {
      // this.store.dispatch(new SetDefaultDashboardSettings(true, 'isLogin'));
      localStorage.setItem('isFirstLogin', 'true');
      this.oidcSecurityService.authorize();
    }

  //#endregion
  checkIfRefreshingProcess(): boolean {
    // if (this.refreshSessionDialogRef) {
    //   this.writeLogs ? this.writeLog("[01-038] checkIfRefreshingProcess - Refresh Session Dialog is Open") : undefined
    //   return true;
    // }
    if (this.isRefreshingSession) {
      this.writeLogs ? this.writeLog('[01-039] checkIfRefreshingProcess - Refreshing Session'): undefined;
      return true;
    }
    if (!sessionStorage.getItem(EnumAuthFlags.IsAuthFinished)) {
      this.writeLogs ? this.writeLog( '[01-40] checkIfRefreshingProcess - EnumAuthFlags.IsAuthFinished Not Present In Session ') : undefined;
      return true;
    }
    //ADD other condition to monitor refresh session

    return false;
  }

  private sharedSessionStatus: 'Waiting' | 'Idle' = 'Idle';

  private checkAuth(includingServer?: boolean) {

    const that = this;
    if (includingServer) {
      that.oidcSecurityService.checkAuthIncludingServer().subscribe((isAuthenticated) => {
        that.sharedSessionStatus = 'Idle';

        if (isAuthenticated) {
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
          ? that.writeLog('checkAuthIncludingServer ', `isAuthenticated ${isAuthenticated}`)
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
        if (isAuthenticated) {
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



  //#region Local Storage Listener


  //#region Utility Methods
  getIdToken() {
    return this.oidcSecurityService.getIdToken();
  }

  public getCurrentPath() {
    const parsedUrl = new URL(window.location.href);
    return { currentPath: `${parsedUrl.pathname}${parsedUrl.search}`, directoryPath: parsedUrl.pathname };
  }

  public getCurrentTime(): number {
    return new Date().getTime();
  }

  public setLoginStatus(isLogin: boolean) {
    this.isNewLogin$.next(isLogin);
  }
  public getLoginStatus() {
    return this.isNewLogin$.asObservable();
  }

  getIsAuthorized() {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map((result: AuthenticatedResult) => result.isAuthenticated)
    );
  }
  public invokeCancellationToken() {
    this.cancellationToken$.next(undefined);
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

  public setRedirectUrl(url: string): void {
    if (this.hasStorage) {
      sessionStorage.setItem('redirectUrl', url);
    }
  }
  public getRedirectUrl(): string|undefined {
    if (this.hasStorage) {
      return sessionStorage.getItem('redirectUrl')|| undefined;
    }
    return undefined;
  }

  async getUpn() {
    const { upn, email } = await firstValueFrom(
      this.oidcSecurityService.getPayloadFromIdToken(),
    );
    return email || upn;
  }

  async getPrimarySid() {
    const { primarysid } = await firstValueFrom(
      this.oidcSecurityService.getPayloadFromIdToken(),
    );
    return primarysid;
  }

  private writeLog(key: string, data?: any) {
    console.log(key);
    data ? console.log(data) : undefined;
  }

  private isFirstLogin(): boolean {
    return localStorage.getItem('isFirstLogin') !== 'false';
  }

  private setFirstLoginFlag(): void {
    localStorage.setItem('isFirstLogin', 'false');
  }
  public setCancellationToken(event: boolean, calledFor?: string) {
    this.writeLog(`[01-048] Cancellation token ${(event == true) ? 'enabled' : 'disabled'} for ${calledFor}`);
    this.isCancellationTokenEnable = event;
  }

  public getCancellationToken() {
    return this.isCancellationTokenEnable;
  }


  private async setSignalR(): Promise<void> {
    if (this.signalRService.isAppHubConnected) {
      this.signalRService.reconnectSignalRService(await firstValueFrom(this.getIdToken()));
    } else {
      this.signalRService.initSignalRService(await firstValueFrom(this.getIdToken()));
    }
    this.signalRService.setTokenReady(true);
  }


  logout(): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGOUT}`, undefined);
  }
  fetchPlants() {
    return environment.modulesBaseUrl.plants;
  }

  public getCancellationTokenObservable() {
    return this.cancellationToken$.asObservable();
  }

  public ignoreUrlsForToken(reqUrl: string) {
    return !this.ignoreUrls.find((url) => reqUrl.indexOf(url) != -1);
  }

  loginApplication({ username, password }: { username: string; password: string; }): Observable<any> {
    const apiBaserUrl = environment.login.apiLoginUrl;
    return this.httpClient.post(`${apiBaserUrl}${authUrlPaths.LOGIN}`, { username, password });
  }
  async getAuthTime() {
    const { auth_time } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    return auth_time;
  }

  public removeRedirectUrl(): void {
    sessionStorage.removeItem('redirectUrl');
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
  //#region refresh session
  public async refreshTokens() {
    const that = this;
    try {
      that.isRefreshingSession = true;
      const { currentPath } = that.getCurrentPath();
      that.setRedirectUrl(currentPath);
      let Error;
      let res;
      try {
        res = await firstValueFrom(that.oidcSecurityService.forceRefreshSession());
      } catch (error) {
        res = undefined;
        Error = error;
      }

      if (Error) {
        that.writeLogs ? that.writeLog('[01-047] Orion Auth Server - Failed to refresh token by server', Error) : undefined;
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
        that.writeLogs ? that.writeLog('[01-018] Refreshing Tokens Failed', res) : undefined;
      }
    } catch (e) {
      that.logoutAdfs();
      that.writeLogs ? that.writeLog('forceRefreshSession-failed', console.error(e)) : undefined;
    }
  }

  async getGroupNames(): Promise<string[]> {
    let { GroupsName } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    try {
      return GroupsName ? <string[]>GroupsName : [];
    } catch (Error) {
      return (GroupsName = []);
    }
  }

  async setUserRights(): Promise<void> {
    const groupNames: string[] = await this.getGroupNames();
    let userRights: UserRights = {};
    let datetypes: DateTypeRights = {};
    let datetypeslist: string[] = [];
    let menuAccessRightList: string[] = [];
    let widgetAccessRightList: string[] = [];
    let statusRightList: string[] = [];
    let rolesList: string[] = ['Orion_SCM_Analyst', 'Orion_SCM_Buyer', 'Orion_SCM_Customer', 'Orion_SCM_Supplier_Commit', 'Orion_SCM_ReadOnly', 'Orion_SCM_Supplier_No_Commit', 'Orion_SCM_Supplier_ROP', 'Orion_SCM_Engineering', 'Orion_SCM_Customer_Commit', 'Orion_Logistics_Logistic', 'Orion_Finance_Accountant', 'Orion_SCM_Sourcing', 'Orion_Administrator', 'Orion_AI'];

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

      }
      if (groupNames[groupNamesIndex] == 'Orion_SCM_Supplier_Commit') {
        this.store.dispatch(new SetManageCommitsRights(true));
      }
    }
  }

  public async setRefreshSessionHandler(immediate: boolean = false): Promise<void> {
    const that = this;
    if (that.checkIfRefreshingProcess()) {
      this.writeLogs ? this.writeLog("[01-034] setRefreshSessionHandler - Ignoring Refresh Process - Already Process Found") : undefined
      return;
    } //SKIP refresh session as it is under process

    that.refreshSessionHandler ? clearTimeout(that.refreshSessionHandler) : undefined;
    this.expiredSessionHandler ? clearTimeout(this.expiredSessionHandler) : undefined;

    let expirationTimeInSeconds: number = 0;
    let refreshTokenExpirationTimeInSeconds: number = 0;

    try {
      expirationTimeInSeconds = (await that.calculateIdTokenExpireTimeInSeconds()) || 0;
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
      refreshTokenExpirationTimeInSeconds = that.getRefreshTokenExpirationIn() || 0; //Refresh Token Expired In
    }
    catch (e) {
      this.writeLogs ? this.writeLog("[01-036] Error getRefreshTokenExpirationIn", e) : undefined
    }

    this.writeLogs ? this.writeLog("[01-034] Ignoring Refresh Process - Already Process Found") : undefined

    if (!isNaN(expirationTimeInSeconds)) {
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
    if (!isNaN(refreshTokenExpirationTimeInSeconds)) {
      that.expiredSessionHandler = setTimeout(() => {
        console.log('[session dialog] Session is expired!');
        that.writeLog('Refresh token Expired!');
        // this.refreshSessionDialogRef ? this.refreshSessionDialogRef.close() : undefined;
        this.invokeTokenExpirationDialog(that);
      }, refreshTokenExpirationTimeInSeconds * 1000);
    }
  }
  //#region calculate time

  resetIdleTimeout(){
    this.idleTimeOut = this.idleTimeOutInMilliseconds/1000;
  }
  
  private async calculateIdTokenExpireTimeInSeconds(): Promise<number | undefined> {
    let expireTimeInMillis: number, currentTimeMillis, result;
    currentTimeMillis = new Date().getTime();
    expireTimeInMillis = await this.getIdTokenExpireTime();

    if (!isNaN(expireTimeInMillis)) {
      const formattedOffset: number = this.tokenExpireOffsetInSeconds * 1000;
      expireTimeInMillis = expireTimeInMillis - formattedOffset;
      result = (expireTimeInMillis - currentTimeMillis) / 1000;
      result = result > 0 ? result : 0;
      this.writeLogs ? this.writeLog(`Token Expires In ${result} Seconds`) : undefined;
    }
    return result;
  }

  private async calculateRenewTokenExpireTimeInMS(): Promise<number> {
    const authTime = await this.getAuthTime();
    let expireTime: number | undefined;

    if (!isNaN(await authTime)) {
      expireTime = (+authTime + 82800) * 1000;
    } else {
      expireTime = new Date().getTime();
    }
    return expireTime;
  }

  async getIdTokenExpireTime(): Promise<number> {
    let { exp } = await firstValueFrom(this.oidcSecurityService.getPayloadFromIdToken());
    exp = isNaN(exp) ? 0 : +exp * 1000;
    return exp;
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

  private getAuthResult(): any {
    const authResultKey = this.findAuthResultKey();
    if (!authResultKey) {
      console.log('[session dialog] No auth result key found in session storage.');
      return undefined;
    }

    const authResult = sessionStorage.getItem(authResultKey);
    console.log('[session dialog] calling getAuthResult....');
    return authResult ? JSON.parse(authResult) : undefined;
  }
  // Find the key that ends with _authnResult
  private findAuthResultKey(): string | undefined {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.endsWith(this.authResultKeySuffix)) {
        return key;
      }
    }
    return undefined;
  }
  //#endregion
  private resetRefreshSessionVars(): void {
    this.writeLogs ? this.writeLog("[01-41] Started resetRefreshSessionVars") : undefined
    sessionStorage.removeItem(EnumAuthVars.SessionCounter);
    // this.refreshSessionDialogRef = undefined;
    this.isRefreshingSession = false;
    this.writeLogs ? this.writeLog("[01-42] Ended resetRefreshSessionVars") : undefined
  }


  //#region dialog box
  private invokeTokenExpirationDialog(self: AuthService): void {
    console.log('[session dialog] Dialog opening...');
    self.openTokenExpireDialog();
  }

  public openTokenExpireDialog() {

  }
}
