import { CommitTransactionDetails, FormKeys } from "../../models/commits.model";
import { PartNumberTransactionDetails } from "../../models/partnumbers-list.model";
import { QuotationTransactionDetails } from "../../models/quotations.model";
import { DummyCommitHeadersFilter, Commit, DummyCommitHeader, DummyCommitDetail, BasicParameters, DateRangeParameters, EnumSvSidebarSection, UserSettingsParameters, UserSettings, PnReviewed } from "../../models/supply-visibility.model";
import { SVComments } from "../../models/sv-comments.model";
import { DashboardPanelModel } from "../../models/sv-dashboard";
import { SVNotes } from "../../models/sv-notes.model";
import { SVNotification } from "../../models/sv-notification.model";
import { SVPredefinedComments } from "../../models/sv-predefined-comments.model";
import { VendorTransactionDetails } from "../../models/vendors-list.model";


/* Commits */
export class SetCommits {
  static readonly type = '[SupplyVisibility] Set Commits';
}

export class SetCommitsError {
  static readonly type = '[SupplyVisibility] Set Commits Error';
  constructor(public readonly error: any) { }
}

export class SetCommitSuccess {
  static readonly type = '[SupplyVisibility] Set Commits Success';
}

export class GetDummyCommitHeaders {
  static readonly type = '[SupplyVisibility] Get Dummy Commits Headers';
  constructor(public readonly filter?: DummyCommitHeadersFilter) { }
}

export class GetDummyCommitHeadersError {
  static readonly type = '[SupplyVisibility] Get Dummy Commits Headers Error';
  constructor(public readonly error: any) { }
}

export class GetDummyCommitHeadersSuccess {
  static readonly type = '[SupplyVisibility] Get Dummy Commits Headers Success';
}

export class CacheCommitsWithDummy {
  static readonly type = '[SupplyVisibility] Cache Commits with Dummy commits';
  constructor(public readonly partNumber: any) { }
}

export class CacheCommitsWithDummyError {
  static readonly type = '[SupplyVisibility] Cache Commits with Dummy commits Error';
  constructor(public readonly error: any) { }
}

export class CacheCommitWithDummySuccess {
  static readonly type = '[SupplyVisibility] Cache Commits with Dummy commits Success';
}

export class SetCommitsWithDummy {
  static readonly type = '[SupplyVisibility] Set Commits with Dummy commits';
  constructor(public isRefreshCommit?: any) { }
}

export class SetCommitsWithDummyError {
  static readonly type = '[SupplyVisibility] Set Commits with Dummy commits Error';
  constructor(public readonly error: any) { }
}

export class SetCommitWithDummySuccess {
  static readonly type = '[SupplyVisibility] Set Commits with Dummy commits Success';
}
export class SetCommitsWithFilter {
  static readonly type = '[SupplyVisibility] Set Commits with filter commits';
  constructor(public readonly filter: any) { }
}

export class SetCommitsWithFilterError {
  static readonly type = '[SupplyVisibility] Set Commits with filter commits Error';
  constructor(public readonly error: any) { }
}

export class SetCommitsWithFilterSuccess {
  static readonly type = '[SupplyVisibility] Set Commits with filter commits Success';
}

export class GetNotifications {
  static readonly type = '[SupplyVisibility] Get Notifications';
}

export class GetNotificationsError {
  static readonly type = '[SupplyVisibility] Get Notifications Error';
  constructor(public readonly error: any) { }
}

export class GetNotificationsSuccess {
  constructor(public readonly notifications: SVNotification[]) { }
  static readonly type = '[SupplyVisibility] Get Notifications Success';
}

export class GetNotificationsUnreadCount {
  static readonly type = '[SupplyVisibility] Get Notifications Unread Count';
}

export class GetNotificationsUnreadCountSuccess {
  constructor(public readonly count: number) { }
  static readonly type = '[SupplyVisibility] Get Notifications Unread Count Success';
}

export class ShowNotifications {
  constructor(public readonly id: string) { }
  static readonly type = '[SupplyVisibility] Show Notifications';
}

export class GetNotificationDetails {
  constructor(public readonly id: string) { }
  static readonly type = '[SupplyVisibility] Get Notification Details';
}
export class GetNotificationDetailsSuccess {
  constructor(public readonly details: SVNotification) { }
  static readonly type = '[SupplyVisibility] Get Notification Detail Success';
}
export class GetNotificationDetailsError {
  static readonly type = '[SupplyVisibility] Get Notification Detail Error';
}

export class SetAllNotificationsAsRead {
  static readonly type = '[SupplyVisibility] Get All Notifications As Read';
}

export class AddCommit {
  static readonly type = '[SupplyVisibility] Add Commit';
  constructor(public readonly commit: Commit) { }
}

export class EditCommit {
  static readonly type = '[SupplyVisibility] Update Commit';
  constructor(public readonly commit: Commit) { }
}

export class EditCommitError {
  static readonly type = '[SupplyVisibility] Edit Commit Error';
  constructor(public readonly error: any) { }
}

export class EditCommitSuccess {
  static readonly type = '[SupplyVisibility] Edit Commit Success';
  constructor(public readonly commit?: Commit) { }
}

export class DeleteCommit {
  static readonly type = '[SupplyVisibility] Delete Commit';
  constructor(
    public readonly commit: any,
    public readonly baseModule?: string,
    public readonly lowerTriggerUrl?: string,) { }
}

export class DeleteCommitError {
  static readonly type = '[SupplyVisibility] Delete Commit Error';
  constructor(public readonly error: any) { }
}

export class DeleteCommitSuccess {
  static readonly type = '[SupplyVisibility] Delete Commit Success';
}

export class AddCommitError {
  static readonly type = '[SupplyVisibility] Add Commit Error';
  constructor(public readonly error: any) { }
}

export class AddCommitSuccess {
  static readonly type = '[SupplyVisibility] Add Commit Success';
}

export class AddCommitNotify {
  static readonly type = '[SupplyVisibility] Add Commit Notify';
  constructor(public readonly commit: Commit) { }
}

export class AddDummyCommitHeader {
  static readonly type = '[SupplyVisibility] Add Dummy Commit Header';
  constructor(public readonly commit: DummyCommitHeader, public readonly filter?: DummyCommitHeadersFilter) { }
}

export class AddDummyCommitHeaderError {
  static readonly type = '[SupplyVisibility] Add Dummy Commit Header Error';
  constructor(public readonly error: any) { }
}

export class AddDummyCommitHeaderSuccess {
  static readonly type = '[SupplyVisibility] Add Dummy Commit Header Success';
}

export class UpdateDummyCommitHeader {
  static readonly type = '[SupplyVisibility] Update Dummy Commit Header';
  constructor(public readonly header: DummyCommitHeader, public readonly filter?: DummyCommitHeadersFilter) { }
}

export class UpdateDummyCommitHeaderError {
  static readonly type = '[SupplyVisibility] Update Dummy Commit Header Error';
  constructor(public readonly error: any) { }
}

export class UpdateDummyCommitHeaderSuccess {
  static readonly type = '[SupplyVisibility] Update Dummy Commit Header Success';
}

export class DeleteDummyCommitHeader {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit Header';
  constructor(public readonly header: DummyCommitHeader, public readonly filter?: DummyCommitHeadersFilter) { }
}

export class DeleteDummyCommitHeaderError {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit Header Error';
  constructor(public readonly error: any) { }
}

export class DeleteDummyCommitHeaderSuccess {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit Header Success';
}

export class AddDummyCommit {
  static readonly type = '[SupplyVisibility] Add Dummy Commit';
  constructor(public readonly commit: DummyCommitDetail) { }
}

export class AddDummyCommitError {
  static readonly type = '[SupplyVisibility] Add Dummy Commit Error';
  constructor(public readonly error: any) { }
}

export class AddDummyCommitSuccess {
  static readonly type = '[SupplyVisibility] Add Dummy Commit Success';
}

export class EditDummyCommit {
  static readonly type = '[SupplyVisibility] Edit Dummy Commit';
  constructor(public readonly commit: DummyCommitDetail) { }
}

export class EditDummyCommitError {
  static readonly type = '[SupplyVisibility] Edit Dummy Commit Error';
  constructor(public readonly error: any) { }
}

export class EditDummyCommitSuccess {
  static readonly type = '[SupplyVisibility] Edit Dummy Commit Success';
}

export class CancelCommit {
  static readonly type = '[SupplyVisibility] Cancel Commit';
  constructor(public readonly commit: Commit) { }
}

export class CancelCommitSuccess {
  static readonly type = '[SupplyVisibility] Cancel Commit Success';
}

export class CancelCommitError {
  static readonly type = '[SupplyVisibility] Cancel Commit Error';
  constructor(public readonly error: any) { }
}

export class DeletePLO {
  static readonly type = '[SupplyVisibility] Delete PLO';
  constructor(public readonly commit: Commit) { }
}

export class DeletePLOSuccess {
  static readonly type = '[SupplyVisibility] Delete PLO Success';
}

export class DeletePLOError {
  static readonly type = '[SupplyVisibility] Delete PLO Error';
  constructor(public readonly error: any) { }
}


export class DeleteDummyCommit {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit';
  constructor(public readonly dummyCommitDetail: DummyCommitDetail) { }
}

export class DeleteDummyCommitError {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit Error';
  constructor(public readonly error: any) { }
}

export class DeleteDummyCommitSuccess {
  static readonly type = '[SupplyVisibility] Delete Dummy Commit Success';
}

export class SetVendorCodes {
  static readonly type = '[SupplyVisibility] Set Vendor Codes';
  constructor(public readonly partNumbers: string[]) { }
}

export class SetVendorCodesError {
  static readonly type = '[SupplyVisibility] Set Vendor Codes Error';
  constructor(public readonly error: any) { }
}

export class SetVendorCodesSuccess {
  static readonly type = '[SupplyVisibility] Set Vendor Codes Success';
}
export class SetPartNumberListParametersSuccess {
  constructor(public readonly widgetId: string, public readonly pnList: BasicParameters[]) { }
  static readonly type = '[SupplyVisibility] Set Part Number List Parameters Success ';
}

export class SetPartNumberListParametersError {
  static readonly type = '[SupplyVisibility]  Set Part Number List Parameters Error';
  constructor(public readonly error: any) { }
}

export class SetCommitVendorCode {
  static readonly type = '[SupplyVisibility] Set Commit Vendor Code';
  constructor(public readonly vendorCode: string) { }
}

export class SetCommitModuleOn {
  static readonly type = '[CommitModule/SupplyVisibility] Set Commit Module on or off';
  constructor(public readonly isCommitModule: boolean) { }
}

export class SetCommitVendorCodeSuccess {
  static readonly type = '[SupplyVisibility] Set Commit Vendor Code Success';
}

export class SetBasicParameters {
  static readonly type = '[SupplyVisibility] Set Basic Parameters';
  constructor(public readonly parameters: BasicParameters) { }
}

export class SetPartNumberListParameters {
  static readonly type = '[SupplyVisibility] Part Number List Parameters';
  constructor(public readonly widgetId: string, public readonly pnList: BasicParameters[]) { }
}

export class SetActiveVendor {
  static readonly type = '[SupplyVisibility] Set Active Vendor';
  constructor(public readonly vendor: string) { }
}

export class SetPurchaseOrders {
  static readonly type = '[SupplyVisibility] Set Purchase Orders';
  constructor(public readonly parameters?: BasicParameters) { }
}
export class SetPurchaseOrdersForCM {
  static readonly type = '[SupplyVisibility] Set Purchase Orders for commit module';
  constructor(public readonly parameters?: BasicParameters) { }
}



export class SetPurchaseOrdersError {
  static readonly type = '[SupplyVisibility] Set Purchase Orders Error';
  constructor(public readonly error: any) { }
}

export class SetPurchaseOrdersSuccess {
  static readonly type = '[SupplyVisibility] Set Purchase Orders Success';
}

export class SetDateRangeParameters {
  static readonly type = '[SupplyVisibility] Set Date Range Parameters';
  constructor(public readonly parameters?: DateRangeParameters) { }
}
export class SetDateRangeParametersSuccess {
  static readonly type = '[SupplyVisibility] Set Date Range Parameters Success';
  constructor(public readonly parameters?: DateRangeParameters) { }
}
export class SetDummyCommitHeader {
  static readonly type = '[SupplyVisibility] Set Dummy Commit Header';
  constructor(public readonly header?: DummyCommitHeader) { }
}

export class SetForecastWeekRange {
  static readonly type = '[SupplyVisibility] Set Forecast Date Range';
  constructor(public readonly start: any, public readonly end: any) { }
}

/* Forecast */
export class SetForecast {
  static readonly type = '[SupplyVisibility] Set Forecast';
  constructor(public readonly id?: string) { }
}

export class SetForecastError {
  static readonly type = '[SupplyVisibility] Set Forecast Error';
  constructor(public readonly error?: any) { }
}

export class SetForecastSuccess {
  static readonly type = '[SupplyVisibility] Set Forecast Success';
  constructor(public readonly id?: string) { }
}

export class SetChildrenForecastSuccess {
  static readonly type = '[SupplyVisibility] Set Children Forecast Success';
  constructor(public readonly cachedChildrenForecast: any) { }
}

export class SetChildrenPNList {
  static readonly type = '[SupplyVisibility] Set Children PN List';
  constructor(public readonly parameters: any, public readonly id?: string) { }
}

export class CacheForecast {
  static readonly type = '[SupplyVisibility] Cache Forecast';
  constructor(public readonly cacheParameters: any) { }
}

export class CacheForecastError {
  static readonly type = '[SupplyVisibility] Cache Forecast Error';
  constructor(public readonly error?: any) { }
}

export class CacheForecastSuccess {
  static readonly type = '[SupplyVisibility] Cache Forecast Success';
  constructor(public readonly cacheParameters: any) { }
}

export class ResetSupplyVisibilityAndCommits {
  static readonly type =
    '[SupplyVisibility] Reset Supply Visibility and Commits';
}
export class ResetCache {
  static readonly type =
    '[SupplyVisibility] Reset Cache';
}

export class ResetCommitTransactionDetails {
  static readonly type =
    '[SupplyVisibility] Reset Commit Transaction Details';
}

export class ResetPlantDependentCache {
  static readonly type =
    '[SupplyVisibility] Reset Plant Dependent Cache';
}
export class ResetSupplyVisibilityPartNumberList {
  static readonly type =
    '[SupplyVisibility] Reset Supply Visibility Part Numbers List';
}

export class SetMaterialManagementViews {
  static readonly type = '[SupplyVisibility] Set Material Management Views';
}

export class SetActiveMMView {
  static readonly type = '[SupplyVisibility] Set Active MMView';
  constructor(public readonly mmView: string) { }
}

export class SetForecastRangeSelector {
  static readonly type = '[SupplyVisibility] Set Forecast Range Selector';
  constructor(public readonly rangeSelector: object[]) { }
}

export class SetSVComments {
  static readonly type = '[SupplyVisibility] Set SV Comments';
  constructor(public readonly vendor: string, public readonly partnumber: string, public readonly validatePN?: boolean) { }
}

export class SetSVCommentsSuccess {
  static readonly type = '[SupplyVisibility] Set SV Comments Success';
  constructor(public readonly comments: any) { }
}

export class SetSVCommentsError {
  static readonly type = '[SupplyVisibility] Set SV Comments Error';
  constructor(public readonly error: any) { }
}

export class CreateSVComment {
  static readonly type = '[SupplyVisibility] Create SV Comment';
  constructor(public readonly data: SVComments) { }
}

export class CreateSVCommentSuccess {
  static readonly type = '[SupplyVisibility] Create SV Comment Success';
  constructor(public readonly data: SVComments) { }
}

export class CreateSVCommentError {
  static readonly type = '[SupplyVisibility] Create SV Comment Error';
  constructor(public readonly data: SVComments) { }
}

export class UpdateSVComment {
  static readonly type = '[SupplyVisibility] Update SV Comment';
  constructor(public readonly data: SVComments) { }
}

export class UpdateSVCommentSuccess {
  static readonly type = '[SupplyVisibility] Update SV Comment Success';
  constructor(public readonly data: SVComments) { }
}

export class UpdateSVCommentError {
  static readonly type = '[SupplyVisibility] Update SV Comment Error';
  constructor(public readonly error: any) { }
}

export class DeleteSVComment {
  static readonly type = '[SupplyVisibility] Delete SV Comment';
  constructor(public readonly data: SVComments) { }
}

export class DeleteSVCommentSuccess {
  static readonly type = '[SupplyVisibility] Delete SV Comment Success';
  constructor(public readonly data: any) { }
}

export class DeleteSVCommentError {
  static readonly type = '[SupplyVisibility] Delete SV Comment Error';
  constructor(public readonly error: any) { }
}

export class SetSVPredefinedComments {
  static readonly type = '[SupplyVisibility] Set SV Predefined Comments';
  constructor(public readonly category: string) { }
}

export class CreateSVPredefinedComment {
  static readonly type = '[SupplyVisibility] Create SV Predefined Comment';
  constructor(public readonly data: SVPredefinedComments) { }
}

export class UpdateSVPredefinedComment {
  static readonly type = '[SupplyVisibility] Update SV Predefined Comment';
  constructor(public readonly data: SVPredefinedComments) { }
}

export class DeleteSVPredefinedComment {
  static readonly type = '[SupplyVisibility] Delete SV Predefined Comment';
  constructor(public readonly data: SVPredefinedComments) { }
}

export class SetSVNotesByRecord {
  static readonly type = '[SupplyVisibility] Set SV Notes by Record';
  constructor(
    public readonly modul: string,
    public readonly key: string,
    public readonly searchText?: string,
    public readonly top?: number,
    public readonly skip?: number
  ) { }
}

export class SetSVNotesByRecordSuccess {
  static readonly type = '[SupplyVisibility] Set SVNotes By Record Success';
}

export class SetSVNotesByRecordError {
  static readonly type = '[SupplyVisibility] Set SVNotes By Record Error';
  constructor(public readonly error: any) { }
}

export class CreateSVNote {
  static readonly type = '[SupplyVisibility] Create SV Note';
  constructor(public readonly data: SVNotes) { }
}

export class CreateSVNoteSuccess {
  static readonly type = '[SupplyVisibility] Create SV Note success';
}

export class UpdateSVNote {
  static readonly type = '[SupplyVisibility] Update SV Note';
  constructor(public readonly data: SVNotes) { }
}

export class DeleteSVNote {
  static readonly type = '[SupplyVisibility] Delete SV Note';
  constructor(public readonly data: SVNotes) { }
}

export class SetUserAction {
  static readonly type = '[SupplyVisibility] SetUserAction';
  constructor(public readonly action: EnumSvSidebarSection) { }
}
//#region user setting

export class SetBuyersPartNumbers {
  static readonly type = '[SupplyVisibility] Set Buyers PartNumbers';
  constructor(public readonly buyer: string) { }
}
export class GetPNsPrecalculateProjectionByFilter {
  static readonly type =
    '[SupplyVisibility] Get PNs Precalculate Projection By Filter';
  constructor(public readonly filter: string) { }
}

export class SetUserSettingParameters {
  static readonly type = '[SupplyVisibility] Set UserSettingParameters';
  constructor(public readonly parameters: UserSettingsParameters) { }
}

/* UserSettings */
export class SetUserSettings {
  static readonly type = '[SupplyVisibility] Set UserSettings';
}

export class SetUserSettingsError {
  static readonly type = '[SupplyVisibility] Set UserSettings Error';
  constructor(public readonly error: any) { }
}

export class SetUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Set UserSettings Success';
}

export class AddUserSettings {
  static readonly type = '[SupplyVisibility] Add UserSettings';
  constructor(public readonly userSettings: UserSettings, public readonly updateIdInData: boolean = true) { }
}

export class EditUserSettings {
  static readonly type = '[SupplyVisibility] Update UserSettings';
  constructor(public readonly userSettings: UserSettings, public readonly isNotificationRequired: boolean = true) { }
}

export class EditUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Edit UserSettings success';
  constructor(public readonly isNotificationRequired: boolean = true) { }
}
export class EditUserSettingsError {
  static readonly type = '[SupplyVisibility] Edit UserSettings Error';
  constructor(public readonly error: any) { }
}
export class SetPanelCacheSuccess {
  static readonly type = '[SupplyVisibility] Set PanelCache success';
  constructor(public readonly widgetId: string) { }
}

export class DeleteUserSettings {
  static readonly type = '[SupplyVisibility] Delete UserSettings';
  constructor(public readonly key: string) { }
}

export class DeleteUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Delete UserSettings success';
}
export class DeleteUserSettingsError {
  static readonly type = '[SupplyVisibility] Delete UserSettings Error';
  constructor(public readonly error: any) { }
}
export class AddUserSettingsError {
  static readonly type = '[SupplyVisibility] Add UserSettings Error';
  constructor(public readonly error: any) { }
}

export class AddUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Add UserSettings Success';
}

export class SetPnReviewed {
  static readonly type = '[SupplyVisibility] Update Precalculate Projection Reviewed';
  constructor(public readonly pnReviewed: PnReviewed) { }
}

export class DeletePnFlags {
  static readonly type = '[SupplyVisibility] Delete PN Flags';
  constructor(public readonly pnReviewed: PnReviewed, public readonly flag: string) { }
}
export class DeletePnFlagsSuccess {
  static readonly type = '[SupplyVisibility] Delete PN Flags Success';
  constructor(public readonly pnReviewed?: PnReviewed) { }
}

export class DeletePnFlagsError {
  static readonly type = '[SupplyVisibility] Delete PN Flags Error';
  constructor(public readonly pnReviewed?: PnReviewed) { }
}

export class SetPnReviewedError {
  static readonly type = '[SupplyVisibility] Update Precalculate Projection Reviewed Error';
  constructor(public readonly error: any, public readonly pnReviewed?: any) { }
}

export class SetPnReviewedSuccess {
  static readonly type = '[SupplyVisibility] Update Precalculate Projection Reviewed Success';
  constructor(public readonly pnReviewed?: any) { }
}


export class SliderChangeForMultiPN {
  static readonly type = '[SliderChangeForMultiPN] slider changed for Multi PN view';
  constructor(public readonly data: any) { }
}

export class SetNewUserVendorCodesRights {
  static readonly type = '[SetNewUserVendorCodesRights] set new rights data for VendorCodes Rights SideNav';
  constructor(public readonly data: any) { }
}

export class SetUpdateUserVendorCodesRights {
  static readonly type = '[SetUpdateUserVendorCodesRights] set update rights data for VendorCodes Rights SideNav';
  constructor(public readonly data: any) { }
}

export class CacheCommitsReasons {
  static readonly type = '[SupplyVisibility] Cache Commits Reasons';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheCommitsReasonsSuccess {
  static readonly type = "[SupplyVisibility] Cache Commits Reasons Success";
}

export class CacheCommitsReasonsError {
  static readonly type = "[SupplyVisibility] Cache Commits Reasons Error";
}

export class CacheCommitsCountries {
  static readonly type = '[SupplyVisibility] Cache Commits Countries';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheCommitsCountriesSuccess {
  static readonly type = "[SupplyVisibility] Cache Commits Countries Success";
}
export class CacheCommitsCountriesError {
  static readonly type = "[SupplyVisibility] Cache Commits Countries Error";
}
export class CacheCommitsCarriers {
  static readonly type = '[SupplyVisibility] Cache Commits Carriers';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheCommitsCarriersSuccess {
  static readonly type = "[SupplyVisibility] Cache Commits Carriers Success";
}

export class CacheCommitsCarriersError {
  static readonly type = "[SupplyVisibility] Cache Commits Carriers Error";
}

export class CacheCommitsTransportType {
  static readonly type = '[SupplyVisibility] Cache Commits Transport Type';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheCommitsTransportTypeSuccess {
  static readonly type = "[SupplyVisibility] Cache Commits Transport Type Success";
}

export class CacheCommitsTransportTypeError {
  static readonly type = "[SupplyVisibility] Cache Commits Transport Type Error";
}

export class SetWidgetCache {
  static readonly type = '[SupplyVisibility] Set Widget Cache';
  constructor(public readonly widget: DashboardPanelModel) { }
}
export class CacheReadOnlyFields {
  static readonly type = 'Get Read Only Fields';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheReadOnlyFieldsSuccess {
  static readonly type = "[SupplyVisibility] Get Read Only Fields Success";
  constructor(public readonly readonlyFieldsData?: any) { }
}
export class CacheReadOnlyFieldsError {
  static readonly type = "[SupplyVisibility] Get Read Only Fields Error";
}

export class GetFilterAdditions {
  static readonly type = 'Get Filter Additions';
}

export class GetFilterAdditionsSuccess {
  static readonly type = 'Get Filter Additions Success';
  constructor(public readonly data?: any) { }
}

export class GetFilterAdditionsError {
  static readonly type = 'Get Filter Additions Error';
  constructor(public readonly error?: any) { }
}
export class SetPlantMandatoryDates {
  static readonly type = '[SupplyVisibility] Set Plant Mandatory Dates';
  constructor(public readonly refresh?: boolean) { }
}

export class SetPlantMandatoryDatesSuccess {
  static readonly type = "[SupplyVisibility] Set Plant Mandatory Dates Success";
}

export class HandleLinkEvents {
  static readonly type = 'Process Special Link Events';
  constructor(public readonly event: string) { }
}
export class HandleLinkEventsSuccess {
  static readonly type = 'Process Special Link Events Success';
  constructor(public readonly event?: any) { }
}
export class HandleLinkEventsError {
  static readonly type = 'Process Special Link Events Error';
  constructor(public readonly event?: any) { }
}
export class TriggerLinkEventCommitDialog {
  static readonly type = 'Open Commit Dialog For Link Events';
  constructor(public readonly event: { eventName: string, eventValue: any }) { }
}

export class SetCommitTransactionDetails {
  static readonly type = 'Set Commit Transaction Details';
  constructor(public readonly commitTransactionDetails: CommitTransactionDetails) { }
}

export class PatchCommitTransactionDetails {
  static readonly type = 'Patch Commit Transaction Details';
  constructor(public readonly commitTransactionDetails: CommitTransactionDetails[]) { }
}

export class SetVendorTransactionDetails {
  static readonly type = 'Set vendor Transaction Details';
  constructor(public readonly vendorTransactionDetails: VendorTransactionDetails) { }
}

export class PatchVendorTransactionDetails {
  static readonly type = 'Patch Vendor Transaction Details';
  constructor(public readonly vendorTransactionDetails: VendorTransactionDetails[]) { }
}

export class SetQuotationTransactionDetails {
  static readonly type = 'Set Quotation Transaction Details';
  constructor(public readonly quotationTransactionDetails: QuotationTransactionDetails) { }
}

export class PatchQuotationTransactionDetails {
  static readonly type = 'Patch Quotation Transaction Details';
  constructor(public readonly quotationTransactionDetails: QuotationTransactionDetails[]) { }
}

export class SetPartNumberTransactionDetails {
  static readonly type = 'Set partnumber Transaction Details';
  constructor(public readonly partnumberTransactionDetails: PartNumberTransactionDetails) { }
}

export class PatchPartNumberTransactionDetails {
  static readonly type = 'Patch partnumber Transaction Details';
  constructor(public readonly partnumberTransactionDetails: PartNumberTransactionDetails[]) { }
}

export class GetDefaultFieldsSuccess {
  static readonly type = 'Get Default Fields Success';
  constructor(public readonly defaultFields: any) { }
}
export class GetDefaultFormSettingFormKeys {
  static readonly type = 'Get Default Form Settings Form Keys';
  constructor(public readonly moduleService: any) { }
}
export class GetDefaultFormSettingFormKeysSuccess {
  static readonly type = 'Get Default Form Settings Form Keys Success';
  constructor(public readonly keys: string[], public readonly formKeys: FormKeys[]) { }
}
export class GetDefaultFormSettingFormKeysError {
  static readonly type = 'Get Default Form Settings Form Keys Error';
  constructor(public readonly error?: any) { }
}
export class GetDefaultFormSettings {
  static readonly type = 'Get Default Form Settings';
  constructor(public readonly moduleService: any, public readonly key: string, public readonly index: number) { }
}
export class GetDefaultFormSettingsSuccess {
  static readonly type = 'Get Default Form Settings Success';
  constructor(public readonly response: any, public readonly key: string, public readonly index: number) { }
}
export class GetDefaultFormSettingsError {
  static readonly type = 'Get Default Form Settings Error';
  constructor(public readonly error?: any) { }
}
export class UpdateDefaultFormSettings {
  static readonly type = 'Update Default Form Settings';
  constructor(public readonly moduleService: any, public readonly formKey: string, public readonly updatedValues: any) { }
}
export class UpdateDefaultFormSettingsSuccess {
  static readonly type = 'Update Default Form Settings Success';
  constructor(public readonly formKey: any) { } // formKey : string TODO: Need to check JAIMIN
}
export class UpdateDefaultFormSettingsError {
  static readonly type = 'Update Default Form Settings Error';
  constructor(public readonly error?: any) { }
}

export class CacheVendorsName {
  static readonly type = '[SupplyVisibility] Cache Vendors Name';
  constructor(public readonly refresh?: boolean) { }
}

export class CacheVendorsNameSuccess {
  static readonly type = '[SupplyVisibility] Cache Vendors Name Success';
}

export class CacheVendorsNameError {
  static readonly type = '[SupplyVisibility] Cache Vendors Name Error';
}
//#endregion

export class SetDefaultDashboardSettings {
  static readonly type = '[SupplyVisibility] Set Default Dashboard Settings'
  constructor(public readonly data: any, public readonly key: any) { }
}

export class SetCommitStatus {
  static readonly type = '[SupplyVisibility] Set CommitStatus'
  constructor(public readonly status: any) { }
}

export class SetAdditionalFilters {
  static readonly type = '[SupplyVisibility] Set AdditionalFilters'
  constructor(public readonly filters: any) { }
}

export class GetMultiProjections {
  static readonly type = '[SupplyVisibility] Get Multi Projection'
  constructor(public readonly payload: any) { }
}

export class GetMultiProjectionsSuccess {
  static readonly type = '[SupplyVisibility] Get Multi Projection Success'
  constructor(public readonly res: any) { }
}

export class GetMultiProjectionsError {
  static readonly type = '[SupplyVisibility] Get Multi Projection Error'
  constructor(public readonly error: any) { }
}

export class GetTemplateSettings {
  static readonly type = '[SupplyVisibility] Get Template Settings'
  constructor(public readonly params: any) { }
}

export class GetTemplateSettingsSuccess {
  static readonly type = '[SupplyVisibility] Get Template Settings Success'
  constructor(public readonly res: any) { }
}

export class GetTemplateSettingsError {
  static readonly type = '[SupplyVisibility] Get Template Settings Error'
  constructor(public readonly error: any) { }
}

export class GetTemplateSettingsByID {
  static readonly type = '[SupplyVisibility] Get Template Settings By ID'
  constructor(public readonly id: string) { }
}

export class GetTemplateSettingsByIDSuccess {
  static readonly type = '[SupplyVisibility] Get Template Settings By ID Success'
  constructor(public readonly res: any) { }
}

export class GetTemplateSettingsByIDError {
  static readonly type = '[SupplyVisibility] Get Template Settings By ID Error'
  constructor(public readonly error: any) { }
}

export class UpdateTemplateSettings {
  static readonly type = '[SupplyVisibility] Update Template Settings'
  constructor(public readonly payload: any) { }
}

export class UpdateTemplateSettingsSuccess {
  static readonly type = '[SupplyVisibility] Update Template Settings Success'
  constructor(public readonly res: any) { }
}

export class UpdateTemplateSettingsError {
  static readonly type = '[SupplyVisibility] Update Template Settings Error'
  constructor(public readonly error: any) { }
}

export class CreateTemplateSettings {
  static readonly type = '[SupplyVisibility] Create Template Settings'
  constructor(public readonly data: any) { }
}

export class CreateTemplateSettingsSuccess {
  static readonly type = '[SupplyVisibility] Create Template Settings Success'
  constructor(public readonly res: any) { }
}

export class CreateTemplateSettingsError {
  static readonly type = '[SupplyVisibility] Create Template Settings Error'
  constructor(public readonly error: any) { }
}

export class DeleteTemplateSettings {
  static readonly type = '[SupplyVisibility] Delete Template Settings'
  constructor(public readonly id: string) { }
}

export class DeleteTemplateSettingsSuccess {
  static readonly type = '[SupplyVisibility] Delete Template Settings Success'
}

export class DeleteTemplateSettingsError {
  static readonly type = '[SupplyVisibility] Delete Template Settings Error'
  constructor(public readonly error: any) { }
}