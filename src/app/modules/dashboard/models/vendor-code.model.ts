export interface VendorCode {
  partNumber: string;
  vendorCodes: string[];
}

export interface VendorCodesRightsFields {
  /**
   * Used as field in forms
   */
  id: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: VendorCodesRightsPlaceHolderTypeVal;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: VendorCodesRightsPlaceHolderTypeVal;
}

export interface VendorCodesRightsPlaceHolderTypeVal {
  datagrid?: string | number | boolean;
  createForm?: string | number | boolean;
  editForm?: string | number | boolean;
}

export class VCRightsVisualization {
  pageSettings?: { pageSize: number, pageIndex: number };
  columnSort: any[] = [];
}

export enum EnumVendorCodesRightsFieldStructure {
  VendorCodesRightsTable = 0,
  VendorCodesRightsCreateForm = 1,
  VendorCodesRightsEditForm = 2,
}

export class VendorCodesRightsListField {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;

  constructor(type?: EnumVendorCodesRightsFieldStructure, userRightFields?: string[]) {
    if (userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    } else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  getDefaultFields(type?: EnumVendorCodesRightsFieldStructure): any[] {
    switch (type) {
      case EnumVendorCodesRightsFieldStructure.VendorCodesRightsTable:
        return this.getDatagridFields();
      case EnumVendorCodesRightsFieldStructure.VendorCodesRightsCreateForm:
        return this.getCreateFormList();
      case EnumVendorCodesRightsFieldStructure.VendorCodesRightsEditForm:
        return this.getEditFormList();
      default:
        return this.getDatagridFields();
    }
  }

  validFunWithUserFields = (field: VendorCodesRightsFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof VendorCodesRightsPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof VendorCodesRightsPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof VendorCodesRightsPlaceHolderTypeVal] == true)
      );
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };

  validFunWithoutUserFields = (field: VendorCodesRightsFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof VendorCodesRightsPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  getDatagridFields() {
    return this.vendorsList
      .filter((field: VendorCodesRightsFields) => {
        return this.hasField(field, 'datagrid', 'datagrid');
      })
      .map((field: VendorCodesRightsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.datagrid,
          type: field.dataType ? field.dataType.datagrid : '',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.datagrid,
        };
      });
  }

  getCreateFormList() {
    return this.vendorsList
      .filter((field: VendorCodesRightsFields) => {
        return this.hasField(field, 'datagrid', 'createForm');
      })
      .map((field: VendorCodesRightsFields) => {
        return {
          field: field.id.datagrid,
          headerText: field.headerText?.createForm
            ? field.headerText.createForm
            : field.headerText?.datagrid,
          controlType: field.controlType ? field.controlType.createForm : '',
          visible: field.visible?.datagrid,
          isRequired: field.isRequired && field.isRequired.createForm,
        };
      });
  }

  getEditFormList() {
    return this.vendorsList
      .filter((field: VendorCodesRightsFields) => {
        return this.hasField(field, 'datagrid', 'editForm');
      })
      .map((field: VendorCodesRightsFields) => {
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

  public readonly vendorsList: VendorCodesRightsFields[] = [
    {
      id: { datagrid: 'actions' },
      headerText: { datagrid: 'Actions' },
      dataType: { datagrid: 'actions' },
      visible: { datagrid: true },
      isRequired: { datagrid: true },
      exclude: { createForm: true }
    },
    {
      id: { datagrid: 'userEmail' },
      headerText: { datagrid: 'User Email' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true }
    },
    {
      id: { datagrid: 'vendorCodes' },
      headerText: { datagrid: 'VendorCodes' },
      controlType: { createForm: 'simple', editForm: 'simple' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true }
    },
  ];
}
