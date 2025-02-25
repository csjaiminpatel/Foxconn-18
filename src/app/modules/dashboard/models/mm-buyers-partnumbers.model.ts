import { PnVendorCode } from './supply-visibility.model';

export interface BuyersPartnumbers {
  reviewed: boolean;
  reviewedValidity: number;
  flags?: string[];
  vendorCode: string;
  partNo: string; // buyers part number give partNo
  partNumber: string; // BuyersPartNumbersService.getPNsPrecalculateProjectionByFilter gives partNumber
  $selected: boolean;
}
export interface BuyersPartnumbersResult {
  $error?: any;
  result?: BuyersPartnumbers[];
  count?: number;
  stepByStepReview?: boolean;
  name?: string;
}

export interface PNsPrecalculateProjectionFilter {
  filterQuery?: string;
  customQuery?: string;
  filterReviewed?: boolean;
  filterVendorCodes?: string[];
  filterBuyers?: string[];
  filterMaterialGroups?: string[];
  filterDeliveryTerms?: string[];
  filterTaxCodes?: string[];
  filterVirtualVC?: boolean;
  filterVirtualVCIncludeChild?: boolean;
  filterLeadtimeQuery?: string;
  filterSearch?: string;
  filterFlags?: string[];
  filterPartNumbersVendorCodes?: PnVendorCode[];
  filterExcludeVendorCodes?: string[];
  filterExcludeMaterialGroups?: string[];
  $skip?: number;
  $top?: number;
  filterContacts?: string[];
  fulltextSearch?: boolean;
  filterVariant?: string;
  loadVendorName?: boolean;
}
