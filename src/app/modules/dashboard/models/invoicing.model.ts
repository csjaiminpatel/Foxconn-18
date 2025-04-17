export interface InvoicingModel {
  status: string[],
  type: string,
  plant: string,
  vendorCode: string,
  invoiceNumber: string,
  invoiceDate: Date,
  dueDate: Date,
  amountIncludeVat: string,
  currency: string,
  clearingDate: Date,
  issueDate: Date,
  PBk: string,
  text: string,
  flags: string[],
  foxconnAccountingDocument: string,
  received: Date,
  reviewed: Date,
  purchasingOrganization: string,
  downloadExcel: undefined | any;
  downloadPDF: undefined | any;
  downloadXML: undefined | any;
}

export interface InvoicingFields {
  /**
   * Used as field in forms
   */
  id: InvoicingPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: InvoicingPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: InvoicingPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: InvoicingPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: InvoicingPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: InvoicingPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: InvoicingPlaceHolderTypeVal;

  /**
   * Adds field explicitly in datagrid columns
   * */
  mandatory?: boolean;
}

export interface InvoicingPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  nestedForm?: string | number | boolean, //use nested<component>form for specific Component
  nestedBuyerForm?: string | number | boolean,
  nestedNotificationForm?: string | number | boolean,
}

export enum EnumInvoicingFieldStructure {
  InvoicingTable = 0
}

export interface InvoiceReviewed {
  invoiceNumber?: string;
  documentNumber?: string;
  flag: string;
}

export class InvoicingList {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;

  constructor(type?: EnumInvoicingFieldStructure, userRightFields?: string[]) {
    if(userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    }
    else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  validFunWithUserFields = (field: InvoicingFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof InvoicingPlaceHolderTypeVal]) &&
      !field.mandatory //For adding fields not present in default fields
    ) {

      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof InvoicingPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof InvoicingPlaceHolderTypeVal] == true)
      );
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };

  validFunWithoutUserFields = (field: InvoicingFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof InvoicingPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  getDefaultFields(type?: EnumInvoicingFieldStructure): any[] {
      switch (type) {
          case EnumInvoicingFieldStructure.InvoicingTable:
              return this.getDatagridFields();
          default:
              return this.getDatagridFields();
      }
  }

  getDatagridFields() {
    return this.invoicingList.filter((field: InvoicingFields) => {
      return this.hasField(field, 'datagrid', 'datagrid');
    })
    .map((field: InvoicingFields) => {
      return {
        field: field.id.datagrid,
        headerText: field.headerText?.datagrid,
        type: field.dataType ? field.dataType.datagrid : '',
        isRequired: field.isRequired && field.isRequired.datagrid,
        visible: field.visible?.datagrid,
      }
    })
  }

  public readonly invoicingList: InvoicingFields[] = [
    {
      id: { datagrid : 'status'},
      headerText: { datagrid: 'Status' },
      dataType: { datagrid: 'status' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'type'},
      headerText: { datagrid: 'Type' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'plant'},
      headerText: { datagrid: 'Plant' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'vendorCode'},
      headerText: { datagrid: 'Vendor Code' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'invoiceNumber'},
      headerText: { datagrid: 'Invoice Number' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'invoiceDate'},
      headerText: { datagrid: 'Invoice Date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'dueDate'},
      headerText: { datagrid: 'Due Date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'amountIncludeVat'},
      headerText: { datagrid: 'Amount' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'currency'},
      headerText: { datagrid: 'Currency' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'clearingDate'},
      headerText: { datagrid: 'Clearing Date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'issueDate'},
      headerText: { datagrid: 'Issue Date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'pBk'},
      headerText: { datagrid: 'PBk' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'text'},
      headerText: { datagrid: 'Text' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'flags'},
      headerText: { datagrid: 'Reviewed' },
      dataType: { datagrid: 'r-flag' },
      visible: { datagrid: true },
      isRequired: { datagrid: true }
    },
    {
      id: { datagrid : 'received'},
      headerText: { datagrid: 'Received' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'reviewed'},
      headerText: { datagrid: 'Reviewed' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'purchasingOrganization'},
      headerText: { datagrid: 'PurchOrg' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid : 'downloadExcel'},
      headerText: { datagrid: 'Download XLSX' },
      dataType: { datagrid: 'downloadExcel' },
      visible: { datagrid: true },
      mandatory: true
    },
    {
      id: { datagrid: 'downloadPDF' },
      headerText: { datagrid: 'Download PDF' },
      dataType: { datagrid: 'downloadPdf' },
      visible: { datagrid: true },
      mandatory: true
    },
    {
      id: { datagrid: 'downloadXML' },
      headerText: { datagrid: 'Download XML' },
      dataType: { datagrid: 'downloadXml' },
      visible: { datagrid: true },
      mandatory: true
    },
    {
      id: { datagrid: 'documentFI' },
      headerText: { datagrid: 'DocumentFI' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
      mandatory: true
    }
  ]

}
