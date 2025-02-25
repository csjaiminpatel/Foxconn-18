import {
  DummyCommitDetail,
  EnumCommitFieldStructure,
  EnumRequestStatusStatus,
} from './supply-visibility.model';

export interface Commit {
  id?: string;
  dummyCommitHeaderID?: string;
  isModifyByDummy?: boolean;
  quantity: number;
  etaDate: string;
  etdDate: string;
  purchaseOrderNumber: string;
  purchaseOrderLine: string;
  invoiceNumber?: string;
  trackNumber: string;
  deliveryDate?: string;
  containerNumber: string;
  inboundDeliveryNumber?: string;
  actualETADate?: string;
  expirationDate?: string;
  slotDate?: string;
  etaPortDate?: string;
  asn: number;
  recomitRequestDate: string;
  shipped: boolean;
  unitWeight: any;
  isUsedInETA?: boolean;
  invalidEta?: boolean
  remark?: string;
  inboundDeliveryDate?: string;
  scheduleLineDate?: string;
  editBy?: string;
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
  vendorCode?: string;
  partNumber: string;
  scheduleLine?: string;
  dummyCommit?: DummyCommitDetail;
  status?: string;
  remainingQuantity?: number;
  codeDate?: string;
  arrivalDate?: string;
  creator?: string;
  createDate?: string;
}

export interface FormKeys {
  formKey?: string;
  rights?: Rights[];
}

export interface Rights {
  field?: string;
  role?: Role[];
}

export interface Role {
  role?: string;
  isUsed?: boolean;
}

export interface SplitCommitBackendDto {
  InboundDeliveryNumber?: string;
  SplitCommitItems?: SplitCommitDto[];
}

export interface SplitCommitDto {
  Quantity?: number;
  ETADate?: string;
  Fields?: any[];
}

export interface SplitCommitCacheDto {
  FieldName?: string[];
  rowIndex?: number;
}

export interface CommitsFilter {
  /// following should be removed as api supports from delivedatefrom to tracknumbers
  vendorCode?: string;
  partNumber?: string;
  quantity?: number;
  etaDate?: string;
  etdDate?: string;
  purchaseOrderNumber?: number;
  purchaseOrderLine?: string;
  inboundDeliveryNumber?: string;
  inboundDeliveryDate?: string;
  scheduleLine?: string;
  scheduleLineDate?: string;
  invoiceNumber?: string;
  actualETADate?: string;
  expirationDate?: string;
  slotDate?: string;
  etaPortDate?: string;
  editBy?: string;
  deliveryDate?: string;
  trackNumber?: string;
  deliveryDateFrom?: Date;
  deliveryDateTo?: Date;
  partNumbers?: string[];
  vendorCodes?: string[];
  inboundDeliveryNumbers?: string[];
  purchaseOrderNumbers?: string[];
  purchaseOrderLines?: string[];
  invoiceNumbers?: string[];
  trackNumbers?: string[];
  remainingQuantity?: number;
}
export class CommitProperty {
  id?: string;
  name?: string;
  type?: 'boolean' | 'number' | 'string' | 'date' | 'dropdown' | 'custom';
}
export enum CommitHistoryType {
  SAP = 'SAP',
  MERGED = 'MERGED',
}
export enum CommitOperationType {
  SPLIT_COMMIT = 0,
  MERGE_COMMIT = 1,
  INITIAL_COMMIT = 2,
  CHANGE_PO_COMMIT = 3,
  REMERGE_COMMIT = 4
}
export enum EnumHistoryViews {
  VIEW_LIST = 0,
  TABLE_VIEW = 1,
}

export interface MergedCommitDetails {
  inboundDeliveryNumber: string;
  etaDate: Date;
  quantity: number;
  plannedNumber?: string;
  originalQuantity?: string;
  requestedDate?: Date;
  triggerDate?: Date;
}

export interface CommitHistory {
  type: CommitHistoryType;
  createDate: string;
  commitHistory?: SapCommitHistory;
  mergedCommitHistory?: MergedCommitHistory;
  commitHistories?: CommitHistories[];
}

export interface SapCommitHistory {
  inboundDeliveryNumber: string;
  changeDate?: string;
  createDate: string;
  changeBy?: string;
  createBy: string;
  field: string;
  sapField: string;
  sapLocation: string;
  transaction: string;
  oldValue: string;
  newValue: string;
}

export interface CommitHistories {
  inboundDeliveryNumber?: string;
  changeDate?: Date;
  changeBy?: string;
  field?: string;
  sapField?: string;
  sapLocation?: string;
  transaction?: string;
  oldValue?: string;
  newValue?: string;
}

export interface MergedCommitHistory {
  type: number;
  mergedCommitsFrom: MergedCommitDetails[];
  mergedCommitsTo: MergedCommitDetails[];
  id: string;
  dateCreated: Date;
  dateModified: Date;
  createdBy: string;
  modifiedBy: string;
}
export interface Reason {
  id: number;
  name: string;
}

export interface Carriers {
  id: string;
  code: string;
  name: string;
  lastModifiedDate: any;
  lastModifiedBy: string;
}

export interface VendorName {
  vendorCode: string;
  vendorName: string;
}

export interface Countries {
  id: string;
  code: string;
  name: string;
  lastModifiedDate: any;
  lastModifiedBy: string;
}

export interface TransportType {
  id: string;
  name: string;
}

export interface RequestStatus {
  requestHash: string;
  status: EnumRequestStatusStatus;
  message: string;
}

export interface CommitTransactionDetails {
  type?: EnumCommitType;
  id: string;
  data?: any;
  datagridInfo?: DatagridInfo;
  isCache?: boolean;
  //Add Other Details
}

export enum EnumCommitType {
  NEW = 0,
  EDIT = 1,
  MERGE = 2,
  SPLIT = 3,

  //ADD more commit types here
}

export interface FilePayload {
  file: File;
  description: any;
}


export enum EnumCustomEdit {
  NONE = 0,
  REMERGE = 1,
  //ADD other custom edit actions
}

export interface DatagridInfo {
  /**
   * @description Sets directly from datagrid (No need to find it from API response)
   */
  pageNumber?: number;
  /**
   * @description Sets index of commit by finding it fromAPI response
   */
  index?: number;
  /**
   * @description Indicates if we need to set page number by finding it from API response
   */
  isPageNumberNeeded?: boolean
}

export interface PlaceHolderTypeVal {
  datagrid?: string | number | boolean;
  commitForm?: string | number | boolean;
  splitForm?: string | number | boolean;
  bulkEditForm?: string | number | boolean;
  createCDForm?: string | number | boolean;
  editCDForm?: string | number | boolean;
  templateFilterCreateForm?: string | number | boolean;
  templateFilterEditForm?: string | number | boolean;
  createCSForm?: string | number | boolean;
  editCSForm?: string | number | boolean;
  commitHistory?: string | number | boolean;
  // commonForm?: string | number | boolean,
}
export interface CommitFields {
  /**
   * Used as field in forms
   */
  id: PlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: PlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: PlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: PlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: PlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: PlaceHolderTypeVal;
  /**
   * (Commit Form)
   */
  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: PlaceHolderTypeVal;
}
export class CommonCommitFields {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;
  //ADD Other Properties

  constructor(type?: EnumCommitFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumCommitFieldStructure): any[] {
    switch (type) {
      case EnumCommitFieldStructure.CommitTable:
        return this.getDatagridFields();
      case EnumCommitFieldStructure.CommitForm:
        return this.getCommitFormFields();
      case EnumCommitFieldStructure.SplitForm:
        return this.getSplitFormFields();
      case EnumCommitFieldStructure.BulkEditForm:
        return this.getBulkFormFields();
      case EnumCommitFieldStructure.DocumentTable:
        return this.getCommitDocumentsFields();
      case EnumCommitFieldStructure.DocumentCreateForm:
        return this.getCDFormField();
      case EnumCommitFieldStructure.DocumentEditForm:
        return this.getCDEditFormFields();
      case EnumCommitFieldStructure.ChartSettingsTable:
        return this.getChartSettingsFields();
      case EnumCommitFieldStructure.ChartSettingsCreateForm:
        return this.getCSFormField();
      case EnumCommitFieldStructure.ChartSettingsEditForm:
        return this.getCSEditFormFields();
      case EnumCommitFieldStructure.CommitHistoryTable:
        return this.getCommitHistoryTableFields();
      case EnumCommitFieldStructure.TemplateFilterTable:
        return this.getTemplateFiltersFields();
      case EnumCommitFieldStructure.TemplateFilterCreateForm:
        return this.getTemplateFiltersFormFields();
      case EnumCommitFieldStructure.TemplateFilterEditForm:
        return this.getTemplateFiltersEditFormFields();
      default:
        return this.getDatagridFields();
    }
  }

  /**
   *
   * @param field field which inclusiveness needs to check
   * @param refId Id
   * @param actualId actual Id on which fields belongs
   * @returns is valid field
   */
  validFunWithUserFields = (field: CommitFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired?.[actualId as keyof PlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>(field.id[refId as keyof PlaceHolderTypeVal] ? field.id[refId as keyof PlaceHolderTypeVal] : '')).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof PlaceHolderTypeVal] == true)
      ); //2571 Comment
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };
  validFunWithoutUserFields = (field: CommitFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof PlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  getDatagridFields(): any[] {
    return this.commonCommitFields
      .filter((field: CommitFields) => {
        return this.hasField(field, 'datagrid', 'datagrid');
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType ? field.dataType.datagrid : 'string',
          isRequired: field.isRequired && field.isRequired.datagrid,
          isPrimaryKey: field.isPrimaryKey ? true : false,
          visible: field.visible?.datagrid,
        };
      });
  }
  getCommitFormFields() {
    return this.commonCommitFields
      .filter((field: CommitFields) => {
        return this.hasField(field, 'datagrid', 'commitForm');
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.commitForm
            ? field.headerText.commitForm
            : field.headerText?.datagrid,
          type: field.dataType ? field.dataType.commitForm : 'text',
          controlType: field.controlType ? field.controlType.commitForm : 'simple',
          exclusive: field.exclusive,
          isRequired: field.isRequired && field.isRequired.commitForm,
          visible: field.visible?.commitForm,
        };
      });
  }

  createDefaultField(field: string) {
    return {
      id: { datagrid: field, splitForm: field },
      headerText: {
        splitForm: field,
      },
      dataType: {
        splitForm: 'text',
      },
    }
  }

  getSplitFormFields() {

    //Custom logic
    let totalFields = this.commonCommitFields.slice(); // create a copy of the array

    for (const defaultField of this.userRightFields) {
      let index = this.commonCommitFields.findIndex(field => { return (<string>(field.id['datagrid'])).toLowerCase() == defaultField.toLowerCase() })
      if (index == -1) { totalFields.push(this.createDefaultField(defaultField)) }
    }

    return totalFields
      .filter((field: CommitFields) => {
        return this.userRightFields.includes((<string>(field.id['datagrid'])).toLowerCase())
      })
      .map((field: CommitFields) => {
        return {
          id: field.id.splitForm,
          name: field.headerText?.splitForm,
          type: field.dataType ? field.dataType.splitForm : 'string',
        };
      });
  }

  getBulkFormFields() {
    let ccFields = this.commonCommitFields.slice();
    for (const dField of this.userRightFields) {
      let index = this.commonCommitFields.findIndex(field => { return (<string>(field.id['datagrid'])).toLowerCase() == dField.toLowerCase() })
      if (index == -1) { ccFields.push(this.createDefaultField(dField)) }
    }
    return ccFields
      .filter((field: CommitFields) => {
        return this.userRightFields.includes((<string>(field.id['datagrid'])).toLowerCase())
      })
      .map((field: CommitFields) => {
        return {
          id: field.id.splitForm,
          name: field.headerText?.splitForm,
          type: (field.dataType && field.dataType.splitForm) ? field.dataType.splitForm : 'string',
        };
      });
  }

  getCommitHistoryTableFields() {
    return this.commonCommitFields
      .filter((field: CommitFields) => {
        return this.hasField(field, 'commitHistory');
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.commitHistory,
          headerText: field.headerText?.datagrid,
        };
      });
  }

  getFormFieldByCase(key: string, toUppercase?: boolean): string {
    const fields: CommitFields[] = this.commonCommitFields;
    const field = fields.find((field: CommitFields) => {
      const comparer: any = toUppercase ? field.id.splitForm : field.id.datagrid;
      if (comparer && comparer.toLowerCase() == key.toLowerCase()) {
        return true;
      }
      return false;
    });
    return <string>(toUppercase ? field?.id.splitForm : field?.id.datagrid);
  }

  public readonly commonCommitFields: CommitFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      isRequired: { datagrid: true },
      visible: { datagrid: true },
      exclude: { commitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'status', splitForm: 'status', commitHistory: 'Status' },
      headerText: { datagrid: 'Status', splitForm: 'Status' },
      dataType: { datagrid: 'status' },
      controlType: { commitForm: 'simple' },
      exclusive: 'edit',
      visible: { datagrid: true },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'inboundDeliveryDate', splitForm: 'InboundDeliveryDate', commitHistory: 'InboundDeliveryDate' },
      headerText: {
        datagrid: 'Inbound Delivery Date',
        splitForm: 'Inbound Delivery Date',
      },
      controlType: { commitForm: 'date' }, //editType on ColumnSetting
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: false },
    },
    {
      id: { datagrid: 'inboundDeliveryNumber', splitForm: 'inboundDeliveryNumber', commitHistory: 'InboundDeliveryNumber' },
      headerText: { datagrid: 'ID', commitForm: 'Inbound Delivery', splitForm: 'ID' },
      controlType: { commitForm: 'number' }, ///
      dataType: { datagrid: 'string', commitForm: 'number' },
      isPrimaryKey: true,
      exclusive: 'edit',
      // exclude: { bulkEditForm: true}, //ADDED RECENTLY
      visible: { datagrid: true, commitForm: true }, //ADDED RECENTLY
    },
    {
      id: { datagrid: 'etdDate', splitForm: 'ETDDate', commitHistory: 'ETDDate' },
      headerText: { datagrid: 'ETD Date', splitForm: 'ETD Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'etaDate', splitForm: 'ETADate', commitHistory: 'ETADate' },
      headerText: { datagrid: 'ETA Date', splitForm: 'ETA Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'deliveryDate', splitForm: 'DeliveryDate', commitHistory: 'DeliveryDate' },
      headerText: { datagrid: 'Delivery Date', splitForm: 'Delivery Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'purchaseOrderLine', splitForm: 'PurchaseOrderLine', commitHistory: 'PurchaseOrderLine' },
      headerText: { datagrid: 'PO Line', commitForm: 'Purchase Order Line', splitForm: 'PO Line' },
      controlType: { commitForm: 'd-poLine' },
      dataType: { datagrid: 'string' },
      isRequired: { datagrid: false, commitForm: true },
      visible: { datagrid: true, commitForm: true },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'purchaseOrderNumber', splitForm: 'purchaseOrderNumber', commitHistory: 'PO' },
      headerText: { datagrid: 'PO', commitForm: 'PO', splitForm: 'PO' },
      controlType: { commitForm: 'd-poNumber' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { commitForm: true },
    },

    {
      id: { datagrid: 'quantity', splitForm: 'quantity', commitHistory: 'DeliveryQuantity' },
      headerText: { datagrid: 'Delivery Qty', commitForm: 'Delivery Quantity', splitForm: 'Delivery Qty' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'number', commitForm: 'number', splitForm: 'number' },
      isRequired: { datagrid: false, commitForm: true },
      visible: { datagrid: true, commitForm: true },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'partNumber', splitForm: 'partNumber', commitHistory: 'PartNumber' },
      headerText: { datagrid: 'Part Number', splitForm: 'Part Number' },
      controlType: { commitForm: 'd-partNumber' },
      dataType: { datagrid: 'string', commitForm: 'number' },
      isRequired: { datagrid: false, commitForm: true }, //
      visible: { datagrid: true, commitForm: true },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'vendorCode', splitForm: 'vendorCode', commitHistory: 'VendorCode' },
      headerText: { datagrid: 'Vendor', commitForm: 'Vendor Code', splitForm: 'Vendor' },
      dataType: { datagrid: 'string' },
      controlType: { commitForm: 'simple' },
      visible: { datagrid: true },
      exclude: { commitForm: true },
    },
    {
      id: { datagrid: 'trackNumber', splitForm: 'TrackNumber', commitHistory: 'TrackNumber' },
      headerText: { datagrid: 'Track No.', splitForm: 'Track No.' },
      controlType: { commitForm: 'simple-np' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'containerNumber', splitForm: 'ContainerNumber', commitHistory: 'ContainerNumber' },
      headerText: { datagrid: 'Container No.', splitForm: 'Container No.' },
      controlType: { commitForm: 'simple-np' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'invoiceNumber', splitForm: 'InvoiceNumber', commitHistory: 'InvoiceNumber' },
      headerText: { datagrid: 'Invoice No.', splitForm: 'Invoice No.' },
      controlType: { commitForm: 'simple' },
      dataType: {
        datagrid: 'invoice',
        commitForm: 'text',
        splitForm: 'string',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'parentID', splitForm: 'parentID' },
      headerText: { datagrid: 'Parent ID', splitForm: 'Parent ID' },
      dataType: { datagrid: 'string' },
      controlType: { commitForm: 'simple' },
      visible: { datagrid: true },
      exclude: { commitForm: true },
    },
    {
      id: { datagrid: 'RequestType', splitForm: 'RequestType', commitHistory: 'RequestType' },
      headerText: { datagrid: 'Request Type', splitForm: 'Request Type' },
      dataType: { datagrid: 'requestType' },
      controlType: { commitForm: 'simple' },
      visible: { datagrid: true },
      exclude: { commitForm: true },
    },
    {
      id: { datagrid: 'actualETADate', splitForm: 'ActualETADate', commitHistory: 'ActualETADate' },
      headerText: { datagrid: 'Actual ETA Date', splitForm: 'Actual ETA Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'expirationDate', splitForm: 'expirationDate', commitHistory: 'ExpirationDate' },
      headerText: { datagrid: 'Expiration Date', splitForm: 'Expiration Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'slotDate', splitForm: 'SlotDate', commitHistory: 'SlotDate' },
      headerText: { datagrid: 'Slot Date', splitForm: 'Slot Date' },
      controlType: { commitForm: 'dateTime' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'dateTime',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'etaPortDate', splitForm: 'ETAPortDate', commitHistory: 'ETAPortDate' },
      headerText: { datagrid: 'ETA Port Date', splitForm: 'ETA Port Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      }, //change in bulkEditForm
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'recomitRequestDate', splitForm: 'RecomitRequestDate', commitHistory: 'RecomitRequestDate' },
      headerText: {
        datagrid: 'Recommit Request Date',
        splitForm: 'Recommit Request Date',
      },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'unitWeight', splitForm: 'UnitWeight', commitHistory: 'WeightUnit' },
      headerText: { datagrid: 'Weight Unit', splitForm: 'Weight Unit' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'number' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'scheduleLineDate', splitForm: 'scheduleLineDate', commitHistory: 'ScheduleLineDate' },
      headerText: {
        datagrid: 'Schedule Line Date',
        splitForm: 'Schedule Line Date',
      },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'scheduleLine', splitForm: 'scheduleLine', commitHistory: 'ScheduleLine' },
      headerText: { datagrid: 'Schedule Line', splitForm: 'Schedule Line' },
      controlType: { commitForm: 'simple-np' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'isUsedInETA', splitForm: 'IsUsedInETA', commitHistory: 'IsUsedInETA' },
      headerText: {
        datagrid: 'ETA Used',
        commitForm: 'Is used in ETA',
        splitForm: 'ETA Used',
      },
      controlType: { commitForm: 'checkbox' },
      dataType: {
        datagrid: 'checkbox',
        commitForm: 'text',
        splitForm: 'boolean',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'shipped', splitForm: 'Shipped', commitHistory: 'Shipped' },
      headerText: { datagrid: 'Shipped', splitForm: 'Shipped' },
      controlType: { commitForm: 'checkbox' },
      dataType: {
        datagrid: 'checkbox',
        commitForm: 'text',
        splitForm: 'boolean',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'invalidEta', splitForm: 'invalidEta', commitHistory: 'InvalidEta' },
      headerText: {
        datagrid: 'Invalid ETA',
        commitForm: 'Invalid ETA',
        splitForm: 'Invalid ETA',
      },
      controlType: { commitForm: 'checkbox' },
      dataType: {
        datagrid: 'checkbox',
        // commitForm: 'text',
        splitForm: 'boolean',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'receiveDate', splitForm: 'ReceiveDate', commitHistory: 'ReceiptDate' },
      headerText: { datagrid: 'Receipt Date', splitForm: 'Receipt Date' },
      controlType: { commitForm: 'dateTime' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'dateTime',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'asn', splitForm: 'ASN', commitHistory: 'ASN' },
      headerText: { datagrid: 'ASN', splitForm: 'ASN' },
      controlType: { commitForm: 'checkbox' },
      dataType: {
        datagrid: 'checkbox',
        commitForm: 'text',
        splitForm: 'boolean',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'manufacturer', splitForm: 'Manufacturer', commitHistory: 'Manufacturer' },
      headerText: { datagrid: 'Manufacturer', splitForm: 'Manufacturer' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'countryOfOrigin', splitForm: 'CountryOfOrigin', commitHistory: 'CountryOfOrigin' },
      headerText: {
        datagrid: 'CoO',
        commitForm: 'Country Of Origin',
        splitForm: 'CoO',
      },
      controlType: { commitForm: 'd-countryOfOrigin' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'custom' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'requestDate', splitForm: 'RequestDate', commitHistory: 'RequestDate' },
      headerText: { datagrid: 'Request Date', splitForm: 'Request Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'triggerDate', splitForm: 'TriggerDate', commitHistory: 'TriggerDate' },
      headerText: { datagrid: 'Trigger Date', splitForm: 'Trigger Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'lastUpdateDate', splitForm: 'lastUpdateDate', commitHistory: 'LastUpdateDate' },
      headerText: { datagrid: 'Last Update Date', splitForm: 'Last Update Date' },
      dataType: { datagrid: 'dateUnchanged', commitForm: 'text' },
      controlType: { commitForm: 'date' },
      exclusive: 'edit',
      visible: { datagrid: true, commitForm: false },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'responsibleEmail', splitForm: 'responsibleEmail', commitHistory: 'ResponsibleEmail' },
      headerText: { datagrid: 'Last Update Name', splitForm: 'Last Update Name' },
      dataType: { datagrid: 'string' },
      controlType: { commitForm: 'simple' },
      visible: { datagrid: true },
      exclude: { commitForm: true },
    },
    {
      id: { datagrid: 'mpn', splitForm: 'MPN', commitHistory: 'MPN' },
      headerText: { datagrid: 'MPN', splitForm: 'MPN' },
      controlType: { commitForm: 'd-mpn' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'mfgPartner', splitForm: 'MFGPartner', commitHistory: 'MFGPartner' },
      headerText: { datagrid: 'MFG Partner', splitForm: 'MFG Partner' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'batchNo', splitForm: 'BatchNo', commitHistory: 'BatchNo' },
      headerText: { datagrid: 'Batch No.', splitForm: 'Batch No.' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'forwarder', splitForm: 'Forwarder', commitHistory: 'Forwarder' },
      headerText: { datagrid: 'Forwarder', splitForm: 'Forwarder' },
      controlType: { commitForm: 'd-forwarder' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'custom' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'remark', splitForm: 'Remark', commitHistory: 'Remark' },
      headerText: { datagrid: 'Remark', splitForm: 'Remark' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'expressFlag', splitForm: 'ExpressFlag', commitHistory: 'ExpressFlag' },
      headerText: { datagrid: 'Express Flag', splitForm: 'Express Flag' },
      controlType: { commitForm: 'dropdown' },
      dataType: {
        datagrid: 'string',
        commitForm: 'text',
        splitForm: 'dropdown',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'thirdPartyPaid', splitForm: 'ThirdPartyPaid', commitHistory: 'ThirdPartyPaid' },
      headerText: { datagrid: 'Third Party Paid', splitForm: 'Third Party Paid' },
      controlType: { commitForm: 'dropdown' },
      dataType: {
        datagrid: 'string',
        commitForm: 'text',
        splitForm: 'dropdown',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: {
        datagrid: 'typeOfTransportation',
        splitForm: 'TypeOfTransportation',
        commitHistory: 'TypeOfTransportation',
      },
      headerText: {
        datagrid: 'Transport',
        commitForm: 'Type Of Transportation',
        splitForm: 'Transport',
      },
      controlType: { commitForm: 'd-typeOfTransportation' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'custom' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'msrRemarks', splitForm: 'MSRRemarks', commitHistory: 'MSRRemarks' },
      headerText: { datagrid: 'MSR Remarks', splitForm: 'MSR Remarks' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'shortageComment', splitForm: 'ShortageComment', commitHistory: 'ShortageComment' },
      headerText: {
        datagrid: 'Shortage Comment',
        splitForm: 'Shortage Comment',
      },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'reason', splitForm: 'Reason', commitHistory: 'Reason' },
      headerText: { datagrid: 'Reason', splitForm: 'Reason' },
      controlType: { commitForm: 'd-reason' },
      dataType: {
        datagrid: 'custom',
        commitForm: 'text',
        splitForm: 'dropdown',
      }, // change in splitForm
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'reasonDetail', splitForm: 'reasonDetail', commitHistory: 'ReasonDetail' },
      headerText: { datagrid: 'Reason Detail', splitForm: 'Reason Detail' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'eddDate', splitForm: 'EDDDate', commitHistory: 'EDDDate' },
      headerText: { datagrid: 'EDD Date', splitForm: 'EDD Date' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'apsRelevant', splitForm: 'APSRelevant', commitHistory: 'APSRelevant' },
      headerText: {
        datagrid: 'APS',
        commitForm: 'APS Relevant',
        splitForm: 'APS',
      },
      controlType: { commitForm: 'dropdown' },
      dataType: {
        datagrid: 'string',
        commitForm: 'text',
        splitForm: 'dropdown',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'revision', splitForm: 'Revision', commitHistory: 'Revision' },
      headerText: { datagrid: 'Revision', splitForm: 'Revision' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'requestQuantity', splitForm: 'requestQuantity', commitHistory: 'RequestQuantity' },
      headerText: { datagrid: 'Request Qty', commitForm: 'Request Quantity', splitForm: 'Request Qty' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'number', commitForm: 'number' },
      exclusive: 'edit',
      visible: { datagrid: true, commitForm: false },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'chooseVendor' },
      headerText: { datagrid: 'Vendor Code' },
      controlType: { commitForm: 'd-chooseVendor' },
      dataType: { commitForm: 'number' },
      isRequired: { datagrid: false, commitForm: true },
      visible: { commitForm: true },
      exclude: { datagrid: true },
    },
    {
      id: { datagrid: 'poNumber', splitForm: 'poNumber', commitHistory: 'PO' },
      headerText: { datagrid: 'PO', splitForm: 'PO' },
      controlType: { commitForm: 'd-poNumber' },
      isRequired: { datagrid: false, commitForm: true },
      visible: { commitForm: true },
      exclude: { datagrid: true },
    },
    {
      id: { datagrid: 'withMerge' },
      headerText: { datagrid: 'Lock Commit' },
      controlType: { commitForm: 'checkbox' },
      dataType: { commitForm: 'text' },
      exclusive: 'new',
      visible: { commitForm: true },
      exclude: { datagrid: true },
    },
    {
      id: { datagrid: 'otmReceiptType', splitForm: 'OtmReceiptType', commitHistory: 'OtmReceiptType' },
      headerText: { datagrid: 'Otm Receipt Type', splitForm: 'Otm Receipt Type' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'otmTransactionID', splitForm: 'OtmTransactionID', commitHistory: 'OtmTransactionID' },
      headerText: {
        datagrid: 'Otm Transaction ID',
        splitForm: 'Otm Transaction ID',
      },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: false },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'transportID', splitForm: 'TransportID', commitHistory: 'TransportID' },
      headerText: { datagrid: 'Transport ID', splitForm: 'Transport ID' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: false },
    },
    {
      id: { datagrid: 'rq', splitForm: 'RQ', commitHistory: 'RQ' },
      headerText: { datagrid: 'RQ', splitForm: 'RQ' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      visible: { datagrid: true, commitForm: true },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: {
        datagrid: 'purchasingDocumentDate',
        splitForm: 'PurchasingDocumentDate',
        commitHistory: 'PurchasingDocumentDate',
      },
      headerText: {
        datagrid: 'Doc. Date',
        commitForm: 'Doc. Date',
        splitForm: 'Doc. Date',
      },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: false },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'mergedInboundDeliveryNumber', splitForm: 'mergedInboundDeliveryNumber', commitHistory: 'MergedInboundDeliveryNumber' },
      headerText: {
        datagrid: 'Merged ID',
        commitForm: 'Merged Inbound Delivery Number',
        splitForm: 'Merged ID'
      },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text' },
      visible: { datagrid: true, commitForm: false },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'instructionEtaDate', splitForm: 'InstructionEtaDate', commitHistory: 'InstructionEtaDate' },
      headerText: {
        datagrid: 'Instruction ETA Date',
        splitForm: 'Instruction ETA Date',
      },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: false },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'otmReceivedDate', splitForm: 'OtmReceivedDate', commitHistory: 'OtmReceivedDate' },
      headerText: {
        datagrid: 'Otm Received Date',
        splitForm: 'Otm Received Date',
      },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: false },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'sapDeliveryDate', splitForm: 'SapDeliveryDate', commitHistory: 'FinalETADate' },
      headerText: { datagrid: 'Final ETA Date', splitForm: 'Final ETA Date' }, // Changed as per skype request
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: false },
      // exclude: { splitForm: true, bulkEditForm: true },
    },
    {
      id: { datagrid: 'mergedQuantity', splitForm: 'mergedQuantity', commitHistory: 'MergedQuantity' },
      headerText: {
        datagrid: 'Merged Qty',
        commitForm: 'Merged Quantity',
        splitForm: 'Merged Quantity',
      },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'number', commitForm: 'number' },
      visible: { datagrid: true, commitForm: false },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'editby', splitForm: 'editby' },
      headerText: {
        splitForm: 'Edit by',
      },
      // controlType: {commitForm: 'simple'},
      // dataType: {datagrid: 'number', commitForm: 'number'},
      visible: { datagrid: true, commitForm: false },
      // exclude: { bulkEditForm: true},
    },
    {
      id: { datagrid: 'remainingQuantity', splitForm: 'RemainingQuantity', commitHistory: 'RemainingQuantity' },
      headerText: {
        datagrid: 'Remaining Quantity',
        splitForm: 'Remaining Quantity',
      },
      controlType: { commitForm: 'simple' },
      dataType: {
        datagrid: 'number',
        commitForm: 'number',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'codeDate', splitForm: 'codeDate', commitHistory: 'CodeDate' },
      headerText: { datagrid: 'Date Code', splitForm: 'Date Code' },
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'arrivalDate', splitForm: 'arrivalDate', commitHistory: 'ArrivalDate' },
      headerText: { datagrid: 'Arrival Date', splitForm: 'Arrival Date' },
      controlType: { commitForm: 'dateTime' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'dateTime',
      },
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'creator', splitForm: 'creator', commitHistory: 'Creator' },
      headerText: { datagrid: 'Created By', splitForm: 'Created By' },
      controlType: { commitForm: 'simple' },
      dataType: { datagrid: 'string', commitForm: 'text', splitForm: 'string' },
      exclusive: 'edit',
      visible: { datagrid: true, commitForm: true },
    },
    {
      id: { datagrid: 'createDate', splitForm: 'createDate', commitHistory: 'createDate' },
      headerText: { datagrid: 'Create Date', splitForm: 'Create Date' }, // Changed as per skype request
      controlType: { commitForm: 'date' },
      dataType: {
        datagrid: 'dateUnchanged',
        commitForm: 'text',
        splitForm: 'date',
      },
      visible: { datagrid: true, commitForm: true },
      exclude: { commitForm: true, splitForm: true, bulkEditForm: true },
    },

    {
      id: { datagrid: 'stockType', splitForm: 'StockType', commitHistory: 'StockType' },
      headerText: { datagrid: 'Stock Type', splitForm: 'Stock Type' },
      controlType: { commitForm: 'dropdown' },
      dataType: { datagrid: 'stockType', commitForm: 'text', splitForm: 'dropdown' },
      //exclusive: 'edit',
      visible: { datagrid: true, commitForm: true }
    },

    {
      id: { datagrid: 'hasDocuments', splitForm: 'hasDocuments' },
      headerText: {
        datagrid: 'Documents',
        //commitForm: 'hasDocuments',
        //splitForm: 'hasDocuments',
      },
      controlType: { commitForm: 'checkbox' },
      dataType: {
        datagrid: 'checkbox',
        commitForm: 'text',
        splitForm: 'boolean',
      },
      exclude: { commitForm: true },
      visible: { datagrid: true, commitForm: false },
    },
    {
      id: { datagrid: 'slotCode', splitForm: 'slotCode' },
      headerText: { datagrid: 'Slot Code', splitForm: 'Slot Code' },
      dataType: { datagrid: 'string', splitForm: 'string' },
      controlType: { commitForm: 'simple' },
      exclude: { commitForm: true },
      visible: { datagrid: true, commitForm: false }
    },
    {
      id: { datagrid: 'plannedordernumber', splitForm: 'plannedordernumber' },
      headerText: { datagrid: 'Planned Order No.', splitForm: 'Planned Order No.' },
      dataType: { datagrid: 'string', splitForm: 'string' },
      controlType: { commitForm: 'simple' },
      exclude: { commitForm: true },
      visible: { datagrid: true, commitForm: false }
    }
  ];

  //#region COMMIT-DOCUMENTS

  getCommitDocumentsFields() {
    return this.commitDocuments
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getCDFormField() {
    return this.commitDocuments
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "createCDForm");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.createCDForm ? field.id.createCDForm : field.id.datagrid,
          headerText: field.headerText?.createCDForm ? field.headerText.createCDForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createCDForm : '',
          visible: field.visible?.createCDForm,
          isRequired: field.isRequired && field.isRequired.createCDForm,
        }
      })
  }

  getCDEditFormFields() {
    return this.commitDocuments
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "editCDForm");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.editCDForm ? field.headerText.editCDForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editCDForm : '',
          visible: field.visible?.editCDForm,
          isRequired: field.isRequired && field.isRequired.editCDForm,
        }
      });
  }

  public readonly commitDocuments: CommitFields[] = [

    {
      id: { datagrid: 'name' },
      headerText: { datagrid: 'File Name', createCDForm: 'File Name' },
      controlType: { createCDForm: 'file' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createCDForm: true },
    },

    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'File Descripton', createCDForm: 'File Description', editCDForm: 'File Description' },
      controlType: { createCDForm: 'simple', editCDForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createCDForm: true }
    },

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },
  ];

  //#endregion COMMIT-DOCUMENTS

  //#region TEMPLATE-FILTRES

  getTemplateFiltersFields() {
    return this.templateFilters
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getTemplateFiltersFormFields() {
    return this.templateFilters
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.templateFilterCreateForm : '',
          visible: field.visible?.templateFilterCreateForm,
          isRequired: field.isRequired && field.isRequired.templateFilterCreateForm,
        }
      })
  }

  getTemplateFiltersEditFormFields() {
    return this.templateFilters
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.templateFilterEditForm : '',
          visible: field.visible?.templateFilterEditForm,
          isRequired: field.isRequired && field.isRequired.templateFilterEditForm,
        }
      })
  }

  public readonly templateFilters: CommitFields[] = [

    {
      id: { datagrid: 'name' },
      headerText: { datagrid: 'Filter Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      controlType: { templateFilterCreateForm: 'simple', templateFilterEditForm: 'simple' },
      isRequired: { templateFilterCreateForm: true, templateFilterEditForm: true }
    },

    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'Filter Description' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      controlType: { templateFilterCreateForm: 'simple', templateFilterEditForm: 'simple' },
      isRequired: { templateFilterCreateForm: true, templateFilterEditForm: true }
    },

    {
      id: { datagrid: 'isDefault' },
      headerText: { datagrid: 'Default' },
      dataType: { datagrid: 'radio' },
      visible: { datagrid: false },
      controlType: { templateFilterCreateForm: 'radio', templateFilterEditForm: 'radio' },
      isRequired: { templateFilterCreateForm: false }
    },

    {
      id: { datagrid: 'isShared' },
      headerText: { datagrid: 'Shared' },
      dataType: { datagrid: 'toggle' },
      visible: { datagrid: false },
      controlType: { templateFilterCreateForm: 'toggle', templateFilterEditForm: 'toggle' },
      isRequired: { templateFilterCreateForm: false }
    },

    {
      id: { datagrid: 'isActive' },
      headerText: { datagrid: 'Active' },
      dataType: { datagrid: 'toggle' },
      visible: { datagrid: true },
      controlType: { templateFilterCreateForm: 'toggle', templateFilterEditForm: 'toggle' },
      isRequired: { templateFilterCreateForm: false }
    },

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },
  ];

  //#endregion TEMPLATE-FILTRES

  //#region CHART-SETTINGS

  getChartSettingsFields() {
    return this.chartSettings
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getCSFormField() {
    return this.chartSettings
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "createCSForm");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.createCSForm ? field.id.createCSForm : field.id.datagrid,
          headerText: field.headerText?.createCSForm ? field.headerText.createCSForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createCSForm : '',
          visible: field.visible?.createCSForm,
          isRequired: field.isRequired && field.isRequired.createCSForm,
        }
      })
  }

  getCSEditFormFields() {
    return this.chartSettings
      .filter((field: CommitFields) => {
        return this.hasField(field, "datagrid", "editCSForm");
      })
      .map((field: CommitFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.editCSForm ? field.headerText.editCSForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editCSForm : '',
          visible: field.visible?.editCSForm,
          isRequired: field.isRequired && field.isRequired.editCSForm,
        }
      });
  }

  public readonly chartSettings: CommitFields[] = [

    {
      id: { datagrid: 'name' },
      headerText: { datagrid: 'Name', createCSForm: 'Name', editCSForm: 'Name' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createCSForm: true, editCSForm: true },
    },

    {
      id: { datagrid: 'isActive' },
      headerText: { datagrid: 'Active' },
      // controlType: { createCSForm: 'toggle'},
      dataType: { datagrid: 'toggle' },
      visible: { datagrid: true },
    },

    {
      id: { datagrid: 'type' },
      headerText: { createCSForm: 'Chart Type', editCSForm: 'Chart Type' },
      controlType: { createCSForm: 'dropdown', editCSForm: 'dropdown' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
      isRequired: { createCSForm: true, editCSForm: true },
    },

    {
      id: { datagrid: 'securityLevels' },
      headerText: { createCSForm: 'Security Levels', editCSForm: 'Security Levels' },
      controlType: { createCSForm: 'dropdown', editCSForm: 'dropdown' },
      visible: { datagrid: false },
      isRequired: { createCSForm: true, editCSForm: true },
    },

    {
      id: { datagrid: 'qlikAppId' },
      headerText: { createCSForm: 'Qlik app ID', editCSForm: 'Qlik app ID' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'tableName' },
      headerText: { createCSForm: 'Table name', editCSForm: 'Table name' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'dateKey' },
      headerText: { createCSForm: 'Date column', editCSForm: 'Date column' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'showDateAsWeeks' },
      headerText: { createCSForm: 'Show date as weeks', editCSForm: 'Show date as weeks' },
      controlType: { createCSForm: 'checkbox', editCSForm: 'checkbox' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'xAxisLabel' },
      headerText: { createCSForm: 'X axis label', editCSForm: 'X axis label' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'yAxisLabel' },
      headerText: { createCSForm: 'Y axis label', editCSForm: 'Y axis label' },
      controlType: { createCSForm: 'simple', editCSForm: 'simple' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    {
      id: { datagrid: 'order' },
      headerText: { createCSForm: 'Order', editCSForm: 'Order' },
      controlType: { createCSForm: 'number', editCSForm: 'number' },
      // dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },

    // {
    //   id: { datagrid: 'seriesName' },
    //   headerText: { createCSForm: 'Name' },
    //   controlType: { createCSForm: 'simple'},
    //   // dataType: { datagrid: 'string' },
    //   visible: { datagrid: false },
    // },

    // {
    //   id: { datagrid: 'nameKey' },
    //   headerText: { createCSForm: 'Name Column Key' },
    //   controlType: { createCSForm: 'simple'},
    //   // dataType: { datagrid: 'string' },
    //   visible: { datagrid: false },
    // },

    // {
    //   id: { datagrid: 'valueKey' },
    //   headerText: { createCSForm: 'Value Column Key' },
    //   controlType: { createCSForm: 'simple'},
    //   // dataType: { datagrid: 'string' },
    //   visible: { datagrid: false },
    // },

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },
  ];

  //#endregion CHART-SETTINGS
}
