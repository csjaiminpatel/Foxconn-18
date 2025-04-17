export class GetVirtualPartNumbers {
    static readonly type = '[PnGroups] Get Virtual PartNumbers'
    constructor(public readonly skip?: any, public readonly top?: any, public readonly filter?: string
    , public readonly searchText?: string
    ) { }
}

export class GetVirtualPartNumbersSuccess {
    static readonly type = '[PnGroups] Get Virtual PartNumbers Success'
    constructor(public readonly pnGroupList?: any) { }
}

export class GetVirtualPartNumbersError {
    static readonly type = '[PnGroups] Get Virtual PartNumbers Error'
    constructor(public readonly error?: any) { }
}

export class GetPartNumberVendorCodeFlags {
    static readonly type = '[PnGroups] Get PartNumber VendorCode Flags'
    constructor(public readonly pnGroup: any) { }
}

export class GetPartNumberVendorCodeFlagsSuccess {
    static readonly type = '[PnGroups] Get PartNumber VendorCode Flags Success'
    constructor(public readonly pnGroupFlags?: any) { }
}

export class GetPartNumberVendorCodeFlagsError {
    static readonly type = '[PnGroups] Get PartNumber VendorCode Flags Error'
    constructor(public readonly error?: any) { }
}

export class UpdateVirtualPartNumber {
    static readonly type = '[PnGroups] Update Virtual PartNumber'
    constructor(public readonly pnGroup: any) { }
}

export class UpdateVirtualPartNumberSuccess {
    static readonly type = '[PnGroups] Update Virtual PartNumber Success'
    constructor(public readonly updatedPNGroup?: any) { }
}

export class UpdateVirtualPartNumberError {
    static readonly type = '[PnGroups] Update Virtual PartNumber Error'
    constructor(public readonly error?: any) { }
}

export class InsertVirtualPartNumber {
    static readonly type = '[PnGroups] Insert Virtual PartNumber'
    constructor(public readonly pnGroup: any) { }
}

export class InsertVirtualPartNumberSuccess {
    static readonly type = '[PnGroups] Insert Virtual PartNumber Success'
    constructor(public readonly data?: any) { }
}

export class InsertVirtualPartNumberError {
    static readonly type = '[PnGroups] Insert Virtual PartNumber Error'
    constructor(public readonly error?: any) { }
}

export class DeleteVirtualPartNumber {
    static readonly type = '[PnGroups] Delete Virtual PartNumber'
    constructor(public readonly pnGroup: any) { }
}

export class DeleteVirtualPartNumberSuccess {
    static readonly type = '[PnGroups] Delete Virtual PartNumber Success'
    constructor(public readonly pnGroupList?: any) { }
}

export class DeleteVirtualPartNumberError {
    static readonly type = '[PnGroups] Delete Virtual PartNumber Error'
    constructor(public readonly error?: any) { }
}

export class GetVirtualPartNumbersDetails {
    static readonly type = '[PnGroups] Get Virtual PartNumbers Details'
    constructor(public readonly id: any, public readonly skip: any, public readonly top: any) { }
}

export class GetVirtualPartNumbersDetailsSuccess {
    static readonly type = '[PnGroups] Get Virtual PartNumbers Details Success'
    constructor(public readonly pnList?: any) { }
}

export class GetVirtualPartNumbersDetailsError {
    static readonly type = '[PnGroups] Get Virtual PartNumbers Details Error'
    constructor(public readonly error?: any) { }
}

export class InsertVirtualPartNumberDetail {
    static readonly type = '[PnGroups] Insert Virtual PartNumber Detail'
    constructor(public readonly pnData: any) { }
}

export class InsertVirtualPartNumberDetailSuccess {
    static readonly type = '[PnGroups] Insert Virtual PartNumber Detail Success'
    constructor(public readonly response?: any) { }
}

export class InsertVirtualPartNumberDetailError {
    static readonly type = '[PnGroups] Insert Virtual PartNumber Detail Error'
    constructor(public readonly error?: any) { }
}

export class UpdateVirtualPartNumberDetail {
    static readonly type = '[PnGroups] Update Virtual PartNumbers Detail'
    constructor(public readonly pnData: any) { }
}

export class UpdateVirtualPartNumberDetailSuccess {
    static readonly type = '[PnGroups] Update Virtual PartNumbers Detail Success'
    constructor(public readonly response?: any) { }
}

export class UpdateVirtualPartNumberDetailError {
    static readonly type = '[PnGroups] Update Virtual PartNumbers Detail Error'
    constructor(public readonly error?: any) { }
}

export class DeleteVirtualPartNumberDetail {
    static readonly type = '[PnGroups] Delete Virtual PartNumber Detail'
    constructor(public readonly pnData: any) { }
}

export class DeleteVirtualPartNumberDetailSuccess {
    static readonly type = '[PnGroups] Delete Virtual PartNumber Detail Success'
}

export class DeleteVirtualPartNumberDetailError {
    static readonly type = '[PnGroups] Delete Virtual PartNumber Detail Error'
    constructor(public readonly error?: any) { }
}