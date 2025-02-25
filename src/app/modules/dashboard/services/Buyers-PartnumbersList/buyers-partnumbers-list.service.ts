import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ConfigService } from "../../../../services/config.service";
import { Helper } from "../../../shared/helper";
import { BuyersPartnumbers, BuyersPartnumbersResult, PNsPrecalculateProjectionFilter } from "../../models/mm-buyers-partnumbers.model";
import { PnVendorCode } from "../../models/supply-visibility.model";

@Injectable()
export class BuyersPartnumbersListService {
  apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  /**
   * Get API URL for Buffer Rulels
   * @param {string} buyer
   * @returns
   * @memberof BuyersPartnumbersListService
   **/

  getBuyersPartnumbersList(buyer: string) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getBuyersPartNumbersList}`;

    let params = new HttpParams();
    params = params.append('AvlBuyer', buyer);

    return this.http.get<BuyersPartnumbers[]>(url, { params: params });
  }

  // GetPNsPrecalculateProjectionByFilter

  /**
   * Get API URL for Buffer Rulels
   * @param {string} buyer
   * @returns
   * @memberof BuyersPartnumbersListService
   **/
  //   // MaterialManagement/SupplyVisibilityReadOnly/GetPNsPrecalculateProjectionByFilter?filter=ForecastQty(w2_w8) > 100000 OR HOI > 2 AND FOI > 500

  getPNsPrecalculateProjectionByFilter(
    formula: string,
    vendor: string[] = [],
    buyer: string[] = [],
    partNumbers: PnVendorCode[] = [],
    flags: string[] = [],
    skip = 0,
    top = 30,
    filterDeliveryTerms: string[] = [],
    filterTaxCodes: string[] = [],
    filterVirtualVC?: boolean,
    filterVirtualVCIncludeChild?: boolean,
    filterLeadtimeQuery?: string,
    materialGroup: string[] = [],
    filterSearch?: string,
    filterExcludeMaterialGroups: string[] = [],
    filterExcludeVendorCodes: string[] = [],
    contact: any = undefined,
    customQuery: any = undefined,
    filterVariant: any = undefined,
    fulltextSearch: boolean = false,
    loadVendorName: boolean = false,
    sorting?: string,
  ): Observable<BuyersPartnumbersResult> {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getPNsPrecalculateProjectionByFilter}`;
    // let params = new HttpParams();
    // params = params.append('filterQuery', filter);

    let filterParams: PNsPrecalculateProjectionFilter = {};
    if (filterSearch) {
      filterParams = {
        filterReviewed: undefined,
        customQuery: customQuery,
        filterQuery: formula,
        filterFlags: flags || [],
        filterVendorCodes: vendor || [],
        filterContacts: contact ? contact/*contact.split(/\s+|,/).map((c) => (c ? c.trim() : '')).filter((c) => c) */ : [],
        filterBuyers: buyer || [],
        filterMaterialGroups: materialGroup || [],
        filterPartNumbersVendorCodes: [],
        filterDeliveryTerms: filterDeliveryTerms || [],
        filterTaxCodes: filterTaxCodes || [],
        filterVirtualVC: filterVirtualVC,
        filterVirtualVCIncludeChild: filterVirtualVCIncludeChild,
        filterLeadtimeQuery: filterLeadtimeQuery || undefined,
        filterSearch: Helper.virtualVCReplace(filterSearch) || undefined,
        filterExcludeVendorCodes: filterExcludeVendorCodes || [],
        filterExcludeMaterialGroups: filterExcludeMaterialGroups || [],
        filterVariant: filterVariant,
        loadVendorName: loadVendorName,
        fulltextSearch: fulltextSearch,
      };
    } else {
      filterParams = {
        customQuery: customQuery,
        filterQuery: formula,
        filterReviewed: undefined,
        filterFlags: flags || [],
        filterVendorCodes: vendor || [],
        //filterContacts: contact ? contact.split(/\s+|,/).map((c) => (c ? c.trim() : '')).filter((c) => c) : [],
        filterContacts: contact ? contact/*contact.split(/\s+|,/).map((c) => (c ? c.trim() : '')).filter((c) => c) */ : [],
        filterBuyers: buyer || [],
        filterMaterialGroups: materialGroup || [],
        filterPartNumbersVendorCodes: partNumbers || [],
        filterDeliveryTerms: filterDeliveryTerms || [],
        filterTaxCodes: filterTaxCodes || [],
        filterVirtualVC: filterVirtualVC,
        filterVirtualVCIncludeChild: filterVirtualVCIncludeChild,
        filterLeadtimeQuery: filterLeadtimeQuery || undefined,
        filterExcludeVendorCodes: filterExcludeVendorCodes || [],
        filterExcludeMaterialGroups: filterExcludeMaterialGroups || [],
        filterVariant: filterVariant,
        fulltextSearch: fulltextSearch,
        loadVendorName: loadVendorName
      };
    }
    filterParams.filterPartNumbersVendorCodes = filterParams.filterPartNumbersVendorCodes ? this.partNumberVendorCodesToUpper(filterParams.filterPartNumbersVendorCodes) : undefined;
    filterParams.filterVendorCodes = filterParams.filterVendorCodes ? this.vendorsToUpper(filterParams.filterVendorCodes) : undefined;
    filterParams.filterExcludeVendorCodes = filterParams.filterExcludeVendorCodes ? this.vendorsToUpper(filterParams.filterExcludeVendorCodes) : undefined;

    let params = new HttpParams();
    if (sorting) {
      params = params.append('$orderBy', sorting);
    }

    return this.http.post<BuyersPartnumbersResult>(url, filterParams, { params: params });
  }

  partNumberVendorCodesToUpper(partNumbersVendorCodes: PnVendorCode[]) {
    const pnsVendors: PnVendorCode[] = [...partNumbersVendorCodes];
    if (partNumbersVendorCodes && partNumbersVendorCodes.length > 0) {
      for (let i = 0; i < pnsVendors.length; i++) {
        pnsVendors[i].vendorCode = pnsVendors[i].vendorCode ? Helper.virtualVCReplace(pnsVendors[i].vendorCode as string) : undefined;
      }
    }
    return pnsVendors;
  }

  vendorsToUpper(vendors: string[]) {
    for (let i = 0; i < vendors.length; i++) {
      vendors[i] = vendors[i] ? Helper.virtualVCReplace(vendors[i]) : '';
    }
    return vendors;
  }

  getPrecalculateProjection(): Observable<any> {
    let params = new HttpParams();
    params = params.append('variant', 'Weekly');
    return this.http.get(`${this.getEndpoint('GetPrecalculateProjection')}`, {
      params: params,
    });
  }

  getPrecalculateProjections(skip = '0', top = '1'): Observable<any> {
    let params = new HttpParams();
    params = params.append('$skip', skip);
    params = params.append('$top', top);
    return this.http.get(`${this.getEndpoint('GetPrecalculateProjections')}`, {
      params: params,
    });
  }
  /**
   * Get Endpoint
   * @param {string} action
   * @returns
   * @memberof BuyersPartnumbersListService
   */
  getEndpoint(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.supplyVisibility}${'/'}${action}`;
  }

  convertSortingString(data: any): string {
    // Check if panelCache exists and contains the sort key
    const panelCache = data.panelCache && Array.isArray(data.panelCache) ? data.panelCache : [];
    const sortCache = panelCache.find((item: any) => item.key === 'sort');

    if (!sortCache || !sortCache.value) {
      // Return an empty string or a default value if no sorting information is available
      return '';
    }

    const { key, type } = sortCache.value;

    // Define mapping for specific sorting keys and their order combinations
    const sortingMap: any = {
      partNumber: { ascending: 'PartNumber asc', descending: 'PartNumber desc' },
      vendorCode: { ascending: 'VendorCode asc', descending: 'VendorCode desc' },
      virtualPN: {
        ascending: 'SubItems asc, VendorCode asc',
        descending: 'SubItems desc, VendorCode desc'
      }
    };

    // Retrieve the mapping for the current key
    const sortOrder = sortingMap[key] && sortingMap[key][type.toLowerCase()];

    // Return the sorting string or a default value
    return sortOrder || '';
  }
}
