
export interface StocksFields {
    /**
     * Used as field in forms
     */
    id: StocksPlaceHolderTypeVal;
    /**
     * Shows the name that should be displayed in forms
     */
    headerText?: StocksPlaceHolderTypeVal;
    /**
     * Required for form
     */
    controlType?: StocksPlaceHolderTypeVal;
    /**
     * Shows dataType tah
     */
    dataType?: StocksPlaceHolderTypeVal;
    /**
     * (Datagrid)
     */
    isPrimaryKey?: boolean;
    /**
     * Shows if the field is mandatory in forms
     */
    isRequired?: StocksPlaceHolderTypeVal;
    /**
     * Shows if it should be visible by default in forms
     */
    visible?: StocksPlaceHolderTypeVal;

    exclusive?: string;
    format?: string;
    editType?: string;
    /**
     * Shows if field should be excluded in specific forms
     */
    exclude?: StocksPlaceHolderTypeVal;
}

export interface StocksPlaceHolderTypeVal {
    datagrid?: string | number | boolean,
    createForm?: string | number | boolean,
    editForm?: string | number | boolean,
}

export enum EnumStocksViews {
    EDIT = 0,
    CONTACT = 1,
    NOTIFICATIONS = 2,
}

export enum EnumStocksFieldStructure {
    StocksTable = 0,
    StocksCreateForm = 1,
    StocksEditForm = 2,
}

export interface Stocks {
    count: number;
    result: StocksDetail[];
}

export interface StocksDetail {
    id: string,
    name: string,
    building: string,
    information: string,
    identityKey: string,
    lastModifiedDate: string,
    lastModifiedBy: string
}

export interface Stock {
    name?: string,
    building?: string,
    information?: string,
    contact?: {
        email?: string,
        phone?: string,
        street?: string,
        city?: string,
        postCode?: string,
        country?: string,
        state?: string
    }
}

export interface StockResult {
    id: string,
    name: string,
    building: string,
    information: string,
    identityKey: string,
    dateCreated: string,
    dateModified: string,
    createdBy: string,
    modifiedBy: string
}

export class StocksListField {
    fields: any[];
    userRightFields: string[]=[];
    hasField: any;

    constructor(type?: EnumStocksFieldStructure, userRightFields?: string[]) {
        if (userRightFields) {
            this.userRightFields = userRightFields.map((e) => e.toLowerCase());
            this.hasField = this.validFunWithUserFields;
        } else {
            this.hasField = this.validFunWithoutUserFields;
        }
        this.fields = this.getDefaultFields(type);
    }

    getDefaultFields(type?: EnumStocksFieldStructure): any[] {
        switch (type) {
            case EnumStocksFieldStructure.StocksTable:
                return this.getDatagridFields();
            case EnumStocksFieldStructure.StocksCreateForm:
                return this.getCreateFormList();
            case EnumStocksFieldStructure.StocksEditForm:
                return this.getEditFormList();
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
    validFunWithUserFields = (field: StocksFields, refId: string, actualId: string) => {
        if (this.userRightFields && !(field.isRequired && field.isRequired[actualId as keyof StocksPlaceHolderTypeVal])) {  //For adding fields not present in default fields
            return (
                this.userRightFields.includes((<string>field.id[refId as keyof StocksPlaceHolderTypeVal]).toLowerCase()) &&
                !(field.exclude && field.exclude[actualId as keyof StocksPlaceHolderTypeVal] == true)
            );
        } else {
            return this.validFunWithoutUserFields(field, refId, actualId);
        }
    };

    validFunWithoutUserFields = (field: StocksFields, refId: string, actualId: string) => {
        if (field.exclude && field.exclude[actualId as keyof StocksPlaceHolderTypeVal] == true) {
            return false;
        } else {
            return true;
        }
    };

    //#region Stocks-List

    getDatagridFields() {
        return this.StocksList
            .filter((field: StocksFields) => {
                return this.hasField(field, 'datagrid', 'datagrid');
            })
            .map((field: StocksFields) => {
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
        return this.StocksList
            .filter((field: StocksFields) => {
                return this.hasField(field, 'datagrid', 'createForm');
            })
            .map((field: StocksFields) => {
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
        return this.StocksList
            .filter((field: StocksFields) => {
                return this.hasField(field, 'datagrid', 'editForm');
            })
            .map((field: StocksFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.editForm
                        ? field.headerText.editForm
                        : field.headerText?.datagrid,
                    controlType: field.controlType ? field.controlType.editForm : '',
                    visible: field.visible?.datagrid,
                    isRequired: field.isRequired && field.isRequired.editForm
                };
            });
    }

    public readonly StocksList: StocksFields[] = [
        {
            id: { datagrid: 'actions' },
            headerText: { datagrid: 'Actions' },
            dataType: { datagrid: 'actions' },
            visible: { datagrid: true },
            isRequired: { datagrid: true },
            exclude: { createForm: true }
        },
        {
            id: { datagrid: 'id' },
            headerText: { datagrid: 'ID' },
            dataType: { datagrid: 'string' },
            controlType: { editForm: 'simple' },
            visible: { datagrid: true },
            exclude: { datagrid: true, createForm: true }
        },
        {
            id: { datagrid: 'name' },
            headerText: { datagrid: 'Name' },
            dataType: { datagrid: 'string' },
            controlType: { createForm: 'simple', editForm: 'simple' },
            visible: { datagrid: true },
            isRequired: { createForm: true },
        },
        {
            id: { datagrid: 'building' },
            headerText: { datagrid: 'Building' },
            dataType: { datagrid: 'string' },
            controlType: { createForm: 'simple', editForm: 'simple' },
            visible: { datagrid: true },
            isRequired: { createForm: true },
        },
        {
            id: { datagrid: 'information' },
            headerText: { datagrid: 'Information' },
            dataType: { datagrid: 'string' },
            controlType: { createForm: 'simple', editForm: 'simple' },
            visible: { datagrid: true },
            isRequired: { createForm: false },
        }
    ];

    //#endregion Stocks-List
}