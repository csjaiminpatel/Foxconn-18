import { DatagridInfo } from "./commits.model";

export interface QuotationsFields {
  /**
   * Used as field in forms
   */
  id: QuotationsPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: QuotationsPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: QuotationsPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: QuotationsPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: QuotationsPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: QuotationsPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: QuotationsPlaceHolderTypeVal;
}

export interface QuotationsPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  createQVForm?: string | number | boolean,
  editQVForm?: string | number | boolean,
  createQSForm?: string | number | boolean,
  editQSForm?: string | number | boolean
  quotationsVendorForm?: string | number | boolean,
}

export interface CreateQuotations {
  partNumber: string;
  manufacturerPartNumber: string;
  quotationStatus: string;
  startedDate: string;
  pilotDate: string;
  closedDate: string;
  description: string;
  customer: string;
  projectName: string;
  volumeForToolingAmortization: string;
  exchangeRate: string;
  currency: string;
  ttlForecast: string;
  comment: string;
  minimalOrderQuantity: number;
}

export interface UpdateQuotations {
  id: string;
  partNumber: string;
  manufacturerPartNumber: string;
  quotationStatus: string;
  startedDate: string;
  pilotDate: string;
  closedDate: string;
  description: string;
  customer: string;
  projectName: string;
  volumeForToolingAmortization: string;
  exchangeRate: string;
  currency: string;
  ttlForecast: string;
  comment: string;
  minimalOrderQuantity: number;
}

export interface QuotationDetail {
  id: string;
  partNumber: string;
  manufacturerPartNumber: string;
  quotationStatus: string;
  startedDate: string;
  pilotDate: string;
  closedDate: string;
  description: string;
  customer: string;
  projectName: string;
  volumeForToolingAmortization: string;
  exchangeRate: string;
  currency: string;
  ttlForecast: string;
  comment: string;
  quotationVendors: QuotationVendor[];
  createdBy: string;
  modifiedBy: string;
  flags: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  discrepancyText: string;
  minimalOrderQuantity: number;
}

export interface QuotationVendor {
  approvedBy?: string;
  awarded?: boolean;
  businessAllocation?: number;
  countryOfOrigin?: string;
  invitationAccepted?: string;
  invitationDeclined?: string;
  invitationSent?: string
  currency?: string;
  deliveryTerms?: string;
  feedbackDate?: string;
  identityKey: string;
  leadTime?: number;
  mfgLeadTime?: number;
  minimalOrderQuantity?: number;
  minimalPackageQuantity?: number;
  priceApproved?: boolean;
  priceWithTooling?: number;
  priceWithoutTooling?: number;
  quotationVendorId?: string;
  remark?: string;
  specificationValidated?: boolean;
  toolingCost?: number;
  transportationMode?: string;
  vendorComment?: string;
  weightPerUnit?: string;
  vendorEmail?: string;
  vendorCode?: string;
  manufacturerPartNumber: string;
}

export interface createQuotationVendor {
  quotationId: string;
  identityKey: string,
  feedbackDate?: string;
  minimalOrderQuantity?: number;
  minimalPackageQuantity?: number;
  priceWithoutTooling?: number;
  priceWithTooling?: number;
  toolingCost?: number;
  currency?: string;
  awarded?: boolean;
  leadTime?: number;
  mfgLeadTime?: number;
  deliveryTerms?: string;
  transportationMode?: string;
  weightPerUnit?: string;
  countryOfOrigin?: string;
  remark?: string;
  specificationValidated?: boolean;
  businessAllocation?: number;
  priceApproved?: boolean;
  approvedBy?: string;
  vendorComment?: string;
  manufacturerPartNumber: string;
}

export interface QuotationOffer {
  approvedBy?: string;
  awarded?: boolean;
  currency?: string;
  feedbackDate?: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  leadTime?: number;
  mfgLeadTime?: number;
  minimalOrderQuantity?: number;
  participationStatus?: number;
  priceApproved?: boolean;
  priceWithoutTooling?: number;
  priceWithTooling?: number;
  quotationVendorId?: string;
  specificationValidated?: boolean;
  toolingCost?: number;
  transportationMode?: string;
  vendorCode?: string;
  vendorComment?: string;
  vendorName?: string;
}

export interface QuotationTransactionDetails {
  type?: EnumQuotationType;
  id: string;
  data?: any;
  datagridInfo?: DatagridInfo;
}

export class QuotationVisualization {
  pageSettings?: { pageSize: number, pageIndex: number };
  columnSort: any[] = [];
}

export enum EnumQuotationType {
  EDIT = 0,
}

export enum EnumQuotationsViews {
  EDIT = 0,
  INVITEES = 1,
  SPECIFICATION = 2,
  OFFERS = 3
}

export enum EnumQuotationsFieldStructure {
  QuotationsTable = 0,
  QuotationCreateForm = 1,
  QuotationEditForm = 2,
  QVTable = 3,
  QVCreateForm = 4,
  QVEditForm = 5,
  QSTable = 6,
  QSCreateForm = 7,
  QSEditForm = 8,
  QuotationVendorBuyer = 9,
  QuotationOffersTable = 10,
}

export class QuotationsListField {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;
  //ADD Other Properties
  quotationStatusValues: any[] = [
    { value: 0, status: 'CREATED' },
    { value: 1, status: 'OPENED' },
    { value: 2, status: 'APPROVED' },
    { value: 3, status: 'WAITING' },
    { value: 4, status: 'AWARDED' },
    { value: 5, status: 'STARTED' },
    { value: 6, status: 'STOPPED' },
    { value: 7, status: 'CLOSED' },
    { value: 8, status: 'CANCELLED' }
  ]

  constructor(type?: EnumQuotationsFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumQuotationsFieldStructure): any[] {
    switch (type) {
      case EnumQuotationsFieldStructure.QuotationsTable:
        return this.getDatagridFields();
      case EnumQuotationsFieldStructure.QuotationCreateForm:
        return this.getCreateFormList();
      case EnumQuotationsFieldStructure.QuotationEditForm:
        return this.getEditFormList();
      case EnumQuotationsFieldStructure.QVTable:
        return this.getQuotationVendorFields();
      case EnumQuotationsFieldStructure.QVCreateForm:
        return this.getQVCreateFormFields();
      case EnumQuotationsFieldStructure.QVEditForm:
        return this.getQVEditFormFields();
      case EnumQuotationsFieldStructure.QSTable:
        return this.getQuotationSpecificationFields();
      case EnumQuotationsFieldStructure.QSCreateForm:
        return this.getQSCreateFormField();
      case EnumQuotationsFieldStructure.QSEditForm:
        return this.getQSEditFormFields();
      case EnumQuotationsFieldStructure.QuotationVendorBuyer:
        return this.getQuotationVendorsFields();
      case EnumQuotationsFieldStructure.QuotationOffersTable:
        return this.getQuotationOffersFields();
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
  validFunWithUserFields = (field: QuotationsFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof QuotationsPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof QuotationsPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof QuotationsPlaceHolderTypeVal] == true)
      );
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };
  validFunWithoutUserFields = (field: QuotationsFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof QuotationsPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  //#region QUOTATIONS (for DataGrid)

  getDatagridFields() {
    return this.quotations
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getCreateFormList() {
    return this.quotations
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "createForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm ? field.headerText.createForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createForm : '',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.createForm,
        }
      })
  }

  getEditFormList() {
    return this.quotations
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "editForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm ? field.headerText.createForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly quotations: QuotationsFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },
    {
      id: { datagrid: 'id' },
      headerText: { datagrid: 'ID' },
      // controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'Part Number', createForm: 'Part Number' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createForm: true },
    },
    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'Description', createForm: 'Description' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'manufacturerPartNumber' },
      headerText: { datagrid: 'MFG PartNumber', createForm: 'MFG PartNumber' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'quotationStatus' },
      headerText: { datagrid: 'Quotation Status', createForm: 'Quotation Status' },
      controlType: { createForm: 'dropdown', editForm: 'dropdown' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createForm: true },
    },
    {
      id: { datagrid: 'startedDate' },
      headerText: { datagrid: 'Started Date', createForm: 'Started Date' },
      controlType: { createForm: 'date', editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'pilotDate' },
      headerText: { datagrid: 'Pilot Date', createForm: 'Pilot Date' },
      controlType: { createForm: 'date', editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'closedDate' },
      headerText: { datagrid: 'Closed Date', createForm: 'Closed Date' },
      controlType: { createForm: 'date', editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'projectName' },
      headerText: { datagrid: 'Project', createForm: 'Project' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'customer' },
      headerText: { datagrid: 'Customer', createForm: 'Customer' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'currency' },
      headerText: { datagrid: 'Currency', createForm: 'Currency' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'ttlForecast' },
      headerText: { datagrid: 'Forecast/Weeks', createForm: 'Forecast/Weeks' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'lastModifiedBy' },
      headerText: { datagrid: 'Edit By' },
      // controlType: { createForm: 'simple'},
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'minimalOrderQuantity' },
      headerText: { datagrid: 'MOQ' },
      dataType: { datagrid: 'number' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      visible: { datagrid: true },
    },
  ]

  //#endregion QUOTATIONS

  //#region QUOTATION-VENDOR (for Form)

  getQuotationVendorFields() {
    return this.quotationVendor
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getQVCreateFormFields() {
    return this.quotationVendor
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "createQVForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.createQVForm ? field.id.createQVForm : field.id.datagrid,
          headerText: field.headerText?.createQVForm ? field.headerText.createQVForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createQVForm : '',
          visible: field.visible?.createQVForm,
          isRequired: field.isRequired && field.isRequired.createQVForm,
        }
      })
  }

  getQVEditFormFields() {
    return this.quotationVendor
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "editQVForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.editQVForm ? field.headerText.editQVForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editQVForm : '',
          visible: field.visible?.editQVForm,
          isRequired: field.isRequired && field.isRequired.editQVForm,
        }
      })
  }

  getQuotationVendorsFields() {
    return this.quotationVendor.filter((field: QuotationsFields) => {
      return this.hasField(field, "datagrid", "quotationsVendorForm");
    })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.quotationsVendorForm ? field.headerText.quotationsVendorForm : field.headerText?.datagrid,
          type: field.dataType ? field.dataType.quotationsVendorForm : '',
          visible: field.visible?.quotationsVendorForm,
          isRequired: field.isRequired && field.isRequired.datagrid,
        }
      })
  }


  public readonly quotationVendor: QuotationsFields[] = [

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions', quotationsVendorForm: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },

    {
      id: { datagrid: 'selectVendor' },
      headerText: { createQVForm: 'Select Vendor' },
      dataType: { datagrid: 'string' },
      controlType: { createQVForm: 'd-vendor' },
      visible: { datagrid: false, createQVForm: true },
      isRequired: { createQVForm: true },
    },

    {
      id: { datagrid: 'vendorName' },
      headerText: { datagrid: 'Vendor Name' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'manufacturerPartNumber' },
      headerText: { datagrid: 'MFG PartNumber' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'vendorComment', createQVForm: 'note' },
      headerText: { datagrid: 'Vendor Comment', createQVForm: 'Note', editQVForm: 'Vendor Comment', quotationsVendorForm: 'Note' },
      dataType: { datagrid: 'string', quotationsVendorForm: 'string' },
      controlType: { createQVForm: 'textarea', editQVForm: 'simple', quotationsVendorForm: 'textarea' },
      visible: { datagrid: false, createQVForm: true, editQVForm: true, quotationsVendorForm: true },
    },

    {
      id: { datagrid: 'identityKey' },
      headerText: { datagrid: 'Identity Key' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'quotationVendorId' },
      headerText: { datagrid: 'Quotation Vendor ID' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'approvedBy' },
      headerText: { datagrid: 'Approved By' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'awarded' },
      headerText: { datagrid: 'Awarded', quotationsVendorForm: 'Winner' },
      dataType: { datagrid: 'checkbox', quotationsVendorForm: 'checkbox' },
      controlType: { editQVForm: 'checkbox', quotationsVendorForm: 'checkbox' },
      visible: { datagrid: true, editQVForm: true, quotationsVendorForm: true },
    },

    {
      id: { datagrid: 'businessAllocation' },
      headerText: { datagrid: 'Business Allocation' },
      dataType: { datagrid: 'number' },
      controlType: { editQVForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'countryOfOrigin' },
      headerText: { datagrid: 'Country Of Origin', quotationsVendorForm: 'Country Of Origin' },
      dataType: { datagrid: 'string', quotationsVendorForm: 'string' },
      controlType: { editQVForm: 'simple', quotationsVendorForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'currency' },
      headerText: { datagrid: 'Currency' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'deliveryTerms' },
      headerText: { datagrid: 'Delivery Terms', quotationsVendorForm: 'Delivery Terms' },
      dataType: { datagrid: 'string', quotationsVendorForm: 'string' },
      controlType: { editQVForm: 'simple', quotationsVendorForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'feedbackDate' },
      headerText: { datagrid: 'Feedback Date' },
      dataType: { datagrid: 'dateUnchanged' },
      controlType: { editQVForm: 'date' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'leadTime' },
      headerText: { datagrid: 'Lead Time', quotationsVendorForm: 'Lead Time' },
      dataType: { datagrid: 'number', quotationsVendorForm: 'number' },
      controlType: { editQVForm: 'number', quotationsVendorForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'mfgLeadTime' },
      headerText: { datagrid: 'MFG Lead Time' },
      dataType: { datagrid: 'number' },
      controlType: { editQVForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'minimalOrderQuantity' },
      headerText: { datagrid: 'Minimal Order Quantity', quotationsVendorForm: 'Quantity' },
      dataType: { datagrid: 'number', quotationsVendorForm: 'number' },
      controlType: { editQVForm: 'number', quotationsVendorForm: 'number' },
      visible: { datagrid: true, editQVForm: true, quotationsVendorForm: true },
    },

    {
      id: { datagrid: 'minimalPackageQuantity' },
      headerText: { datagrid: 'MPQ', editQVForm: 'Minimal Package Quantity' },
      dataType: { datagrid: 'number' },
      controlType: { editQVForm: 'number' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'invitationSent' },
      headerText: { datagrid: 'Invitation Sent' },
      dataType: { datagrid: 'dateUnchanged' },
      controlType: { editQVForm: 'date' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'invitationAccepted' },
      headerText: { datagrid: 'Invitation Accepted' },
      dataType: { datagrid: 'dateUnchanged' },
      controlType: { editQVForm: 'date' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'invitationDeclined' },
      headerText: { datagrid: 'Invitation Declined' },
      dataType: { datagrid: 'dateUnchanged' },
      controlType: { editQVForm: 'date' },
      visible: { datagrid: true, editQVForm: true },
    },

    {
      id: { datagrid: 'participationStatus' },
      headerText: { datagrid: 'Participation Status' },
      dataType: { datagrid: 'number' },
      controlType: { editQVForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'priceApproved' },
      headerText: { datagrid: 'Price Approved' },
      dataType: { datagrid: 'checkbox' },
      controlType: { editQVForm: 'checkbox' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'priceWithTooling' },
      headerText: { datagrid: 'Price With Tooling', quotationsVendorForm: 'Price With Tooling' },
      dataType: { datagrid: 'number', quotationsVendorForm: 'number' },
      controlType: { editQVForm: 'number', quotationsVendorForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'priceWithoutTooling' },
      headerText: { datagrid: 'Price Without Tooling', quotationsVendorForm: 'Price Without Tooling' },
      dataType: { datagrid: 'number', quotationsVendorForm: 'number' },
      controlType: { editQVForm: 'number', quotationsVendorForm: 'number' },
      visible: { datagrid: false, editQVForm: true, quotationsVendorForm: true },
    },

    {
      id: { datagrid: 'remark' },
      headerText: { datagrid: 'Remark' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'string' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'specificationValidated' },
      headerText: { datagrid: 'Specification Validated' },
      dataType: { datagrid: 'checkbox' },
      controlType: { editQVForm: 'checkbox' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'toolingCost' },
      headerText: { datagrid: 'Tooling Cost' },
      dataType: { datagrid: 'number' },
      controlType: { editQVForm: 'number' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'transportationMode' },
      headerText: { datagrid: 'Transportation Mode', quotationsVendorForm: 'Transportation' },
      dataType: { datagrid: 'string', quotationsVendorForm: 'string' },
      controlType: { editQVForm: 'simple', quotationsVendorForm: 'simple' },
      visible: { datagrid: false, editQVForm: true, quotationsVendorForm: true },
    },

    {
      id: { datagrid: 'weightPerUnit' },
      headerText: { datagrid: 'Weight Per Unit', quotationsVendorForm: 'Weight Per Unit' },
      dataType: { datagrid: 'string', quotationsVendorForm: 'string' },
      controlType: { editQVForm: 'simple', quotationsVendorForm: 'string' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'vendorEmail' },
      headerText: { datagrid: 'Vendor Email' },
      dataType: { datagrid: 'string' },
      controlType: { editQVForm: 'simple' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'OfferCreated' },
      headerText: { datagrid: 'Offer Created' },
      dataType: { datagrid: 'checkbox' },
      // controlType: { editQVForm: 'simple' },
      visible: { datagrid: true },
    },

    {
      id: { datagrid: 'priceValidFrom' },
      headerText: { datagrid: 'Valid Price from', quotationsVendorForm: 'Valid Price from' },
      dataType: { datagrid: 'dateUnchanged', quotationsVendorForm: 'date' },
      controlType: { editQVForm: 'date', quotationsVendorForm: 'date' },
      visible: { datagrid: false, editQVForm: true },
    },

    {
      id: { datagrid: 'priceValidTo' },
      headerText: { datagrid: 'Valid Price To', quotationsVendorForm: 'Valid Price To' },
      dataType: { datagrid: 'dateUnchanged', quotationsVendorForm: 'date' },
      controlType: { editQVForm: 'date', quotationsVendorForm: 'date' },
      visible: { datagrid: false, editQVForm: true },
    },
  ]

  //#endregion QUOTATION-VENDOR

  //#region QUOTATION-Specification

  getQuotationSpecificationFields() {
    return this.quotationSpecification
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  getQSCreateFormField() {
    return this.quotationSpecification
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "createQSForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.createQSForm ? field.id.createQSForm : field.id.datagrid,
          headerText: field.headerText?.createQSForm ? field.headerText.createQSForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createQSForm : '',
          visible: field.visible?.createQSForm,
          isRequired: field.isRequired && field.isRequired.createQSForm,
        }
      })
  }

  getQSEditFormFields() {
    return this.quotationSpecification
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "editQSForm");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.editQSForm ? field.headerText.editQSForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editQSForm : '',
          visible: field.visible?.editQSForm,
          isRequired: field.isRequired && field.isRequired.editQSForm,
        }
      });
  }

  public readonly quotationSpecification: QuotationsFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
    },
    {
      id: { datagrid: 'name' },
      headerText: { datagrid: 'File Name', createQSForm: 'File Name' },
      controlType: { createQSForm: 'file', editQSForm: 'file' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: 'true', createQSForm: true, editQSForm: true },
      isRequired: { createQSForm: true },
    },
    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'File Descripton', createQSForm: 'File Description', editQSForm: 'File Description' },
      controlType: { createQSForm: 'simple', editQSForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true, createQSForm: true, editQSForm: true },
      isRequired: { createQSForm: true }
    }
  ];

  //#endregion QUOTATION-FILES

  //#region QUOTATION-OFFERS

  getQuotationOffersFields() {
    return this.quotationOffers
      .filter((field: QuotationsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: QuotationsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        }
      })
  }

  public readonly quotationOffers: QuotationsFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true }
    },
    {
      id: { datagrid: 'quotationVendorId' },
      headerText: { datagrid: 'Quotation Vendor ID' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false }
    },
    {
      id: { datagrid: 'vendorName' },
      headerText: { datagrid: 'Vendor' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'feedbackDate' },
      headerText: { datagrid: 'Date Created' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'minimalOrderQuantity' },
      headerText: { datagrid: 'MOQ' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'leadTime' },
      headerText: { datagrid: 'Lead Time' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'mfgLeadTime' },
      headerText: { datagrid: 'MFG L Time' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'transportationMode' },
      headerText: { datagrid: 'Trans.' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'priceWithoutTooling' },
      headerText: { datagrid: 'Price' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'toolingCost' },
      headerText: { datagrid: 'Price Tooling' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'priceWithTooling' },
      headerText: { datagrid: 'Price Total' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'currency' },
      headerText: { datagrid: 'Currency' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false }
    },
    {
      id: { datagrid: 'specificationValidated' },
      headerText: { datagrid: 'Spec. Validated' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'priceApproved' },
      headerText: { datagrid: 'Price Approved' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'awarded' },
      headerText: { datagrid: 'Winner' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true },
      isRequired: { datagrid: true }
    },
    {
      id: { datagrid: 'vendorComment' },
      headerText: { datagrid: 'Vendor Comment' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false }
    },
    {
      id: { datagrid: 'participationStatus' },
      headerText: { datagrid: 'Participation Status' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: false }
    },
    {
      id: { datagrid: 'lastEditBy' },
      headerText: { datagrid: 'Last Edit By' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false }
    },
    {
      id: { datagrid: 'lastEditDate' },
      headerText: { datagrid: 'Last Edit Date' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false }
    },
  ];

  //#endregion QUOTATION-OFFERS

}