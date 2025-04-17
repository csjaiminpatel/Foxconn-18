
export interface CarriersFields {
    /**
     * Used as field in forms
     */
    id: CarriersPlaceHolderTypeVal;
    /**
     * Shows the name that should be displayed in forms
     */
    headerText?: CarriersPlaceHolderTypeVal;
    /**
     * Required for form
     */
    controlType?: CarriersPlaceHolderTypeVal;
    /**
     * Shows dataType tah
     */
    dataType?: CarriersPlaceHolderTypeVal;
    /**
     * (Datagrid)
     */
    isPrimaryKey?: boolean;
    /**
     * Shows if the field is mandatory in forms
     */
    isRequired?: CarriersPlaceHolderTypeVal;
    /**
     * Shows if it should be visible by default in forms
     */
    visible?: CarriersPlaceHolderTypeVal;

    exclusive?: string;
    format?: string;
    editType?: string;
    /**
     * Shows if field should be excluded in specific forms
     */
    exclude?: CarriersPlaceHolderTypeVal;
}

export interface CarriersPlaceHolderTypeVal {
    datagrid?: string | number | boolean,
    createForm?: string | number | boolean,
    editForm?: string | number | boolean,
    nestedLogisticsForm?: string | number | boolean,
    nestedTransportsForm?: string | number | boolean,
    nestedNotificationForm?: string | number | boolean,
}

export enum EnumCarriersViews {
    INFO = 0,
    EDIT = 1,
    CONTACTS = 2,
    LOGISTICS = 3,
    TRANSPORTS = 4,
    NOTIFICATION = 5,
}


export enum EnumCarriersFieldStructure {
    CarriersTable = 0,
    CarriersCreateForm = 1,
    CarriersEditForm = 2,
    NestedContactsTable = 3,
    NestedLogisticsTable = 4,
    NestedLogisticsForm = 5,
    NestedTransportsTable = 6,
    NestedTransportsForm = 7,
    NestedNotificationTable = 8,
    NestedNotificationForm = 9,
}

export enum EnumCarrierInfoViews {
    LIST = 0,
    SINGLE_COLUMN = 1,
    MULTI_COLUMN = 2,
    RESPONSIVE_COLUMN = 3,
}

export interface Carriers {
    count: number;
    result: CarriersDetail[];
}

export interface CarriersDetail {
    id: string;
    code: string;
    name: string;
    identityKey: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface Transports {
    id: string,
    code: string,
    name: string
}

export interface CarriersContacts {
    contactType?: string;
    email?: string;
    firstName?: string;
    identityKey?: string;
    key?: string;
    lastName?: string;
    name?: string;
}

export interface Carrier {
    code?: string;
    name?: string;
    contact?: {
        email?: string;
        phone?: number;
    };
}

export interface CarrierResult {
    id: string;
    code: string;
    name: string;
    identityKey: string;
    dateCreated: string;
    dateModified: string;
    createdBy: string;
    modifiedBy: string;
    flags: any;
}

export class CarriersListField {
    fields: any[];
    userRightFields: string[] = [];
    hasField: any;

    constructor(type?: EnumCarriersFieldStructure, userRightFields?: string[]) {
        if (userRightFields) {
            this.userRightFields = userRightFields.map((e) => e.toLowerCase());
            this.hasField = this.validFunWithUserFields;
        } else {
            this.hasField = this.validFunWithoutUserFields;
        }
        this.fields = this.getDefaultFields(type);
    }

    getDefaultFields(type?: EnumCarriersFieldStructure): any[] {
        switch (type) {
            case EnumCarriersFieldStructure.CarriersTable:
                return this.getDatagridFields();
            case EnumCarriersFieldStructure.CarriersCreateForm:
                return this.getCreateFormList();
            case EnumCarriersFieldStructure.CarriersEditForm:
                return this.getEditFormList();
            case EnumCarriersFieldStructure.NestedContactsTable:
                return this.getCarrierContactsFields();
            case EnumCarriersFieldStructure.NestedLogisticsTable:
                return this.getCarrierLogisticFields();
            case EnumCarriersFieldStructure.NestedLogisticsForm:
                return this.getLogisticFormFields();
            case EnumCarriersFieldStructure.NestedTransportsTable:
                return this.getCarrierTransportFields();
            case EnumCarriersFieldStructure.NestedTransportsForm:
                return this.getTransportFormFields();
            case EnumCarriersFieldStructure.NestedNotificationTable:
                return this.getCarrierNotificationFields();
            case EnumCarriersFieldStructure.NestedNotificationForm:
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
    validFunWithUserFields = (field: CarriersFields, refId: string, actualId: string) => {
        if (this.userRightFields && !(field.isRequired && field.isRequired[actualId as keyof CarriersPlaceHolderTypeVal])) {  //For adding fields not present in default fields
            return (
                this.userRightFields.includes((<string>field.id[refId as keyof CarriersPlaceHolderTypeVal]).toLowerCase()) &&
                !(field.exclude && field.exclude[actualId as keyof CarriersPlaceHolderTypeVal] == true)
            );
        } else {
            return this.validFunWithoutUserFields(field, refId, actualId);
        }
    };

    validFunWithoutUserFields = (field: CarriersFields, refId: string, actualId: string) => {
        if (field.exclude && field.exclude[actualId as keyof CarriersPlaceHolderTypeVal] == true) {
            return false;
        } else {
            return true;
        }
    };

    //#region CARRIERS-LIST (for DataGrid and EditForm)

    getDatagridFields() {
        return this.carriersList
            .filter((field: CarriersFields) => {
                return this.hasField(field, 'datagrid', 'datagrid');
            })
            .map((field: CarriersFields) => {
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
        return this.carriersList
            .filter((field: CarriersFields) => {
                return this.hasField(field, 'datagrid', 'createForm');
            })
            .map((field: CarriersFields) => {
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
        return this.carriersList
            .filter((field: CarriersFields) => {
                return this.hasField(field, 'datagrid', 'editForm');
            })
            .map((field: CarriersFields) => {
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

    public readonly carriersList: CarriersFields[] = [
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
            id: { datagrid: 'code' },
            headerText: { datagrid: 'Code' },
            dataType: { datagrid: 'string' },
            controlType: { createForm: 'simple', editForm: 'simple' },
            visible: { datagrid: true },
            isRequired: { createForm: true },
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
            id: { datagrid: 'email' },
            headerText: { datagrid: 'Email' },
            // dataType: { datagrid: 'string' },
            controlType: { createForm: 'simple' },
            visible: { datagrid: true },
            exclude: { datagrid: true }
        },
        {
            id: { datagrid: 'phone' },
            headerText: { datagrid: 'Phone' },
            // dataType: { datagrid: 'string' },
            controlType: { createForm: 'number' },
            visible: { datagrid: true },
            exclude: { datagrid: true }

        },
        // {
        //     id: { datagrid: 'identityKey' },
        //     headerText: { datagrid: 'Identity Key' },
        //     dataType: { datagrid: 'string' },
        //     visible: { datagrid: true, createForm: false },
        // },
        // {
        //     id: { datagrid: 'lastModifiedBy' },
        //     headerText: { datagrid: 'Last Modified By' },
        //     dataType: { datagrid: 'string' },
        //     visible: { datagrid: true, createForm: false },
        // },
        // {
        //     id: { datagrid: 'lastModifiedDate' },
        //     headerText: { datagrid: 'Last Modified Date' },
        //     dataType: { datagrid: 'dateUnchanged' },
        //     visible: { datagrid: true, createForm: false },
        // },
    ];

    //#endregion CARRIERS-LIST

    //#region CARRIERS-CONTACTS (for DataGrid)

    getCarrierContactsFields() {
        return this.carrierContacts
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "datagrid");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
                    visible: field.visible?.datagrid,
                }
            })
    }

    public readonly carrierContacts: CarriersFields[] = [

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

    //#endregion CARRIERS-CONTACTS

    //#region CARRIER-LOGISTICS (for DataGrid and Form)


    getCarrierLogisticFields() {
        return this.carrierLogistics
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "datagrid");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
                    visible: field.visible?.datagrid,
                }
            })
    }

    getLogisticFormFields() {
        return this.carrierLogistics
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "nestedLogisticsForm");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    controlType: field.controlType ? field.controlType.nestedLogisticsForm : '',
                    visible: field.visible?.datagrid,
                }
            })
    }

    public readonly carrierLogistics: CarriersFields[] = [

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
            id: { datagrid: 'carrier' },
            headerText: { datagrid: 'Carrier' },
            controlType: { nestedLogisticsForm: 'd-carrier' },
            dataType: { datagrid: 'string' },
            visible: { datagrid: true },
            // exclude: { datagrid: true }
        },
        {
            id: { datagrid: 'code' },
            headerText: { datagrid: 'Code' },
            controlType: { nestedLogisticsForm: 'simple' },
            isRequired: { nestedLogisticsForm: true },
            dataType: { datagrid: 'string' },
            visible: { datagrid: true },
        },
        {
            id: { datagrid: 'identityKey' },
            headerText: { datagrid: 'Identity Key' },
            controlType: { nestedLogisticsForm: 'd-identityKey' },
            dataType: { datagrid: 'string' },
            visible: { datagrid: true },
            exclude: { datagrid: true }
        },
        {
            id: { datagrid: 'contactType' },
            headerText: { datagrid: 'Contact Type' },
            controlType: { nestedLogisticsForm: 'dropdown' },
            isRequired: { nestedLogisticsForm: true },
            dataType: { datagrid: 'string' },
            visible: { datagrid: true },
            exclude: { datagrid: true }
        },
        {
            id: { datagrid: 'validFrom' },
            headerText: { datagrid: 'Valid From' },
            controlType: { nestedLogisticsForm: 'date' },
            dataType: { datagrid: 'dateUnchanged' },
            visible: { datagrid: true },
        },
        {
            id: { datagrid: 'validTo' },
            headerText: { datagrid: 'Valid To' },
            controlType: { nestedLogisticsForm: 'date' },
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
    //#endregion CARRIER-LOGISTICS

    //#region CARRIER-TRANSPORTS (for DataGrid and Form)


    getCarrierTransportFields() {
        return this.carrierTransports
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "datagrid");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    type: field.dataType && field.dataType.datagrid ? field.dataType.datagrid : 'string',
                    visible: field.visible?.datagrid,
                }
            })
    }

    getTransportFormFields() {
        return this.carrierTransports
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "nestedTransportsForm");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    controlType: field.controlType ? field.controlType.nestedTransportsForm : '',
                    visible: field.visible?.datagrid,
                    isRequired: field.isRequired && field.isRequired.nestedTransportsForm
                }
            })
    }

    public readonly carrierTransports: CarriersFields[] = [

        {
            id: { datagrid: 'actions' },
            headerText: { datagrid: 'Actions' },
            dataType: { datagrid: 'actions' },
            visible: { datagrid: true },
        },
        {
            id: { datagrid: 'code' },
            headerText: { datagrid: 'Code' },
            controlType: { nestedTransportsForm: 'simple' },
            isRequired: { nestedTransportsForm: true },
            visible: { datagrid: false },
        },
        {
            id: { datagrid: 'carrier' },
            headerText: { datagrid: 'Carrier' },
            controlType: { nestedTransportsForm: 'simple' },
            isRequired: { nestedTransportsForm: true },
            visible: { datagrid: false },
        },
        {
            id: { datagrid: 'name' },
            headerText: { datagrid: 'Name' },
            controlType: { nestedTransportsForm: 'dropDown' },
            isRequired: { nestedTransportsForm: true },
            dataType: { datagrid: 'string' },
            visible: { datagrid: true },
        },
    ]
    //#endregion CARRIER-TRANSPORTS

    //#region CARRIERS-NOTIFICATION (for DataGrid and Form)

    getCarrierNotificationFields() {
        return this.carrierNotification
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "datagrid");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    type: field.dataType?.datagrid ? field.dataType.datagrid : 'string',
                    visible: field.visible?.datagrid,
                }
            })
    }

    getNotificationFormFields() {
        return this.carrierNotification
            .filter((field: CarriersFields) => {
                return this.hasField(field, "datagrid", "nestedNotificationForm");
            })
            .map((field: CarriersFields) => {
                return {
                    field: field.id.datagrid,
                    headerText: field.headerText?.datagrid,
                    controlType: field.controlType ? field.controlType.nestedNotificationForm : '',
                    visible: field.visible?.datagrid,
                }
            })
    }

    public readonly carrierNotification: CarriersFields[] = [

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
    //#endregion CARRIERS-NOTIFICATION
}