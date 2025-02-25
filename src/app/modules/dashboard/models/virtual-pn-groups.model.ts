export interface virtualPartNumberGroup {
  virtualPartnumber: string;
  virtualVendorCode: string;
  id?: string;
  dateCreated?: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
}

export interface virtualPartNumber {
  virtualPartNumberId?: string;
  partNumber: string;
  vendorCode: string;
  id?: string;
  dateCreated?: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
}

export interface PnVcFlags {
  partNumber: string;
  vendorCode: string;
}

export interface createPnVcFlags {
  partNumber: string;
  vendorCode: string;
  flag: string;
}

export interface virtualPartNumbersDto {
  skip?: number;
  top?: number;
  sort?: string;
  searchValue?: string;
}

