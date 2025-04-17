export interface PortfolioFields {
  /**
   * Used as field in forms
   */
  id: PortfolioPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: PortfolioPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: PortfolioPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: PortfolioPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: PortfolioPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: PortfolioPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: PortfolioPlaceHolderTypeVal;
}

export interface PortfolioPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  bulkEditForm?: string | number | boolean,
  nestedCreateAdditionForm?: string | number | boolean,
  nestedEditAdditionForm?: string | number | boolean
}

export enum EnumPortfolioViews {
  EDIT = 0,
  ADDITIONS = 1,
  PN_INFO = 2,
  VC_INFO = 3,
}

export enum EnumPortfolioFieldStructure {
  PortfolioTable = 0,
  PortfolioCreateForm = 1,
  PortfolioEditForm = 2,
  BulkEditForm = 3,
  NestedAdditionTable = 4,
  NestedCreateAdditionForm = 5,
  NestedEditAdditionForm = 6,
}

export interface PortfolioFilterUIModel {
  dateType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  partNumbers?: string;
  vendorCodes?: string;
  flags?: string;
  contacts?: string;
  contactType?:string;
  materialGroups?: string;
  additionField?: string;
  additionFieldValue?: string;
  contact?:boolean
}

export interface VendorName {
  vendorCode: string;
  vendorName: string;
}

export interface PnVcAdditions {
  partNumber: string;
  vendorCode: string;
}

export interface BatchEditPortfolios {
  ids: string[];
  fields: { key: string; value: string | boolean | Date | number }[];
}

export class PortfolioProperty {
  id?: string;
  name?: string;
  type?: 'boolean' | 'number' | 'string' | 'date' | 'dropdown' | 'custom';
}

export interface CreateOrUpdatePnVcAdditions {
  partNumber: string;
  vendorCode: string;
  propertyName?: string;
  value?: string;
}
export interface Portfolio {
  id:string;
  identityKey?:string;
  firstName?:string;
  lastName?:string;
  email?:string;
  flags?:string[];
  validFrom?:string;
  validTo?:string;
  partNumber?:string;
  vendorCode?:string;
  contactType?:string
}

export class PortfolioListField {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;
  //ADD Other Properties

  constructor(type?: EnumPortfolioFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumPortfolioFieldStructure): any[] {
    switch (type) {
      case EnumPortfolioFieldStructure.PortfolioTable:
        return this.getPortfolioFields();
      case EnumPortfolioFieldStructure.PortfolioEditForm:
        return this.getEditPortfolioFormFields();
      case EnumPortfolioFieldStructure.PortfolioCreateForm:
        return this.getCreatePortfolioFormFields();
      case EnumPortfolioFieldStructure.BulkEditForm:
        return this.getBulkFormFields();
      case EnumPortfolioFieldStructure.NestedAdditionTable:
        return this.getPnVcAdditionsFields();
      case EnumPortfolioFieldStructure.NestedCreateAdditionForm:
        return this.getPnVcAdditionFormFields();
      case EnumPortfolioFieldStructure.NestedEditAdditionForm:
        return this.getPnVcEditAdditionFormFields();
      default:
        return this.getPortfolioFields();
    }
  }

  /**
   *
   * @param field field which inclusiveness needs to check
   * @param refId Id
   * @param actualId actual Id on which fields belongs
   * @returns is valid field
   */
  validFunWithUserFields = (field: PortfolioFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof PortfolioPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof PortfolioPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof PortfolioPlaceHolderTypeVal] == true)
      ); //2571 Comment
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };
  validFunWithoutUserFields = (field: PortfolioFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof PortfolioPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  //#region PORTFOLIO (for DataGrid & CreateForm & EditForm)

  getPortfolioFields() {
    return this.portfolioField
      .filter((field: PortfolioFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PortfolioFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getEditPortfolioFormFields() {
    return this.portfolioField
    .filter((field: PortfolioFields) => {
        return this.hasField(field, "datagrid", "editForm");
    })
    .map((field: PortfolioFields) => {
        return {
            field: field.id.datagrid,
            headerText: field.headerText?.editForm
              ? field.headerText.editForm
              : field.headerText?.datagrid,
            controlType: field.controlType ? field.controlType.editForm : '',
            visible: field.visible?.datagrid,
        }
    })
  }

  getCreatePortfolioFormFields() {
    return this.portfolioField
      .filter((field: PortfolioFields) => {
        return this.hasField(field, 'datagrid', 'createForm');
      })
      .map((field: PortfolioFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm
            ? field.headerText.createForm
            : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createForm : '',
          visible: field.visible?.createForm ? field.visible.createForm : field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.createForm
        };
      });
  }

  createDefaultField(field :any) {
    return {
      id: {datagrid: field, bulkEditForm: field },
      headerText: {
        bulkEditForm: field,
      },
      dataType: {
        bulkEditForm: 'text',
      },
    }
  }

  getBulkFormFields() {
    let ccFields = this.portfolioField.slice();
    for (const dField of this.userRightFields) {
      let index = this.portfolioField.findIndex(field =>
      { return (<string>(field.id['datagrid'])).toLowerCase() == dField.toLowerCase() })
      if(index == -1) { ccFields.push(this.createDefaultField(dField)) }
    }
    return  ccFields
      .filter((field: PortfolioFields) => {
        return this.userRightFields.includes((<string>(field.id['datagrid'])).toLowerCase())})
      .map((field: PortfolioFields) => {
        return {
          id: field.id.bulkEditForm,
          name: (field.headerText && field.headerText.bulkEditForm) ? field.headerText.bulkEditForm : field.headerText?.datagrid,
          type: field.dataType && field.dataType.bulkEditForm ? field.dataType.bulkEditForm : 'string',
        };
      });
  }

  public readonly portfolioField: PortfolioFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      isRequired: { datagrid: true },
      visible: { datagrid: true },
      exclude: { bulkEditForm: true }
    },
    {
      id: { datagrid: 'partNumber',  bulkEditForm:'partNumber'},
      headerText: { datagrid: 'Part Number' },
      controlType: { createForm: 'd-partNumber'},
      dataType: { datagrid: 'string' },
      isRequired: { datagrid: true, createForm: true },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vendorCode', bulkEditForm:'vendorCode'},
      headerText: { datagrid: 'Vendor Code', bulkEditForm:'VendorCode'},
      controlType: { createForm: 'd-vendorCode', editForm: 'd-vendorCode' },
      dataType: { datagrid: 'string', bulkEditForm: 'string'},
      visible: { datagrid: true },
      isRequired: { createForm: true },
    },
    {
      id: { datagrid: 'vendorName', bulkEditForm:'vendorName'},
      headerText: { datagrid: 'Vendor Name', bulkEditForm:'vendorName'},
      dataType: { datagrid: 'string', bulkEditForm: 'string'},
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'hasAdditionField', bulkEditForm:'hasAdditionField'},
      headerText: { datagrid: 'Addition Field' },
      dataType: { datagrid: 'checkbox' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'contactType', bulkEditForm:'contactType' },
      headerText: { datagrid: 'Contact Type' },
      controlType: { createForm: 'dropDown', editForm: 'dropDown' },
      dataType: { datagrid: 'string', bulkEditForm: 'dropdown' },
      isRequired: { datagrid: true, createForm: true }, //
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'firstName', bulkEditForm: 'firstName' },
      headerText: { datagrid: 'First Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'lastName', bulkEditForm: 'lastName' },
      headerText: { datagrid: 'Last Name' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true, createForm: false },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'email', bulkEditForm: 'email' },
      headerText: { datagrid: 'Email' },
      controlType: { editForm: 'simple' },
      dataType: { datagrid: 'string', bulkEditForm: 'd-identityKey' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'validFrom', bulkEditForm: 'validFrom' },
      headerText: { datagrid: 'Valid From' },
      controlType: { createForm: 'date', editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged', bulkEditForm: 'date' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'validTo', bulkEditForm: 'validTo' },
      headerText: { datagrid: 'Valid To' },
      controlType: { createForm: 'date', editForm: 'date' },
      dataType: { datagrid: 'dateUnchanged', bulkEditForm: 'date' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'flags', bulkEditForm: 'flags' },
      headerText: { datagrid: 'Flags' },
      dataType: { datagrid: 'flag' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'identityKey', bulkEditForm: 'identityKey' },
      headerText: { datagrid: 'Identity Key', createForm: 'Name', editForm: 'Name' },
      controlType: { createForm:'d-identityKey', editForm: 'd-identityKey' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      isRequired: { createForm: true },
      exclude: { datagrid: true }
    },
    {
      id: { datagrid: 'description', bulkEditForm: 'description' },
      headerText: { datagrid: 'Description' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'materialGroup', bulkEditForm: 'materialGroup' },
      headerText: { datagrid: 'Material Group' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'commodityCode', bulkEditForm: 'commodityCode' },
      headerText: { datagrid: 'Commodity Code' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'manufacturerPartNumber', bulkEditForm: 'manufacturerPartNumber' },
      headerText: { datagrid: 'Manufacturer PN' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'awsPartNumber', bulkEditForm: 'awsPartNumber' },
      headerText: { datagrid: 'AWS PN' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'mmPartNumber', bulkEditForm: 'mmPartNumber' },
      headerText: { datagrid: 'MM PN' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'mrpController', bulkEditForm: 'mrpController' },
      headerText: { datagrid: 'MRP Controller' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      exclude: { createForm: true }
    },
  ]

  //#endregion PORTFOLIO

  //#region PORTFOLIO-ADDITIONS (for DataGrid and Form)

  getPnVcAdditionsFields() {
    return this.pnVcAdditionFields
      .filter((field: PortfolioFields) => {
        return this.hasField(field, "datagrid", "datagrid");
      })
      .map((field: PortfolioFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
          visible: field.visible?.datagrid,
        }
      })
  }

  getPnVcAdditionFormFields() {
    return this.pnVcAdditionFields
      .filter((field: PortfolioFields) => {
        return this.hasField(field, "datagrid", "nestedCreateAdditionForm");
      })
      .map((field: PortfolioFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedCreateAdditionForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  getPnVcEditAdditionFormFields() {
    return this.pnVcAdditionFields
      .filter((field: PortfolioFields) => {
        return this.hasField(field, "datagrid", "nestedEditAdditionForm");
      })
      .map((field: PortfolioFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.nestedEditAdditionForm : '',
          visible: field.visible?.datagrid,
        }
      })
  }

  public readonly pnVcAdditionFields: PortfolioFields[] = [

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
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
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

  //#endregion PORTFOLIO-ADDITIONS
}