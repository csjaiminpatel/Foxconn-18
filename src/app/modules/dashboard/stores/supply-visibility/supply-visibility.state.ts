import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { State, Store, Selector, createSelector, Action, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { Subscription, debounceTime, firstValueFrom, tap } from 'rxjs';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { Helper } from '../../../shared/helper';
import { SVNotification } from '../../models/sv-notification.model';
import {
  SetCommits, SetCommitSuccess, SetCommitsError, CacheCommitsWithDummyError, CacheCommitWithDummySuccess,
  CacheCommitsWithDummy, SetCommitsWithDummy, SetCommitWithDummySuccess, SetCommitsWithDummyError, SetCommitsWithFilter,
  SetCommitsWithFilterSuccess, SetCommitsWithFilterError, GetDummyCommitHeaders, GetDummyCommitHeadersSuccess,
  GetDummyCommitHeadersError, GetNotifications, GetNotificationsSuccess, GetNotificationsError, GetNotificationsUnreadCount,
  GetNotificationsUnreadCountSuccess, GetNotificationDetails, GetNotificationDetailsSuccess, GetNotificationDetailsError,
  SetAllNotificationsAsRead, SetPnReviewed, SetPnReviewedSuccess, SetPnReviewedError, DeletePnFlags, DeletePnFlagsSuccess,
  DeletePnFlagsError, AddCommit, AddCommitSuccess, AddCommitNotify, AddCommitError, AddDummyCommit, AddDummyCommitSuccess,
  AddDummyCommitError, AddDummyCommitHeader, AddDummyCommitHeaderSuccess, SetDummyCommitHeader, AddDummyCommitHeaderError,
  UpdateDummyCommitHeaderError, UpdateDummyCommitHeaderSuccess, UpdateDummyCommitHeader, DeleteDummyCommitHeaderError,
  DeleteDummyCommitHeaderSuccess, DeleteDummyCommitHeader, DeleteDummyCommitError, DeleteDummyCommitSuccess, DeleteDummyCommit,
  SetUserSettingParameters, SetUserSettings, SetUserSettingsSuccess, SetUserSettingsError, AddUserSettings,
  AddUserSettingsSuccess, AddUserSettingsError, EditUserSettings, EditUserSettingsSuccess, SetPanelCacheSuccess, EditUserSettingsError,
  DeleteUserSettings, EditCommit, PatchCommitTransactionDetails, EditCommitSuccess, EditCommitError,
  DeleteCommit, DeleteCommitSuccess, DeleteCommitError, CancelCommit, CancelCommitSuccess, CancelCommitError, DeletePLO, DeletePLOSuccess,
  DeletePLOError, EditDummyCommit, EditDummyCommitSuccess, EditDummyCommitError, SetPurchaseOrders,
  SetPurchaseOrdersSuccess, SetPurchaseOrdersForCM, SetBasicParameters, SetPartNumberListParameters, SetPartNumberListParametersSuccess,
  SetActiveVendor, SetDateRangeParameters, SetDateRangeParametersSuccess, SetVendorCodes, SetVendorCodesSuccess,
  SetVendorCodesError, SetCommitVendorCode, SetCommitVendorCodeSuccess, SetCommitModuleOn, SetForecast, SetForecastSuccess,
  SetForecastError, SetChildrenPNList, SetChildrenForecastSuccess, CacheForecast, CacheForecastSuccess,
  CacheForecastError, SetForecastWeekRange, SetBuyersPartNumbers, GetPNsPrecalculateProjectionByFilter, SetSVComments, SetSVCommentsSuccess,
  SetSVCommentsError, CreateSVComment, CreateSVCommentSuccess, CreateSVCommentError, UpdateSVComment,
  UpdateSVCommentSuccess, UpdateSVCommentError, DeleteSVComment, DeleteSVCommentSuccess, DeleteSVCommentError, SetSVPredefinedComments,
  CreateSVPredefinedComment, UpdateSVPredefinedComment, DeleteSVPredefinedComment, SetSVNotesByRecord,
  SetSVNotesByRecordSuccess, SetSVNotesByRecordError, CreateSVNote, CreateSVNoteSuccess, UpdateSVNote, DeleteSVNote, SetMaterialManagementViews,
  SetActiveMMView, SetUserAction, ResetSupplyVisibilityAndCommits, ResetSupplyVisibilityPartNumberList,
  ResetCache, ResetCommitTransactionDetails, ResetPlantDependentCache, CacheCommitsReasons, CacheCommitsReasonsSuccess, CacheCommitsReasonsError,
  CacheCommitsCarriers, CacheCommitsCarriersSuccess, CacheCommitsCarriersError, CacheVendorsName,
  CacheVendorsNameSuccess, CacheVendorsNameError, CacheCommitsCountries, CacheCommitsCountriesSuccess, CacheCommitsCountriesError, CacheCommitsTransportType,
  CacheCommitsTransportTypeSuccess, CacheCommitsTransportTypeError, CacheReadOnlyFields, CacheReadOnlyFieldsSuccess,
  CacheReadOnlyFieldsError, GetFilterAdditions, GetFilterAdditionsSuccess, GetFilterAdditionsError, SetCommitTransactionDetails,
  SetVendorTransactionDetails, PatchVendorTransactionDetails, SetQuotationTransactionDetails,
  PatchQuotationTransactionDetails, ShowNotifications, SetPlantMandatoryDates, SetPlantMandatoryDatesSuccess, GetDefaultFormSettingFormKeys,
  GetDefaultFormSettingFormKeysSuccess, GetDefaultFormSettingFormKeysError, GetDefaultFormSettings,
  GetDefaultFormSettingsSuccess, GetDefaultFormSettingsError, UpdateDefaultFormSettings, UpdateDefaultFormSettingsSuccess, UpdateDefaultFormSettingsError,
  HandleLinkEvents, TriggerLinkEventCommitDialog, HandleLinkEventsSuccess, HandleLinkEventsError,
  SetDefaultDashboardSettings, SetCommitStatus, SetAdditionalFilters, GetMultiProjections, GetMultiProjectionsSuccess, GetMultiProjectionsError,
  GetTemplateSettings, GetTemplateSettingsSuccess, GetTemplateSettingsError, GetTemplateSettingsByID,
  GetTemplateSettingsByIDSuccess, GetTemplateSettingsByIDError, UpdateTemplateSettings, UpdateTemplateSettingsSuccess, UpdateTemplateSettingsError,
  CreateTemplateSettings, CreateTemplateSettingsSuccess, CreateTemplateSettingsError, DeleteTemplateSettings,
  DeleteTemplateSettingsSuccess, DeleteTemplateSettingsError
} from './supply-visibility.actions';
import { UserSettingsParameters, BasicParameters, DateRangeParameters, Commit, UserSettings, PurchaseOrders, DummyCommitHeader, PnVendorCode, EnumSvSidebarSection, DefaultDashboardSettings, VendorParametersFilter, NewCommit, DummyCommitDetail, NewUserSetting as NewUserSettings, PnReviewed, } from '../../models/supply-visibility.model';
import { Reason, Carriers, VendorName, Countries, TransportType, CommitTransactionDetails, EnumCommitType, FormKeys } from '../../models/commits.model';
import { MaterialManagementViews } from '../../models/material-management-views.model';
import { BuyersPartnumbers } from '../../models/mm-buyers-partnumbers.model';
import { PartNumberTransactionDetails } from '../../models/partnumbers-list.model';
import { QuotationTransactionDetails, EnumQuotationType } from '../../models/quotations.model';
import { SVComments } from '../../models/sv-comments.model';
import { SVNotes } from '../../models/sv-notes.model';
import { SVPredefinedComments } from '../../models/sv-predefined-comments.model';
import { VendorCode } from '../../models/vendor-code.model';
import { VendorTransactionDetails, EnumVendorType } from '../../models/vendors-list.model';
import { Forecast, ForecastWeekRange, ForecastDetail, Reviewed, ForecastVirtualVc } from '../../models/forecast.model';
import objectHash from 'object-hash';
import { CommitsService } from '../../services/Commits/commits.service';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { SupplyVisibilityCommentService } from '../../services/Supply-Visibility-Comment/supply-visibility-comment.service';
import { SupplyVisibilityPredefinedCommentService } from '../../services/Supply-Visibility-Predefined-Comment/supply-visibility-predefined-comment.service';
import { SupplyVisibilityNotesService } from '../../services/Supply-Visibility-Notes/supply-visibility-notes.service';
import { DateService } from '../../../../services/Date/date.service';
import { BuyersPartnumbersListService } from '../../services/Buyers-PartnumbersList/buyers-partnumbers-list.service';
import { LinkEventsDialogComponent } from '../../components/link-events-dialog/link-events-dialog.component';

export interface SVActiveFetch {
  notificationDetailId?: string,
  forecast?: { currentPnId: string, nextPnId: string }
  //ADD Other active Fetch Info
}
export interface NotificationDetailCache {
  [key: string]: SVNotification;
}
export interface SupplyVisibilityStateModel {
  vendorList: string;
  userSettingParameters: UserSettingsParameters;
  basicParameters: BasicParameters;
  partNumberListParameters: { [widgetId: string]: BasicParameters[] };
  daterangeParameters: DateRangeParameters;
  commits: Commit[];
  notifications: SVNotification[];
  notificationsUnreadCount: number;
  notificationDetailCache: NotificationDetailCache;
  cachedCommits?: Commit[];
  cachedCommitsHash?: String;
  cachedCommitsReasons?: Reason[];
  cachedCommitsCarriers?: Carriers[];
  cachedVendorName?: VendorName[];
  cachedCommitsCountries?: Countries[];
  cachedCommitsTransportType?: TransportType[];
  cachedReadOnlyFields?: string[];
  newCommit: Object;
  userSettings: UserSettings;
  newUserSettings: NewUserSettings;
  purchaseOrders: PurchaseOrders[];
  dummyCommitsHeaders: DummyCommitHeader[];
  selectedDummyCommitHeader?: DummyCommitHeader;
  forecast: Forecast;
  cachedForecast?: Forecast;
  // cachedChildrenForecast?: { parentPnInfo: PnVendorCode, cachedForecast: ForecastVirtualVc[] }
  childrenPNInfo?: { parentPnInfo?: PnVendorCode, childrenPNList: any }
  childrenPNList?: any[]
  cachedChildrenPNInfo?: { parentPnInfo: PnVendorCode, childrenPNList: any }
  cachedForecastHash?: String;
  forecastWeekRange: ForecastWeekRange;
  materialManagementViews: MaterialManagementViews[];
  svComments: SVComments[];
  svPredefinedComments: SVPredefinedComments[];
  svNotes: SVNotes[];
  svNotesCount: number;
  userAction: EnumSvSidebarSection;
  buyersPartNumbers: BuyersPartnumbers[];
  vendorCodes: VendorCode[];
  commitVendorCode: string;
  commitModuleOn?: boolean;
  commitFilter?: any;
  commitMandatoryDates: string[];
  commitTransactionDetails: CommitTransactionDetails[];
  vendorTransactionDetails: VendorTransactionDetails[];
  quotationTransactionDetails: QuotationTransactionDetails[];
  partnumberTransactionDetails: PartNumberTransactionDetails[];
  commitFilterAdditions?: any;
  DefaultDashboardData: DefaultDashboardSettings;
  commitStatus: any[];
  additionalFilters: any
}

export interface SupplyVisibilityCacheStateModel {
  commits: Commit[];
}
@State<SupplyVisibilityCacheStateModel>({
  name: 'supplyvisibilitycache',
  defaults: {
    commits: []
  }
})
export class SupplyVisibilityCacheState {
  constructor(
    // private supplyVisibilityService: SupplyVisibilityService,

  ) {
  }
}

@State<SupplyVisibilityStateModel>({
  name: 'supplyvisibility',
  defaults: {
    vendorList: '',
    basicParameters: {
      plant: '',
      partNumber: '',
      vendorCode: '',
      records: 0,
      variant: '',
      mmViewID: ''
    },
    partNumberListParameters: {},
    daterangeParameters: {
      dateFrom: '',
      dateTo: ''
    },
    userSettingParameters: { key: '' },
    userSettings: { key: '', data: '' },
    newUserSettings: { key: '', data: '' },
    commits: [],
    cachedReadOnlyFields: [],
    notifications: [],
    notificationsUnreadCount: 0,
    notificationDetailCache: {},
    cachedCommits: undefined,
    cachedCommitsHash: '',
    newCommit: {},
    purchaseOrders: [],
    dummyCommitsHeaders: [],
    selectedDummyCommitHeader: undefined,
    forecast: {
      plant: '',
      partNumber: '',
      vendorCode: '',
      materialManagementViewID: '',
      weeks: undefined,
      days: undefined,
      reviewed: undefined,
      staticvalues: [],
      projectionDetails: [],
      mergeProjections: []
    },
    cachedForecast: undefined,
    // cachedChildrenForecast: null,
    childrenPNInfo: { childrenPNList: [] },
    childrenPNList: [],
    cachedChildrenPNInfo: undefined,
    cachedForecastHash: '',
    forecastWeekRange: {
      startWeek: undefined,
      endWeek: undefined
    },
    materialManagementViews: [],
    svComments: [],
    svPredefinedComments: [],
    svNotes: [],
    svNotesCount: 0,
    buyersPartNumbers: [],
    userAction: EnumSvSidebarSection.None,
    vendorCodes: [],
    commitVendorCode: '',
    commitModuleOn: false,
    commitMandatoryDates: [],
    commitTransactionDetails: [],
    vendorTransactionDetails: [],
    partnumberTransactionDetails: [],
    quotationTransactionDetails: [],
    DefaultDashboardData: { defaultDashboardId: {}, isPlantChanged: false, isLogin: false },
    commitStatus: [],
    additionalFilters: []
  }
})

export class SupplyVisibilityState {

  private activeFetchInfo: SVActiveFetch = { notificationDetailId: undefined, forecast: { currentPnId: '', nextPnId: '' } };
  private forecastSubs?: Subscription;
  private commitsSub?: Subscription;
  forecastsData: { [key: string]: any } = {};
  virtualPnChildList: { [key: string]: any } = {};
  static isForecastDataChanged: boolean = false;

  constructor(
    private commitsService: CommitsService,
    private supplyVisibilityService: SupplyVisibilityService,
    private supplyVisibilityCommentService: SupplyVisibilityCommentService,
    private supplyVisibilityPredefinedCommentService: SupplyVisibilityPredefinedCommentService,
    private supplyVisibilityNotesService: SupplyVisibilityNotesService,
    private supplyVisibilityBuyersPartNumbersService: BuyersPartnumbersListService,
    private dateService: DateService,
    private dialog: MatDialog,
    private store: Store,
    private translate: TranslateService,
    private notification: NotificationService,
  ) {
    this.initNotifications()
  }

  /**
   * Get All Commits
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getCommits(state: SupplyVisibilityStateModel) {
    return state.commits;
  }

  @Selector()
  static getMaterialManagementViews(state: SupplyVisibilityStateModel) {
    return state.materialManagementViews;
  }

  /**
   * Get All Commits
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getCommitTransactionDetails(state: SupplyVisibilityStateModel) {
    return state.commitTransactionDetails;
  }

  @Selector()
  static getVendorTransactionDetails(state: SupplyVisibilityStateModel) {
    return state.vendorTransactionDetails;
  }

  @Selector()
  static getQuotationTransactionDetails(state: SupplyVisibilityStateModel) {
    return state.quotationTransactionDetails;
  }

  @Selector()
  static getPartNumberTransactionDetails(state: SupplyVisibilityStateModel) {
    return state.partnumberTransactionDetails;
  }

  /**
   * Get All Commits
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getCommitFilterAdditions(state: SupplyVisibilityStateModel) {
    return state.commitFilterAdditions;
  }


  /**
   * Get Commit
   * @static
   * @param {string} id
   * @returns
   * @memberof SupplyVisibilityState
   */
  static getCommit(id: string) {
    return createSelector(
      [SupplyVisibilityState],
      (state: SupplyVisibilityStateModel) => {
        const filtredCommit = state.commits.filter(
          data =>
            data.inboundDeliveryNumber !== undefined && data.inboundDeliveryNumber
              .toLocaleLowerCase()
              .indexOf(id.toLocaleLowerCase()) !== -1
        );
        return filtredCommit[0];
      }
    );
  }

  /**
   * Get basic parameters for API calls (PLANT|PARTNUMBER|VEDORCODE)
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getBasicParameters(state: SupplyVisibilityStateModel) {
    return state.basicParameters;
  }

  @Selector()
  static getCommitFilter(state: SupplyVisibilityStateModel) {
    return state.commitFilter;
  }

  /**
   * Get basic parameters for API calls (PLANT|PARTNUMBER|VEDORCODE)
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  // @Selector()
  // static getPartNumberListParameters(state: SupplyVisibilityStateModel) {
  //   return state.partNumberListParameters;
  // }

  @Selector()
  static getPartNumberListParameters(state: SupplyVisibilityStateModel) {
    return (widgetId: string) => {
      try {
        return state.partNumberListParameters[widgetId];
      } catch (error) {
        return [];
      }
    };
  }

  /**
   * Get Date Range parameters for API calls
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getDaterangeParameters(state: SupplyVisibilityStateModel) {
    return state.daterangeParameters;
  }

  /**
   * Selector for all Purchase Orders
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getPurchaseOrders(state: SupplyVisibilityStateModel) {
    return state.purchaseOrders;
  }

  /**
   * Selector for selected Purchase Order
   * @static
   * @param {string} selectedPuchaseOrderNumber
   * @returns
   * @memberof SupplyVisibilityState
   */
  static getPurchaseOrder(selectedPuchaseOrderNumber: string) {
    return createSelector(
      [SupplyVisibilityState],
      (state: SupplyVisibilityStateModel) => {
        const selectedPO = state.purchaseOrders.filter(
          data =>
            data.purchaseOrderNumber
              .toLocaleLowerCase()
              .indexOf(selectedPuchaseOrderNumber.toLocaleLowerCase()) !== -1
        );
        if (selectedPO && selectedPO[0] && selectedPO[0].purchaseOrderItems) {
          return selectedPO[0].purchaseOrderItems.map(POItem => POItem.purchaseOrder_Item);
        }
        return [];
      }
    );
  }

  /**
   * Selector for Forecast parameters
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getForecast(state: SupplyVisibilityStateModel) {
    return state.forecast;
  }

  /**
   * Selector for carriers
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getCommitsCarriers(state: SupplyVisibilityStateModel) {
    return state.cachedCommitsCarriers;
  }

  /**
   * Seletor for vendorsName
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getVendorsName(state: SupplyVisibilityStateModel) {
    return state.cachedVendorName;
  }

  /**
  * Selector for countries
  * @static
  * @param {SupplyVisibilityStateModel} state
  * @returns
  * @memberof SupplyVisibilityState
  */
  @Selector()
  static getCommitsCountries(state: SupplyVisibilityStateModel) {
    return state.cachedCommitsCountries;
  }

  /**
 * Selector for Transportation Types
 * @static
 * @param {SupplyVisibilityStateModel} state
 * @returns
 * @memberof SupplyVisibilityState
 */
  @Selector()
  static getCommitsTransportType(state: SupplyVisibilityStateModel) {
    return state.cachedCommitsTransportType;
  }

  /**
 * Selector for reasons
 * @static
 * @param {SupplyVisibilityStateModel} state
 * @returns
 * @memberof SupplyVisibilityState
 */
  @Selector()
  static getCommitsReasons(state: SupplyVisibilityStateModel) {
    return state.cachedCommitsReasons;
  }

  /**
 * Selector for getting read only fields
 * @static
 * @param {SupplyVisibilityStateModel} state
 * @returns
 * @memberof SupplyVisibilityState
 */
  @Selector()
  static getReadOnlyFields(state: SupplyVisibilityStateModel) {
    return state.cachedReadOnlyFields;
  }

  /**
   * Selector for Vendor codes
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getVendorCodes(state: SupplyVisibilityStateModel) {
    return state.vendorCodes;
  }

  /**
   * Selector for Forecast parameters
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getDummyCommitsHeaders(state: SupplyVisibilityStateModel) {
    return state.dummyCommitsHeaders;
  }

  /**
   * Selector for Selected Dummy Commits Header
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns DummyCommitHeader
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getSelectedDummyCommitsHeader(state: SupplyVisibilityStateModel) {
    return state.selectedDummyCommitHeader;
  }

  /**
   * Selector for Forecast table
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getForecastDetailsFiltered(state: SupplyVisibilityStateModel) {
    return state.forecast.projectionDetails
      .filter(
        (item: ForecastDetail) => item.week >= (state.forecastWeekRange.startWeek ?? 0)
      )
      .filter(
        (item: ForecastDetail) => item.week <= (state.forecastWeekRange.endWeek ?? 0)
      );
  }

  /**
   * Selector for Forecast week range
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getForecastWeekRange(state: SupplyVisibilityStateModel) {
    return state.forecastWeekRange;
  }

  @Selector()
  static getSVComments(state: SupplyVisibilityStateModel) {
    return state.svComments;
  }

  @Selector()
  static getSVPredefinedComments(state: SupplyVisibilityStateModel) {
    return state.svPredefinedComments;
  }

  @Selector()
  static getSVNotes(state: SupplyVisibilityStateModel) {
    return state.svNotes;
  }

  @Selector()
  static getSVNotesCount(state: SupplyVisibilityStateModel) {
    return state.svNotesCount;
  }

  @Selector()
  static getUserAction(state: SupplyVisibilityStateModel) {
    return state.userAction;
  }

  @Selector()
  static getBuyersPartNumberList(state: SupplyVisibilityStateModel) {
    return state.buyersPartNumbers;
  }

  @Selector()
  static getChildrenPNList(state: SupplyVisibilityStateModel) {
    return state.childrenPNList;
  }

  @Selector()
  static getChildrenPNInfo(state: SupplyVisibilityStateModel) {
    return state.childrenPNInfo;
  }

  @Selector()
  static getCachedChildrenPNList(state: SupplyVisibilityStateModel) {
    return state.cachedChildrenPNInfo;
  }

  @Selector()
  static getBuyersPartNumberListFilterByArg(state: SupplyVisibilityStateModel) {
    return (vendorsPartNumbers: VendorParametersFilter) => {
      let data = state.buyersPartNumbers;
      if (vendorsPartNumbers) {
        if (
          vendorsPartNumbers.partNumbers &&
          vendorsPartNumbers.partNumbers.length > 0
        ) {
          data = data.filter(
            c => vendorsPartNumbers.partNumbers.indexOf(c.partNo) >= 0
          );
        }
        if (
          vendorsPartNumbers.vendors &&
          vendorsPartNumbers.vendors.length > 0
        ) {
          data = data.filter(
            c => vendorsPartNumbers.vendors.indexOf(c.vendorCode) >= 0
          );
        }
      }
      return data;
    };
  }

  @Selector()
  static getDefaultDashboard(state: SupplyVisibilityStateModel) {
    return state.DefaultDashboardData;
  }

  @Selector()
  static getPlantSpecificLeadDate(state: SupplyVisibilityStateModel) {
    return state.commitMandatoryDates;
  }
  /**
   * Set Commits from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommits)
  async setCommits({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {
    const state = getState();
    const parameters: BasicParameters = state.basicParameters;
    const daterangeParameters = state.daterangeParameters;

    return await this.supplyVisibilityService
      .getCommits(parameters, daterangeParameters)
      .subscribe({
        next: (response: Commit[]) => {
          if (response) {
            patchState({ commits: [...response] });
            dispatch(new SetCommitSuccess());
          }
        },
        error: (error) => {
          dispatch(new SetCommitsError(error));
        }
      }
      );
  }

  /**
   * Set Commit with Dummy Error
   * @memberof SupplyVisibilityState
   */
  @Action(CacheCommitsWithDummyError)
  cacheCommitsWithDummyError() { }

  /**
   * Set Commit with Dummy Success
   * @memberof SupplyVisibilityState
   */
  @Action(CacheCommitWithDummySuccess)
  cacheCommitWithDummySuccess() { }

  /**
   * Set Commits with Dummy commits from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(CacheCommitsWithDummy)
  async cacheCommitsWithDummy({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>, { partNumber }: { partNumber: any }) {
    const state = getState();
    const parameters: BasicParameters = { ...state.basicParameters };
    parameters.partNumber = partNumber.partNumber;
    parameters.vendorCode = partNumber.vendorCode;
    const daterangeParameters = state.daterangeParameters;
    const dummyCommitHeader = state.selectedDummyCommitHeader;
    const commitStatus = state.commitStatus;
    const filterParams = state.additionalFilters;

    // create hash for parameters
    const parametersForHash = [parameters, daterangeParameters, dummyCommitHeader];
    const parametersHash = objectHash(parametersForHash);
    console.log('parametersHash', parametersHash);

    return this.supplyVisibilityService
      .getCommitsWithDummy(parameters, daterangeParameters, dummyCommitHeader, filterParams, commitStatus)
      .subscribe(
        (response: Commit[]) => {
          let modifiedResponse: any[] = [];
          response.forEach(commit => {
            let commitWithModifiedDates = this.dateService.commitHistoryTableDates({ ...commit });
            if (commitWithModifiedDates.isModifyByDummy) {
              let dummyCommit = this.dateService.commitHistoryTableDates(commitWithModifiedDates.dummyCommit); //TODO: set DummyCommitDetail to commit DTO jaimin
              dummyCommit.inboundDeliveryNumber = '*' + (dummyCommit.inboundDeliveryNumber ? dummyCommit.inboundDeliveryNumber : '');
              modifiedResponse.push(dummyCommit);
            } else {
              modifiedResponse.push(commitWithModifiedDates);
            }
          });
          if (response) {
            if (!this.isValidPn(getState(), partNumber.partNumber, partNumber.vendorCode)) { return }
            console.log('caching commits for PN ' + parameters.partNumber + ' and vendor ' + parameters.vendorCode, modifiedResponse);
            patchState({ cachedCommits: [...modifiedResponse], cachedCommitsHash: parametersHash });
            dispatch(new CacheCommitWithDummySuccess());
          }
        },
        (error: any) => {
          dispatch(new CacheCommitsWithDummyError(error));
        }
      );
  }

  /**
   * Set Commits with Dummy commits from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitsWithDummy)
  async setCommitsWithDummy(
    { getState, patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    action: SetCommitsWithDummy
  ): Promise<void> {
    const { isRefreshCommit } = action;
    const state = getState();

    if (state.commitModuleOn) {
      return; // do nothing as we are in commit module
    }

    const parameters: BasicParameters = state.basicParameters;
    const daterangeParameters = state.daterangeParameters;
    const dummyCommitHeader = state.selectedDummyCommitHeader;
    const commitStatus = state.commitStatus;
    const filterParams = state.additionalFilters;

    const parametersForHash = [parameters, daterangeParameters, dummyCommitHeader];
    const parametersHash = objectHash(parametersForHash);

    console.log('parametersHash SetCommitsWithDummy', parametersHash);

    // Check if we have cached commit
    const cachedCommits = state.cachedCommits;
    const cachedCommitsHash = state.cachedCommitsHash;

    if (!isRefreshCommit && cachedCommits && parametersHash === cachedCommitsHash) {
      if (!this.isValidPn(getState(), parameters.partNumber, parameters.vendorCode ?? '')) {
        return;
      }

      console.log('Returning cached commits...');
      patchState({ commits: [...cachedCommits], cachedCommits: undefined, cachedCommitsHash: '' });

      setTimeout(() => {
        dispatch(new SetCommitWithDummySuccess());
      }, 100);
    } else {
      if (this.commitsSub) {
        this.commitsSub.unsubscribe();
      }

      console.log('Fetching commits...');
      this.commitsSub = this.supplyVisibilityService
        .getCommitsWithDummy(parameters, daterangeParameters, dummyCommitHeader, filterParams, commitStatus)
        .pipe(debounceTime(500))
        .subscribe(
          (response: Commit[]) => {
            if (response) {
              let result = this.modifyCommitTransaction(response, getState());

              if (result) {
                patchState({ commitTransactionDetails: result });
              }
            }

            let modifiedResponse: any[] = [];
            response.forEach(commit => {
              let commitWithModifiedDates = this.dateService.commitHistoryTableDates({ ...commit });

              if (commitWithModifiedDates.isModifyByDummy === true) {
                let dummyCommit = this.dateService.commitHistoryTableDates(commitWithModifiedDates.dummyCommit);
                dummyCommit.inboundDeliveryNumber = '*' + (dummyCommit.inboundDeliveryNumber ?? '');
                modifiedResponse.push(dummyCommit);
              } else {
                modifiedResponse.push(commitWithModifiedDates);
              }
            });

            if (response) {
              if (!this.isValidPn(getState(), parameters.partNumber, parameters.vendorCode ?? '')) {
                return;
              }

              patchState({ commits: [...modifiedResponse] });
              dispatch(new SetCommitWithDummySuccess());
            }
          },
          (error: any) => {
            dispatch(new SetCommitsWithDummyError(error));
          }
        );
    }
  }


  /**
  * Set Commits with Dummy commits from API
  * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
  * @returns
  * @memberof SupplyVisibilityState
  */
  @Action(SetCommitsWithFilter)
  async setCommitsWithFilter({
    patchState,
    getState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>,
    { filter }: any
  ) {
    return this.commitsService.getCommitsForBatchEdit(filter).subscribe(
      (response: Commit[]) => {
        let modifiedResponse: any[] = [];

        if (response) {

          let result = this.modifyCommitTransaction(response, getState())

          if (result) {
            patchState({ commitTransactionDetails: result })
          }

          response.forEach(async commit => {
            let commitWithModifiedDates = this.dateService.commitHistoryTableDates({ ...commit });
            modifiedResponse.push(commitWithModifiedDates);
          })
          patchState({
            commits: modifiedResponse,
            commitFilter: filter
          });

          dispatch(new SetCommitsWithFilterSuccess());
        }
      },
      (error: any) => {
        patchState({
          commitFilter: null
        });
        dispatch(new SetCommitsWithFilterError(error));
      }
    );


  }

  /**
   * Set Commit with Dummy Error
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitsWithDummyError)
  setCommitsWithDummyError() { }

  /**
   * Set Commit with Dummy Success
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitWithDummySuccess)
  setCommitWithDummySuccess() { }

  /**
   * Get dummy commits headers from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(GetDummyCommitHeaders)
  async getDummyCommitHeader({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>,
    { filter }: GetDummyCommitHeaders
  ) {
    if (filter) {
      return this.supplyVisibilityService
        .getDummyCommitHeaders(filter)
        .subscribe(
          (response: DummyCommitHeader[]) => {
            if (response) {
              patchState({ dummyCommitsHeaders: [...response] });
              dispatch(new GetDummyCommitHeadersSuccess());
            }
          },
          (error: any) => {
            dispatch(new GetDummyCommitHeadersError(error));
          }
        );
    }
    return undefined;

  }

  /**
   * Set Commit with Dummy Error
   * @memberof SupplyVisibilityState
   */
  @Action(GetDummyCommitHeadersError)
  getDummyCommitHeadersError() { }

  /**
   * Set Commit with Dummy Success
   * @memberof SupplyVisibilityState
   */
  @Action(GetDummyCommitHeadersSuccess)
  getDummyCommitHeadersSuccess() { }

  /**
   * Set Commit Error
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitsError)
  setCommitsError() { }

  /**
   * Set Commit Success
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitSuccess)
  setCommitSuccess() { }

  /**
   * Set Commits with Dummy commits from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(GetNotifications)
  getNotifications({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {
    const state = getState();
    return this.supplyVisibilityService
      .getNotificationsList()
      .subscribe(
        (response: any) => {
          response = response ? response : { result: [] };
          patchState({ notifications: response.result });
          dispatch(new GetNotificationsSuccess(response.result));

        },
        (error: any) => {
          dispatch(new GetNotificationsError(error));
        }
      );
  }
  @Action(GetNotificationsUnreadCount)
  getNotificationsUnreadCount({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {
    const state = getState();

    return this.supplyVisibilityService
      .getNotificationsUnreadCount()
      .subscribe(
        (response: any) => {
          response = response ? response : { count: 0 }
          patchState({ notificationsUnreadCount: response.count });
          dispatch(new GetNotificationsUnreadCountSuccess(response.count));
        }
      );
  }
  @Action(GetNotificationDetails)
  getNotificationDetails({
    dispatch, getState, patchState
  }: StateContext<SupplyVisibilityStateModel>,
    { id }: { id: string }) {

    this.activeFetchInfo.notificationDetailId = id;
    const state = getState();
    if (state.notificationDetailCache[id]) {
      return dispatch(new GetNotificationDetailsSuccess(state.notificationDetailCache[id]));
    }
    return this.supplyVisibilityService
      .getNotificationDetail(id)
      .subscribe(
        (response: any) => {

          const notificationDetail = response;
          const re = /,/g;
          notificationDetail.message = notificationDetail.message.replace(re, "<br>")
          patchState({ notificationDetailCache: { [id]: notificationDetail, ...state.notificationDetailCache } })

          if (this.activeFetchInfo.notificationDetailId == id) {

            dispatch(new GetNotificationDetailsSuccess(notificationDetail));

            if (notificationDetail.isRead === false) {
              this.supplyVisibilityService.setNotificationAsRead(id).subscribe(() => {
                const index = state.notifications.findIndex(data => data.id == id);
                const notifications = state.notifications;
                notifications[index].isRead = true;

                patchState({
                  notifications: notifications,
                })
                if (this.activeFetchInfo.notificationDetailId == id) { dispatch(new GetNotificationsUnreadCount()); }

              });
            } else {
              if (this.activeFetchInfo.notificationDetailId == id) { dispatch(new GetNotificationsUnreadCount()); }
            }
          }


        },
        (error: any) => {
          dispatch(new GetNotificationDetailsError());
        }
      );
  }


  @Action(SetAllNotificationsAsRead)
  setAllNotificationAsRead({
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {

    const errorMsg = 'Unable to mark all as read';
    return this.supplyVisibilityService
      .setAllNotificationsAsRead()
      .subscribe((response: boolean) => {
        dispatch(new GetNotifications());
        dispatch(new GetNotificationsUnreadCount());
        if (!response) {
          this.notification.showError(errorMsg);
        }
      },
        (error: any) => {
          this.notification.showError(errorMsg);
        }
      );
  }


  /**
   * Set Commits from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetPnReviewed)
  async setPnReviewed({
    getState,
    setState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>,
    { pnReviewed }: { pnReviewed: PnReviewed }) {
    const state = getState();
    const forecast = state.forecast;
    return this.supplyVisibilityService
      .setPnReviewed(pnReviewed)
      .subscribe(
        (response: Reviewed) => {
          if (response) {
            dispatch(new SetPnReviewedSuccess(pnReviewed));
          }
        },
        (error: any) => {
          dispatch(new SetPnReviewedError(error, pnReviewed));
        }
      );
  }

  /**
   * Remove flag from part number
   * @param {StateContext<SupplyVisibilityStateModel>}
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(DeletePnFlags)
  async deletePnFlag({
    dispatch
  }: StateContext<SupplyVisibilityStateModel>,
    { pnReviewed, flag }: DeletePnFlags) {
    return this.supplyVisibilityService.deletePnFlags(pnReviewed, flag).subscribe((e: any) => {
      dispatch(new DeletePnFlagsSuccess(pnReviewed))
      // IMPLEMENT logic after deleting flag
    },
      (error: any) => {
        // console.log('Delete Pn Flag Failed!', error);
        dispatch(new DeletePnFlagsError(error))
      }

    )
  }


  /**
   * Add New Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {AddCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(AddCommit)
  addCommit(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: AddCommit
  ) {
    const state = getState();
    const {
      plant,
      partNumber,
      mmViewID
    }: BasicParameters = state.basicParameters;
    let {
      vendorCode,
    }: BasicParameters = state.basicParameters;

    if (commit) {
      // when All vendors is selected use vendor chosen in commit dialog
      if (!vendorCode || vendorCode == '') {
        vendorCode = state.commitVendorCode;
      }
      const addCommit: NewCommit = {
        ...commit,
        plant,
        partNumber,
        vendorCode,
        mmViewID,
      };

      if (commit.chooseVendor) {
        addCommit.vendorCode = commit.chooseVendor;
      }
      addCommit.partNumber = addCommit.partNumber.toUpperCase()
      addCommit.invoiceNumber = addCommit.invoiceNumber || "NULL INVOICE";

      // fields not present in commit form
      // addCommit.manufacturer = "";
      // addCommit.countryOfOrigin = "";
      // addCommit.forwarder = "";
      // addCommit.expressFlag = "";
      // addCommit.thirdPartyPaid = "";
      // addCommit.typeOfTransportation = "";
      // addCommit.reason = 0;
      // addCommit.apsRelevant = "Y";

      return this.supplyVisibilityService.addCommit(addCommit).pipe(
        tap((commit: Commit) => {
          if (commit) {
            SupplyVisibilityState.isForecastDataChanged = false;
            dispatch(new AddCommitSuccess());
            dispatch(new AddCommitNotify(commit));
            if (!state.commitModuleOn) {
              dispatch(new SetCommitsWithDummy());
            }
          }
        }, error => {
          dispatch(new AddCommitError(error));
        })
      );
    }

    return undefined;
  }


  /**
   * Add New Dummy Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {AddDummyCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(AddDummyCommit)
  addDummyCommit(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: AddDummyCommit
  ) {
    const state = getState();
    let {
      partNumber,
      vendorCode,
    }: BasicParameters = state.basicParameters;

    if (commit) {
      let addDummyCommit: DummyCommitDetail;
      if (vendorCode) {
        addDummyCommit = {
          ...commit,
          partNumber,
          vendorCode
        };
      } else {
        addDummyCommit = {
          ...commit,
          partNumber
        };
      }
      // TODO - Temporary solution (no data from backend)
      addDummyCommit.asn = 0;
      if (commit.chooseVendor) {
        addDummyCommit.vendorCode = commit.chooseVendor;
      }
      return this.supplyVisibilityService.addDummyCommit(addDummyCommit).pipe(
        tap((commit: Commit) => {
          if (commit) {
            if (!state.commitModuleOn) dispatch(new SetCommitsWithDummy());
            dispatch(new AddDummyCommitSuccess());
          }
        }, error => {
          dispatch(new AddDummyCommitError(error));
        })
      );
    }
    return undefined;

  }
  /**
   * Add Dummy Commit Error
   * @memberof SupplyVisibilityState
   */
  @Action(AddDummyCommitError)
  addDummyCommitError() { }

  /**
   * Add Dummy Commit Success
   * @memberof SupplyVisibilityState
   */
  @Action(AddDummyCommitSuccess)
  addDummyCommitSuccess() { }

  /**
   * Add New Dummy Commit header
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {DummyCommitHeader} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(AddDummyCommitHeader)
  addDummyCommitHeader(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit, filter }: AddDummyCommitHeader
  ) {

    if (commit) {
      return this.supplyVisibilityService.addDummyCommitHeader(commit).subscribe(
        (res: any) => {
          dispatch(new AddDummyCommitHeaderSuccess());
          dispatch(new GetDummyCommitHeaders(filter));
          dispatch(new SetDummyCommitHeader(undefined));
        },
        (error: any) => {
          dispatch(new AddDummyCommitHeaderError(error));
        }
      );
    }
    return undefined;
  }
  /**
   * Update Dummy Commit Header Error
   * @memberof SupplyVisibilityState
   */
  @Action(UpdateDummyCommitHeaderError)
  updateDummyCommitHeaderError() { }

  /**
   * Update Dummy Commit Header Success
   * @memberof SupplyVisibilityState
   */
  @Action(UpdateDummyCommitHeaderSuccess)
  updateDummyCommitHeaderSuccess() { }

  /**
   * Update Dummy Commit header
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {DummyCommitHeader} { header }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(UpdateDummyCommitHeader)
  updateDummyCommitHeader(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { header, filter }: UpdateDummyCommitHeader
  ) {

    if (header) {
      return this.supplyVisibilityService.updateDummyCommitHeader(header).subscribe(
        (res: any) => {
          dispatch(new AddDummyCommitHeaderSuccess());
          dispatch(new GetDummyCommitHeaders(filter));
          dispatch(new SetDummyCommitHeader(res));
        },
        (error: any) => {
          dispatch(new AddDummyCommitHeaderError(error));
        }
      );
    }
    return undefined;

  }
  /**
   * Delete Dummy Commit Header Error
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommitHeaderError)
  deleteDummyCommitHeaderError() { }

  /**
   * Delete Dummy Commit Header Success
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommitHeaderSuccess)
  deleteDummyCommitHeaderSuccess() { }

  /**
   * Delete Dummy Commit header
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {DummyCommitHeader} { header }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommitHeader)
  async deleteDummyCommitHeader(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { header, filter }: DeleteDummyCommitHeader
  ) {

    if (header) {
      return this.supplyVisibilityService.deleteDummyCommitHeader(header).subscribe(
        (res: any) => {
          dispatch(new DeleteDummyCommitHeaderSuccess());
          dispatch(new GetDummyCommitHeaders(filter));
          dispatch(new SetDummyCommitHeader(undefined));
        },
        (error: any) => {
          dispatch(new DeleteDummyCommitHeaderError(error));
        }
      );
    }
    return undefined;

  }
  /**
   * Delete Dummy Commit Error
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommitError)
  deleteDummyCommitError() { }

  /**
   * Delete Dummy Commit Success
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommitSuccess)
  deleteDummyCommitSuccess() { }

  /**
   * Delete Dummy Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {DummyCommitDetail} { header }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteDummyCommit)
  async deleteDummyCommit(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { dummyCommitDetail }: DeleteDummyCommit
  ) {

    if (dummyCommitDetail) {
      return this.supplyVisibilityService.deleteDummyCommit(dummyCommitDetail).subscribe(
        (res: any) => {
          dispatch(new DeleteDummyCommitSuccess());
          dispatch(new SetCommitsWithDummy());
        },
        (error: any) => {
          dispatch(new DeleteDummyCommitError(error));
        }
      );
    }
    return undefined;

  }

  //#region user setting

  /**
   * Set basis user setting key
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetUserSettingParameters} { parameters }
   * @memberof SupplyVisibilityState
   */
  @Action(SetUserSettingParameters)
  setUserSettingParameters(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { parameters }: SetUserSettingParameters
  ) {
    patchState({ userSettingParameters: parameters });
  }

  /**
   * Get All UserSettings
   * @static
   * @param {SupplyVisibilityStateModel} state
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Selector()
  static getUserSettings(state: SupplyVisibilityStateModel) {
    return state.userSettings;
  }
  @Selector()
  static getNotificationsList(state: SupplyVisibilityStateModel) {
    return state.notifications;
  }
  @Selector()
  static getNotificationsUnreadCount(state: SupplyVisibilityStateModel) {
    return state.notificationsUnreadCount;
  }

  /**
   * Set UserSettings from API
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetUserSettings)
  async setUserSettings({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {
    const state = getState();
    const parameters = state.userSettingParameters;

    return await this.supplyVisibilityService
      .getUserSettings(parameters.key)
      .subscribe(
        (response: UserSettings) => {
          if (response) {
            patchState({ userSettings: response });
            dispatch(new SetUserSettingsSuccess());
          }
        },
        (error: any) => {
          dispatch(new SetUserSettingsError(error));
        }
      );
  }

  /**
   * Set UserSetting Error
   * @memberof SupplyVisibilityState
   */
  @Action(SetUserSettingsError)
  setUserSettingsError() { }

  /**
   * Set UserSetting Success
   * @memberof SupplyVisibilityState
   */
  @Action(SetUserSettingsSuccess)
  setUserSettingSuccess() { }

  /**
   * Add New UserSetting
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {AddUserSettings} { userSetting }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(AddUserSettings)
  addUserSetting(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { userSettings, updateIdInData }: AddUserSettings
  ) {
    const state = getState();

    if (userSettings) {
      const addUserSetting: NewUserSettings = userSettings;

      return this.supplyVisibilityService
        .addUserSettings(addUserSetting, updateIdInData)
        .subscribe(
          (userSetting: UserSettings) => {
            if (userSetting) {
              const userSettingsData = userSettings;
              patchState({ userSettings: userSettingsData });
              dispatch(new AddUserSettingsSuccess());
            }
          },
          (error: any) => {
            dispatch(new AddUserSettingsError(error));
          }
        );
    }
    return undefined;

  }

  /**
   * Edit New UserSetting
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {EditUserSettings} { userSetting }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(EditUserSettings)
  editUserSetting(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { userSettings, isNotificationRequired }: EditUserSettings) {
    const state = getState();

    if (userSettings) {
      const editUserSetting: NewUserSettings = userSettings;
      const widgetId = userSettings.key;

      return this.supplyVisibilityService
        .updateUserSettings(editUserSetting)
        .subscribe(
          (userSetting: UserSettings) => {
            // right now no response except successcode is comming from the server so had to comment out
            // if (userSetting) {
            //   const userSettingsData = userSettings;
            //   patchState({ userSettings: userSettingsData });
            //   dispatch(new EditUserSettingsSuccess());
            // }
            patchState({ newUserSettings: userSettings });
            dispatch(new EditUserSettingsSuccess(isNotificationRequired));
            dispatch(new SetPanelCacheSuccess(widgetId));
          },
          (error: any) => {
            dispatch(new EditUserSettingsError(error));
          }
        );
    }
    return undefined;

  }
  @Action(DeleteUserSettings)
  DeleteUserSettings(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { key }: DeleteUserSettings
  ) {
    if (!key) return null;
    this.supplyVisibilityService.deleteUserSettings(key).subscribe((res: any) => {
      return undefined;

      // const result = userSettings.filter(q => q.id !== res.id);
      // patchState({
      //   userSettings: result
      // });
    });
    return undefined;

  }

  //#endregion

  /**
   * Add Commit Error
   * @memberof SupplyVisibilityState
   */
  @Action(AddCommitError)
  addCommitError() { }

  /**
   * Add Commit Success
   * @memberof SupplyVisibilityState
   */
  @Action(AddCommitSuccess)
  addCommitSuccess() { }

  /**
   * Add Commit Notify
   * @memberof SupplyVisibilityState
   */
  @Action(AddCommitNotify)
  addCommitNotify(commit: any) { }



  /**
   * Edit existing Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, dispatch }
   * @param {UpdateCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(EditCommit)
  editCommit(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: EditCommit
  ) {
    const state = getState();
    const {
      plant,
      partNumber,
      vendorCode,
      mmViewID
    }: BasicParameters = state.basicParameters;

    let updateCommit: NewCommit = {
      ...commit,
      plant,
      partNumber,
      vendorCode,
      mmViewID,
    };

    if (commit.chooseVendor) {
      updateCommit.vendorCode = commit.chooseVendor;
    }

    if (!updateCommit.status) {
      updateCommit.status = '';
      console.log('adding status');
    }
    if (!updateCommit.order) {
      updateCommit.order = '';
      console.log('adding order');
    }
    if (!updateCommit.parentID) {
      updateCommit.parentID = '';
      console.log('adding parentID');
    }
    if (!updateCommit.countryOfOrigin) {
      updateCommit.countryOfOrigin = '';
    }
    if (!updateCommit.manufacturer) {
      updateCommit.manufacturer = '';
    }

    return this.supplyVisibilityService.updateCommit(updateCommit).pipe(
      tap((commit: Commit) => {
        if (commit) {
          SupplyVisibilityState.isForecastDataChanged = false;
          //For N type commit, for commit whose PO number is changed and for remerged commit (type edit is used)
          if (updateCommit.status == 'N' || updateCommit['WithChangePurchaseOrderNumber'] || updateCommit['withRemerge']) {
            let modifiedCommitTransactions = state.commitTransactionDetails.filter(commit => commit.type != EnumCommitType.EDIT)
            let commitTransaction: CommitTransactionDetails = { id: commit.inboundDeliveryNumber ? commit.inboundDeliveryNumber : '', data: commit, datagridInfo: { index: 0, isPageNumberNeeded: (updateCommit['WithChangePurchaseOrderNumber'] || updateCommit['withRemerge']) }, type: EnumCommitType.EDIT, isCache: (updateCommit['WithChangePurchaseOrderNumber'] || updateCommit['withRemerge']) ? false : true }
            modifiedCommitTransactions.push(commitTransaction)
            dispatch(new PatchCommitTransactionDetails(modifiedCommitTransactions))
          }
          else {
            state.commitTransactionDetails.map(stateCommit => {
              if (stateCommit.id == commit.inboundDeliveryNumber) {
                stateCommit.data = commit;
              }
            })
          }

          dispatch(new EditCommitSuccess(commit));
        }
      }, error => {
        dispatch(new EditCommitError(error));
      })
    );
  }
  /**
   * Edit existing Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, dispatch }
   * @param {DeleteCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(DeleteCommit)
  deleteCommit(
    {
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit, baseModule, lowerTriggerUrl }: DeleteCommit
  ) {

    lowerTriggerUrl = !lowerTriggerUrl ? "" : lowerTriggerUrl;
    if (baseModule == Helper.COMMIT_MODULE) {

      this.commitsService.deleteCommit(commit, lowerTriggerUrl).subscribe(
        (commit: any) => {
          dispatch(new DeleteCommitSuccess());
        }, (error: any) => {
          dispatch(new DeleteCommitError(error));
        }
      );
    } else {
      this.commitsService.deleteCommit(commit, lowerTriggerUrl).subscribe(
        (commit: any) => {
          SupplyVisibilityState.isForecastDataChanged = false;
          dispatch(new DeleteCommitSuccess());
          dispatch(new SetCommitsWithDummy());
        },
        (error: any) => {
          dispatch(new DeleteCommitError(error));
          dispatch(new SetCommitsWithDummy());
        }
      );
    }
  }


  /**
   * Cancel Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, dispatch }
   * @param {CancelCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(CancelCommit)
  cancelCommit(
    {
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: CancelCommit
  ) {
    this.supplyVisibilityService.cancelCommit(commit).subscribe(data => {
      if (data) {
        dispatch(new CancelCommitSuccess());
      }
    },
      (error) => {
        dispatch(new CancelCommitError(error));
      }
    )
  }

  /**
 * Delete PLO
 * @param {StateContext<SupplyVisibilityStateModel>} { getState, dispatch }
 * @param {DeletePLO} { commit }
 * @returns
 * @memberof SupplyVisibilityState
 */
  @Action(DeletePLO)
  deletePLO(
    {
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: DeletePLO
  ) {
    this.supplyVisibilityService.deletePLO(commit).subscribe(data => {
      if (data) {
        dispatch(new DeletePLOSuccess());
      }
    },
      (error) => {
        dispatch(new DeletePLOError(error));
      }
    )
  }



  /**
   * Edit existing DUmmy Commit
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, dispatch }
   * @param {EditDummyCommit} { commit }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(EditDummyCommit)
  editDummyCommit(
    {
      getState,
      patchState,
      dispatch
    }: StateContext<SupplyVisibilityStateModel>,
    { commit }: EditDummyCommit
  ) {
    const state = getState();
    const {
      partNumber,
      vendorCode,
    }: BasicParameters = state.basicParameters;

    let updateDummyCommit: DummyCommitDetail;
    if (vendorCode) {
      updateDummyCommit = {
        ...commit,
        partNumber,
        vendorCode
      };
    } else {
      updateDummyCommit = {
        ...commit,
        partNumber
      };
    }
    // TODO - Temporary solution (no data from backend)
    updateDummyCommit.asn = 0;

    return this.supplyVisibilityService.updateDummyCommit(updateDummyCommit).pipe(
      tap((commit: Commit) => {
        if (commit) {
          dispatch(new EditDummyCommitSuccess());
          dispatch(new SetCommitsWithDummy());
        }
      }, error => {
        dispatch(new EditDummyCommitError(error));
      })
    );
  }

  /**
   * Get Purchase Orders from API
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetPurchaseOrders} { parameters }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetPurchaseOrders)
  async setPurchaseOrders({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>) {
    const state = getState();
    const parameters: BasicParameters = state.basicParameters;
    let poParameters = parameters;

    if (parameters.vendorCode === undefined || parameters.vendorCode === '') {
      poParameters = { ...parameters, vendorCode: state.commitVendorCode, plant: parameters.plant || '' };
    }
    return await this.supplyVisibilityService
      .getPurchaseOrders(poParameters)
      .subscribe((response: any) => {
        patchState({ purchaseOrders: [...response] });
        dispatch(new SetPurchaseOrdersSuccess());
      });
  }

  /**
 * Get Purchase Orders from API
 * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
 * @param {SetPurchaseOrdersForCM} { parameters }
 * @returns
 * @memberof SupplyVisibilityState
 */
  @Action(SetPurchaseOrdersForCM)
  async setPurchaseOrdersForCM({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>
    , { parameters }: SetPurchaseOrdersForCM) {
    const state = getState();
    let poParameters = parameters;

    if (parameters?.vendorCode === undefined || parameters.vendorCode === '') {
      poParameters = { ...parameters, vendorCode: state.commitVendorCode, plant: parameters?.plant || '', partNumber: parameters?.partNumber || '' };
    }
    if (poParameters) {
      return await this.supplyVisibilityService
        .getPurchaseOrders(poParameters)
        .subscribe((response: PurchaseOrders[]) => {
          patchState({ purchaseOrders: [...response] });
          dispatch(new SetPurchaseOrdersSuccess());
        });
    }
    return undefined;

  }
  /**
   * Set basis URL parameters (PLANT|PARTNUMBER|VEDORCODE)
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetBasicParameters} { parameters }
   * @memberof SupplyVisibilityState
   */
  @Action(SetBasicParameters)
  setBasicParameters(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { parameters }: SetBasicParameters
  ) {
    patchState({
      basicParameters: {
        plant: parameters.plant,
        partNumber: parameters.partNumber,
        vendorCode: parameters.vendorCode,
        records: parameters.records,
        variant: parameters.variant,
        mmViewID: parameters.mmViewID
      }
    });
  }
  /**
   * Set basis URL parameters (PLANT|PARTNUMBER|VEDORCODE)
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetPartNumberListParameters} { parameters }
   * @memberof SupplyVisibilityState
   */
  @Action(SetPartNumberListParameters)
  setPartNumberListParameters(
    { patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { widgetId, pnList }: SetPartNumberListParameters,


  ) {
    if (pnList && pnList.length > 0) {
      patchState({
        partNumberListParameters: { [widgetId]: pnList }
      });
      dispatch(new SetPartNumberListParametersSuccess(widgetId, pnList));
    }
  }
  @Action(SetActiveVendor)
  setActiveVendor(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { vendor }: SetActiveVendor
  ) {
    const state = getState();
    const parameters: BasicParameters = state.basicParameters;

    patchState({
      basicParameters: {
        plant: parameters.plant,
        partNumber: parameters.partNumber,
        vendorCode: vendor,
        weeks: parameters.weeks,
        mmViewID: parameters.mmViewID
      }
    });
  }

  /**
   * Set Date Range parameters from API
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetDateRangeParameters} { parameters }
   * @memberof SupplyVisibilityState
   */
  @Action(SetDateRangeParameters)
  setDateRangeParameters(
    { patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { parameters }: SetDateRangeParameters
  ) {
    let dateRange: DateRangeParameters;

    if (!parameters) {
      dateRange = this.supplyVisibilityService.getDateRange();
    } else {
      dateRange = parameters;
    }
    const tDeliveryDateFrom = this.supplyVisibilityService.convertDate(
      dateRange,
      'dateFrom'
    );
    const tDeliveryDateTo = this.supplyVisibilityService.convertDate(
      dateRange,
      'dateTo'
    );
    const tDateRange = {
      dateFrom: tDeliveryDateFrom,
      dateTo: tDeliveryDateTo
    }
    patchState({
      daterangeParameters: tDateRange
    });
    dispatch(new SetDateRangeParametersSuccess(tDateRange));
    // dispatch(new SetCommitsWithDummy());
  }

  /**
   * Set Date Range parameters from API
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetDummyCommitHeader} { header }
   * @memberof SupplyVisibilityState
   */
  @Action(SetDummyCommitHeader)
  setDummyCommitHeader(
    { patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { header }: SetDummyCommitHeader
  ) {

    patchState({
      selectedDummyCommitHeader: header
    });
  }

  /**
   * Set Vendor Codes
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param partNumbers
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetVendorCodes)
  setVendorCodes({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>,
    { partNumbers }: SetVendorCodes) {
    const state = getState();

    return this.supplyVisibilityService.getVendorCodesList(partNumbers).pipe(
      tap((codes: VendorCode[]) => {
        patchState({
          vendorCodes: codes
        });
        dispatch(new SetVendorCodesSuccess());
      }, error => {
        dispatch(new SetVendorCodesError(error));
      })
    );
  }

  /**
   * Set selected vendor code for new commit
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetCommitVendorCode} { vendorCode }
   * @memberof SupplyVisibilityState
   */
  @Action(SetCommitVendorCode)
  setCommitVendorCode(
    { patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { vendorCode }: SetCommitVendorCode
  ) {
    patchState({
      commitVendorCode: vendorCode
    });
    dispatch(new SetCommitVendorCodeSuccess());
  }
  /**
     * Set selected vendor code for new commit
     * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
     * @param {SetCommitVendorCode} { vendorCode }
     * @memberof SupplyVisibilityState
     */
  @Action(SetCommitModuleOn)
  setCommitModuleOn(
    { patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { isCommitModule: isCommitModuleOn }: SetCommitModuleOn
  ) {
    patchState({
      commitModuleOn: isCommitModuleOn
    });
  }
  /**
   * Set Forecast data
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(SetForecast, { cancelUncompleted: true })
  async setForecast({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>, { id }: SetForecast) {
    if (this.activeFetchInfo.forecast && id) {
      this.activeFetchInfo.forecast.currentPnId = id;
    }
    const state = getState();
    const parameters: BasicParameters = Helper.createCopy(state.basicParameters);
    const dummyCommitHeader = state.selectedDummyCommitHeader;

    // check if we have cached forecast
    const cachedForecast = state.cachedForecast;

    // if used more than one place, take it in other state's property and use it instead of sending in success action
    let cachedChildrenForecast = null;

    // when All vendors is selected use PN-Vendor array
    if (parameters.vendorCode === null || parameters.vendorCode === undefined || parameters.vendorCode === "") {
      dispatch(new SetVendorCodes([parameters.partNumber])).subscribe(async () => {
        const state = getState();
        // console.log('state.vendorCodes', state.vendorCodes);
        const vendorCodes = state.vendorCodes;
        const vendorList: { partNumber: string, vendorCode: string }[] = [];
        vendorCodes.forEach(element => {
          element.vendorCodes.forEach(vendorCode => {
            vendorList.push({
              partNumber: element.partNumber,
              vendorCode: vendorCode
            })
          });
        });
        // create hash for parameters
        const parametersForHash = [parameters, dummyCommitHeader, vendorList];
        const parametersHash = objectHash(parametersForHash);
        const cachedForecastHash = state.cachedForecastHash;

        if (cachedForecast !== undefined && cachedForecast && parametersHash === cachedForecastHash) {
          // console.log('Returning cached forecast...');
          if (!this.isValidPn(getState(), cachedForecast?.partNumber, cachedForecast?.vendorCode)) { return }
          patchState({ forecast: cachedForecast, cachedForecast: undefined, cachedForecastHash: '' });
          // without timeout catchSetCommitsWithDummySuccess in commit-history.component.ts isn't caught
          setTimeout(() => {
            dispatch(new SetForecastSuccess(id));
          }, 100);

        } else {

          // console.log('Fetching forecast...>>', parameters.partNumber, parameters.vendorCode);
          // console.log('vendorList', vendorList);
          if (this.forecastSubs) {
            this.forecastSubs.unsubscribe();
          }
          if (dummyCommitHeader)
            this.forecastSubs = this.supplyVisibilityService.getForecastAllVendors(parameters, dummyCommitHeader, vendorList)
              .pipe(debounceTime(1000)).subscribe({
                next: async (forecast: Forecast) => {
                  if (forecast.projectionDetails.length > 0) {
                    if (!this.isValidPn(getState(), forecast.partNumber, forecast.vendorCode)) { return } dispatch(new SetForecastSuccess(id));
                    patchState({
                      forecast: {
                        plant: forecast.plant,
                        partNumber: forecast.partNumber,
                        vendorCode: forecast.vendorCode,
                        materialManagementViewID: forecast.materialManagementViewID,
                        records: forecast.records,
                        variant: forecast.variant,
                        reviewed: forecast.reviewed, //TODO Change dependency
                        staticvalues: forecast.staticvalues,
                        projectionDetails: forecast.projectionDetails,
                        mergeProjections: (forecast.mergeProjections && forecast.mergeProjections.length > 0) ? forecast.mergeProjections : []
                      }
                    });

                  } else {
                    dispatch(new SetForecastError());
                  }
                },
                error: (error) => {
                  dispatch(new SetForecastError(error));
                }
              }
              );
          // return this.forecastSubs;
        }

        // if (this.isVirtualVC(state)) {
        //   let childrenPNList = await this.getChildrenPNList(parameters)
        //   dispatch(new SetChildrenPNList(parameters, id));
        //   cachedChildrenForecast = await this.setChildrenForecast(state, parameters, childrenPNList);

        //   if (id != this.activeFetchInfo.forecast.currentPnId) { return }
        //   dispatch(new SetChildrenForecastSuccess(cachedChildrenForecast));
        // }

      });
    } else {
      // create hash for parameters
      const parametersForHash = [parameters, dummyCommitHeader];
      const parametersHash = objectHash(parametersForHash);
      const cachedForecastHash = state.cachedForecastHash;
      console.log('parametersHash SetForecast', parametersHash);

      if (cachedForecast !== undefined && cachedForecast && parametersHash === cachedForecastHash) {

        if (!this.isValidPn(getState(), cachedForecast.partNumber, cachedForecast.vendorCode)) { return } console.log('Returning cached forecast...');
        patchState({ forecast: cachedForecast, cachedForecast: undefined, cachedForecastHash: '' });
        // without timeout catchSetCommitsWithDummySuccess in commit-history.component.ts isn't caught
        setTimeout(() => {
          dispatch(new SetForecastSuccess(id));
        }, 100);

      } else {
        if (this.forecastSubs) {
          this.forecastSubs.unsubscribe();
        }
        console.log('Fetching forecast...>>', parameters.partNumber, parameters.vendorCode);
        if (dummyCommitHeader)
          this.forecastSubs = this.supplyVisibilityService.getForecast(parameters, dummyCommitHeader)
            .pipe(debounceTime(500)).subscribe({
              next: async (forecast: Forecast) => {
                if (forecast.projectionDetails.length > 0) {
                  if (!this.isValidPn(getState(), forecast.partNumber, forecast.vendorCode)) { return }
                  patchState({
                    forecast: {
                      plant: forecast.plant,
                      partNumber: forecast.partNumber,
                      vendorCode: forecast.vendorCode,
                      materialManagementViewID: forecast.materialManagementViewID,
                      records: forecast.records,
                      variant: forecast.variant,
                      reviewed: forecast.reviewed,
                      staticvalues: forecast.staticvalues,
                      projectionDetails: forecast.projectionDetails,
                      mergeProjections: (forecast.mergeProjections && forecast.mergeProjections.length > 0) ? forecast.mergeProjections : []
                    }
                  });
                  dispatch(new SetForecastSuccess(id));
                } else {
                  dispatch(new SetForecastError());
                }
              },
              error: (error) => {
                dispatch(new SetForecastError(error));
              }
            }
            );


        // return this.forecastSubs;
      }

      // if (this.isVirtualVC(state)) {
      //   let childrenPNList = await this.getChildrenPNList(parameters);
      //   dispatch(new SetChildrenPNList(parameters, id));
      //   cachedChildrenForecast = await this.setChildrenForecast(state, parameters, childrenPNList);
      //   if (id != this.activeFetchInfo.forecast.currentPnId) { return }

      //   dispatch(new SetChildrenForecastSuccess(cachedChildrenForecast));
      // }
    }
    // }
  }

  @Action(SetChildrenPNList)
  async setChildrenPnLIst({
    patchState
  }: StateContext<SupplyVisibilityStateModel>, { parameters, id }: SetChildrenPNList) {

    //Checking if the PN is changed
    if (id && id == this.activeFetchInfo.forecast?.currentPnId) {
      patchState({ childrenPNList: this.virtualPnChildList[parameters.partNumber] })
    }
    else {
      patchState({ childrenPNList: [] })
    }
    patchState({ childrenPNInfo: { parentPnInfo: { plant: parameters.plant, partNumber: parameters.partNumber, vendorCode: parameters.vendorCode }, childrenPNList: this.virtualPnChildList[parameters.partNumber] } })
  }


  /**
   * Set Forecast Error
   * @memberof SupplyVisibilityState
   */
  @Action(SetForecastError)
  setForecastError() { }

  /**
   * Set Forecast Success
   * @memberof SupplyVisibilityState
   */
  @Action(SetForecastSuccess)
  async setForecastSuccess({
    getState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>, { id }: SetForecastSuccess) {
    const state = getState();
    const parameters: BasicParameters = Helper.createCopy(state.basicParameters);

    if (this.isVirtualVC(state)) {
      //let childrenPNList = await this.getChildrenPNList(parameters);
      dispatch(new SetChildrenPNList(parameters, id));
      let cachedChildrenForecast = await this.setChildrenForecast(state, parameters);
      if (id != this.activeFetchInfo.forecast?.currentPnId) { return }
      dispatch(new SetChildrenForecastSuccess(cachedChildrenForecast));
    }
  }

  /**
   * Cache Forecast data
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(CacheForecast, { cancelUncompleted: true })
  async cacheForecast({
    getState,
    patchState,
    dispatch
  }: StateContext<SupplyVisibilityStateModel>, { cacheParameters }: { cacheParameters: any }) {
    if (this.activeFetchInfo.forecast)
      this.activeFetchInfo.forecast.nextPnId = cacheParameters.id;

    const state = getState();
    const parameters: BasicParameters = Helper.createCopy(state.basicParameters);

    parameters.partNumber = cacheParameters.partNumber;
    parameters.vendorCode = cacheParameters.vendorCode;
    const dummyCommitHeader = Helper.createCopy(state.selectedDummyCommitHeader);

    // when All vendors is selected use PN-Vendor array
    if (
      parameters.partNumber !== undefined &&
      (parameters.vendorCode === null || parameters.vendorCode === undefined || parameters.vendorCode === "")
    ) {
      dispatch(new SetVendorCodes([parameters.partNumber])).subscribe(() => {
        const state = getState();
        const vendorCodes = state.vendorCodes;
        const vendorList: { partNumber: string, vendorCode: string }[] = [];
        vendorCodes.forEach(element => {
          element.vendorCodes.forEach(vendorCode => {
            vendorList.push({
              partNumber: element.partNumber,
              vendorCode: vendorCode
            })
          });
        });
        // create hash for parameters
        const parametersForHash = [parameters, dummyCommitHeader, vendorList];
        const parametersHash = objectHash(parametersForHash);
        console.log('parametersHash FORECAST', parametersHash);
        this.supplyVisibilityService.getForecastAllVendors(parameters, dummyCommitHeader, vendorList).subscribe({
          next: (forecast: Forecast) => {
            if (forecast.projectionDetails.length > 0) {
              console.log('caching forecast for PN ' + parameters.partNumber + ' and vendor ' + parameters.vendorCode, forecast);
              patchState({
                cachedForecast: {
                  plant: forecast.plant,
                  partNumber: forecast.partNumber,
                  vendorCode: forecast.vendorCode,
                  materialManagementViewID: forecast.materialManagementViewID,
                  weeks: forecast.records,
                  days: forecast.records,
                  reviewed: forecast.reviewed, //TODO Change dependency
                  staticvalues: forecast.staticvalues,
                  projectionDetails: forecast.projectionDetails,
                  mergeProjections: (forecast.mergeProjections && forecast.mergeProjections.length > 0) ? forecast.mergeProjections : []
                },
                cachedForecastHash: parametersHash
              });
              dispatch(new CacheForecastSuccess(cacheParameters));
            } else {
              dispatch(new CacheForecastError());
            }
          },
          error: (error) => {
            dispatch(new CacheForecastError(error));
          }
        }
        );
      });
    } else {
      // create hash for parameters
      const parametersForHash = [parameters, dummyCommitHeader];
      const parametersHash = objectHash(parametersForHash);
      console.log('parametersHash FORECAST', parametersHash);
      this.supplyVisibilityService.getForecast(parameters, dummyCommitHeader).subscribe({
        next: (forecast: Forecast) => {

          if (this.activeFetchInfo.forecast?.nextPnId != cacheParameters.id) { return }

          if (forecast.projectionDetails.length > 0) {
            console.log('caching forecast for PN ' + parameters.partNumber + ' and vendor ' + parameters.vendorCode, forecast);
            patchState({
              cachedForecast: {
                plant: forecast.plant,
                partNumber: forecast.partNumber,
                vendorCode: forecast.vendorCode,
                materialManagementViewID: forecast.materialManagementViewID,
                weeks: forecast.records,
                days: forecast.days,
                reviewed: forecast.reviewed,
                staticvalues: forecast.staticvalues,
                projectionDetails: forecast.projectionDetails,
                mergeProjections: (forecast.mergeProjections && forecast.mergeProjections.length > 0) ? forecast.mergeProjections : []
              },
              cachedForecastHash: parametersHash
            });
            dispatch(new CacheForecastSuccess(cacheParameters));
          } else {
            dispatch(new CacheForecastError());
          }
        },
        error: (error) => {
          dispatch(new CacheForecastError(error));
        }
      }
      );
    }
    // if (cacheParameters.vendorCode == 'VirtualVC') {
    //    // let childrenPNList = await this.getChildrenPNList(cacheParameters);
    //     let virtualVcForecasts: ForecastVirtualVc[] = await this.supplyVisibilityService.getChildrenPnForecast(cacheParameters,virtualChildList);

    //     if(this.activeFetchInfo.forecast.nextPnId != cacheParameters.id) { return }

    //     this.forecastsData[cacheParameters.partNumber] = { data: virtualVcForecasts }
    // }

  }

  /**
   * Cache Forecast Error
   * @memberof SupplyVisibilityState
   */
  @Action(CacheForecastError)
  cacheForecastError() { }

  /**
   * Cache Forecast Success
   * @memberof SupplyVisibilityState
   */
  @Action(CacheForecastSuccess)
  async cacheForecastSuccess({ getState }: StateContext<SupplyVisibilityStateModel>, { cacheParameters }: CacheForecastSuccess) {
    if (cacheParameters.vendorCode == 'VirtualVC') {
      // let childrenPNList = await this.getChildrenPNList(cacheParameters);
      const state = getState();
      const virtualChildList: any[] | undefined = state.cachedForecast?.mergeProjections;
      let virtualVcForecasts: ForecastVirtualVc[] = await this.supplyVisibilityService.getChildrenPnForecast(cacheParameters, virtualChildList);

      if (this.activeFetchInfo.forecast?.nextPnId != cacheParameters.id) { return }

      this.forecastsData[cacheParameters.partNumber] = { data: virtualVcForecasts }
    }
  }

  /**
   * Set Forecast Week Range
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetForecastWeekRange} { start, end }
   * @memberof SupplyVisibilityState
   */
  @Action(SetForecastWeekRange)
  setForecastWeekRange(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { start, end }: SetForecastWeekRange
  ) {
    patchState({
      forecastWeekRange: {
        startWeek: start,
        endWeek: end
      }
    });
  }



  @Action(SetBuyersPartNumbers)
  SetBuyersPartNumbers(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { buyer }: SetBuyersPartNumbers
  ) {
    this.supplyVisibilityBuyersPartNumbersService
      .getBuyersPartnumbersList(buyer)
      .subscribe(res => {
        patchState({
          buyersPartNumbers: res
        });
      });
  }
  // // MaterialManagement /SupplyVisibilityReadOnly/GetPNsPrecalculateProjectionByFilter

  //   // f.e.
  //   // MaterialManagement/SupplyVisibilityReadOnly/GetPNsPrecalculateProjectionByFilter?filter=ForecastQty(w2_w8) > 100000 OR HOI > 2 AND FOI > 500
  @Action(GetPNsPrecalculateProjectionByFilter)
  getPNsPrecalculateProjectionByFilter(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { filter }: GetPNsPrecalculateProjectionByFilter
  ) {
    return this.supplyVisibilityBuyersPartNumbersService.getPNsPrecalculateProjectionByFilter(
      filter
    );
  }

  @Action(SetSVComments)
  SetSVComments(
    { getState, patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { vendor, partnumber, validatePN }: SetSVComments
  ) {
    this.supplyVisibilityCommentService
      .getSVCommentsByVendorPN(vendor, partnumber)
      .subscribe(res => {
        if (!validatePN) {
          if (!this.isValidPn(getState(), partnumber, vendor)) { return }
        }
        patchState({
          svComments: res.result
        });
        dispatch(new SetSVCommentsSuccess(res.result));
      }), (error: any) => {
        dispatch(new SetSVCommentsError(error));
      }
  }

  @Action(CreateSVComment)
  CreateSVComments(
    { getState, patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { data }: CreateSVComment
  ) {
    const state = getState().svComments;

    this.supplyVisibilityCommentService.createSVComment(data).subscribe(res => {
      const result = [...state, res];
      patchState({
        svComments: result
      });
      dispatch(new CreateSVCommentSuccess(res));
    }),
      (error: any) => {
        dispatch(new CreateSVCommentError(error));
      }
  }

  @Action(UpdateSVComment)
  UpdateSVComments(
    { getState, setState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { data }: UpdateSVComment
  ) {
    const svComments = getState().svComments;

    this.supplyVisibilityCommentService.updateSVComment(data).subscribe(res => {
      setState(
        patch({
          svComments: updateItem<SVComments>(c => c.id === data.id, res)
        })
      );
      dispatch(new UpdateSVCommentSuccess(res));
    }),
      (error: any) => {
        dispatch(new UpdateSVCommentError(error));
      }
  }

  @Action(DeleteSVComment)
  DeleteSVComments(
    { getState, patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { data }: DeleteSVComment
  ) {
    const svComments = getState().svComments;

    this.supplyVisibilityCommentService.deleteSVComment(data).subscribe(res => {
      const result = svComments.filter(q => q.id !== res.id);
      patchState({
        svComments: result
      });
      dispatch(new DeleteSVCommentSuccess(res));
    }),
      (error: any) => {
        dispatch(new DeleteSVCommentError(error))
      }
  }

  @Action(SetSVPredefinedComments)
  SetSVPredefinedComments(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { category }: SetSVPredefinedComments
  ) {
    this.supplyVisibilityPredefinedCommentService
      .getSVCommentsByCategory(category)
      .subscribe(res => {
        patchState({
          svPredefinedComments: res.result
        });
      });
  }

  @Action(CreateSVPredefinedComment)
  CreateSVPredefinedComments(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { data }: CreateSVPredefinedComment
  ) {
    const state = getState().svPredefinedComments;

    this.supplyVisibilityPredefinedCommentService.createSVPredefinedComment(data).subscribe(res => {
      const result = [...state, res];
      patchState({
        svPredefinedComments: result
      });
    });
  }

  @Action(UpdateSVPredefinedComment)
  UpdateSVPredefinedComments(
    { getState, setState }: StateContext<SupplyVisibilityStateModel>,
    { data }: UpdateSVPredefinedComment
  ) {
    const svPredefinedComments = getState().svPredefinedComments;

    this.supplyVisibilityPredefinedCommentService.updateSVPredefinedComment(data).subscribe(res => {
      setState(
        patch({
          svPredefinedComments: updateItem<SVPredefinedComments>(c => c.id === data.id, res)
        })
      );
    });
  }

  @Action(DeleteSVPredefinedComment)
  DeleteSVPredefinedComments(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { data }: DeleteSVPredefinedComment
  ) {
    const svPredefinedComments = getState().svPredefinedComments;

    this.supplyVisibilityPredefinedCommentService.deleteSVPredefinedComment(data).subscribe(res => {
      const result = svPredefinedComments.filter(q => q.id !== res);
      patchState({
        svPredefinedComments: result
      });
    });
  }

  @Action(SetSVNotesByRecord)
  SetSVNotesByRecord(
    { dispatch, getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { modul, key, searchText, top, skip }: SetSVNotesByRecord
  ) {
    const state = getState().svNotes;

    this.supplyVisibilityNotesService
      .getSVNotesByRecord(modul, key, searchText, top, skip)
      .subscribe(res => {
        if ("VC:" + getState().basicParameters.vendorCode + ";PN:" + getState().basicParameters.partNumber != key) { return }
        dispatch(new SetSVNotesByRecordSuccess());

        var result = [];
        if (skip === 0) {
          result = res.result;
        } else {
          result = [...state, ...res.result];
        }

        if ("VC:" + getState().basicParameters.vendorCode + ";PN:" + getState().basicParameters.partNumber != key) { return }
        patchState({
          svNotes: result,
          svNotesCount: res.count
        });
      }, error => {
        dispatch(new SetSVNotesByRecordError(error));
      });
  }
  /**
   * Set SV Notes Error
   * @memberof SupplyVisibilityState
   */
  @Action(SetSVNotesByRecordError)
  setSVNotesByRecordError() { }

  @Action(CreateSVNote)
  CreateSVNote(
    { getState, patchState, dispatch }: StateContext<SupplyVisibilityStateModel>,
    { data }: CreateSVNote
  ) {
    const state = getState().svNotes;

    this.supplyVisibilityNotesService.createSVNote(data).subscribe(res => {
      const result = [...state, res];
      patchState({
        svNotes: result
      });

      dispatch(new CreateSVNoteSuccess());
    });
  }

  /**
   * Set Create SV Note Success
   * @memberof SupplyVisibilityState
   */
  @Action(CreateSVNoteSuccess)
  createSVNoteSuccess() { }

  @Action(UpdateSVNote)
  UpdateSVNote(
    { getState, setState }: StateContext<SupplyVisibilityStateModel>,
    { data }: UpdateSVNote
  ) {
    const svNotes = getState().svNotes;

    this.supplyVisibilityNotesService.updateSVNote(data).subscribe(res => {
      setState(
        patch({
          svNotes: updateItem<SVNotes>(c => c.id === data.id, res)
        })
      );
    });
  }

  @Action(DeleteSVNote)
  DeleteSVNote(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { data }: DeleteSVNote
  ) {
    const svNotes = getState().svNotes;

    this.supplyVisibilityNotesService.deleteSVNote(data).subscribe(res => {
      const result = svNotes.filter(q => q.id !== res.id);
      patchState({
        svNotes: result
      });
    });
  }

  /**
   * Set Material Management Views
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @memberof SupplyVisibilityState
   */
  @Action(SetMaterialManagementViews)
  setMaterialManagementviews({
    patchState
  }: StateContext<SupplyVisibilityStateModel>) {
    this.supplyVisibilityService
      .materialManagementViews()
      .subscribe((materialManagementViews: MaterialManagementViews[]) => {
        // console.log('>>>>>>>>>>>>>>>>');
        // console.log(materialManagementViews);
        // console.log('>>>>>>>>>>>>>>>>');

        materialManagementViews = materialManagementViews.filter(
          q => q.enabled === true
        );
        patchState({
          materialManagementViews
        });
      });
  }

  /**
   * Set Forecast Active MM View
   * @param {StateContext<SupplyVisibilityStateModel>} { patchState }
   * @param {SetActiveMMView} { mmView}
   * @memberof SupplyVisibilityState
   */
  @Action(SetActiveMMView)
  setActiveMMView(
    { getState, patchState }: StateContext<SupplyVisibilityStateModel>,
    { mmView }: SetActiveMMView
  ) {
    const state = getState();
    const parameters: BasicParameters = state.basicParameters;

    patchState({
      basicParameters: {
        plant: parameters.plant,
        partNumber: parameters.partNumber,
        vendorCode: parameters.vendorCode,
        weeks: parameters.weeks,
        mmViewID: mmView
      }
    });
  }

  @Action(SetUserAction)
  setUserAction(
    { patchState }: StateContext<SupplyVisibilityStateModel>,
    { action }: SetUserAction
  ) {
    patchState({
      userAction: action
    });
  }
  /**
   * Reset Buffer Rules
   * @memberof BufferRulesState
   */
  @Action(ResetSupplyVisibilityAndCommits)
  resetSupplyVisibilityAndCommits({
    setState, getState
  }: StateContext<SupplyVisibilityStateModel>) {
    const pnList = getState().partNumberListParameters;
    const cachedCommits = getState().cachedCommits;
    const cachedForecast = getState().cachedForecast;
    const childrenPNList = getState().childrenPNList;
    const childrenPNInfo = getState().childrenPNInfo;
    const cachedChildrenPNInfo = getState().cachedChildrenPNInfo;
    // const cachedChildrenForecast = getState().cachedChildrenForecast;
    const cachedCommitsHash = getState().cachedCommitsHash;
    const cachedForecastHash = getState().cachedForecastHash;
    const notifications = getState().notifications;
    const notificationsUnreadCount = getState().notificationsUnreadCount;
    const DefaultDashboardData = getState().DefaultDashboardData;
    setState({
      vendorList: '',
      basicParameters: {
        plant: '',
        partNumber: '',
      },
      partNumberListParameters: pnList,
      daterangeParameters: {
        dateFrom: '',
        dateTo: ''
      },
      commits: [],
      cachedCommits: cachedCommits,
      cachedCommitsHash: cachedCommitsHash,
      newCommit: {},
      userSettingParameters: { key: '' },
      userSettings: { key: '', data: '' },
      newUserSettings: { key: '', data: '' },
      notifications: notifications,
      notificationsUnreadCount: notificationsUnreadCount,
      notificationDetailCache: {},
      purchaseOrders: [],
      dummyCommitsHeaders: [],
      selectedDummyCommitHeader: undefined,
      forecast: {
        plant: '',
        partNumber: '',
        vendorCode: '',
        materialManagementViewID: '',
        weeks: undefined,
        days: undefined,
        reviewed: undefined,
        staticvalues: [],
        projectionDetails: [],
        mergeProjections: []
      },
      cachedForecast: cachedForecast,
      // cachedChildrenForecast: cachedChildrenForecast,
      childrenPNList: childrenPNList,
      childrenPNInfo: childrenPNInfo,
      cachedChildrenPNInfo: cachedChildrenPNInfo,
      cachedForecastHash: cachedForecastHash,
      forecastWeekRange: {
        startWeek: undefined,
        endWeek: undefined
      },
      materialManagementViews: [],
      svComments: [],
      svPredefinedComments: [],
      svNotes: [],
      svNotesCount: 0,
      userAction: EnumSvSidebarSection.None,
      buyersPartNumbers: [],
      vendorCodes: [],
      commitVendorCode: '',
      commitTransactionDetails: [],
      vendorTransactionDetails: [],
      quotationTransactionDetails: [],
      partnumberTransactionDetails: [],
      commitMandatoryDates: [],
      DefaultDashboardData: DefaultDashboardData,
      commitStatus: [],
      additionalFilters: []
    });
  }


  @Action(ResetSupplyVisibilityPartNumberList)
  resetSupplyVisibilityPartNumberList({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>) {
    const pnList = getState();
    patchState({
      partNumberListParameters: {},
    });
  }

  @Action(ResetCache)
  resetCache({
    patchState
  }: StateContext<SupplyVisibilityStateModel>) {

    //Resetting childrenForecasts Data
    this.forecastsData = {};
    this.virtualPnChildList = {};

    patchState({
      cachedCommits: undefined,
      cachedForecast: undefined,
      cachedCommitsHash: undefined,
      childrenPNList: undefined,
      childrenPNInfo: undefined,
      cachedForecastHash: undefined
    });
  }

  @Action(ResetCommitTransactionDetails)
  resetCommitTransactionDetails({
    patchState
  }: StateContext<SupplyVisibilityStateModel>) {

    patchState({ commitTransactionDetails: [] })
  }

  /**
  * Reset plant dependent cache fields
  * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
  * @returns
  * @memberof SupplyVisibilityState
  */
  @Action(ResetPlantDependentCache)
  async resetPlantDependentCache({
    patchState, dispatch
  }: StateContext<SupplyVisibilityStateModel>) {

    //Fields will be reset when plant changes (action dispatched in auth state)
    patchState({
      cachedCommitsReasons: undefined,
      cachedCommitsCarriers: undefined,
      cachedCommitsCountries: undefined,
      cachedCommitsTransportType: undefined,
      cachedReadOnlyFields: undefined,
      commitMandatoryDates: undefined,
    });
  }





  /**
  * Cache Reasons from API
  * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
  * @returns
  * @memberof SupplyVisibilityState
  */
  @Action(CacheCommitsReasons)
  async cacheCommitsReasons({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheCommitsReasons) {
    let state = getState();
    if (refresh || !state.cachedCommitsReasons) {
      return this.commitsService
        .getReasonsList()
        .subscribe({
          next: (response: Reason[]) => {
            if (response) {
              patchState({ cachedCommitsReasons: [...response] });
            }
            dispatch(new CacheCommitsReasonsSuccess())
          },
          error: (error) => {
            dispatch(new CacheCommitsReasonsError())
          }
        }
        );
    }
    else {
      return dispatch(new CacheCommitsReasonsSuccess());
    }
  }

  /**
  * Cache Carriers from API (Forwarder)
  * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
  * @returns
  * @memberof SupplyVisibilityState
  */
  @Action(CacheCommitsCarriers)
  async cacheCommitsCarriers({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheCommitsCarriers) {
    let state = getState();
    if (refresh || !state.cachedCommitsCarriers) {
      return this.commitsService
        .getCommitsCarriers()
        .subscribe({
          next: (response: any) => {
            if (response) {
              response.result = Helper.setOrderByAlpha('code', response.result);
              patchState({
                cachedCommitsCarriers: response["result"],
              });
            }
            dispatch(new CacheCommitsCarriersSuccess());
          },
          error: (error) => {
            dispatch(new CacheCommitsCarriersError());
          }
        }
        );
    }
    else {
     return dispatch(new CacheCommitsCarriersSuccess());
    }
  }

  /**
   * Cache Vendors Name from API GetVendorsWithNames
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState}
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(CacheVendorsName)
  async cacheVendorsName({
    patchState, getState, dispatch
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheVendorsName) {
    let state = getState();
    if (refresh || !state.cachedVendorName) {
      return this.commitsService.getVendorsWithNames().subscribe({
        next: (response: any) => {
          if (response) {
            patchState({
              cachedVendorName: response.result
            })
          }
          dispatch(new CacheVendorsNameSuccess());
        },
        error: (error) => {
          dispatch(new CacheVendorsNameError());
        }
      }
      )
    }
    else {
      return dispatch(new CacheVendorsNameSuccess());
    }
  }

  /**
* Cache Countries from API
* @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
* @returns
* @memberof SupplyVisibilityState
*/
  @Action(CacheCommitsCountries)
  async cacheCommitsCountries({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheCommitsCountries) {
    let state = getState();
    if (refresh || !(state.cachedCommitsCountries && state.cachedCommitsCountries.length)) {
      return this.commitsService
        .getCommitsCountries()
        .subscribe({
          next: (response: any) => {
            if (response) {
              patchState({ cachedCommitsCountries: response["result"] });
            }
            dispatch(new CacheCommitsCountriesSuccess());
          },
          error: (error) => {
            dispatch(new CacheCommitsCountriesError());
          }
        }
        );
    }
    else {
      return dispatch(new CacheCommitsCountriesSuccess());
    }
  }

  /**
* Cache Transport Type from API
* @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
* @returns
* @memberof SupplyVisibilityState
*/
  @Action(CacheCommitsTransportType)
  async cacheCommitsTransportType({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheCommitsTransportType) {
    let state = getState();
    if (refresh || !state.cachedCommitsTransportType) {
      return this.commitsService
        .getCommitsTransportType()
        .subscribe({
          next: (response: any) => {
            if (response) {
              patchState({ cachedCommitsTransportType: response });
            }
            dispatch(new CacheCommitsTransportTypeSuccess())
          },
          error: (error) => {
            dispatch(new CacheCommitsTransportTypeError())
          }
        }
        );
    }
    else {
      return dispatch(new CacheCommitsTransportTypeSuccess());
    }
  }

  @Action(CacheReadOnlyFields)
  async cacheReadOnlyFields({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: CacheReadOnlyFields) {
    let state = getState();
    if (refresh || !(state.cachedReadOnlyFields && state.cachedReadOnlyFields.length)) {

      return this.supplyVisibilityService.getReadOnlyFieldsForCommits().subscribe({
        next: (response: any) => {
          if (response) {
            patchState({ cachedReadOnlyFields: [...response] });
          }
          else {
            patchState({ cachedReadOnlyFields: [] });
          }
          dispatch(new CacheReadOnlyFieldsSuccess(response));
        },
        error: (error) => {
          dispatch(new CacheReadOnlyFieldsError());
        }
      }
      )
    }
    else {
      return dispatch(new CacheReadOnlyFieldsSuccess(state.cachedReadOnlyFields));

    }

  }

  @Action(GetFilterAdditions)
  async getFilterAdditions({
    patchState, dispatch, getState
  }: StateContext<SupplyVisibilityStateModel>) {
    let state = getState();
    if (!state.commitFilterAdditions) {

      this.supplyVisibilityService.getFilterAdditionsForCommits().subscribe((response: any) => {
        response = (response && response.length) ? response : [];
        patchState({ commitFilterAdditions: [...response] });
        dispatch(new GetFilterAdditionsSuccess(response));
      },
        (error: any) => {
          dispatch(new GetFilterAdditionsError(error));
        }
      )
    }
    else {
      dispatch(new GetFilterAdditionsSuccess(state.cachedReadOnlyFields));
    }

  }

  @Action(SetCommitTransactionDetails)
  async setCommitTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { commitTransactionDetails }: SetCommitTransactionDetails) {

    const state = getState();

    //For adding newly created commit in commitTransaction
    if (commitTransactionDetails.type == EnumCommitType.NEW) {
      let commits = state.commitTransactionDetails.filter(commit => commit.type != EnumCommitType.NEW);
      commits.push(commitTransactionDetails)
      patchState({ commitTransactionDetails: commits })
    }

    //For Updating edited,merged or splitted commit data in commitTransaction
    if (commitTransactionDetails.type == EnumCommitType.EDIT || commitTransactionDetails.type == EnumCommitType.SPLIT || commitTransactionDetails.type == EnumCommitType.MERGE) {

      let updatedCommitIndex = state.commitTransactionDetails.findIndex(commit => commit.id == commitTransactionDetails.id);
      if (updatedCommitIndex != -1) {
        patchState({
          commitTransactionDetails: [...state.commitTransactionDetails.filter(commit => {
            return commit.id != commitTransactionDetails.id && commit.type != commitTransactionDetails.type
          }), commitTransactionDetails]
        })
      }
      else {
        let index = state.commitTransactionDetails.findIndex(commit => commit.type == commitTransactionDetails.type)
        if (index != -1) {
          patchState({ commitTransactionDetails: [...state.commitTransactionDetails.filter(commit => commit.type != commitTransactionDetails.type), commitTransactionDetails] })
        }
        else {
          let modifiedCommitTransactions = Helper.createCopy(state.commitTransactionDetails);
          modifiedCommitTransactions.push(commitTransactionDetails)
          patchState({ commitTransactionDetails: modifiedCommitTransactions })
        }
      }
    }
  }


  @Action(PatchCommitTransactionDetails)
  async patchCommitTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { commitTransactionDetails }: PatchCommitTransactionDetails) {
    const state = getState();
    //Checking if commitTransactions are reset (undefined or null)
    if (state.commitTransactionDetails) {
      patchState({ commitTransactionDetails: commitTransactionDetails })
    }
  }

  @Action(SetVendorTransactionDetails)
  async setVendorTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { vendorTransactionDetails }: SetVendorTransactionDetails) {

    const state = getState();

    //For Updating edited vendor data in vendorTransaction
    if (vendorTransactionDetails.type == EnumVendorType.EDIT) {

      let updatedVendorIndex = state.vendorTransactionDetails.findIndex(vendor => vendor.id == vendorTransactionDetails.id);
      if (updatedVendorIndex != -1) {
        patchState({
          vendorTransactionDetails: [...state.vendorTransactionDetails.filter(vendor => {
            return vendor.id != vendorTransactionDetails.id && vendor.type != vendorTransactionDetails.type
          }), vendorTransactionDetails]
        })
      }
      else {
        let index = state.vendorTransactionDetails.findIndex(commit => commit.type == vendorTransactionDetails.type)
        if (index != -1) {
          patchState({ vendorTransactionDetails: [...state.vendorTransactionDetails.filter(vendor => vendor.type != vendorTransactionDetails.type), vendorTransactionDetails] })
        }
        else {
          let modifiedVendorTransactions = Helper.createCopy(state.vendorTransactionDetails);
          modifiedVendorTransactions.push(vendorTransactionDetails)
          patchState({ vendorTransactionDetails: modifiedVendorTransactions })
        }
      }
    }
  }

  @Action(PatchVendorTransactionDetails)
  async patchVendorTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { vendorTransactionDetails }: PatchVendorTransactionDetails) {
    const state = getState();
    //Checking if vendorTransactions are reset (undefined or null)
    if (state.vendorTransactionDetails) {
      patchState({ vendorTransactionDetails: vendorTransactionDetails })
    }
  }

  @Action(SetQuotationTransactionDetails)
  async setQuotationTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { quotationTransactionDetails }: SetQuotationTransactionDetails) {
    const state = getState();

    if (quotationTransactionDetails.type == EnumQuotationType.EDIT) {
      let updatedQuotationIndex = state.quotationTransactionDetails.findIndex(quotation => quotation.id == quotationTransactionDetails.id);
      if (updatedQuotationIndex != -1) {
        patchState({
          quotationTransactionDetails: [...state.quotationTransactionDetails.filter(quotation => {
            return quotation.id != quotationTransactionDetails.id && quotation.type
          }), quotationTransactionDetails]
        })
      }
      else {
        let index = state.quotationTransactionDetails.findIndex(commit => commit.type == quotationTransactionDetails.type)
        if (index != 1) {
          patchState({ quotationTransactionDetails: [...state.quotationTransactionDetails.filter(quotation => quotation.type != quotationTransactionDetails.type), quotationTransactionDetails] })
        }
        else {
          let modifiedQuotationTransactions = Helper.createCopy(state.quotationTransactionDetails);
          modifiedQuotationTransactions.push(quotationTransactionDetails);
          patchState({ quotationTransactionDetails: modifiedQuotationTransactions });
        }
      }
    }
  }

  @Action(PatchQuotationTransactionDetails)
  async patchQuotationTransactionDetails({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { quotationTransactionDetails }: PatchQuotationTransactionDetails) {
    const state = getState();
    if (state.quotationTransactionDetails) {
      patchState({ quotationTransactionDetails: quotationTransactionDetails })
    }
  }

  @Action(ShowNotifications)
  showNotifications({
    patchState,
  }: StateContext<SupplyVisibilityStateModel>, { id }: ShowNotifications) {

    let dialogRef;
    import('../../../shared/components/notifications/notifications.component')
      .then(({ NotificationsComponent }) => {

        if (id) {
          dialogRef = this.dialog.open(NotificationsComponent, {
            width: '70%',
            height: '80%',
            data: {
              id: id,
            }
          });
        }
      });
  }




  @Action(SetPlantMandatoryDates)
  async setPlantMandatoryDates({
    dispatch, patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { refresh }: SetPlantMandatoryDates) {
    let state = getState();
    if (refresh || !(state.commitMandatoryDates && state.commitMandatoryDates.length)) {

      let dates: string[] = await this.commitsService.getMandatoryDates().toPromise().catch(
        error => {
          dates = ["ETADate"];
          console.warn(`${getState().commitMandatoryDates[0]} is Plant Specific Lead Date`);
        }
      )
      patchState({
        commitMandatoryDates: dates
      });
    }
    dispatch(new SetPlantMandatoryDatesSuccess());
  }

  @Action(GetDefaultFormSettingFormKeys)
  async getDefaultFormSettingFormKeys(
    { dispatch }: StateContext<SupplyVisibilityStateModel>, { moduleService }: GetDefaultFormSettingFormKeys) {
    await moduleService.getDefaultFormSettingFormKeys()
      .subscribe((response: any) => {
        if (response) {
          let keys: string[] = [];
          let formKeys: FormKeys[] = [];
          keys = response;
          response.forEach((key: any) => {
            let formKey: FormKeys = {
              formKey: undefined,
              rights: []
            };
            formKey.formKey = key;
            formKeys.push(formKey);
          })
          dispatch(new GetDefaultFormSettingFormKeysSuccess(keys, formKeys));
        }
      },
        (error: any) => {
          dispatch(new GetDefaultFormSettingFormKeysError(error));
        }
      )
  }

  @Action(GetDefaultFormSettings)
  async getDefaultFormSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>, { moduleService, key, index }: GetDefaultFormSettings) {
    await moduleService.getDefaultFormSettings(key)
      .subscribe((response: any) => {
        if (response) {
          dispatch(new GetDefaultFormSettingsSuccess(response, key, index));
        }
      },
        (error: any) => {
          dispatch(new GetDefaultFormSettingsError(error));
        }
      )
  }

  @Action(UpdateDefaultFormSettings)
  async updateDefaultFormSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>, { moduleService, formKey, updatedValues }: UpdateDefaultFormSettings) {
    await moduleService.updateDefaultFormSettings(formKey, updatedValues)
      .subscribe((response: any) => {
        if (response) {
          dispatch(new UpdateDefaultFormSettingsSuccess(formKey));
        }
      },
        (error: any) => {
          dispatch(new UpdateDefaultFormSettingsError(error));
        }
      )
  }

  //#region Helper Functions

  initNotifications() {
    const self = this;
    setTimeout(() => {
      self.store.dispatch(new GetNotifications());
      self.store.dispatch(new GetNotificationsUnreadCount());
    }, 400)
  }

  //
  modifyCommitTransaction(response: Commit[], state: any) {
    let commitTransactionDetails = Helper.createCopy(state.commitTransactionDetails);

    if (commitTransactionDetails && commitTransactionDetails.length) {
      let updatedDetails = this.addCommitTransactions(response, commitTransactionDetails);
      response = updatedDetails.response;
      commitTransactionDetails = updatedDetails.commitTransactionDetails;
      return this.updateCommitTransaction(response, commitTransactionDetails, state);
    }
  }

  //For pushing newly created commits into the API response
  addCommitTransactions(response: Commit[], commitTransactionDetails: any) {
    let commitTransactions = commitTransactionDetails.filter((commit: any) => {
      return (commit.type == EnumCommitType.NEW || (commit.type == EnumCommitType.EDIT && commit.isCache) || (commit.type == EnumCommitType.SPLIT && commit.isCache) || (commit.type == EnumCommitType.MERGE && commit.isCache))
    })
    let newCommitTransactions = commitTransactions.slice(-1)

    for (let commitIndex = 0; commitIndex < newCommitTransactions.length; commitIndex++) {
      let highLightCommits = []
      let isPresent: boolean;
      // if (response.length) {
      if (newCommitTransactions[commitIndex].type == EnumCommitType.NEW || newCommitTransactions[commitIndex].type == EnumCommitType.EDIT) {
        //Checking if its present in API response
        let index = response.findIndex(commit => commit.inboundDeliveryNumber == newCommitTransactions[commitIndex].data.inboundDeliveryNumber);
        if (index != -1) {
          //Updating index of the commit already present
          let oldCommitIndex = commitTransactionDetails.findIndex((commit: any) => commit.id == response[index].inboundDeliveryNumber)
          let updatedCommit = commitTransactionDetails[oldCommitIndex];
          updatedCommit.datagridInfo = { index: index };
          commitTransactionDetails.splice(commitIndex, 1);
          commitTransactionDetails.push(updatedCommit);
          isPresent = true;
        }
        else {
          highLightCommits.push(newCommitTransactions[commitIndex].data);
        }

      }

      if (newCommitTransactions[commitIndex].type == EnumCommitType.SPLIT) {
        let index = response.findIndex(commit => commit.inboundDeliveryNumber == newCommitTransactions[commitIndex].id);
        if (index != -1) {
          // updating split commit in commit transaction
          let oldCommitIndex = commitTransactionDetails.findIndex((commit: any) => commit.id == response[index].inboundDeliveryNumber)
          let updatedCommit = commitTransactionDetails[oldCommitIndex];
          updatedCommit.datagridInfo = { index: index };
          commitTransactionDetails.splice(commitIndex, 1);
          commitTransactionDetails.push(updatedCommit);
        }
        // checking if children commits are present in API response
        for (let datagridCommitIndex = 0; datagridCommitIndex < newCommitTransactions[commitIndex].data.length; datagridCommitIndex++) {
          let splitIndex = response.findIndex(commit => commit.inboundDeliveryNumber == newCommitTransactions[commitIndex].data[datagridCommitIndex].inboundDeliveryNumber);
          if (splitIndex != -1) {
            isPresent = true;
          }
          else {
            highLightCommits.push(newCommitTransactions[commitIndex].data[datagridCommitIndex])
          }
        }
      }

      if (newCommitTransactions[commitIndex].type == EnumCommitType.MERGE) {
        let index = response.findIndex(commit => commit.inboundDeliveryNumber == newCommitTransactions[commitIndex].data.inboundDeliveryNumber);
        if (index != -1) {
          //Updating index of the commit already present
          let oldCommitIndex = commitTransactionDetails.findIndex((commit: any) => commit.id == response[index].inboundDeliveryNumber)
          let updatedCommit = commitTransactionDetails[oldCommitIndex];
          updatedCommit.datagridInfo = { index: index };
          commitTransactionDetails.splice(commitIndex, 1);
          commitTransactionDetails.push(updatedCommit);
          isPresent = true;
        }
        else {
          highLightCommits.push(newCommitTransactions[commitIndex].data);
        }
      }


      if (highLightCommits) {
        for (let i = 0; i < highLightCommits.length; i++) {
          response.unshift(highLightCommits[i])
        }
      }
      // }
    }
    let updatedDetails = { response: response, commitTransactionDetails: commitTransactionDetails }
    return updatedDetails;
  }

  // For setting index of already present commit in API response
  updateCommitTransaction(response: Commit[], commitTransactionDetails: any, state: any) {

    let result = commitTransactionDetails;
    let editIndex = commitTransactionDetails.findIndex((commit: any) => commit.type == EnumCommitType.EDIT)
    let splitIndex = commitTransactionDetails.findIndex((commit: any) => commit.type == EnumCommitType.SPLIT)
    let mergeIndex = commitTransactionDetails.findIndex((commit: any) => commit.type == EnumCommitType.MERGE)

    if (editIndex != -1 || splitIndex != -1 || mergeIndex != -1) {

      if (editIndex != -1) {
        result = this.setCommitIndex(commitTransactionDetails, editIndex, response, state)
      }
      else if (splitIndex != -1) {
        result = this.setCommitIndex(result, splitIndex, response, state)
      }
      else if (mergeIndex != -1) {
        result = this.setCommitIndex(result, mergeIndex, response, state)
      }

    }
    return result;
  }

  setCommitIndex(commitTransactionDetails: any, index: number, response: Commit[], state: any) {

    if (commitTransactionDetails[index].datagridInfo && typeof commitTransactionDetails[index].datagridInfo.index != 'number') {
      let commitIndex = response.findIndex(commit => commit.inboundDeliveryNumber == state.commitTransactionDetails[index].id)
      if (commitIndex != -1) {
        let updatedCommit = commitTransactionDetails[index];
        updatedCommit.datagridInfo.index = commitIndex;
        commitTransactionDetails.splice(index, 1);
        commitTransactionDetails.push(updatedCommit);
      }
    }
    return commitTransactionDetails;
  }
  //Get Children forecast from state if available, otherwise get it from API
  async setChildrenForecast(state: SupplyVisibilityStateModel, parameters: BasicParameters) {

    if (this.forecastsData[parameters.partNumber] && SupplyVisibilityState.isForecastDataChanged) {
      return this.forecastsData[parameters.partNumber];
    }

    else {
      let data = {
        partNumber: parameters.partNumber,
        vendorCode: parameters.vendorCode,
        mmViewID: parameters.mmViewID,
        plant: parameters.plant,
        records: parameters.records,
        variant: parameters.variant,
        widgetId: parameters.widgetId,
        dummyCommitHeaders: state.dummyCommitsHeaders
      }
      console.log('CALLING CHILDREN PN API!! --------------')
      console.log(state.childrenPNInfo)
      const virtualVcChildList: any[] = state.forecast.mergeProjections ? state.forecast.mergeProjections : [];
      let virtualVcForecasts: ForecastVirtualVc[] = await this.supplyVisibilityService.getChildrenPnForecast(data, virtualVcChildList);
      if (virtualVcForecasts && virtualVcForecasts.length) {

        this.forecastsData[parameters.partNumber] = { data: virtualVcForecasts }

      }
      else {
      }
    }
    SupplyVisibilityState.isForecastDataChanged = true;
    return this.forecastsData[parameters.partNumber];
  }

  isVirtualVC(state: SupplyVisibilityStateModel) {
    return (state.basicParameters.vendorCode == 'VirtualVC')
  }

  isValidPn(state: any, partNumber: string, vendorCode: string) {
    if (state && state.basicParameters) {
      return (state.basicParameters.partNumber == partNumber || state.basicParameters.vendorCode == vendorCode)
    }
    return;
  }


  //#endregion Helper Functions

  //#region LinkEvents Feature
  @Action(HandleLinkEvents)
  handleSpecialLinkEvents({
  }: StateContext<SupplyVisibilityStateModel>,
    { event }: HandleLinkEvents
  ) {

    if (!Helper.getLinkEventRegex(true).test(event)) {
      return;
    }

    //Process Event Data
    let eventName: string, eventValue: string;
    const eventNameMatch = event.match(/-[a-z]+:/gm);
    eventName = eventNameMatch ? eventNameMatch[0] : '';
    eventName = eventName ? eventName.substring(1, eventName.length - 1) : '';
    const eventValueMatch = event.match(/:[0-9]+/gm);
    eventValue = eventValueMatch ? eventValueMatch[0] : '';
    eventValue = eventValue ? eventValue.substring(1, eventValue.length) : '';
    const linkEventDialogRef = this.openLinkEventDialog(eventName);

    //Events
    switch (eventName) {
      case 'commit':
        this.onCommitEditEvent(eventName, eventValue);
        break;
      case 'deleteCommit':
        //To be Implemented
        break;
      /*ADD Other Events*/
      default:
        //Unknown Event
        break;
    }


  }

  /**
   * Show Loading Screen While Link event process in background
   * @param eventName
   * @returns dialog ref for customization
   */
  openLinkEventDialog(eventName: string): any {
    const dialogRef = this.dialog.open(LinkEventsDialogComponent, {
      // height: '100px',
      width: '400px',
      disableClose: true,
      data: {
        content: this.translate.instant(`supply-visibility.linkEvent-${eventName}`),
        hideHeader: true
      },
    });
    return dialogRef;
  }

  //#region Commit Link Event
  private async onCommitEditEvent(eventName: string, eventValue: string): Promise<string | void> {

    let commitData: any[] = await firstValueFrom(this.commitsService.getCommits([{ key: 'inboundDeliveryNumber', value: eventValue }])).catch(
      () => { commitData = [] }
    )
    if (commitData && commitData.length) {
      const commit = commitData.find(e => e.inboundDeliveryNumber == eventValue);
      if (commit) {
        let commitWithModifiedDates = this.dateService.commitHistoryTableDates({ ...commit });
        this.store.dispatch(new TriggerLinkEventCommitDialog({ eventName: eventName, eventValue: commitWithModifiedDates }));
        this.store.dispatch(new HandleLinkEventsSuccess());
      } else {
        this.onCommitEditError(eventName, eventValue);
      }
    } else {
      this.onCommitEditError(eventName, eventValue);
    }
  }
  private onCommitEditError(eventName: string, eventValue: string): void {
    this.store.dispatch(new HandleLinkEventsError());
    const errorMsg = `${this.translate.instant(`supply-visibility.linkEvent-${eventName}-error`)} ${eventValue}!`;
    this.notification.showError(errorMsg);
    console.log(errorMsg);
  }
  //#endregion Commit Link Event
  /* Add Other Link Event Functionality*/
  //#endregion LinkEvents Feature

  /**
   * @param parameters
   * @returns childrenList from cache if available, otherwise from API
   */
  // async getChildrenPNList(parameters) {
  //   if (this.virtualPnChildList[parameters.partNumber]) { return this.virtualPnChildList[parameters.partNumber] }
  //   else {
  //     let childrenPNList = await this.supplyVisibilityService.getVirtualPnChildList(parameters.partNumber)
  //     this.virtualPnChildList[parameters.partNumber] = childrenPNList;
  //     return childrenPNList;
  //   }
  // }
  @Action(SetDefaultDashboardSettings)
  setDefaultDashboard({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { data, key }: { data: any, key: string }) {
    const state = getState();
    if (key == 'defaultDashboardId') {
      let defaultDashboardId = state.DefaultDashboardData.defaultDashboardId
      if (defaultDashboardId) {
        defaultDashboardId[data.plant] = data.id;
      }
      patchState({
        DefaultDashboardData: {
          defaultDashboardId: defaultDashboardId,
          isPlantChanged: state.DefaultDashboardData.isPlantChanged,
          isLogin: state.DefaultDashboardData.isLogin
        }
      })
    }
    if (key == 'isPlantChanged') {
      patchState({
        DefaultDashboardData: {
          defaultDashboardId: state.DefaultDashboardData.defaultDashboardId,
          isPlantChanged: data,
          isLogin: state.DefaultDashboardData.isLogin

        }
      })
    }
    if (key == 'isLogin') {
      patchState({
        DefaultDashboardData: {
          defaultDashboardId: state.DefaultDashboardData.defaultDashboardId,
          isPlantChanged: state.DefaultDashboardData.isPlantChanged,
          isLogin: data
        }
      })
    }
  }

  @Action(SetCommitStatus)
  setCommitStatus({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { status }: SetCommitStatus) {
    patchState({
      commitStatus: status
    })
  }

  @Action(SetAdditionalFilters)
  setAdditionalFilters({
    patchState, getState
  }: StateContext<SupplyVisibilityStateModel>, { filters }: SetAdditionalFilters) {
    patchState({
      additionalFilters: filters
    })
  }

  @Action(GetMultiProjections)
  getMultiProjection(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { payload }: GetMultiProjections) {
    this.supplyVisibilityService.getMultiProjections(payload).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          dispatch(new GetMultiProjectionsSuccess(res));
        }
      },
      error: (error) => {
        dispatch(new GetMultiProjectionsError(error));
      }
    }
    );
  }

  @Action(GetTemplateSettings)
  getTemplateSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { params }: GetTemplateSettings) {
    this.supplyVisibilityService.getTemplateSettings(params).subscribe({
      next: (res) => {
        if (res) {
          dispatch(new GetTemplateSettingsSuccess(res));
        }
      },
      error: (error) => {
        dispatch(new GetTemplateSettingsError(error));
      }
    }
    );
  }

  @Action(GetTemplateSettingsByID)
  getTemplateSettingsByGetTemplateSettingsByID(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { id }: GetTemplateSettingsByID) {
    this.supplyVisibilityService.getTemplateSettingsByID(id).subscribe({
      next: (res) => {
        if (res) {
          dispatch(new GetTemplateSettingsByIDSuccess(res));
        }
      },
      error: (error) => {
        dispatch(new GetTemplateSettingsByIDError(error));
      }
    }
    );
  }

  @Action(UpdateTemplateSettings)
  updateTemplateSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { payload }: UpdateTemplateSettings) {
    this.supplyVisibilityService.updateTemplateSettings(payload).subscribe({
      next: (res) => {
        // if (res) {
        dispatch(new UpdateTemplateSettingsSuccess(res));
        // }
      },
      error: (error) => {
        dispatch(new UpdateTemplateSettingsError(error));
      }
    }
    );
  }

  @Action(CreateTemplateSettings)
  createTemplateSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { data }: CreateTemplateSettings) {
    this.supplyVisibilityService.createTemplateSettings(data).subscribe({
      next: (res) => {
        if (res) {
          dispatch(new CreateTemplateSettingsSuccess(res));
        }
      },
      error: (error) => {
        dispatch(new CreateTemplateSettingsError(error));
      }
    }
    );
  }

  @Action(DeleteTemplateSettings)
  deleteTemplateSettings(
    { dispatch }: StateContext<SupplyVisibilityStateModel>,
    { id }: DeleteTemplateSettings) {
    this.supplyVisibilityService.deleteTemplateSettings(id).subscribe({
      next: (res) => {
        dispatch(new DeleteTemplateSettingsSuccess());
      },
      error: (error) => {
        dispatch(new DeleteTemplateSettingsError(error));
      }
    });

  }
}
