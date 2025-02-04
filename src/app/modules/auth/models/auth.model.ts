export interface AuthenticatedUser {
  token: string;
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

//#region UserRightsModels
export interface UserRights {
  widgetRights?: WidgetsRights;
  supplyVisibilityRights?: SupplyVisibilityRights;
  commitsModuleRights?: CommitsModuleRights;
  configurationRights?: ConfigurationRights;
  dashboardRights?: DashboardsRights;
  vendorListRights?: VendorListRights;
  finantialModuleRights?: FinancialModuleRights;
  dateTypeRights?: DateTypeRights;
  dateTypeRightList?: string[];
  menuAccessRightList?: string[];
  widgetAccessRightList?: string[];
  statusRightList?: string[];
}

export interface WidgetsRights {
  viewWidget?: boolean;
  changeWidget?: boolean;
  createWidget?: boolean;
}

export interface SupplyVisibilityRights {
  forecastView?: boolean;
  graphsView?: boolean;
  graphsEdit?: boolean;
  manageCommits?: boolean;
  massChanges?: boolean;
  dummyCommits?: boolean;
  manageDummyCommits?: boolean;
  commitsLayout?: boolean;
  notesView?: boolean;
  notesEdit?: boolean;
  commentsView?: boolean;
  commentsEdit?: boolean;
  masterDataView?: boolean;
  deleteCommits?: boolean;
  cancelCommits?: boolean;
  reviewFlags?: boolean;
  reviewFlagsEdit?: boolean;
  reviewFlagsForBuyer?: boolean;
  reviewFlagsForBuyerEdit?: boolean;
  reviewFlagsForCustomer?: boolean;
  reviewFlagsForCustomerEdit?: boolean;
  reviewFlagsForSupplier?: boolean;
  reviewFlagsForSupplierEdit?: boolean;
  splitCommits?: boolean;
  mergeCommits?: boolean;
  remergeCommits?: boolean;
  manageSimulationSets?: boolean;
  selectCommitFields?: boolean;
  disableCommitManagement?: boolean;
  managePredefinedComments?: boolean;
}

export interface CommitsModuleRights {
  searchCommits?: boolean;
  downloadExcel?: boolean;
  createCommits?: boolean;
  editCommits?: boolean;
  massChanges?: boolean;
  layoutChanges?: boolean;
  cancelCommits?: boolean;
  deleteCommits?: boolean;
  splitCommits?: boolean;
  mergeCommits?: boolean;
  lockCommit?: boolean;
  remergeCommits?: boolean;
  deletePLO?: boolean;
  selectFields?: boolean;
  defaultFieldsSetup?: boolean;
  documentsView?: boolean;
  documentsCreate?: boolean;
  documentsDelete?: boolean;
}
export interface ConfigurationRights {
  virtualGroupsView?: boolean;
  virtualGroupsChange?: boolean;
  manageViews?: boolean;
  vendorCodesView?: boolean;
  vendorCodesChange?: boolean;
  materialManagementViewsView?: boolean;
  reviewVisibility?: boolean;
  reviewVisibilityForBuyer?: boolean;
  reviewVisibilityForSupplier?: boolean;
  reviewVisibilityForCustomer?: boolean;
  searchConfiguration?: boolean;
  qapSettings?: boolean;
}

export interface FinancialModuleRights {
  invoicesView?: boolean;
  invoicesExport?: boolean;
  goodReceipts?: boolean;
  invoiceReconcilation?: boolean;
  quotations?: boolean;
}

export interface DashboardsRights {
  sharedDashboards?: boolean;
  dashboardEdit?: boolean;
  dashboardView?: boolean;
}

export interface VendorListRights {
  vendorCreate?: boolean;
  vendorView?: boolean;
  vendorEdit?: boolean;
  vendorDelete?: boolean;
  notificationsSetupView?: boolean;
  notificationsSetupEdit?: boolean;
  flagEdit?: boolean;
  partNumbersView?: boolean;
  partNumbersEdit?: boolean;
  partNumbersDelete?: boolean;
  buyersView?: boolean;
  buyersManage?: boolean;
}

export interface DateTypeRights {
  sapDeliveryDate?: boolean;
  etaDate?: boolean;
  deliveryDate?: boolean;
  etdDate?: boolean;
  slotDate?: boolean;
  requestDate?: boolean;
  triggerDate?: boolean;
  recomitRequestDate?: boolean;
  eddDate?: boolean;
  instructionEtaDate?: boolean;
  otmReceivedDate?: boolean;
  actualETADate?: boolean;
  receiveDate?: boolean;
  plannedOrderStatus?: boolean;
}

export interface dateTypeRightList {
  dateTimeName: string;
}
[];

export const authUrlPaths = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
};

export interface AuthenticationStateModel {
  token: string;
  tenants: string[];
  activeTenant: string;
  isLoggedIn: boolean;
  applicationForm: any;
  username: string;
  upn: string;
  primarySid: string;
  plant: any;
  plants: any[];
  supplyVisibilityRights?: SupplyVisibilityRights;
  commitsModuleRights?: CommitsModuleRights;
  dashboardRights?: DashboardsRights;
  vendorListRights?: VendorListRights;
  configurationRights?: ConfigurationRights;
  finantialModuleRights?: FinancialModuleRights;
  dateTypeRights?: DateTypeRights;
  dateTypeRightList?: string[];
  menuAccessRightList?: string[];
  widgetAccessRightList?: string[];
  statusRightList?: string[];
  currentRole?: string;
}
