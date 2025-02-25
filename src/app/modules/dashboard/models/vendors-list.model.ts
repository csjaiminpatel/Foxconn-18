
import { additionInfo } from './approved-vendor-list.model';
import { DatagridInfo } from './commits.model';
import { VendorCode } from './vendor-code.model';

export interface VendorsFields {
  /**
   * Used as field in forms
   */
  id: VendorsPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: VendorsPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: VendorsPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: VendorsPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: VendorsPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: VendorsPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: VendorsPlaceHolderTypeVal;
}

export enum EnumVendorsViews {
  INFO = 0,
  EDIT = 1,
  CONTACTS = 2,
  PN = 3,
  BUYERS = 4,
  NOTIFICATION = 5,
  NOTES = 6,
  COMMENTS = 7,
  CONFIG = 8,
}

export enum EnumVendorInfoViews {
  LIST = 0,
  SINGLE_COLUMN = 1,
  MULTI_COLUMN = 2,
  RESPONSIVE_COLUMN = 3,
}

export enum EnumVendorPNViews {
  SIMPLE_TABLE = 0,
  GROUP_TABLE = 1,
}

//TODO Change name
export interface VendorsPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  nestedForm?: string | number | boolean, //use nested<component>form for specific Component 
  nestedBuyerForm?: string | number | boolean,
  nestedNotificationForm?: string | number | boolean,
}

export interface VendorListFlags {
  id: string;
  key: string;
  dateCreated: Date;
  dateModified: Date;
  createdBy?: string;
  flags: string[];
  modifiedBy: string;
  pnVc: VendorCode[];
}

export interface IdentityByKey {
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

export interface createVendor {
  flag?: string; // only for create vendor with flag
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

export interface VendorsContacts {
  contactType?: string;
  email?: string;
  firstName?: string;
  identityKey?: string;
  key?: string;
  lastName?: string;
  name?: string;
}

export interface notificationEmails {
  name: string,
  description?: string,
  id: string,
  key: string,
  emailTo?: string[],
  emailToCC?: string[],
  emailToBCC?: string[],
}

export interface VendorTransactionDetails {
  type?: EnumVendorType;
  id: string;
  data?: any;
  datagridInfo?: DatagridInfo;
  // isCache?: boolean;
  //Add Other Details
}

export enum EnumVendorType {
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

export enum EnumVendorsFieldStructure {
  VendorTable = 0,
  VendorCreateForm = 1,
  VendorEditForm = 2, //IF MORE FORM CHANGE NAME
  NestedTable = 3,
  NestedForm = 4,
  NestedBuyerTable = 5,
  NestedBuyerForm = 6,
  NestedContactsTable = 7,
  NestedNotificationTable = 8,
  NestedNotificationForm = 9,
}

export interface SystemKeys {
  key: string;
  system: string;
}

export interface Vendors {
  count: number;
  result: VendorsDetail[];
}

export interface VendorsDetail {
  id: string;
  approvedVendorByCustomer: boolean;
  enabled: boolean;
  identityKey: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  meansOfCommitting: string;
  name: string;
  partnerMode: boolean;
  sectionName: string;
  selfBilling: string;
  transportationPaidBy: string;
  vat?: string;
  flags?: any
}

export class VendorsListField {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;
  //ADD Other Properties

  constructor(type?: EnumVendorsFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumVendorsFieldStructure): any[] {
    switch (type) {
      case EnumVendorsFieldStructure.VendorTable:
        return this.getDatagridFields();
      case EnumVendorsFieldStructure.VendorCreateForm:
        return this.getCreateFormList();
      case EnumVendorsFieldStructure.VendorEditForm:
        return this.getEditFormList();
      case EnumVendorsFieldStructure.NestedTable:
        return this.getVendorPnFields(); //
      case EnumVendorsFieldStructure.NestedForm:
        return this.getPnFormFields();
      case EnumVendorsFieldStructure.NestedBuyerTable:
        return this.getVendorBuyerFields();
      case EnumVendorsFieldStructure.NestedBuyerForm:
        return this.getBuyerFormFields();
      case EnumVendorsFieldStructure.NestedContactsTable:
        return this.getVendorContactsFields();
      case EnumVendorsFieldStructure.NestedNotificationTable:
        return this.getVendorNotificationFields();
      case EnumVendorsFieldStructure.NestedNotificationForm:
        return this.getNotificationFormFields();
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
  validFunWithUserFields = (field: VendorsFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof VendorsPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof VendorsPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof VendorsPlaceHolderTypeVal] == true)
      ); //2571 Comment
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };
  validFunWithoutUserFields = (field: VendorsFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof VendorsPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  //#region VENDORS-LIST (for DataGrid and EditForm)

  getDatagridFields() {
    return this.vendorsList
      .filter((field: VendorsFields) => {
        return this.hasField(field, 'datagrid', 'datagrid');
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType ? field.dataType.datagrid : '',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid
        };
      });
  }

  getCreateFormList() {
    return this.vendorsList
      .filter((field: VendorsFields) => {
        return this.hasField(field, 'datagrid', 'createForm');
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm
            ? field.headerText.createForm
            : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createForm : '',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.createForm
        };
      });
  }

  getEditFormList() {
    return this.vendorsList
      .filter((field: VendorsFields) => {
        return this.hasField(field, 'datagrid', 'editForm');
      })
      .map((field: VendorsFields) => {
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

  public readonly vendorsList: VendorsFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'approvedVendorByCustomer' },
      headerText: { datagrid: 'Customer Approved' },
      controlType: { createForm: 'checkbox', editForm: 'checkbox' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'enabled' },
      headerText: { datagrid: 'Enabled' },
      // controlType: { editForm: 'checkbox' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'partnerMode' },
      headerText: { datagrid: 'Partner Mode' },
      controlType: { createForm: 'checkbox', editForm: 'checkbox' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true },
    },
    // {
    //     id: { datagrid: 'id' },
    //     headerText: { datagrid: 'ID' },
    //     controlType: { editForm: 'simple' },
    //     dataType: { datagrid:'string' },
    //     visible: { datagrid: true },
    // },
    // {
    //     id: { datagrid: 'identityKey' },
    //     headerText: { datagrid: 'Identity Key' },
    //     controlType: { editForm: 'simple' },
    //     dataType: { datagrid: 'string' },
    //     visible: { datagrid: true },
    // },
    {
      id: { datagrid: 'lastModifiedBy' },
      headerText: { datagrid: 'Last Modified By' },
      // controlType: { editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'lastModifiedDate' },
      headerText: { datagrid: 'Last Modified Date' },
      // controlType: { editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'meansOfCommitting' },
      headerText: { datagrid: 'Means of Committing' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      controlType: { createForm: 'required' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createForm: true },
    },
    {
      id: { datagrid: 'vendorName' },
      headerText: { datagrid: 'Vendor Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    // {
    //     id: 'alias',
    //     headerText: 'Alias',
    //     controlType: 'simple',
    //     dataType: 'string',
    //     visible: true,
    // },
    {
      id: { datagrid: 'sectionName' },
      headerText: { datagrid: 'Section Name' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'selfBilling' },
      headerText: { datagrid: 'Self Billing' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    // {
    //     id: 'vendorCode',
    //     headerText: 'Vendor Code',
    //     controlType: 'simple',
    //     dataType: 'string',
    //     visible: true,
    // },
    {
      id: { datagrid: 'flags' },
      headerText: { datagrid: 'Flags' },
      dataType: { datagrid: 'flag' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'transportationPaidBy' },
      headerText: { datagrid: 'Transportation Paid By' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vat' },
      headerText: { datagrid: 'Vat' },
      controlType: { createForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    // {
    //   id: { datagrid: 'email' },
    //   headerText: { datagrid: 'Email' },
    //   controlType: { createForm: 'required' },
    //   visible: { datagrid: true },
    //   // dataType: { datagrid: 'string' },
    //   isRequired: { createForm: true },
    //   exclude: { datagrid: true }
    // },
    {
      id: { datagrid: 'phone' },
      headerText: { datagrid: 'Phone' },
      controlType: { createForm: 'number' },
      visible: { datagrid: true },
      // dataType: { datagrid: 'number' },
      exclude: { datagrid: true }
    },
    // {
    //     id: 'lastModifiedBy',
    //     headerText: 'Last',
    //     controlType: 'simple',
    //     dataType: 'string',
    //     visible: true,
    // }
  ]

  //#endregion VENDORS-LIST

  //#region VENDORS-PN (for DataGrid and Form)

  getVendorPnFields() {
    return this.vendorPNs
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: VendorsFields) => {
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
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "nestedForm");
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.nestedForm ? field.headerText.nestedForm : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }


  public readonly vendorPNs: VendorsFields[] = [


    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'Part Number' },
      controlType: { nestedForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    // {
    //     id: { datagrid: 'vendorCode' },
    //     headerText: { datagrid: 'Vendor Code' },
    //     controlType: { nestedForm: 'simple' },
    //     dataType: { datagrid:'string' },
    //     visible: { datagrid: true },
    // },
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

  //#endregion VENDORS-PN

  //#region VENDORS-BUYERS (for DataGrid and Form)


  getVendorBuyerFields() {
    return this.vendorBuyers
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getBuyerFormFields() {
    return this.vendorBuyers
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "nestedBuyerForm");
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedBuyerForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly vendorBuyers: VendorsFields[] = [

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
      controlType: { nestedBuyerForm: 'd-partNumber' },
      isRequired: { nestedBuyerForm: true },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      controlType: { nestedBuyerForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { datagrid: true }
    },
    {
      id: { datagrid: 'identityKey' },
      headerText: { datagrid: 'Identity Key' },
      controlType: { nestedBuyerForm: 'd-identityKey' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { datagrid: true }
    },
    {
      id: { datagrid: 'contactType' },
      headerText: { datagrid: 'Contact Type' },
      // controlType: { nestedBuyerForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { datagrid: true }
    },
    {
      id: { datagrid: 'validFrom' },
      headerText: { datagrid: 'Valid From' },
      controlType: { nestedBuyerForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'validTo' },
      headerText: { datagrid: 'Valid To' },
      controlType: { nestedBuyerForm: 'date' },
      dataType: { datagrid: 'dateUnchanged' },
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
  ]
  //#endregion VENDORS-BUYERS

  //#region VENDORS-CONTACTS (for DataGrid)

  getVendorContactsFields() {
    return this.vendorContacts
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly vendorContacts: VendorsFields[] = [

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

  //#endregion VENDORS-CONTACTS

  //#region VENDORS-NOTIFICATION (for DataGrid and Form)


  getVendorNotificationFields() {
    return this.vendorNotification
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: VendorsFields) => {
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
      .filter((field: VendorsFields) => {
        return this.hasField(field, "datagrid", "nestedNotificationForm");
      })
      .map((field: VendorsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedNotificationForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly vendorNotification: VendorsFields[] = [

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
  //#endregion VENDORS-NOTIFICATION
}
