
export interface GoodsReceiptsFields {
  /**
   * Used as field in forms
   */
  id: GoodsReceiptsPlaceHolderTypeVal;
  /**
   * Shows the name that should be displayed in forms
   */
  headerText?: GoodsReceiptsPlaceHolderTypeVal;
  /**
   * Required for commit form
   */
  controlType?: GoodsReceiptsPlaceHolderTypeVal;
  /**
   * Shows dataType tah
   */
  dataType?: GoodsReceiptsPlaceHolderTypeVal;
  /**
   * (Datagrid)
   */
  isPrimaryKey?: boolean;
  /**
   * Shows if the field is mandatory in forms
   */
  isRequired?: GoodsReceiptsPlaceHolderTypeVal;
  /**
   * Shows if it should be visible by default in forms
   */
  visible?: GoodsReceiptsPlaceHolderTypeVal;

  exclusive?: string;
  format?: string;
  editType?: string;
  /**
   * Shows if field should be excluded in specific forms
   */
  exclude?: GoodsReceiptsPlaceHolderTypeVal;
}

export interface GoodsReceiptsPlaceHolderTypeVal {
  datagrid?: string | number | boolean,
  createForm?: string | number | boolean,
  editForm?: string | number | boolean,
  nestedForm?: string | number | boolean, //use nested<component>form for specific Component 
  nestedBuyerForm?: string | number | boolean,
  nestedNotificationForm?: string | number | boolean,
}

export enum EnumGoodsReceiptsFieldStructure {
  GoodsReceiptsTable = 0,
  GoodReceiptsForm = 1
}

export class GoodsReceiptsList {
  fields: any[];
  userRightFields: string[] = [];
  hasField: any;

  constructor(type?: EnumGoodsReceiptsFieldStructure, userRightFields?: string[]) {
    if(userRightFields) {
      this.userRightFields = userRightFields.map((e) => e.toLowerCase());
      this.hasField = this.validFunWithUserFields;
    }
    else {
      this.hasField = this.validFunWithoutUserFields;
    }
    this.fields = this.getDefaultFields(type);
  }

  validFunWithUserFields = (field: GoodsReceiptsFields, refId: string, actualId: string) => {
    if (
      this.userRightFields &&
      !(field.isRequired && field.isRequired[actualId as keyof GoodsReceiptsPlaceHolderTypeVal]) //For adding fields not present in default fields
    ) {
      // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
      return (
        this.userRightFields.includes((<string>field.id[refId as keyof GoodsReceiptsPlaceHolderTypeVal]).toLowerCase()) &&
        !(field.exclude && field.exclude[actualId as keyof GoodsReceiptsPlaceHolderTypeVal ] == true)
      ); 
    } else {
      return this.validFunWithoutUserFields(field, refId, actualId);
    }
  };

  validFunWithoutUserFields = (field: GoodsReceiptsFields, refId: string, actualId: string) => {
    if (field.exclude && field.exclude[actualId as keyof GoodsReceiptsPlaceHolderTypeVal] == true) {
      return false;
    } else {
      return true;
    }
  };

  getDefaultFields(type?: EnumGoodsReceiptsFieldStructure): any[] {
      switch (type) {
          case EnumGoodsReceiptsFieldStructure.GoodsReceiptsTable:
            return this.getDatagridFields();
          default:
            return this.getDatagridFields();
      }
  }


  getDatagridFields() {
    return this.goodsReceiptsList.filter((field: GoodsReceiptsFields) => {
      return this.hasField(field, 'datagrid', 'datagrid');
    })
    .map((field: GoodsReceiptsFields) => {
      return {
        field: field.id.datagrid,
        headerText: field.headerText?.datagrid,
        type: field.dataType ? field.dataType.datagrid : '',
        isRequired: field.isRequired && field.isRequired.datagrid,
        visible: field.visible?.datagrid,
      }
    })
  }



  public readonly goodsReceiptsList: GoodsReceiptsFields[] = [
    // {
    //   id: { datagrid: 'actions' },
    //   headerText: { datagrid: 'Actions' },
    //   dataType: { datagrid: 'actions' },
    //   isRequired: { datagrid: true },
    //   visible: { datagrid: true },
    // },
    {
      id: { datagrid: 'plant' },
      headerText: { datagrid: 'Plant' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'vendorCode' },
      headerText: { datagrid: 'Vendor Code' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'partNumber' },
      headerText: { datagrid: 'Part Number' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'purchaseOrderItem' },
      headerText: { datagrid: 'Purchase Order Item' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'materialDescription' },
      headerText: { datagrid: 'Material Description' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'receivedQuantity' },
      headerText: { datagrid: 'Received Quantity' },
      dataType: { datagrid: 'number' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'receiveDate' },
      headerText: { datagrid: 'Received Date' },
      dataType: { datagrid: 'dateUnchanged' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'externalId' },
      headerText: { datagrid: 'External Id' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'deliveryNote' },
      headerText: { datagrid: 'Delivery Note' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'goodsReceiveNumber' },
      headerText: { datagrid: 'Goods Receive Number' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'goodsReceiveItem' },
      headerText: { datagrid: 'Goods Receive Item' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'purchaseOrderNumber' },
      headerText: { datagrid: 'Purchase Order Number' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'profitCenter' },
      headerText: { datagrid: 'Profit Center' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
    {
      id: { datagrid: 'remark' },
      headerText: { datagrid: 'Remark' },
      dataType: { datagrid: 'string' },
      visible: { datagrid: true },
    },
  ]

}