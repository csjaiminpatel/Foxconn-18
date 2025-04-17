export interface ShipmentFields {
    /**
     * Used as field in forms
     */
    id: ShipmentPlaceHolderTypeVal;
    /**
     * Shows the name that should be displayed in forms
     */
    headerText?: ShipmentPlaceHolderTypeVal;
    /**
     * Required for commit form
     */
    controlType?: ShipmentPlaceHolderTypeVal;
    /**
     * Shows dataType tah
     */
    dataType?: ShipmentPlaceHolderTypeVal;
    /**
     * (Datagrid)
     */
    isPrimaryKey?: boolean;
    /**
     * Shows if the field is mandatory in forms
     */
    isRequired?: ShipmentPlaceHolderTypeVal;
    /**
     * Shows if it should be visible by default in forms
     */
    visible?: ShipmentPlaceHolderTypeVal;
  
    exclusive?: string;
    format?: string;
    editType?: string;
    /**
     * Shows if field should be excluded in specific forms
     */
    exclude?: ShipmentPlaceHolderTypeVal;
  }
  
  export interface ShipmentPlaceHolderTypeVal {
    datagrid?: string | number | boolean,
    createForm?: string | number | boolean,
    editForm?: string | number | boolean,
    createDocsForm?: string | number | boolean,
    createIntDocsForm?: string | number | boolean,

  }
  
  export enum EnumShipmentsViews {
    DETAILS = 0,
    DOCUMENTS = 1,
    INTERNAL_DOCUMENTS = 2
  }

  export enum EnumShipmentFieldStructure {
    ShipmentTable = 0,
    ShipmentEditForm = 1,
    ShipmentCreateForm = 2,
    NestedDetailsTable = 3,
    NestedDocsTable = 4,
    NestedDocsCreateForm = 5,
    NestedIntDocsTable = 6,
    NestedIntDocsCreateForm = 7
  }
  
  export interface ShipmentFilterUIModel {
    requestNumbers?: string;
    trackNumbers?: string;
    containerNumbers?: string;
    status?: string;
    flags?: string;
    onlyMyShipments?: boolean
  }
  
  export interface Shipment {
    id: string;
    key?: string;
    requestNumber?: string;
    trackNumber?: string;
    containerNumber?: string;
    status?: string;
    receiveDate?: string;
    instructionType?: string;
    instructionRequestDate?: string;
    instructionSendDate?: string;
    lastModifiedDate?: string;
    lastModifiedBy?: string;
    flags?: string[]
  }
  
  export interface ShipmentDeliveriesDetail {
    actualETADate?: string;
    commodityCode?: string;
    containerNumber?: string;
    forwarder?: string;
    inboundDeliveryNumber?: string;
    invoiceNumber?: string;
    materialGroupDuty?: string;
    partNumber?: string;
    purchaseOrderItem?: string;
    purchaseOrderNumber?: string;
    quantity?: string;
    receiveDate?: string;
    trackNumber?: string;
    vendorCode?: string;
    vendorName?: string;
  }

  export class ShipmentListField {
    fields: any[];
    userRightFields: string[]  = [];
    hasField: any;
    //ADD Other Properties
  
    constructor(type?: EnumShipmentFieldStructure, userRightFields?: string[]) {
      if (userRightFields) {
        this.userRightFields = userRightFields.map((e) => e.toLowerCase());
        this.hasField = this.validFunWithUserFields;
      } else {
        this.hasField = this.validFunWithoutUserFields;
      }
      this.fields = this.getDefaultFields(type);
    }
  
    getDefaultFields(type?: EnumShipmentFieldStructure): any[] {
      switch (type) {
        case EnumShipmentFieldStructure.ShipmentTable:
          return this.getShipmentFields();
        case EnumShipmentFieldStructure.ShipmentEditForm:
          return this.getEditShipmentFormFields();
        case EnumShipmentFieldStructure.ShipmentCreateForm:
          return this.getCreateShipmentFormFields();
        case EnumShipmentFieldStructure.NestedDetailsTable:
          return this.getShipmentDetailsFields();
        case EnumShipmentFieldStructure.NestedDocsTable:
          return this.getShipmentDocsFields();
        case EnumShipmentFieldStructure.NestedDocsCreateForm:
          return this.getCreateShipmentDocsFormFields();
        case EnumShipmentFieldStructure.NestedIntDocsTable:
          return this.getShipmentIntDocsFields();
        case EnumShipmentFieldStructure.NestedIntDocsCreateForm:
          return this.getCreateShipmentIntDocsFormFields();
        default:
          return this.getShipmentFields();
      }
    }
  
    /**
     *
     * @param field field which inclusiveness needs to check
     * @param refId Id
     * @param actualId actual Id on which fields belongs
     * @returns is valid field
     */
    validFunWithUserFields = (field: ShipmentFields, refId: string, actualId: string) => {
      if (
        this.userRightFields &&
        !(field.isRequired && field.isRequired[actualId as keyof ShipmentPlaceHolderTypeVal]) //For adding fields not present in default fields
      ) {
        // return this.userRightFields.includes((<string>field.id[refId]).toLowerCase());
        return (
          this.userRightFields.includes((<string>field.id[refId as keyof ShipmentPlaceHolderTypeVal]).toLowerCase()) &&
          !(field.exclude && field.exclude[actualId as keyof ShipmentPlaceHolderTypeVal] == true)
        ); //2571 Comment
      } else {
        return this.validFunWithoutUserFields(field, refId, actualId);
      }
    };
    validFunWithoutUserFields = (field: ShipmentFields, refId: string, actualId: string) => {
      if (field.exclude && field.exclude[actualId as keyof ShipmentPlaceHolderTypeVal] == true) {
        return false;
      } else {
        return true;
      }
    };
  
    //#region SHIPMENT (for DataGrid & CreateForm & EditForm)
  
    getShipmentFields() {
      return this.shipmentField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, "datagrid", "datagrid");
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.datagrid,
            type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
            isRequired: field.isRequired && field.isRequired.datagrid,
            visible: field.visible?.datagrid,
          }
        })
    }
  
    getEditShipmentFormFields() {
      return this.shipmentField
      .filter((field: ShipmentFields) => {
          return this.hasField(field, "datagrid", "editForm");
      })
      .map((field: ShipmentFields) => {
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
  
    getCreateShipmentFormFields() {
      return this.shipmentField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, 'datagrid', 'createForm');
        })
        .map((field: ShipmentFields) => {
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
  
    public readonly shipmentField: ShipmentFields[] = [
      {
        id: { datagrid: 'actions' },
        headerText: { datagrid: 'Actions' },
        dataType: { datagrid: 'actions' },
        isRequired: { datagrid: true },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'flags' },
        headerText: { datagrid: 'Flags' },
        dataType: { datagrid: 'flag' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'id' },
        headerText: { datagrid: 'ID' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: false },
      },
      {
        id: { datagrid: 'key' },
        headerText: { datagrid: 'Key' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: false },
      },
      {
        id: { datagrid: 'requestNumber' },
        headerText: { datagrid: 'Request Number'},
        controlType: { createForm: 'simple', editForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'trackNumber' },
        headerText: { datagrid: 'Track Number'},
        controlType: { createForm: 'simple', editForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'containerNumber' },
        headerText: { datagrid: 'Container Number'},
        controlType: { createForm: 'simple', editForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'status' },
        headerText: { datagrid: 'Status' },
        controlType: { createForm: 'simple'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'receiveDate' },
        headerText: { datagrid: 'ReceiveDate' },
        controlType: { createForm: 'date', editForm: 'date' },
        dataType: { datagrid: 'dateUnchanged' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'instructionType' },
        headerText: { datagrid: 'Instruction Type' },
        controlType: { createForm: 'simple', editForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'instructionRequestDate' },
        headerText: { datagrid: 'Instruction Request Date' },
        controlType: { createForm: 'date', editForm: 'date' },
        dataType: { datagrid: 'dateUnchanged' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'instructionSendDate' },
        headerText: { datagrid: 'Instruction Send Date' },
        controlType: { createForm: 'date', editForm: 'date' },
        dataType: { datagrid: 'dateUnchanged' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'lastModifiedDate' },
        headerText: { datagrid: 'Last Modified Date' },
        controlType: { editForm: 'date' },
        dataType: { datagrid: 'dateUnchanged' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'lastModifiedBy' },
        headerText: { datagrid: 'Last Modified By' },
        controlType: { editForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
  
    ]
  
    //#endregion SHIPMENT

    //#region SHIPMENT-DETAILS (for DataGrid)

    getShipmentDetailsFields() {
      return this.shipmentDetailsField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, "datagrid", "datagrid");
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.datagrid,
            type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
            visible: field.visible?.datagrid,
            isRequired: field.isRequired && field.isRequired.datagrid
          }
        })
    }
  
    public readonly shipmentDetailsField: ShipmentFields[] = [

      {
        id: { datagrid: 'inboundDeliveryNumber' },
        headerText: { datagrid: 'Inbound Delivery Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'trackNumber' },
        headerText: { datagrid: 'Track Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'containerNumber' },
        headerText: { datagrid: 'Container Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'invoiceNumber' },
        headerText: { datagrid: 'Invoice Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'purchaseOrderNumber' },
        headerText: { datagrid: 'Purchase Order Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'partNumber' },
        headerText: { datagrid: 'Part Number'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'vendorCode' },
        headerText: { datagrid: 'Vendor Code'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'vendorName' },
        headerText: { datagrid: 'Vendor Name'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'quantity' },
        headerText: { datagrid: 'Quantity'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'materialGroupDuty' },
        headerText: { datagrid: 'Regime'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'commodityCode' },
        headerText: { datagrid: 'HSCode'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'forwarder' },
        headerText: { datagrid: 'Forwarder'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'actualETADate' },
        headerText: { datagrid: 'Actual ETA Date'},
        dataType: { datagrid: 'dateUnchanged' },
        visible: { datagrid: false },
      },
  
    ]
  
    //#endregion SHIPMENT-DOCUMENTS

    //#region SHIPMENT-DOCUMENTS (for DataGrid & CreateForm)

    getShipmentDocsFields() {
      return this.shipmentDocsField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, "datagrid", "datagrid");
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.datagrid,
            type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
            visible: field.visible?.datagrid,
            isRequired: field.isRequired && field.isRequired.datagrid
          }
        })
    }
  
    getCreateShipmentDocsFormFields() {
      return this.shipmentDocsField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, 'datagrid', 'createDocsForm');
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.createDocsForm
              ? field.headerText.createDocsForm
              : field.headerText?.datagrid,
            controlType: field.controlType ? field.controlType.createDocsForm : '',
            visible: field.visible?.datagrid,
            isRequired: field.isRequired && field.isRequired.createDocsForm
          };
        });
    }
  
    public readonly shipmentDocsField: ShipmentFields[] = [
      {
        id: { datagrid: 'actions' },
        headerText: { datagrid: 'Actions' },
        dataType: { datagrid: 'actions' },
        isRequired: { datagrid: true },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'documentName' },
        headerText: { datagrid: 'Document Name'},
        controlType: { createDocsForm: 'file' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'purchaseNumber' },
        headerText: { datagrid: 'Purchase Number', createDocsForm: 'Purchase Numbers'},
        controlType: { createDocsForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: false },
      },
      {
        id: { datagrid: 'types' },
        headerText: { datagrid: 'Types'},
        controlType: { createDocsForm: 'dropdown'},
        dataType: { datagrid: 'string' },
        visible: { datagrid: false },
      },
  
    ]
  
    //#endregion SHIPMENT-DOCUMENTS

    //#region SHIPMENT-INTERNAL-DOCUMENTS (for DataGrid & CreateForm)

    getShipmentIntDocsFields() {
      return this.shipmentIntDocsField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, "datagrid", "datagrid");
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.datagrid,
            type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
            visible: field.visible?.datagrid,
            isRequired: field.isRequired && field.isRequired.datagrid
          }
        })
    }
  
    getCreateShipmentIntDocsFormFields() {
      return this.shipmentIntDocsField
        .filter((field: ShipmentFields) => {
          return this.hasField(field, 'datagrid', 'createIntDocsForm');
        })
        .map((field: ShipmentFields) => {
          return {
            field: field.id.datagrid,
            headerText: field.headerText?.createIntDocsForm
              ? field.headerText.createIntDocsForm
              : field.headerText?.datagrid,
            controlType: field.controlType ? field.controlType.createIntDocsForm : '',
            visible: field.visible?.datagrid,
            isRequired: field.isRequired && field.isRequired.createIntDocsForm
          };
        });
    }
  
    public readonly shipmentIntDocsField: ShipmentFields[] = [
      {
        id: { datagrid: 'actions' },
        headerText: { datagrid: 'Actions' },
        dataType: { datagrid: 'actions' },
        isRequired: { datagrid: true },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'documentName' },
        headerText: { datagrid: 'Document Name'},
        controlType: { createIntDocsForm: 'file' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: true },
      },
      {
        id: { datagrid: 'description' },
        headerText: { datagrid: 'Description'},
        controlType: { createIntDocsForm: 'simple' },
        dataType: { datagrid: 'string' },
        visible: { datagrid: false },
      },
  
    ]
  
    //#endregion SHIPMENT-INTERNAL-DOCUMENTS
  }