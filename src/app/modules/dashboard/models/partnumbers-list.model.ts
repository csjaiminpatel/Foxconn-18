import { additionInfo } from './approved-vendor-list.model';
import { DatagridInfo } from './commits.model';
import { VendorCode } from './vendor-code.model';

export interface PartNumbersFields {
  /**
   * Used as field in forms
   */
  id: PartNumbersPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: PartNumbersPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: PartNumbersPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: PartNumbersPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: PartNumbersPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: PartNumbersPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: PartNumbersPlaceHolderTypeVal;
}

export enum EnumPartNumbersViews {
  INFO = 0,
  ADDITIONS = 1,
  CONTACTS = 2,
  VENDORS = 3,
  BUYERS = 4,
  NOTIFICATION = 5,
  NOTES = 6,
  COMMENTS = 7,
  CONFIG = 8,
}

export enum EnumPartNumberInfoViews {
  LIST = 0,
  SINGLE_COLUMN = 1,
  MULTI_COLUMN = 2,
  RESPONSIVE_COLUMN = 3,
}

export enum EnumPNVendorViews {
  SIMPLE_TABLE = 0,
  GROUP_TABLE = 1,
}



//TODO Change name
export interface PartNumbersPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  nestedForm?: string | number | boolean, //use nested<component>form for specific Component 
  nestedCreateBuyerForm?: string | number | boolean,
  nestedEditBuyerForm?: string | number | boolean,
  nestedNotificationForm?: string | number | boolean,
  nestedCreateAdditionForm?: string | number | boolean,
  nestedEditAdditionForm?: string | number | boolean
}

export interface PartNumberListFlags {
  id: string;
  key: string;
  dateCreated: Date;
  dateModified: Date;
  createdBy?: string;
  flags: string[];
  modifiedBy: string;
  pnVc: VendorCode[];
}

export interface PartNumberListContacts {
  id: string;
  active?: boolean;
  additionInfos?: additionInfo[];
  addresses: Address[];
  adfsGuid?: any;
  alias?: any;
  contacts: Contacts[];
  createdBy?: string;
  dateCreated?: string;
  dateModified?: string;
  description?: string;
  firstName?: string;
  identityKey?: string;
  identityType?: string;
  lastName?: string;
  modifiedBy?: string;
  systemKeys?: SystemKeys[];
  [key: string]: any;
}

export interface createPartNumber {
  flag?: string; // only for create PartNumber with flag
  vendorCode: string;
  vat?: string;
  contact?: {
    email?: string;
    phone?: number;
  };
  selfBilling: string;
  approvedVendorByCustomer?: boolean;
  transportationPaidBy?: string;
  meansOfCommitting: string;
  partnerMode?: boolean;
  sectionName?: string;
}

export interface PartNumbersContacts {
  contactType?: string;
  email?: string;
  firstName?: string;
  identityKey?: string;
  key?: string;
  lastName?: string;
  name?: string;
}

export interface PartNumbersNotificationEmails {
  name: string,
  description?: string,
  id: string,
  key: string,
  emailTo?: string[],
  emailToCC?: string[],
  emailToBCC?: string[],
}

export interface PartNumberTransactionDetails {
  type?: EnumPartNumberType;
  id: string;
  data?: any;
  datagridInfo?: DatagridInfo;
  // isCache?: boolean;
  //Add Other Details
}

export enum EnumPartNumberType {
  NEW = 0,
  EDIT = 1,
}
export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  addressType: string;
}

export interface Contacts {
  contactType: string;
  value: string;
}

export interface BuyersContacts {
  identityKey: string;
  partNumber: string;
  vendorCode: string;
  contactType?: string;
}

export interface DeleteBuyersContacts {
  id: string;
  identityKey: string;
  partNumber: string;
  vendorCode: string;
  contactType?: string;
}

export enum EnumPartNumbersFieldStructure {
  PartNumberTable = 0,
  PartNumberCreateForm = 1,
  PartNumberEditForm = 2, //IF MORE FORM CHANGE NAME
  NestedTable = 3,
  NestedForm = 4,
  NestedBuyerTable = 5,
  NestedCreateBuyerForm = 6,
  NestedEditBuyerForm = 7,
  NestedContactsTable = 8,
  NestedNotificationTable = 9,
  NestedNotificationForm = 10,
  NestedAdditionTable = 11,
  NestedCreateAdditionForm = 12,
  NestedEditAdditionForm = 13,
}

export interface SystemKeys {
  key: string;
  system: string;
}

export interface PartNumbers {
  count: number;
  result: PartNumbersDetail[];
}

export interface PartNumbersDetail {
  awsPartNumber: string;
  commodityCode: string;
  description: string;
  manufacturerPartNumber: string;
  materialGroup: string;
  mmPartNumber: string;
  mrpController: string;
  name: string;
  partNumber: string;
  flags?: any
}
export interface PartNumbersAdditions {
  id: string;
  partNumber: string;
  commodityTeam: string;
  gtk: string;
  typeOfTransport: string;
  remark: string;
  dateCreated: string;
  dateModified: string;
  modifiedBy: string;
  flags?: any;
}

export class PartNumbersListField {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;
  //ADD Other Properties

  constructor(type?: EnumPartNumbersFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumPartNumbersFieldStructure): any[] {
    switch (type) {
      case EnumPartNumbersFieldStructure.PartNumberTable:
        return this.getDatagridFields();
      case EnumPartNumbersFieldStructure.PartNumberCreateForm:
        return this.getCreateFormList();
      case EnumPartNumbersFieldStructure.PartNumberEditForm:
        return this.getEditFormList();
      case EnumPartNumbersFieldStructure.NestedTable:
        return this.getPartNumberVendorFields(); //
      case EnumPartNumbersFieldStructure.NestedForm:
        return this.getPnFormFields();
      case EnumPartNumbersFieldStructure.NestedBuyerTable:
        return this.getPartNumberBuyerFields();
      case EnumPartNumbersFieldStructure.NestedCreateBuyerForm:
        return this.getBuyerFormFields();
      case EnumPartNumbersFieldStructure.NestedEditBuyerForm:
        return this.getEditBuyerFormFields();
      case EnumPartNumbersFieldStructure.NestedContactsTable:
        return this.getPartNumberContactsFields();
      case EnumPartNumbersFieldStructure.NestedNotificationTable:
        return this.getPartNumberNotificationFields();
      case EnumPartNumbersFieldStructure.NestedNotificationForm:
        return this.getNotificationFormFields();
      case EnumPartNumbersFieldStructure.NestedAdditionTable:
        return this.getPartNumberAdditionsFields();
      case EnumPartNumbersFieldStructure.NestedCreateAdditionForm:
        return this.getAdditionFormFields();
      case EnumPartNumbersFieldStructure.NestedEditAdditionForm:
        return this.getEditAdditionFormFields();
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
  validFunWithUserFields = (field: PartNumbersFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof PartNumbersPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof PartNumbersPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof PartNumbersPlaceHolderTypeVal] == true)
      ); //2571 Comment
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };
  validFunWithoutUserFields = (field: PartNumbersFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof PartNumbersPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  //#region PartNumbers-LIST (for DataGrid and EditForm)

  getDatagridFields() {
    return this.PartNumbersList
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, 'datagrid', 'datagrid');
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType ? field.dataType.datagrid : '',
          visible: field.visible?.datagrid,
        };
      });
  }

  getCreateFormList() {
    return this.PartNumbersList
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, 'datagrid', 'createForm');
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm
            ? field.headerText.createForm
            : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createForm : '',
          visible: field.visible?.datagrid,
        };
      });
  }

  getEditFormList() {
    return this.PartNumbersList
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, 'datagrid', 'editForm');
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.editForm
            ? field.headerText.editForm
            : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.editForm : '',
          visible: field.visible?.datagrid,
        };
      });
  }

  public readonly PartNumbersList: PartNumbersFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      isRequired: { datagrid: true },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'PartNumber' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'Description' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'materialGroup' },
      headerText: { datagrid: 'Material Group' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'commodityCode' },
      headerText: { datagrid: 'Commodity Code' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'manufacturerPartNumber' },
      headerText: { datagrid: 'Manufacturer PartNumber' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'awsPartNumber' },
      headerText: { datagrid: 'AWS PartNumber' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'mmPartNumber' },
      headerText: { datagrid: 'MM PartNumber' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'mrpController' },
      headerText: { datagrid: 'MRP Controller' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    // {
    //     id: { datagrid: 'lastModifiedBy' },
    //     headerText: { datagrid: 'Last Modified By' },
    //     // controlType: { editForm: 'simple' },
    //     dataType: { datagrid: 'string' },
    //     visible: { datagrid: true },
    // },
    // {
    //     id: { datagrid: 'lastModifiedDate' },
    //     headerText: { datagrid: 'Last Modified Date' },
    //     // controlType: { editForm: 'date' },
    //     dataType: { datagrid: 'dateUnchanged' },
    //     visible: { datagrid: true },
    // },
    {
      id: { datagrid: 'flags' },
      headerText: { datagrid: 'Flags' },
      dataType: { datagrid: 'flag' },
      visible: { datagrid: true },
    },
  ]

  //#endregion PartNumbers-LIST

  //#region PartNumbers-VENDORS (for DataGrid and Form)

  getPartNumberVendorFields() {
    return this.vendorPNs
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }
  getPnFormFields() {
    return this.vendorPNs
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.nestedForm ? field.headerText.nestedForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }


  public readonly vendorPNs: PartNumbersFields[] = [


    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
    },
    // {
    //     id: { datagrid: 'partNumber' },
    //     headerText: { datagrid: 'Part Number' },
    //     controlType: { nestedForm: 'simple' },
    //     dataType: { datagrid:'string' },
    //     visible: { datagrid: true } ,
    // },
    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      controlType: { nestedForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'sectionName' },
      headerText: { datagrid: 'Section Name' },
      controlType: { nestedForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'flags' },
      headerText: { datagrid: 'Flags' },
      // controlType: { nestedForm: 'flags' },
      dataType: { datagrid: 'flag' },
      visible: { datagrid: true },
    },
  ]

  //#endregion PartNumbers-VENDORS

  //#region PartNumbers-BUYERS (for DataGrid and Form)


  getPartNumberBuyerFields() {
    return this.partnumberBuyers
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getBuyerFormFields() {
    return this.partnumberBuyers
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedCreateBuyerForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedCreateBuyerForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  getEditBuyerFormFields() {
    return this.partnumberBuyers
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedEditBuyerForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedEditBuyerForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly partnumberBuyers: PartNumbersFields[] = [

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
    },
    // {
    //   id: { datagrid: 'buyer' },
    //   headerText: { datagrid: 'Buyer' },
    //   dataType: { datagrid: 'string' },
    //   visible: { datagrid: true },
    // },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'Part Number' },
      // controlType: { nestedCreateBuyerForm: 'd-partNumber' },
      // isRequired: { nestedCreateBuyerForm: true },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      controlType: { nestedCreateBuyerForm: 'd-vendorCode', nestedEditBuyerForm: 'd-vendorCode' },
      isRequired: { nestedCreateBuyerForm: true },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'identityKey' },
      headerText: { datagrid: 'Identity Key' },
      controlType: { nestedCreateBuyerForm: 'd-identityKey', nestedEditBuyerForm: 'd-identityKey' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { datagrid: true }
    },
    {
      id: { datagrid: 'contactType' },
      headerText: { datagrid: 'Contact Type' },
      controlType: { nestedCreateBuyerForm: 'dropDown', nestedEditBuyerForm: 'dropDown' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'firstName' },
      headerText: { datagrid: 'First Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'lastName' },
      headerText: { datagrid: 'Last Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    // {
    //   id: { datagrid: 'phone' },
    //   headerText: { datagrid: 'Buyer Phone' },
    //   dataType: { datagrid: 'number' },
    //   visible: { datagrid: true },
    // },
    {
      id: { datagrid: 'email' },
      headerText: { datagrid: 'Email' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'validFrom' },
      headerText: { datagrid: 'Valid From' },
      controlType: { nestedCreateBuyerForm: 'date', nestedEditBuyerForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'validTo' },
      headerText: { datagrid: 'Valid To' },
      controlType: { nestedCreateBuyerForm: 'date', nestedEditBuyerForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
  ]
  //#endregion PartNumbers-BUYERS

  //#region PartNumbers-CONTACTS (for DataGrid)

  getPartNumberContactsFields() {
    return this.vendorContacts
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }
  public readonly vendorContacts: PartNumbersFields[] = [

    {
      id: { datagrid: 'firstName' },
      headerText: { datagrid: 'NAME' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'lastName' },
      headerText: { datagrid: 'SURNAME' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'email' },
      headerText: { datagrid: 'EMAIL' },
      dataType: { datagrid: 'email' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'contactType' },
      headerText: { datagrid: 'CONTACT TYPE' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    }
  ]

  //#endregion PartNumbers-CONTACTS

  //#region PartNumbers-NOTIFICATION (for DataGrid and Form)


  getPartNumberNotificationFields() {
    return this.vendorNotification
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getNotificationFormFields() {
    return this.vendorNotification
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedNotificationForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedNotificationForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly vendorNotification: PartNumbersFields[] = [

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'emailTo' },
      headerText: { datagrid: 'Email To' },
      controlType: { nestedNotificationForm: 'email' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'emailToCC' },
      headerText: { datagrid: 'Email To CC' },
      controlType: { nestedNotificationForm: 'email' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'emailToBCC' },
      headerText: { datagrid: 'Email To BCC' },
      controlType: { nestedNotificationForm: 'email' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'description' },
      headerText: { datagrid: 'Description' },
      controlType: { nestedNotificationForm: 'text' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
  ]
  //#endregion PartNumbers-NOTIFICATION

  //#region PartNumbers-ADDITIONS (for DataGrid and Form)

  getPartNumberAdditionsFields() {
    return this.vendorAdditionFields
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getAdditionFormFields() {
    return this.vendorAdditionFields
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedCreateAdditionForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedCreateAdditionForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  getEditAdditionFormFields() {
    return this.vendorAdditionFields
      .filter((field: PartNumbersFields) => {
        return this.hasField(field, "datagrid", "nestedEditAdditionForm");
      })
      .map((field: PartNumbersFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedEditAdditionForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly vendorAdditionFields: PartNumbersFields[] = [

    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'Part Number' },
      controlType: { nestedCreateAdditionForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: false },
    },
    {
      id: { datagrid: 'propertyName' },
      headerText: { datagrid: 'Property Name' },
      controlType: { nestedCreateAdditionForm: 'simple', nestedEditAdditionForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'value' },
      headerText: { datagrid: 'Value' },
      controlType: { nestedCreateAdditionForm: 'simple', nestedEditAdditionForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
  ]

  //#endregion PartNumbers-ADDITIONS
}
