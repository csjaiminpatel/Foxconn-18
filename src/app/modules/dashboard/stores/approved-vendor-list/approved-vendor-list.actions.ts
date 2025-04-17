export class SetAVLDetail {
  static readonly type = '[ApprovedVendorList] Set Approved Vendor Detail';
}

export class SetAVLDetailSuccess {
  static readonly type = '[SupplyVisibility] Set Approved Vendor Detail Success';
}

export class SetAVLDetailError {
  static readonly type = '[SupplyVisibility] Set Approved Vendor Detail Error';
  constructor(public readonly error?: any) {}
}

export class SetAVLDetailByParams {
  static readonly type = '[ApprovedVendorList] Set Approved Vendor Detail By Params';
  constructor(public plant: string, public partNumber: string, public vendorCode: string) {}
}

export class SetAVLDetailById {
  static readonly type = '[ApprovedVendorList] Set Approved Vendor Detail By ID';
  constructor(public id: string) {}
}

export class SetAVLDetailByIdSuccess {
  static readonly type = '[SupplyVisibility] Set AVLDetail By ID Success';
}

export class SetAVLDetailByIdError {
  static readonly type = '[SupplyVisibility] Set AVLDetail By ID Error';
  constructor(public readonly error?: any) {}
}

export class SetAVL {
  static readonly type = '[ApprovedVendorList] Set Approved Vendor List';
}

export class ResetAVL {
  static readonly type = '[SupplyVisibility] Reset Approved Vendor List';
}
