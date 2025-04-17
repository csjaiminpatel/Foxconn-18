import { formatDate } from '@angular/common';
import { HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Subject, Observable, lastValueFrom, firstValueFrom } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../services/config.service';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { AuthenticationState } from '../../../auth/store/authentication.state';
import { Helper } from '../../../shared/helper';
import { RequestStatus } from '../../models/commits.model';
import { ForecastVirtualVc, ForecastDetail, ForecastDate } from '../../models/forecast.model';
import { DummyCommitHeader, UserSettings, NewUserSetting, WaterfallDto, BasicParameters, DateRangeParameters, Commit, NewCommit, DummyCommitDetail, DummyCommitHeadersFilter, PnReviewed, PnVendorCode, SvUrlWithParams, PurchaseOrders, ManufacturerDetailsDto } from '../../models/supply-visibility.model';
import { DashboardPanelModel, DashboardType, AdditionalFilter, DownloadSupplyVisibilityTableByWidget } from '../../models/sv-dashboard';
import { SetDateRangeParameters, SetPnReviewed, DeletePnFlags } from '../../stores/supply-visibility/supply-visibility.actions';
import { AuthService } from '../../../auth/services/auth.service';
import { DashboardSetting, SharedWidget } from '../../models/shared-sv.model';
import moment from 'moment';
import { VirtualPnGroupsService } from '../Virtual-pn-group/virtual-pn-groups.service';
import { MaterialManagementViews } from '../../models/material-management-views.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupplyVisibilityService {
  // private apiUrl: string;
  // private userSettingsUrl;
  public svUrlList: SvUrlWithParams[] = [];
  private isColumnLoaded = new Subject<any>();
  private dummyCommitHeader: DummyCommitHeader | undefined = undefined;

  get dummyCommitHeaderForExcel() {
    return this.dummyCommitHeader;
  }

  set dummyCommitHeaderForExcel(dummyCommitHeader: DummyCommitHeader | undefined) {
    this.dummyCommitHeader = dummyCommitHeader;
  }

  /**
   * In isLoaded object true = loaded, false = not loaded, null = not loaded
   */

  isLoaded = {
    isForecastLoaded: false,
    isCommitsLoaded: false,
    isNotesLoaded: null,
    isCommentLoaded: null,
    isInfoLoaded: null
  };

  isChildList: boolean = false;
  private currentParentPNs: any = [];
  currentChildPNs: any = [];
  private loadingDetails = new Subject<any>();

  constructor(
    private store: Store,
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private vpnsService: VirtualPnGroupsService
  ) {
    // this.apiUrl = this.configService.getSettings('apiBaseUrl');
    // this.userSettingsUrl = this.configService.getSettings('userSettingsService');
  }

  private svCalled: boolean = false;
  private dialogClose = new Subject<any>();
  private chartSettings = new Subject<any>();
  private expandedSettings = new Subject<any>();


  getDialogDetail(): Observable<any> {
    return this.dialogClose.asObservable();
  }

  setDialogDetail(data?: any) {
    this.dialogClose.next(data);
  }

  getChartSetting(): Observable<any> {
    return this.chartSettings.asObservable();
  }

  get apiUrl():string{
    return this.configService.getSettings('apiBaseUrl')
  }
  setChartSetting(data?: any) {
    this.chartSettings.next(data);
  }

  getChartSettingsExpanded(): Observable<any> {
    return this.expandedSettings.asObservable();
  }

  setChartSettingsExpanded(expanded?: boolean) {
    this.expandedSettings.next(expanded);
  }

  getLoadingDetail(): Observable<any> {
    return this.loadingDetails.asObservable();
  }

  setLoadingDetail(data: any) {
    this.isLoaded = { ...this.isLoaded, ...data };
    this.loadingDetails.next(this.isLoaded);
  }

  setParentPN(data: BasicParameters[]) {
    let tData = Helper.createCopy(data)
    this.currentParentPNs = tData
  }

  getIsColumnLoaded(): Observable<any> {
    return this.isColumnLoaded.asObservable();
  }

  setIsColumnLoaded(data: any) {
    this.isColumnLoaded.next(data);
  }

  private isFilterApplied = new Subject<boolean>();

  setIsFilterApplied(data: any) {
    this.isFilterApplied.next(data);
  }

  getIsFilterApplied() {
    return this.isFilterApplied.asObservable();
  }

  getParentPN() {
    let tData = Helper.createCopy(this.currentParentPNs)
    return tData
  }

  resetValues() {
    this.isLoaded = {
      isForecastLoaded: false,
      isCommitsLoaded: false,
      isNotesLoaded: null,
      isCommentLoaded: null,
      isInfoLoaded: null
    };
  }

  /**
   * Get Group Names from authentication service
   * @returns boolean
   * @memberof SupplyVisibilityService
   */
  async getUserRights(): Promise<boolean> {

    const usersHavingRights = ["Orion_SCM_Analyst", "Orion_SCM_Buyer", "Orion_SCM_Supplier_Commit", "Orion_SCM_Customer", "Orion_SCM_Engineering", "Orion_SCM_Customer_Commit", "Orion_Logistics_Logistic", "Orion_SCM_Sourcing", "Orion_Administrator", "Orion_AI", "Orion_SCM_Master_Buyer"]
    const groupNames: string[] = await this.authService.getGroupNames();
    for (let i = 0; i < usersHavingRights.length; i++) {
      for (let j = 0; j < groupNames.length; j++) {
        if (usersHavingRights[i] === groupNames[j]) {
          return true;
        }
      }
    }
    return false
  }


  /**
   * Get API URL for UserSettings
   * @param {string} action e.g. AddUserSettings, UpdateUserSettings, DeleteUserSettings,GetUserSettings
   * @returns
   * @memberof SupplyVisibilityService
   * (GET)MaterialManagement/UserSettings/GetUserSettings?key=materialDashboard
   */
  getApiUrlUserSettings(action: string) {
    return `${this.configService.getSettings('userSettingsService')}${environment.modulesBaseUrl.materialManagement.userSettings}/${action}`;
  }


  /**
   * Get API URL for Commits
   * @param {string} action
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlCommits(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commits}/${action}`;
  }

  /**
   * Get API URL for PurchaseOrders
   * @param {string} action
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlPurchaseOrders(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.purchaseOrders}/${action}`;
  }

  /**
   * Get API URL for DummyCommits
   * @param {string} action
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlDummyCommits(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.dummyCommits}/${action}`;
  }


  /**
   * Get API URL for PartNumbers
   * @param {string} action
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlPartNumbers(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.partNumbers}/${action}`;
  }

  /**
   * Get manufacturer details for pn and vc.
   * @returns
   * @memberof SupplyVisibilityService
   */
  getManufacturerDetails(partNumber: any, vendorCode: any) {
    let url = this.getApiUrlPartNumbers('getpartnumberciscodatas');
    let params = new HttpParams().set("partNumber", partNumber ? partNumber.toUpperCase() : null).set("vendorCode", vendorCode); //Create new HttpParams
    return this.http.get<ManufacturerDetailsDto[]>(url, { params: params });
  }


  /**
   * Get API URL for Vendor codes
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlVendorCodes() {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getVendorCodes}`;
  }
  getApiUrlWaterfall() {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.waterfall}`;
  }

  /**
   * Get API URL for Supply Visibility
   * @param {string} action
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrlSupplyVisibility(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.supplyVisibility}${'/'}${action}`;
  }

  //#region user settings apis
  /**
   * Get comits by date range
   * @param {string} key keyName of UserSetting
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (GET)MaterialManagement/UserSettings/GetUserSettings?key=materialDashboard
   */
  getUserSettings(
    key: string
  ): Observable<any> {
                // TODO: need to remove Bearer
                const token = this.authService.getToken();
                const headers = { Authorization: `Bearer ${token}` };
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    return this.http.get<UserSettings>(`${this.getApiUrlUserSettings('')}${key}-${plant}`, {headers});
  }

  /**
   * Add new UserSetting
   * @param {NewUserSetting} userSetting
   * @param updateIdInData If true add Plant ID (eg. -LS51) to ID of object in data field
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/UserSettings/AddUserSettings
   */
  addUserSettings(userSetting: NewUserSetting, updateIdInData: boolean = true): Observable<any> {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    userSetting.key += '-' + plant;
    if (userSetting.data) {
      let data = JSON.parse(userSetting.data);
      if (updateIdInData === true) {
        data.id += '-' + plant;
      }
      userSetting.data = JSON.stringify(data);
    }
    return this.http.post(`${this.getApiUrlUserSettings('')}`, userSetting);
  }

  /**
   * Update existing userSetting
   * @param {NewUserSetting} userSetting
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/UserSettings/UpdateUserSettings
   */
  updateUserSettings(userSetting: NewUserSetting): Observable<any> {
    const key = userSetting.key;
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    userSetting.key += '-' + plant;
    return this.http.put(`${this.getApiUrlUserSettings('')}${key}-${plant}`, userSetting);
  }

  deleteUserSettings(key: string): Observable<any> {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    const url = `${this.getApiUrlUserSettings('')}${key}-${plant}`;
    return this.http.delete(url, {});
  }

  //#endregion user settings apis

  //#region common user settings apis
  /**
   * Get comits by date range
   * @param {string} dashboard keyName of dashboard
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (GET)MaterialManagement/UserSettings/GetUserSettings?key=materialDashboard
   */
  getCommonUserSettings(
    dashboard: string
  ): Observable<any> {
    return this.http.get<UserSettings>(`${this.getApiUrlUserSettings('')}${dashboard}`, {});
  }

  /**
   * Add new UserSetting
   * @param {NewUserSetting} userSetting
   * @param updateIdInData If true add Plant ID (eg. -LS51) to ID of object in data field
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/UserSettings/AddUserSettings
   */
  addCommonUserSettings(userSetting: NewUserSetting): Observable<any> {
    if (userSetting.data) {
      let data = JSON.parse(userSetting.data);
      userSetting.data = JSON.stringify(data);
    }
    return this.http.post(`${this.getApiUrlUserSettings('')}`, userSetting);
  }

  /**
   * Update existing userSetting
   * @param {NewUserSetting} userSetting
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/UserSettings/UpdateUserSettings
   */
  updateCommonUserSettings(userSetting: NewUserSetting): Observable<any> {
    const key = userSetting.key;
    return this.http.put(`${this.getApiUrlUserSettings('')}${key}`, userSetting);
  }

  deleteCommonUserSettings(key: string): Observable<any> {
    const url = `${this.getApiUrlUserSettings('')}${key}`;
    return this.http.delete(url, {});
  }

  //#endregion common user settings apis

  //Get default commits columns and fields
  getDefaultFormSettingFields(formKey: string) {
    let url = new URL(`${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getDefaultFormSettingFields}`);
    url.searchParams.append('formKey', formKey);

    console.log(url.toString())
    return <Observable<any>>this.http.get(url.toString());
  }


  SVDefaultDashboard: DashboardPanelModel[] = [

    {
      id: 'simplePNList-' + uuidv4(),
      cols: 3, rows: 5, y: 0, x: 0, type: "simplePNList",
      minItemCols: 3, minItemRows: 5,
      title: "All My Part Numbers",
      link: "", header: "", firstValue: { onlyMyPNs: true, weeks: 26 },
      modificationRights: true
    },
    {
      id: 'reviewSupplyVisibility-' + uuidv4(),
      cols: 3, rows: 4, minItemCols: 3, minItemRows: 4,
      y: 0, x: 3, type: "reviewSupplyVisibility", title: "Search",
      modificationRights: true
    },
    {
      id: 'configurationLink-' + uuidv4(),
      cols: 2, rows: 2, y: 0, x: 6, type: "configurationLink",
      title: "View config", link: "material-management/material-management-views",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true
    },
    {
      id: 'commitsLink-' + uuidv4(),
      cols: 2, rows: 2, y: 0, x: 8, type: "commitsLink",
      title: "Commits", link: "material-management/commits",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      id: 'pnGroupsLink-' + uuidv4(),
      cols: 2, rows: 2, y: 0, x: 10, type: "pnGroupsLink",
      title: "Pn Groups", link: "material-management/pn-groups",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      id: 'vendorcodeRightsLink-' + uuidv4(),
      cols: 2, rows: 2, y: 2, x: 6, type: "vendorcodeRightsLink",
      title: "Vendor Code Rights", link: "material-management/vendorcodes-rights",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      id: 'qapLink-' + uuidv4(),
      cols: 2, rows: 2, y: 2, x: 6, type: "qapLink",
      title: "QAP View", link: "material-management/qap",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      id: 'aiLink-' + uuidv4(),
      cols: 2, rows: 2, y: 2, x: 6, type: "aiLink",
      title: "A.I.", link: "dashboard/ai",
      minItemCols: 2, minItemRows: 2,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    }
  ]

  appendUuidForImportWidget(importData: any) {
    const parsedData = JSON.parse(importData.data);
    parsedData.forEach((item: any) => {
      if (item.id) {
        item.id = item.id + '-' + uuidv4()
      }
    });
    importData.data = JSON.stringify(parsedData);
    return importData.data;
  }

  DEFAULT_dashboardTypeList: DashboardType[] = [
    {
      fontSize: 'medium',
      type: 'reviewSupplyVisibility',
      title: 'Search',
      img: 'reviewSupplyVisibility',
      selected: false, cols: 3, rows: 4, minItemCols: 3, minItemRows: 4,
      maxItemCols: null, maxItemRows: null,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'smartPNList',
      title: 'Smart PN list',
      img: 'smartPNList',
      selected: false, cols: 3, rows: 5, minItemCols: 3, minItemRows: 5,
      maxItemCols: null, maxItemRows: null, firstValue: { onlyMyPNs: true, weeks: 26 },
      modificationRights: true,

    },
    {
      fontSize: 'medium',
      type: 'filterWidget',
      title: 'Filter Widget',
      img: 'filter-icon',
      selected: false, cols: 4, rows: 4, minItemCols: 3, minItemRows: 3,
      maxItemCols: null, maxItemRows: null, firstValue: { onlyMyPNs: true },
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'pnGroupsLink',
      title: 'Pn Groups',
      img: 'pnGroupsLink',
      selected: false,
      cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'configurationLink',
      title: 'MM VIEWS',
      img: 'configurationLink',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'commitsLink',
      title: 'Commits',
      img: 'commits',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'circularChart',
      title: 'Circular Chart',
      img: 'circularChart',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3, firstValue: { onlyMyPNs: true, weeks: 26 }, secondValue: { onlyMyPNs: true, weeks: 26 },
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'searchV2',
      title: 'Search 2.0',
      img: 'searchV2',
      selected: false, cols: 3, rows: 6, minItemCols: 3, minItemRows: 6,
      maxItemCols: null, maxItemRows: null, firstValue: { onlyMyPNs: true },
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'statusMonitor',
      title: 'Status Monitor',
      img: 'statusMonitor',
      selected: false, cols: 3, rows: 4, minItemCols: 3, minItemRows: 4,
      maxItemCols: null, maxItemRows: null,
      modificationRights: true,
      chartColor: 'green',
      selectMode: 'precalculations'
    },
    {
      fontSize: 'medium',
      type: 'vendorcodeRightsLink',
      title: 'Vendor Code Rights',
      img: 'vendorcodeRightsLink',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'qapLink',
      title: 'Qap Views',
      img: 'qap',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'aiLink',
      title: 'A.I.',
      img: 'ai',
      selected: false, cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'commitList',
      title: 'Commit List',
      img: 'commitList',
      selected: false, cols: 3, rows: 5, minItemCols: 3, minItemRows: 5,
      maxItemCols: null, maxItemRows: null,
      firstValue: { filters: [] },
      modificationRights: true

    },
    {
      fontSize: 'medium',
      type: 'ploSync',
      title: 'PLO Sync',
      img: 'ploSync',
      selected: false,
      cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'fileUpload',
      title: 'File Upload',
      img: 'file-upload',
      selected: false,
      cols: 2, rows: 2, minItemCols: 2, minItemRows: 1,
      maxItemCols: 3, maxItemRows: 3,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'waterfall',
      title: 'Waterfall',
      img: 'waterfall',
      selected: false,
      cols: 4, rows: 5, minItemCols: 4, minItemRows: 5,
      maxItemCols: null, maxItemRows: null,
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'mypnlist',
      title: 'My Partnumbers',
      subTitle: 'All My partnumbers',
      img: 'smartPNList',
      selected: false, cols: 4, rows: 7, minItemCols: 3, minItemRows: 5,
      maxItemCols: null, maxItemRows: null,
      firstValue: { onlyMyPNs: true, weeks: 26, showVendorCode: true },
      modificationRights: true
    },
    {
      fontSize: 'medium',
      type: 'invoiceList',
      title: 'Invoice List',
      img: 'invoiceList',
      selected: false, cols: 3, rows: 5, minItemCols: 3, minItemRows: 5,
      maxItemCols: null, maxItemRows: null,
      firstValue: { filters: [] },
      modificationRights: true
    }
  ];

  getDashboardTypeList(widgetList: string[]): DashboardType[] {
    this.DEFAULT_dashboardTypeList.map(c => {
      c.selected = false
    })

    this.DEFAULT_dashboardTypeList = Helper.getWidgetAccess(widgetList, this.DEFAULT_dashboardTypeList)
    return this.DEFAULT_dashboardTypeList;
  }

  getDefaultDashboard() {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    let defaultDashboard = this.SVDefaultDashboard;
    if (defaultDashboard.length > 0) {
      for (let i = 0; i < defaultDashboard.length; i++) {
        defaultDashboard[i]['id'] = defaultDashboard[i]['id'] + '-' + plant;
      }
    }
    return defaultDashboard;
  }

  //#endregion


  /**
   * Get vendor codes list
   * @param {string} partNumbers list of part numbers
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (GET)MaterialManagement/UserSettings/GetUserSettings?key=materialDashboard
   */
  getVendorCodesList(
    partNumbers: string[]
  ): Observable<any> {
    const tPartNumbers = partNumbers.map(str => str.toUpperCase().trim());
    let params = {
      PartNumbers: tPartNumbers
    };

    return this.http.post(`${this.getApiUrlVendorCodes()}`, tPartNumbers);
  }
  getWaterfall(payload: WaterfallDto) {
    return this.http.post(`${this.getApiUrlWaterfall()}`, payload, {
      responseType: 'blob',
    });
  }

  /**
   * Get comits by date range
   * @param {BasicParameters} parameters
   * @param {DateRangeParameters} dateParams
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getCommits(
    parameters: BasicParameters,
    dateParams: DateRangeParameters
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('Plant', parameters.plant);
    params = params.append('PartNumber', parameters.partNumber);
    params = params.append('DateFrom', dateParams.dateFrom);
    params = params.append('DateTo', dateParams.dateTo);

    if (parameters.vendorCode) {
      params = params.append('VendorCode', parameters.vendorCode);
    }

    return this.http.get<Commit>(`${this.getApiUrlCommits('GetCommits')}`, {
      params: params
    });
  }

  /**
   * Get commits and dummy commits by date range
   * @param {BasicParameters} parameters
   * @param {DateRangeParameters} dateParams
   * @param {DummyCommitHeader} dummyCommitHeader
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getCommitsWithDummy(
    parameters: BasicParameters,
    dateParams: DateRangeParameters,
    dummyCommitHeader?: DummyCommitHeader,
    filterParams?: any,
    commitStatus?: any
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('Plant', parameters.plant);
    params = params.append('PartNumber', parameters.partNumber.toUpperCase());
    params = params.append('SapDeliveryDateFrom', dateParams.dateFrom);
    params = params.append('SapDeliveryDateTo', dateParams.dateTo);

    if (commitStatus.length > 0) {
      params = params.append('Status', commitStatus)
    }
    if (parameters.vendorCode) {
      params = params.append('VendorCode', parameters.vendorCode);
    }
    if (dummyCommitHeader && dummyCommitHeader.id) {
      params = params.append('DummyCommitHeaderID', dummyCommitHeader.id);
    }

    const exisitingParams = params.keys();

    if (filterParams && filterParams.filters && filterParams.filters.length) {
      for (let i = 0; i < filterParams.filters.length; i++) {
        const filterName = filterParams.filters[i].filterName;
        const filterValue = filterParams.filters[i].value;

        const doesFilterFieldExit = exisitingParams.some((param) => param.toLowerCase() == filterName.toLowerCase());
        if (doesFilterFieldExit) {
          params = params.set(filterName, filterValue);
        } else {
          params = params.append(filterName, filterValue);
        }
      }
    }

    return this.http.get<Commit>(`${this.getApiUrlCommits('GetCommitsWithDummy')}`, {
      params: params
    });
  }

  /**
   * Add new Commit
   * @param {NewCommit} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  addCommit(commit: NewCommit): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlCommits('NewCommit')}`, commit);
  }

  /**
   * Update existing commit
   * @param {NewCommit} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  updateCommit(commit: NewCommit): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlCommits('EditCommit')}`, commit);
  }

  /**
   * Cancel commit
   * @param {CancelCommit} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  cancelCommit(commit: Commit): Observable<any> {
    return this.http.put(`${this.getApiUrlCommits('CommitCancellation')}/${commit.inboundDeliveryNumber}`, null);
  }

  /**
 * Delete PLO
 * @param {DeletePLO} commit
 * @returns {Observable<any>}
 * @memberof SupplyVisibilityService
 */
  deletePLO(commit: Commit): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlCommits('DeleteCommit')}`, commit);
  }

  /**
   * Delete existing commit
   * @param {NewCommit} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  deleteCommit(commit: NewCommit): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlCommits('DeleteCommit')}`, commit);
  }

  /**
   * Update Dummy Commit
   * @param {DummyCommitDetail} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  addDummyCommit(commit: DummyCommitDetail): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlDummyCommits('CreateDetail')}`, commit);
  }

  /**
   * Update existing dummy commit
   * @param {DummyCommitDetail} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  updateDummyCommit(commit: DummyCommitDetail): Observable<any> {
    commit = Helper.formatCommitDate(commit);
    return this.http.post(`${this.getApiUrlDummyCommits('UpdateDetail')}`, commit);
  }

  /**
   * Delete existing dummy commit
   * @param {DummyCommitDetail} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/SupplyVisibility/DeleteDummyCommitDetail
   */
  deleteDummyCommit(commit: DummyCommitDetail): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    const ret = this.http.post(
      `${this.getApiUrlDummyCommits('DeleteDetail')}?dummyCommitDetailId=${commit.id}`,
      {},
      { headers, responseType: 'text' }
    );
    return ret;
  }

  //UPLOAD//

  uploadDummyCommits(fileName: string, file: File): Observable<any> {

    // let headers = new HttpHeaders({
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials,content-type=multipart/*'
    // })

    const url = `${this.getApiUrlDummyCommits('PostUpload')}`
    const formData: FormData = new FormData();

    formData.append('fileName', fileName);
    formData.append('file', file);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  //DOWNLOAD//

  downloadDummyCommits(dummyCommitHeader: DummyCommitHeader) {
    return this.http.post(`${this.getApiUrlDummyCommits('GetUpload')}?dummyCommitHeaderId=${dummyCommitHeader.id}`, null, { responseType: 'blob' });
  }

  /**
   * Add new Dummy Commit header
   * @param {DummyCommitHeader} commit header
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  addDummyCommitHeader(commit: DummyCommitHeader): Observable<any> {
    return this.http.post(`${this.getApiUrlDummyCommits('CreateHeader')}`, commit);
  }

  /**
   * Update existing dummy commit header
   * @param {DummyCommitHeader} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  updateDummyCommitHeader(commit: DummyCommitHeader): Observable<any> {
    return this.http.post(`${this.getApiUrlDummyCommits('UpdateHeader')}`, commit);
  }

  /**
   * Delete existing dummy commit header
   * @param {DummyCommitHeader} commit
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/SupplyVisibility/DeleteDummyCommitHeader
   */
  deleteDummyCommitHeader(commit: DummyCommitHeader): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    const ret = this.http.post(
      `${this.getApiUrlDummyCommits('DeleteHeader')}?dummyCommitHeaderId=${commit.id}`,
      {},
      { headers, responseType: 'text' }
    );
    return ret;
  }

  /**
   * Update existing dummy commit header
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getDummyCommitHeaders(filter: DummyCommitHeadersFilter): Observable<any> {
    let params = new HttpParams();

    if (filter !== undefined && filter.vendorCode) {
      params = params.append('VendorCode', filter.vendorCode);
    }
    if (filter !== undefined && filter.partNumber) {
      params = params.append('partNumber', filter.partNumber.toUpperCase());
    }

    return this.http.get(`${this.getApiUrlDummyCommits('GetHeaders')}`, {
      params: params
    });
  }

  /**
   * Set PN as reviewed
   * @param {PnReviewed} pnReviewed
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   * (POST)MaterialManagement/SupplyVisibility/UpdatePrecalculateProjectionReviewed
   */
  setPnReviewed(pnReviewed: PnReviewed): Observable<any> {

    return this.http.post(`${this.getApiUrlPartNumbers('createpartnumbervendorcodeflag')}`, pnReviewed);
  }


  getPnFlags(pnVcList: PnVendorCode[]): Observable<any> {
    return this.http.post(`${this.getApiUrlPartNumbers('getpartnumbervendorcodeflags')}`, pnVcList);
  }

  deletePnFlags(pnVc: PnVendorCode, flag: string): Observable<any> {
    let partNumber, vendorCode;
    partNumber = pnVc.partNumber ? encodeURIComponent(pnVc.partNumber) : undefined;
    vendorCode = pnVc.vendorCode ? encodeURIComponent(pnVc.vendorCode) : undefined;

    return this.http.delete(`${this.getApiUrlPartNumbers('deletepartnumbervendorcodeflag')}/${partNumber}/${vendorCode}/${flag}`);
  }

  getMultiProjections(payload: any): Observable<any> {
    return this.http.post(`${this.getApiUrlSupplyVisibility('MultiProjections')}`, payload);
  }

  /**
   * Get Forecast data
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getForecast(parameters: BasicParameters, dummyCommitHeader?: DummyCommitHeader, requestFilter: boolean = false): Observable<any> {

    if (!parameters.vendorCode) {
      return throwError(() => new Error('Vendor code is required'));
    } else {
      this.svCalled = true;
    }

    const forecastUrlWithParams = this.getUrlForForecastWithParams(parameters, dummyCommitHeader, requestFilter);
    if (forecastUrlWithParams === null || !forecastUrlWithParams) {
      return throwError(() => new Error('Invalid forecastUrlWithParams'));
    }

    //this.svUrlList.push(forecastUrlWithParams);

    return this.http.get(forecastUrlWithParams.url, {
      params: forecastUrlWithParams.params
    });
  }


  getUrlForForecastWithParams(parameters: BasicParameters, dummyCommitHeader?: DummyCommitHeader, requestFilter: boolean = false): SvUrlWithParams {
    const selectedApi = 'ProjectionByVendor';
    let params = new HttpParams();
    params = params.append('Plant', parameters.plant);
    params = params.append('PartNumber', encodeURIComponent(parameters.partNumber).toUpperCase());
    if (parameters && parameters.records) {
      params = params.append('Records', parameters.records.toString());
    }
    if (parameters.variant) {
      params = params.append('Variant', parameters.variant);
    }
    if (parameters.mmViewID) {
      params = params.append('MaterialManagementViewID', parameters.mmViewID);
    }
    if (parameters.vendorCode) {
      params = params.append('VendorCode', parameters.vendorCode);
    }
    if (dummyCommitHeader && dummyCommitHeader.id) {
      params = params.append('DummyCommitHeaderID', dummyCommitHeader.id);
    }
    if (requestFilter && parameters.vendorCode !== 'VirtualVC')
      params = params.append('requestFilter', "true");

    const apiUrl = `${this.getApiUrlSupplyVisibility(selectedApi)}`;
    return {
      url: apiUrl.replace('ls51.', `${parameters.plant.toLowerCase()}.`),
      params: params
    };

  }

  /**
   * Get Forecast data for all vendors
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getForecastAllVendors(parameters: BasicParameters, dummyCommitHeader: DummyCommitHeader, vendorList: any[]): Observable<any> {
    return this.http.post(`${this.getApiUrlSupplyVisibility('MultiProjection')}`, {
      Plant: parameters.plant,
      PartNumber: parameters.partNumber,
      MaterialManagementViewID: parameters.mmViewID,
      DummyCommitHeaderID: dummyCommitHeader !== null ? dummyCommitHeader.id : null,
      partNoVendors: vendorList,
      records: parameters.records,
      variant: parameters.variant
    });
  }

  /**
   * Get Children PN forecast data
   * @returns {ForecastVirtualVc[]}
   * @memberof SupplyVisibilityService
   */
  async getChildrenPnForecast(virtualPN: any, virtualVcChildList: any) { // set type as per requirement
    let virtualVcForecasts: ForecastVirtualVc[] = [];
    if (virtualVcChildList && virtualVcChildList.length) {
      for (let virtualVcChild of virtualVcChildList) {
        let rawValidQuote = await firstValueFrom(this.getValidCombination(virtualVcChild.partNumber, virtualVcChild.vendorCode)).catch(
          (): any => rawValidQuote = null
        )
        const validQuota = rawValidQuote && rawValidQuote.isValidQuota ? rawValidQuote.isValidQuota : false;
        const basicParameters: BasicParameters = {
          partNumber: virtualVcChild.partNumber,
          plant: virtualPN.plant,
          vendorCode: virtualVcChild.vendorCode,
          mmViewID: virtualPN.mmViewID,
          records: virtualPN.records,
          variant: virtualPN.variant,
          widgetId: virtualPN.widgetId
        }
        if (virtualVcChild && virtualVcChild.projectionDetails.length > 0) {
          if (virtualVcChild.staticvalues) {
            virtualVcChild.staticvalues = [
              {
                "label": "Part Number",
                "value": virtualVcChild.partNumber,
                "order": 0,
                "visible": true,
                "calculation": "UNDEFINED",
                "calculationrule": "DEFAULT",
                "calculationvalue": "0"
              },
              {
                "label": "Vendor Code",
                "value": virtualVcChild.vendorCode,
                "order": 0,
                "visible": true,
                "calculation": "UNDEFINED",
                "calculationrule": "DEFAULT",
                "calculationvalue": "0"
              },
              ...virtualVcChild.staticvalues
            ].map(
              (data, index: number) => {
                data.order = index;
                return data;
              }
            )
          }
        }
        const childDetails = {
          basicParameters: basicParameters,
          validQuota: validQuota,
          data: virtualVcChild
        }
        virtualVcForecasts.push(<ForecastVirtualVc>childDetails);
      }
    } else {
      //NO PARTS AVAILABLE
    }
    return virtualVcForecasts;
  }

  async getVirtualPnChildList(partNumber?: number | string) { // not in use
    let partNumberList = await this.vpnsService.getPartNumbersListForSV(partNumber);
    return partNumberList;
  }

  async getDefaultList(key: string) {
    let defaultFields = await firstValueFrom(this.getDefaultFormSettingFields(key))
      .catch(() => {
        return [];
      });

    return defaultFields;
  }

  async getReadOnlyList() {
    let tReadOnlyList: any;
    tReadOnlyList = await firstValueFrom(this.getReadOnlyFieldsForCommits())
      .catch((e) => {
        tReadOnlyList = undefined;
      });

    if (tReadOnlyList) {
      tReadOnlyList = tReadOnlyList.map((element: any) => {
        return element ? element.trim().toLowerCase() : element;
      });
    }

    return tReadOnlyList ? tReadOnlyList : [];
  }

  getMandatoryFieldsUrl() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.GetMandatoryFields}`;
    return this.http.get(url);
  }

  async getMandatoryFields() {
    let mandatoryFields = this.getMandatoryFieldsUrl()
      .toPromise()
      .catch(() => {
        return [];
      });

    return mandatoryFields;
  }

  setFieldsVisibility(defaultFields: string[], readOnlyFields?: string[], mandatoryDates?: string[], mandatoryFields?: any) {

    let modifiedFields: string[] = [];
    if (defaultFields) {
      if (readOnlyFields) {
        modifiedFields = defaultFields.filter((obj) =>
          !readOnlyFields.includes(obj.toLowerCase())
        );
      }
    }

    if (mandatoryDates) {
      for (let i = 0; i < mandatoryDates.length; i++) {
        if (modifiedFields.indexOf(mandatoryDates[i].toLowerCase()) === -1) {
          modifiedFields.push(mandatoryDates[i].toLowerCase());
        }
      }
    }

    if (mandatoryFields) {
      mandatoryFields.forEach((mandatoryField: any, index: number) => {
        if (modifiedFields.indexOf(mandatoryFields[index].toLowerCase()) === -1) {
          modifiedFields.push(mandatoryField);
        }
      });
    }

    return modifiedFields;
  }


  /**
   * GetCumulativeList data
   * @returns {Observable<any>}
   * @memberof SupplyVisibilityService
   */
  getCumulativeList(data: any): Observable<any> {
    return this.http.post(`${this.getApiUrlSupplyVisibility('MultiProjection')}`, data);
  }

  /**
   * Get Purchase Orders
   * @param {BasicParameters} parameters
   * @returns
   * @memberof SupplyVisibilityService
   */
  getPurchaseOrders(parameters: BasicParameters) {
    let vendorCode: string;

    let params = new HttpParams();
    params = params.append('Plant', parameters.plant);
    params = params.append('PartNumber', parameters.partNumber.toUpperCase());
    if (parameters.vendorCode) {
      vendorCode = Helper.virtualVCReplace(parameters.vendorCode?.toUpperCase())
      params = params.append('VendorCode', vendorCode);
    }
    return this.http.get<PurchaseOrders[]>(`${this.getApiUrlPurchaseOrders('GetPurchaseOrders')}`, {
      params: params
    });
  }

  /**
   * Get Commit Api URL for Get commit
   * @param {BasicParameters} basicParams
   * @param {DateRangeParameters} dateRangeParams
   * @param {string} [action='GetCommits']
   * @returns
   * @memberof SupplyVisibilityService
   */
  getApiUrl(
    basicParams: BasicParameters,
    dateRangeParams: DateRangeParameters,
    action = 'GetCommits'
  ) {
    return `${this.getApiUrlCommits(
      `${action}`
    )}?$inlinecount=allpages&$top=0&$skip=0&Plant=${basicParams.plant
      }&PartNumber=${basicParams.partNumber}&DeliveryDateFrom=${dateRangeParams.dateFrom
      }&DeliveryDateTo=${dateRangeParams.dateTo}`;
  }

  /**
   * Get Date Range
   * @param {string} [type]
   * @returns {DateRangeParameters}
   * @memberof SupplyVisibilityService
   */
  getDateRange(type?: string): DateRangeParameters {
    const month: number = new Date().getMonth();
    const fullYear: number = new Date().getFullYear();
    const day: number = new Date(Date.now()).getDate();
    // TODO - add setting for user selection
    const startDate: Date = new Date(fullYear, month, day - 14);
    const endDate: Date = new Date(fullYear, month + 1, day);

    switch (type) {
      case 'start':
        return { dateFrom: startDate.toDateString() };
      case 'end':
        return { dateTo: endDate.toDateString() };
      default:
        return {
          dateFrom: startDate.toDateString(),
          dateTo: endDate.toDateString()
        };
    }
  }

  /**
   * Convert data to specified format
   * @param {DateRangeParameters} parameters
   * @param {string} type
   * @returns
   * @memberof SupplyVisibilityService
   */
  convertDate(parameters: DateRangeParameters, type: string) {
    try {
      return formatDate(parameters[type as keyof DateRangeParameters], 'yyyy-MM-dd', 'en-US');

    } catch (error) {
      return parameters[type as keyof DateRangeParameters];
    }
  }

  /**
   * Weeks in array
   * @param {ForecastDetail[]} forecastDetail
   * @returns {number[]}
   * @memberof SupplyVisibilityService
   */
  getWeeks(forecastDetail: ForecastDetail[]): number[] {
    const weeks: number[] = [];
    forecastDetail.map(item => {
      weeks.push(item.week);
    });
    return weeks;
  }

  /**
   * Weeks index array for Range Navigator
   * @param {ForecastDetail[]} forecastDetail
   * @returns {number[]}
   * @memberof SupplyVisibilityService
   */
  getProjectionWeeks(forecastDetail: ForecastDetail[]): number[] {
    const projectionWeeks: number[] = [];
    forecastDetail.map(item => {
      projectionWeeks.push(item.projectionWeek);
    });
    return projectionWeeks;
  }

  getFirstDayOfWeeks(forecastDetail: ForecastDetail[]): string[] {
    const firstDayOfWeeks: string[] = [];
    forecastDetail.map(item => {
      firstDayOfWeeks.push(item.date);
    });
    return firstDayOfWeeks;
  }
  public static getCommitHistoryDateRange(): DateRangeParameters {
    const dateFrom = moment().subtract(14, 'days');
    const dateTo = moment().add(6, 'months');

    const dateRange: DateRangeParameters = {
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
    return dateRange;
  }

  /**
   * Get forecast range
   * @param {ForecastDetail[]} forecastDetail
   * @returns
   * @memberof SupplyVisibilityService
   */
  getForecastRange(weeks: number[]): number[] {
    const min = Math.min(...weeks);
    const max = Math.max(...weeks);
    return [min, max];
  }

  /**
   * Set Date Range
   * @param {DateRangeParameters} dateParameters
   * @memberof SupplyVisibilityService
   */
  setDateRange(dateParameters: DateRangeParameters) {
    if (dateParameters && dateParameters.dateFrom && dateParameters.dateTo) {
      this.store.dispatch(new SetDateRangeParameters(dateParameters));
    } else {
      dateParameters = Helper.getCommitHistoryDateRange();
      this.store.dispatch(new SetDateRangeParameters(dateParameters));
    }
  }

  /**
   * Set Material Management Views
   */
  materialManagementViews() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.mmViews}`;
    return this.http.get<MaterialManagementViews[]>(url);
  }

  getSVDashboardUserSettings() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.mmViews}`;
    return this.http.get(url);
  }


  /**
   * Get Chart data from Qlik
   * @todo set to real files based on partnumber and vendor
   */
  getQlikData(partNumber: string, vendor: string, appId: string, tableId: string) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.qlikGetDataFromApp}`;
    const filter = [
      {
        field: "Material",
        value: partNumber.toUpperCase()
      },
      {
        field: "Vendor",
        value: vendor
      }
    ];
    const postData = {
      "applicationId": appId,
      "tableId": tableId,
      "filter": filter
    };

    return this.http.post(url, postData);
  }

  /*
  todo: implement
   */
  getChartSettings() {
    // const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.chartSettings}`;
    // return this.http.get(url);
    const appId = this.getQlikAppId(); //use only momentarily, then it will be set in settings

    const chartSettings = [
      {
        name: 'FcstAccuLeadTime',
        type: 'line',
        qlikAppId: appId,
        tableName: 'zjteqp',
        showDateAsWeeks: true,
        series: [{
          name: 'Sum of Forecast',
          nameKey: 'edi_date_fcstaccu',
          valueKey: 'fcst_rsum'
        }, {
          name: 'cons_qty',
          nameKey: 'edi_date_fcstaccu',
          valueKey: 'cons_qty'
        }],
        dateKey: 'edi_date_fcstaccu',
        xAxisLabel: 'Week',
        yAxisLabel: 'Forecast',
        downloadedData: null,
        data: null,
        order: 1
      },
      {
        name: 'ConsWeekly',
        type: 'bar',
        qlikAppId: appId,
        tableName: 'SFPJXy',
        showDateAsWeeks: false,
        series: [{
          name: 'Sum of Forecast',
          nameKey: 'edi_date_consweekly',
          valueKey: 'consqtyweekly'
        }],
        dateKey: 'edi_date_consweekly',
        xAxisLabel: 'Week',
        yAxisLabel: 'Forecast',
        downloadedData: null,
        data: null,
        order: 2
      },
      {
        name: 'MSR',
        type: 'bar',
        qlikAppId: appId,
        tableName: 'Ukh',
        showDateAsWeeks: true,
        series: [{
          name: 'MSR',
          nameKey: 'datemsr',
          valueKey: 'bestmsrshortage'
        }],
        dateKey: 'datemsr',
        xAxisLabel: 'Week',
        yAxisLabel: 'Forecast',
        downloadedData: null,
        data: null,
        order: 3
      }
    ];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(chartSettings);
      }, 100);
    });
  }


  //#region PartNumber/VendorCode Flags
  setMarkPnReviewed(reviewFlag: any, PnVc: any, isFlagAvailable?: any) {
    //BlockGuards
    if (!reviewFlag) {
      return;
    }

    if (!isFlagAvailable) {
      PnVc['flag'] = reviewFlag;
      this.store.dispatch(new SetPnReviewed(PnVc))
    } else {
      this.store.dispatch(new DeletePnFlags(PnVc, reviewFlag));
      //IMPLEMENT Delete flag Logic
    }
  }

  //#endregion PartNumber/VendorCode Flags

  /**
   * Extract partnumber at index from list
   * @param partNumbersList
   */
  getPartNumberAtIndex(partNumbersList: any, pnIndex: number) { // not in use
    return partNumbersList[pnIndex];
  }

  // * Create list of partnumbers from the widget so it is always the same
  //following method createPartNumbersList is deprecated
  createPNVendorList(partNumbersList: string, vendorCode?: string, separateByTab: boolean = false) {
    if (separateByTab) {
      const partNumbers = partNumbersList ? partNumbersList.trim().split(/\r\n|\n|\r|,/).filter(c => c).map(c => c ? c.trim() : '').map(c => {
        const pnVn = c.split(/[\|]|\t/).filter(c => c);
        return { partNumber: pnVn[0] ? pnVn[0].trim() : '', vendorCode: pnVn[1] ? pnVn[1].trim() : vendorCode }
      }) : null;
      return partNumbers;
    } else {
      const partNumbers = partNumbersList ? partNumbersList.trim().split(/\r\n|\n|\r|,/).filter(c => c).map(c => c ? c.trim() : '').map(c => {
        const pnVn = c.split(/[\|]/).filter(c => c);
        return { partNumber: pnVn[0] ? pnVn[0].trim() : '', vendorCode: pnVn[1] ? pnVn[1].trim() : vendorCode }
      }) : null;
      return partNumbers;
    }

  }

  /**
   *  Accepts field having values seperated by tab (/n) and returns array of values
   * @param fields
   * @returns Array
   */
  createFieldsList(fields: any) {
    const fieldList = fields ? fields.trim().split(/\r\n|\n|\r|,/).filter((c: string) => c).map((c: string) => c ? c.trim() : '') : [];
    return fieldList;
  }


  /**
   * @deprecated
   * Create list of partnumbers from the widget so it is always the same
   * List can go like this: PN,PN, ... PN|Vendor,PN|Vendor,... tab separated PN Vendor with new lines (pasted from excel)
   * result should always be an array PN|Vendor,PN|Vendor or PN,PN
   * @param partNumbersList
   */
  createPartNumbersList(partNumbersList: any, vendorCode: any) { // not in use
    let recordsSingleRow = '';
    let lines = false;
    let pnsArray = [];
    let isTabSeparated = false;
    if (this.checkSplit(partNumbersList, "\n")) {
      lines = true;
    }
    let tmpArray = [];
    if (lines === true) {
      tmpArray = partNumbersList.split("\n");
    } else {
      tmpArray = partNumbersList.split(',');
    }
    if (tmpArray.length > 0) {
      for (let i = 0; i < tmpArray.length; i++) {
        const tmpTabSeparated = this.checkSplit(tmpArray[i], "\t");
        if (tmpTabSeparated === true) {
          isTabSeparated = true;
          break;
        }
      }
      for (let j = 0; j < tmpArray.length; j++) {
        let pnVendor = tmpArray[j].split(isTabSeparated === true ? "\t" : "|");
        if (pnVendor.length > 1 && pnVendor[0].trim() != '') {
          pnsArray.push(pnVendor[0] + '|' + pnVendor[1]);
        } else {
          pnsArray.push(pnVendor[0] + (vendorCode && vendorCode !== '' ? '|' + vendorCode : ''));
        }
      }
    }
    return pnsArray;
  }

  /**
   * Check if string is divided by custom separator
   * @param partNumbersList
   * @param separator
   */
  checkSplit(partNumbersList: any, separator: string) {
    const resultList = partNumbersList.split(separator);
    if (resultList.length > 1) {
      return true;
    }
    return false;
  }

  /**
   * getVendorFromPartnumberVendor string
   * @param partnumberVendor separated by vendorSeparator or |
   * @param vendorSeparator custom or undefined
   */
  getVendorFromPartNumber(partnumberVendor: any, vendorSeparator: any) { // not in use
    let vendor: string = '';
    if (!vendorSeparator) {
      vendorSeparator = '|';
    }
    if (partnumberVendor !== '') {
      const tmpPnVendor = partnumberVendor.split(vendorSeparator);
      if (tmpPnVendor.length > 1) {
        vendor = tmpPnVendor[1];
      }
    }
    return vendor;
  }

  /**
   * getPartNumberFromPartNumberVendor string
   * @param partnumberVendor separated by vendorSeparator or |
   * @param vendorSeparator custom or undefined
   */
  getPartNumberFromPartNumberVendor(partnumberVendor: any, vendorSeparator: any) { // not in use
    let partNumber: string = partnumberVendor;
    if (!vendorSeparator) {
      vendorSeparator = '|';
    }
    if (partnumberVendor !== '') {
      const tmpPnVendor = partnumberVendor.split(vendorSeparator);
      if (tmpPnVendor.length > 1) {
        partNumber = tmpPnVendor[0];
      }
    }
    return partNumber;
  }


  getValidCombination(partNumber?: string, vendorCode?: string): Observable<any> {
    let params = new HttpParams();
    if(partNumber){
    params = params.append("PartNumber", partNumber.toUpperCase());}
    if(vendorCode){
    params = params.append("vendorCode", vendorCode);}

    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.ValidatePartNumberVendorCode}`;
    return this.http.get(url, {
      params: params
    });
  }

  //new
  async downloadSupplyVisibilityTableByWidget(partnumbersList: DownloadSupplyVisibilityTableByWidget, live?: any, comments?: boolean) {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    const dataUrl = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getProjectionsByPrecalculations}`;
    if (live) {
      await this.reDownloadSupplyVisibilityTablePrecalculations(dataUrl.replace('ls51.', plant.toLowerCase() + '.'), partnumbersList, live);
    }
    else {
      await this.reDownloadSupplyVisibilityTablePrecalculations(dataUrl.replace('ls51.', plant.toLowerCase() + '.'), partnumbersList, false, comments);
    }
    return true;
  }

  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  async downloadSupplyVisibility(partnumbersList: any, withComments?: boolean) {
    const excelDownloadInstructions = {
      partNoVendors: [],
      fontSize: partnumbersList.fontSize ? partnumbersList.fontSize : 10,
      materialManagementViewID: partnumbersList.materialManagementViewID,
      plant: this.store.selectSnapshot(AuthenticationState.getActiveplant),
      records: partnumbersList.records,
      variant: partnumbersList.variant,
      userId: this.store.selectSnapshot(AuthenticationState.primarySid),
      timeZone: this.getUserTimezone()
    }
    //this.svUrlList = [];
    //this.svUrlList.push(this.getUrlForForecastWithParams(partnumbersList, this.dummyCommitHeaderForExcel, false));

    if (this.svUrlList.length === 0) {
      this.svUrlList.push(this.getUrlForForecastWithParams(partnumbersList, this.dummyCommitHeaderForExcel, false));
    }


    const encodeParams = ((params: any) => {
      const paramsToEncode = ['PartNumber', 'VendorCode'];
      paramsToEncode.forEach((param) => {
        if (params[param]) {
          params[param] = encodeURIComponent(params[param]);
        }
      });
      return params;
    });
    this.svUrlList = this.svUrlList.map((svUrlWithParams: SvUrlWithParams) => {
      return {
        url: svUrlWithParams.url,
        params: encodeParams(svUrlWithParams.params)
      }
    });
    this.svUrlList.forEach((svUrlWithParams: SvUrlWithParams) => {

      const partNoVendor = `${svUrlWithParams.url}?${svUrlWithParams.params.toString()}`;
      (excelDownloadInstructions.partNoVendors as { url: string }[]).push({ url: partNoVendor });
    });
    await this.downloadSupplyVisibilityTable(excelDownloadInstructions, withComments || false);
    return true;
  }



  async downloadSupplyVisibilityTablePrecalculations(data: any) {  // Not in use now
    const url = this.configService.getSettings('excelService');
    let res: any;
    res = await this.http.post(url + '/svtable/createProjectionsWithPrecalculation/', data).toPromise()
    try {
      let fileUrl = res['success'] && res['success'].url ? url + res['success'].url : false;
      if (fileUrl !== false) {
        window.location.href = fileUrl;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async reDownloadSupplyVisibilityTablePrecalculations(dataUrl: string, partNumberList: any, live?: any, comments?: boolean) {
    const url = this.configService.getSettings('excelService');
    let res: any;
    if (live) {
      let params = new HttpParams();
      //params = params.append("$live",live);
      try {
        res = await this.http.post(url + '/download/downloadPrecalculations/', {
          url: dataUrl,
          partNumbersList: partNumberList,
          timeZone: this.getUserTimezone()
        }, {
          params: params
        }).toPromise()
          .catch((error) => {
            Helper.showError(this.notificationService, error, 'Error while PN list download process');
          });
      } catch (e: any) {
        if (e.error && e.error.errorMessage) {
          Helper.showError(this.notificationService, e.error.errorMessage, 'Error while downloading SV. ' + e.error.errorMessage);
        }
      }

    }
    else {
      try {
        res = await this.http.post(url + '/download/precalculations' + (comments ? 'WithComments' : '') + '/', {
          url: dataUrl,
          partNumbersList: partNumberList,
          timeZone: this.getUserTimezone()
        }).toPromise();
      } catch (e: any) {
        if (e.error && e.error.errorMessage) {
          Helper.showError(this.notificationService, e.error.errorMessage, 'Error while downloading SV. ' + e.error.errorMessage);
        }
      }
    }
    try {
      if (!res) {
        return false;
      }
      let fileUrl = res['success'] && res['success'].url ? url + res['success'].url : false;
      if (fileUrl !== false) {
        window.location.href = fileUrl;
      }
      return true;
    } catch (e) {
      return e;
    }
  }


  async downloadSupplyVisibilityTable(data: any, withComments?: boolean) {
    const url = this.configService.getSettings('excelService');
    data = { ...data, timeZone: this.getUserTimezone() };
    const encodedUrlWithParams = ((url: any) => {
      const paramsToEncode = ['PartNumber', 'VendorCode'];
      //get url and params as params object
      const urlParams = new URLSearchParams(url);
      const params: { [key: string]: string } = {};
      urlParams.forEach((value, key) => {
        params[key] = value;
      });
      //encode params
      paramsToEncode.forEach((param) => {
        if (params[param]) {
          params[param] = encodeURIComponent(params[param]);
        }
      });
      //return url with encoded params
      return `${url.split('?')[0]}?${new URLSearchParams(params).toString()}`;
    });
    if (data.partNoVendors.length > 0) {
      data.partNoVendors = data.partNoVendors.map((partNoVendor: any) => {
        return {
          url: encodedUrlWithParams(partNoVendor.url)
        }
      });
    }

    try {
      let res: any;
      res = await this.http.post(url + '/download/downloadSvJob' + (withComments === true ? 'WithComments' : '') + '/', data).toPromise();
      try {
        if (res === null) {
          return false;
        }
        let fileUrl = res['success'] && res['success'].url ? url + res['success'].url : false;
        if (fileUrl !== false) {
          window.location.href = fileUrl;
        }
        return false;
      } catch (e: any) {
        console.log(e);
        if (e.error && e.error.errorMessage) {
          Helper.showError(this.notificationService, e.errorMessage, 'Error while downloading SV table');
        }
        return e;
      }
    } catch (e: any) {
      if (e.error && e.error.errorMessage) {
        Helper.showError(this.notificationService, e.error.errorMessage, 'Error while downloading SV table: ' + e.error.errorMessage);
      }
      return e;
    }
  }

  async downloadMultiPNSupplyVisibilityTable(data: any, withComments?: boolean) {
    const url = this.configService.getSettings('excelService');
    let res: any;
    res = await this.http.post(url + '/download/downloadSv' + (withComments === true ? 'WithComments' : '') + '/', data).toPromise()
    try {
      let fileUrl = res['success'] && res['success'].url ? url + res['success'].url : false;
      if (fileUrl !== false) {
        window.location.href = fileUrl;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async downloadMultiPNSupplyVisibilityTablePrecalculations(data: any) {
    const url = this.configService.getSettings('excelService') + '/multipnsvtable/createProjectionsWithPrecalculation/';

    const res: any = await lastValueFrom(this.http.post(url, data)); //TODO: set proper type based on response type JAIMIN
    try {
      let fileUrl = res['success'] && res['success'].url ? url + res['success'].url : false;
      if (fileUrl !== false) {
        window.location.href = fileUrl;
      }
      return false;
    } catch (e) {
      return e;
    }
  }


  getUserDataRuleEndpoint(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.userDataRule}${'/'}${action}`;
  }

  getUserVendorCode(data: any): Observable<any> {
    let params = new HttpParams();
    if (data) {
      if (data.skip !== null && data.skip !== undefined) {
        params = params.append('$skip', data.skip);
      }
      if (data.top !== null && data.top !== undefined) {
        params = params.append('$top', data.top);
      }
      if (data.sort !== null && data.sort !== undefined) {
        params = params.append('$orderby', data.sort);
      }
      if (data.searchValue) {
        params = params.append('searchText', data.searchValue);
      }
    }
    return this.http.get(`${this.getUserDataRuleEndpoint('GetUserVendorCode')}`, {
      params: params
    });
  }

  getUserRule(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("id", id);
    return this.http.get(`${this.getUserDataRuleEndpoint('GetUserVendorCode')}`, {
      params: params
    });
  }

  downloadVendorRights(): Observable<any> {
    let url = `${this.getUserDataRuleEndpoint('getuploaduservendorcodes')}`;
    return this.http.post(url, null, { responseType: 'blob' });
  }

  uploadVendorRights(file: File): Observable<RequestStatus> {
    const url = `${this.getUserDataRuleEndpoint('postuploaduservendorcodes')}`;
    const formData: FormData = new FormData();

    formData.append('Content', file);

    return <Observable<RequestStatus>>(
      this.http.post(`${this.getUserDataRuleEndpoint('postuploaduservendorcodes')}`, formData, {
        reportProgress: true,
        responseType: 'json',
      })
    );
  }

  insertUserVendorCodeRights(data: any): Observable<any> {

    return this.http.post(`${this.getUserDataRuleEndpoint('InsertUserVendorCode')}`, data);
  }

  updateUserVendorCodeRights(data: any): Observable<any> {
    return this.http.post(`${this.getUserDataRuleEndpoint('UpdateUserVendorCode')}`, data);
  }

  deleteUserVendorCodeRights(id: string): Observable<any> {
    return this.http.delete(`${this.getUserDataRuleEndpoint('DeleteUserVendorCode')}/${id}`);
  }

  /**
   * Shared Widget Settings
   */
  private getSharedWidgetEndpoint() {
    return `${this.configService.getSettings('userSettingsService')}${environment.modulesBaseUrl.materialManagement.sharedWidgets}`;
  }

  insertSharedWidget(widgetData: SharedWidget): Observable<any> {
    return this.http.post(this.getSharedWidgetEndpoint(), widgetData);
  }

  getSharedWidgetList(): Observable<any> {
    return this.http.get(`${this.getSharedWidgetEndpoint()}`);
  }

  getSharedWidgetById(widgetId: string): Observable<any> {
    return this.http.get(`${this.getSharedWidgetEndpoint()}/${widgetId}`);
  }

  updateSharedWidget(widgetData: any): Observable<any> {
    return this.http.put(`${this.getSharedWidgetEndpoint()}/${widgetData.id}`, widgetData);
  }

  deleteSharedWidget(widgetId: string): Observable<any> {
    return this.http.delete(`${this.getSharedWidgetEndpoint()}/${widgetId}`);
  }

  /**
   * Shared Widget Settings
   */
  private getDashboardEndpoint() {
    return `${this.configService.getSettings('userSettingsService')}${environment.modulesBaseUrl.materialManagement.dashboards}`;
  }

  private getTemplateSettingsEndpoint() {
    return `${this.configService.getSettings('userSettingsService')}${environment.modulesBaseUrl.materialManagement.templateSettings}`;
  }

  insertDashboard(dashboard: DashboardSetting): Observable<any> {
    return this.http.post(`${this.getDashboardEndpoint()}`, dashboard);
  }

  updateDashboard(dashboard: any): Observable<any> {
    return this.http.put(`${this.getDashboardEndpoint()}/${dashboard.id}`, dashboard)
  }

  getDashboardList(): Observable<any> {
            // TODO: need to remove Bearer
            const token = this.authService.getToken();
            const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.getDashboardEndpoint()}`,{headers});
  }

  getDashboardDetail(id: string): Observable<any> {
                // TODO: need to remove Bearer
                const token = this.authService.getToken();
                const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.getDashboardEndpoint()}/${id}`,{headers});
  }

  deleteDashboard(id: string): Observable<any> {
    return this.http.delete(`${this.getDashboardEndpoint()}/${id}`);
  }

  getTemplateSettings(data: any): Observable<any> {
    let params = new HttpParams();
    params = params.append("plant", data.plant);
    params = params.append("type", data.type);
    params = params.append("key", data.key);

    return this.http.get(`${this.getTemplateSettingsEndpoint()}`, {
      params: params
    });
  }

  getTemplateSettingsByID(id: string): Observable<any> {
    return this.http.get(`${this.getTemplateSettingsEndpoint()}/${id}`);
  }

  updateTemplateSettings(payload: any): Observable<any> {
    return this.http.put(`${this.getTemplateSettingsEndpoint()}/${payload.id}`, payload);
  }

  createTemplateSettings(data: any): Observable<any> {
    return this.http.post(`${this.getTemplateSettingsEndpoint()}`, data);
  }

  deleteTemplateSettings(id: string): Observable<any> {
    return this.http.delete(`${this.getTemplateSettingsEndpoint()}/${id}`);
  }

  getForecastDate() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.forecastDate}`;
    return this.http.get<ForecastDate>(url);
  }

  getReadOnlyFieldsForCommits() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commitsReadOnlyFields}`;
    return this.http.get(url);
  }

  getFilterAdditionsForCommits() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commitsFilterAdditions}`;
    return this.http.get(url);
  }


  /**
   * Notifications
   */
  private getNotificationsEndpoint() {
    return `${this.configService.getSettings('userSettingsService')}${environment.modulesBaseUrl.materialManagement.notifications}`;
  }

  getNotificationsList(): Observable<any> {
        // TODO: need to remove Bearer
        const token = this.authService.getToken();
        const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.getNotificationsEndpoint()}`, { headers });
  }

  getNotificationDetail(id: string): Observable<any> {
    return this.http.get(`${this.getNotificationsEndpoint()}/${id}`);
  }

  getNotificationsUnreadCount(): Observable<any> {
    return this.http.get(`${this.getNotificationsEndpoint()}/unreadcount`);
  }

  setNotificationAsRead(id: string): Observable<any> {
    return this.http.put(`${this.getNotificationsEndpoint()}/${id}/setasread`, null)
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.getNotificationsEndpoint()}/${id}`);
  }

  setAllNotificationsAsRead(): Observable<any> {
    return this.http.post(`${this.getNotificationsEndpoint()}/setallasread`, null);
  }

  getFilterList(arg0: string, filters: AdditionalFilter[], ignoreSpace = false, useSemicolon = false): string[] | boolean | string | undefined {
    if (filters && filters.length > 0) {
      const filter = filters.find(c => c.field === arg0);
      if (filter) {
        if (arg0 === 'filterLeadtimeQuery') {
          return filter.value ? filter.operator + filter.value : undefined;
        } else if (arg0 === 'filterVirtualVC') {
          return filter.value; // true false or null
        }
        // else if (arg0 === 'reviewStatus') {
        //   return filter.value === EnumReviewedStatus.OnlyReviewedPNs ? [Helper.REVIEW_FLAG_KEY] :
        //     (filter.value === EnumReviewedStatus.ToBeReviewed ? ["!" + Helper.REVIEW_FLAG_KEY] : []);
        // }
        else {
          if (ignoreSpace) {
            if (useSemicolon) {
              return filter.value ? filter.value.split(/;/).map((c: string) => c ? c.trim() : '').filter((c: string) => c) : [];
            } else {
              return filter.value ? filter.value.split(/,/).map((c: string) => c ? c.trim() : '').filter((c: string) => c) : [];
            }
          } else {
            if (useSemicolon) {
              return filter.value ? filter.value.split(/\s+|;/).map((c: string) => c ? c.trim() : '').filter((c: string) => c) : [];
            } else {
              return filter.value ? filter.value.split(/\s+|,/).map((c: string) => c ? c.trim() : '').filter((c: string) => c) : [];
            }
          }
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  //#region  QAP Managements
  getQapUrl() {
    let url: string = "";
    let qap: any = this.configService.getSettings('qap');
    if (qap) {

      let params = new HttpParams();
      params = params.append("username", `*${qap.domain}${this.authService.getUserName()}*`);
      params = params.append("appid", qap.appId);
      params = params.append("sheet", qap.sheet);
      params = params.append("opt", "currsel");
      params = params.append("select", "clearall");
      url = `${qap.url}?${params.toString()}`
    }
    return url;
  }

  getQlikAppId() {
    try {
      const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
      const id: string = this.configService.getSettings(`svQlikAppIdByPlant.${plant}`);
      if (id) {
        console.log("Using qlik app id: " + id + " for plant: " + plant);
        return id;
      } else {
        throw new Error("No qlik app id found");
      }
    } catch (error) {
      console.log(error);
      return this.configService.getSettings("svQlikAppId");
    }


  }


  // https://qlik.cz.foxconn.com/single/?username=*foxconn-cztbrezina*&appid=bd4f6fbf-e528-4677-bfca-b2e6472f3745&sheet=21b93da4-b46d-4a03-843b-b614a7dc9876&opt=currsel&select=clearall
  //#endregion QAP Managements

  syncPLO() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.syncPlo}`;
    //NOTE - Need to set responseType as response is of string type not JSON
    return this.http.get(url, { responseType: 'text' });
  }


  qapLogin() {
    const url = 'https://cz03qap11.cz.foxconn.com/jwt/qrs/about?xrfkey=0000000000000000';
    const headers = { 'X-Qlik-xrfkey': '0000000000000000' };
    return this.http.get(url, { responseType: 'text', headers: headers, withCredentials: true });
  }

}
