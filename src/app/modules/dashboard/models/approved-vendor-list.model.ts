export interface ApprovedVendorDetail {
  approvedVendor: ApprovedVendor;
  materialMaster: MaterialMaster;
  infoRecord: InfoRecord;
  avlBuyer: Contact;
  vendor: Vendor;
  supplier?: Supplier;
  additionInfos: additionInfoG;
  whBuyer?: Contact;
  customer?: Contact;
}

export interface ApprovedVendorDetailResult {
  approvedVendor: ApprovedVendor;
  vendor: Vendor;
  materialMaster: MaterialMaster;
  infoRecords: InfoRecord[];
  contacts: Contact[];
  quota: Quota;
  additionInfos: additionInfoG[];
}

export interface additionInfoG {
  partNumber: string;
  commodityTeam: string;
  gtk: string;
  typeOfTransport: string;
  remark: string;
  id: string;
  dateCreated: string;
  dateModified: string;
  createdBy: string;
  modifiedBy: string;
}

export interface Quota {
  partNumber: string;
  vendorCode: string;
  quotaPercentage: number;
  id: string;
  dateCreated: string;
  dateModified: string;
  createdBy: string;
  modifiedBy: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  contactType: string;
  addresses: Address[];
  additionInfos: additionInfo[];
}

export interface ApprovedVendor {
  plant: string;
  partNo: string;
  vendorCode: string;
  avlBuyer: Contact;
  whBuyer: string;
  customerContact: string;
  commodityTeam: string;
  suplierContactName: string;
  suplierContactPhone: string;
  suplierContactMail: string;
  gtkBuySell: string;
  mainTypeOfTransport: string;
  remark: any;
  id: string;
  dateCreated: Date;
  dateModified: Date;
  createdBy: any;
  modifiedBy: any;
}

export interface Vendor {
  firstName: string;
  lastName: string;
  email: string;
  contactType: string;
  addresses: Address[];
  additionInfos: additionInfo[];
  vatNumber?: string;
}

export interface Supplier {
  firstName: string;
  lastName: string;
  email: string;
  contactType: string;
  addresses: Address[];
  additionInfos: additionInfo[];
  vatNumber?: string;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
}

export interface additionInfo {
  propertyName: string;
  value: string;
}

export interface MaterialMaster {
  partNoDesc: string;
  commodityCode: string;
  pG_SAP: string;
  manufacturerPartNumber: string;
  awsPartNumber: string;
  mmPartNumber: string;
}

export interface InfoRecord {
  incoterms: string;
  incotermsDesc: string;
  paymentTerms: string;
  taxCode: string;
  planedDeliveryTime: number;
  infoRecordNumber: string;
  price: number;
  currency: string;
  piecePrice: number;
  unit: string;
  infoRecordCategory: string;
  minumQuantity: number;
  leadTime: number;
}
