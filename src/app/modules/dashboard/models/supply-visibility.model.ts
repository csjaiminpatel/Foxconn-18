export interface Commit {
  id?: string;
  dummyCommitHeaderID?: string;
  isModifyByDummy?: boolean;
  dummyCommit?: DummyCommitDetail;
  quantity: number;
  etaDate: string;
  etdDate: string;
  purchaseOrderNumber: string;
  purchaseOrderLine: string;
  invoiceNumber?: string;
  partNumber: string;
  trackNumber: string;
  deliveryDate?: string;
  containerNumber: string;
  inboundDeliveryNumber?: string;
  editBy?: string;
  inboundDeliveryDate?: string;
  actualETADate?: string;
  expirationDate?: string;
  slotDate?: string;
  etaPortDate?: string;
  asn: number;
  recomitRequestDate: string;
  shipped: boolean;
  unitWeight: string;
  isUsedInETA?: boolean;
  invalidEta?: boolean;
  remark?: string;
  receiveDate?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  requestDate?: string;
  triggerDate?: string;
  mfgPartner?: string;
  mpn?: string;
  batchNo?: string;
  forwarder?: string;
  expressFlag?: string;
  thirdPartyPaid?: string;
  typeOfTransportation?: string;
  msrRemarks?: string;
  shortageComment?: string;
  reason?: number;
  reasonDetail?: string;
  eddDate?: string;
  apsRelevant?: string;
  scheduleLineDate?: string;
  scheduleLine?: string;
  status?: string;
  vendorCode?: string;
  chooseVendor?: string;
  responsibleEmail?: string;
  order?: string;
  parentID?: string;
  instructionEtaDate?: string;
  otmReceivedDate?: string;
  otmReceiptType?: string;
  otmTransactionID?: string;
  mergedInboundDeliveryNumber?: string;
  mergedQuantity: number;
  rq?: string;
  transportID?: string;
  sapDeliveryDate?: string;
  purchasingDocumentDate?: string;
  lastUpdateDate?: string;
  requestQuantity?: string;
  revision?: string;
  carrier?: string;
  remainingQuantity?: number;
  codeDate?: string;
  arrivalDate?: string;
  creator?: string;
  stockType?: string;
  hasDocuments?: boolean;
  [key: string]: any;

}

export interface SvUrlWithParams {
  url: string;
  params: {};
}

export interface DummyCommitHeader {
  name: string;
  id?: string;
  partNumber: string;
  vendorCode?: string;
  dateCreated?: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
  forPrecalculate?: boolean;
  enumSimulationSet?: number;
}
export class DummyCommitHeaderCls {
  name?: string;
  id?: string;
  partNumber?: string;
  vendorCode?: string;
  dateCreated?: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
  details?: [any];
}
export interface DummyCommitHeadersFilter {
  partNumber?: string;
  vendorCode?: string;
}
export interface DummyCommitDetail {
  id?: string;
  dummyCommitHeaderID: string;
  partNumber: string;
  vendorCode: string;
  inboundDeliveryNumber: string;
  deliveryDate: string;
  quantity: number;
  etaDate: string;
  etdDate: string;
  purchaseOrderNumber: string;
  purchaseOrderLine: string;
  invoiceNumber?: string;
  actualETADate?: string;
  expirationDate?: string;
  slotDate?: string;
  etaPortDate?: string;
  trackNumber: string;
  containerNumber: string;
  asn: number;
  recomitRequestDate: string;
  shipped: boolean;
  unitWeight: number;
  isUsedInETA: boolean;
  invalidEta: boolean;
  remark?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  requestDate?: string;
  triggerDate?: string;
  mfgPartner?: string;
  mpn?: string;
  batchNo?: string;
  forwarder?: string;
  expressFlag?: string;
  thirdPartyPaid?: string;
  typeOfTransportation?: string;
  msrRemarks?: string;
  shortageComment?: string;
  reason?: number;
  reasonDetail?: string;
  eddDate?: string;
  apsRelevant?: string;
  scheduleLineDate?: string;
  scheduleLine?: string;
  status?: string;
  chooseVendor?: string;
  codeDate?: string;
  arrivalDate?: string;
  creator?: string;
  stockType?: string;
  hasDocuments?: boolean;
}

export interface BasicParameters {
  plant: string;
  partNumber: string;
  vendorCode?: string;
  weeks?: number;
  days?: number;
  mmViewID?: string;
  currentPartNumber?: number;
  widgetId?: string;
  $loaded?: boolean;
  $avlLoaded?: boolean;
  records?: number;
  variant?: string;
}
export interface VendorParametersFilter {
  vendors: string[];
  partNumbers: string[];
}
export interface UserSettingsParameters {
  key: string; //dashboard name
}
export interface PnReviewed {
  partNumber: string;
  vendorCode: string;
  flag: string;
}
export interface PnVendorCode {
  plant?: string;
  partNumber?: string;
  vendorCode?: string;
}
export class DateRangeParameters {
  dateFrom?: any;
  dateTo?: any;
}
export class CommitVisualization {
  pageSettings?: { pageSize: number, pageIndex: number };
  columnSort: any[] = [];
}
export class CommonSvVisualization {
  svSplitAreaSize?: SvSplitAreaSize;
  svSidebarOpened?: boolean;
  svSidebarOpenedSection?: EnumSvSidebarSection;
}
export interface SvSplitAreaSize {
  mainView: number;
  sidebar: number;
}
export enum EnumSvSidebarSection {
  None = -1,
  Notes = 0,
  Comments = 1,
  PNInfo = 2,
  PredefinedComments = 3,
}
export interface NewCommit extends Commit, BasicParameters { }

export interface PurchaseOrders {
  purchaseOrderNumber: string;
  purchaseOrderItems: purchaseOrderItem[];
}

export class purchaseOrderItem {
  purchaseOrder_Item?: string;
  openCommitQuantity?: string;
}


export interface UserSettings {
  key: string;
  data: string;
}

export interface DefaultDashboardSettings {
  defaultDashboardId?: { [key: string]: string; },
  isPlantChanged?: boolean,
  isLogin?: boolean
}

export interface DialogResult {
  status: boolean;
  data?: any;
  msg?: string;
  error?: any;
}
export interface DeleteDialogData {
  title?: string;
  confirmationMessage?: string;
  positiveBtnTitle?: string;
  negativeBtnTitle?: string;
  callbackData?: any;
  positiveCallbackFunction?: (dialogRef: any, args: any) => void;
  negativeCallbackFunction?: (dialogRef: any, args: any) => void;
}

export interface WaterfallDto {
  date?: string,
  partNoVendors?: PnVendorCode[],
  ColumnPeriods?: number,
  RowPeriods?: number,
}

export class UserSettingsCls {
  key?: string;
  data?: string;
}

export type NewUserSetting = UserSettings
export enum EnumKeyValuePairs {
  All = 0,
  Vendor = 1,
  Formula = 2,
  Buyer = 3,
}
export enum EnumPartNoFilters {
  FixedList = 0,
  Criteria = 1,
}

export enum EnumReviewedStatus {
  AllPNs = 0,
  OnlyReviewedPNs = 1,
  ToBeReviewed = 2,
}

export enum EnumMMViews {
  NO_DATA = 0,
  FOUND = 1,
  NOT_FOUND = 2,
}

export enum EnumControls {
  CheckBox = 0,
  TextBox = 1,
  TextArea = 2,
  NumericBox = 3,
  ComboBox = 4,
}
export enum EnumSaveStates {
  Init = 10,
  InProgress = 20,
  Finished = 30,
}
export enum EnumRequestStatusStatus {
  Processing = 'PROCESSING',
  Success = 'SUCCESS',
  Error = 'ERROR',
  Notfound = "NOTFOUND"
}
export class KeyValuePair {
  key: number;
  name: string;
  /**
   *
   */
  constructor(key: number, name: string) {
    this.key = key;
    this.name = name;
  }
  public static getPartNoFilterOptions(): KeyValuePair[] {
    const list = [];
    list.push(new KeyValuePair(EnumPartNoFilters.FixedList, 'fixedList'));
    list.push(new KeyValuePair(EnumPartNoFilters.Criteria, 'criteria'));
    return list;
  }
  public static getReviewedStatuses(): KeyValuePair[] {
    const list = [];
    list.push(new KeyValuePair(EnumReviewedStatus.AllPNs, 'allPNs'));
    list.push(new KeyValuePair(EnumReviewedStatus.OnlyReviewedPNs, 'onlyReviewedPNs'));
    list.push(new KeyValuePair(EnumReviewedStatus.ToBeReviewed, 'toBeReviewed'));
    return list;
  }
  public static getOperatorsList(): string[] {
    const list = ['=', '>', '>=', '<', '<='];
    return list;
  }
}

export class KeyTypePair {
  key: string;
  type: EnumControls;
  /**
   *
   */
  constructor(key: string, type: EnumControls) {
    this.key = key;
    this.type = type;
  }

  public static getAdditionalFilterList(config: any): KeyTypePair[] {

    let data: any[] = [];
    //change condition on other cases
    if (config.widgetType != "commitList") {
      const list = [];
      if (config.widgetType == "invoiceList") {
        list.push(new KeyTypePair('VendorCode', EnumControls.TextArea));
        list.push(new KeyTypePair('InvoiceNumber', EnumControls.TextArea));
      } else {
        list.push(new KeyTypePair('filterVendorCodes', EnumControls.TextArea));
        list.push(new KeyTypePair('filterBuyers', EnumControls.TextArea));
        list.push(new KeyTypePair('filterContacts', EnumControls.TextArea));
        list.push(new KeyTypePair('filterDeliveryTerms', EnumControls.TextArea));
        list.push(new KeyTypePair('filterTaxCodes', EnumControls.TextArea));
        list.push(new KeyTypePair('filterVirtualVC', EnumControls.CheckBox));
        list.push(new KeyTypePair('filterLeadtimeQuery', EnumControls.NumericBox));
        list.push(new KeyTypePair('filterMaterialGroups', EnumControls.TextArea));
        list.push(new KeyTypePair('flags', EnumControls.TextArea));
        list.push(new KeyTypePair('filterExcludeVendorCodes', EnumControls.TextArea));
        list.push(new KeyTypePair('filterExcludeMaterialGroups', EnumControls.TextArea));
        list.push(new KeyTypePair('filterVirtualVCIncludeChild', EnumControls.CheckBox));
      }
      data = list;
    }

    else if (config.widgetType == "commitList") {
      const list = [];
      list.push(new KeyTypePair('vendorCode', EnumControls.TextArea));
      list.push(new KeyTypePair('partNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('purchaseOrderNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('purchaseOrderLine', EnumControls.TextArea));
      list.push(new KeyTypePair('inboundDeliveryNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('invoiceNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('trackNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('containerNumber', EnumControls.TextArea));
      list.push(new KeyTypePair('forwarder', EnumControls.ComboBox));
      list.push(new KeyTypePair('remark', EnumControls.TextArea));


      if (config.mapControls) {
        //use mapping if fields come from api and dont have control type
        const mappedList = [];
        for (let i = 0; i < config.fields.length; i++) {
          const index = list.findIndex((e: KeyTypePair) => {
            return e.key.toLowerCase().includes(config.fields[i].toLowerCase());
          })
          if (index != -1) {
            mappedList.push(new KeyTypePair(config.fields[i], list[index].type))
          } else {
            mappedList.push(new KeyTypePair(config.fields[i], EnumControls.TextArea))
          }
        }
        data = mappedList;
      }
      else {
        //no map
        data = list;
      }
    }

    //IMPLEMENT Other Addition Widgets

    return data;
  }
}

export interface CommitsFilterDTO {
  dateFrom?: Date;
  dateTo?: Date;
  partNumbers?: string[];
  vendorCodes?: string[];
  inboundDeliveryNumbers?: string[];
  purchaseOrderNumbers?: string[];
  purchaseOrderLines?: string[];
  invoiceNumbers?: string[];
  trackNumbers?: string[];
  status?: string;
}
export interface CommitsFilterStrDtDTO {
  dateFrom?: string;
  dateTo?: string;
  partNumbers?: string[];
  vendorCodes?: string[];
  contacts?: string[];
  inboundDeliveryNumbers?: string[];
  purchaseOrderNumbers?: string[];
  purchaseOrderLines?: string[];
  invoiceNumbers?: string[];
  trackNumbers?: string[];
  status?: string[];
  ContainerNumber?: string[];
  Forwarder?: string[];
  Remark?: string[];
  [key: string]: any;
}
export interface CommitsFilterDownloadDTO extends CommitsFilterStrDtDTO {
  dateFrom?: string;
  dateTo?: string;
  commitIDs?: string[];
  Fields?: string[];
  sorts?: any;
  type?: string;

}

export interface UploadCommits {
  inboundDeliveryNumbers: any[];
  Fields: any[];
  includeParentIDs: any[];
  status: any[];
  type: string;
}

export interface CommitsFilterUIModel {
  dateType?: string;
  dateFrom: Date;
  dateTo: Date;
  partNumbers?: string;
  vendorCodes?: string;
  inboundDeliveryNumbers?: string;
  purchaseOrderNumbers?: string;
  purchaseOrderLines?: string;
  invoiceNumbers?: string;
  trackNumbers?: string;
  status?: string[];
  commitIDs?: string;
  ContainerNumber?: string;
  Forwarder?: string[];
  Remark?: string;
  sorts?: any;
  buyers?: string;
  rqs?: string;
  creators?: string;
  contacts?: boolean;
  includeParentIDs?: string[];
  CheckLargeData?: boolean;
}
export interface BatchEditCommits {
  inboundDeliveryNumbers: string[];
  fields: { key: string; value: string | boolean | Date | number }[];
}
export interface notificationSignalRDto {
  Id: string;
  IsRead?: string;
  DateCreated?: string;
  UserId?: string;
  Title?: string;
  Message?: string;
}
export interface PageHeaderAction {
  actionType: EnumPageHeaderAction;
  actionData: any;
}
export enum EnumPageHeaderAction {
  DashboardAdd = 0,
  DashboardEdit = 1,
  DashboardCopy = 2,
  DashboardDelete = 3,
  DashboardLock = 4,
  //Add Other Events
  DashboardImport = 5,
  DashboardLoading = 10,
}

export enum EnumCommitFieldStructure {
  CommitTable = 0,
  CommitForm = 1,
  BulkEditForm = 2,
  SplitForm = 3,
  HistoryTable = 4,
  DocumentTable = 5,
  DocumentCreateForm = 6,
  DocumentEditForm = 7,
  ChartSettingsTable = 8,
  ChartSettingsCreateForm = 9,
  ChartSettingsEditForm = 10,
  CommitHistoryTable = 11,
  TemplateFilterTable = 12,
  TemplateFilterCreateForm = 13,
  TemplateFilterEditForm = 14
}

export enum EnumSplitEvents {
  Start = 0,
  End = 1,
  InProgress = 2,
}
export class FieldVisibilitySetting {
  field?: string;
  visible = false;
  index?: number;
}
export interface ManufacturerDetailsDto {
  partNumber: string;
  vendorCode: string;
  mfgpn: string;
  mfgName: string;
  productRevision: string;
  cpnStatusCode: string;
  primaryKey?: number;
}

export interface BuyersInfo {
  active: boolean;
  additionalInfos?: any[];
  addresses?: any[];
  contactType?: string;
  email?: string;
  firstName?: string;
  id?: string;
  identityKey?: string;
  lastName?: string;
  partNumber?: string;
  validFrom?: Date;
  validTo?: Date;
  vendorCode?: string;
}
