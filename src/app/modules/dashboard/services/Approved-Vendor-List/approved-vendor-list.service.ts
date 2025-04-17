import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../services/config.service';
import { ApprovedVendorDetailResult, ApprovedVendorDetail, ApprovedVendor } from '../../models/approved-vendor-list.model';
import { BasicParameters } from '../../models/supply-visibility.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovedVendorListService  {
  apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  /**
   * Get API URL for Avl
   * @param {string} action
   * @returns {string}
   * @memberof ApprovedVendorListService
   */
  getApiUrlAvl(action: string): string {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.approvedVendorList}/${action}`;
  }

  /**
   * Get API URL for PartNumbers
   * @param {string} action
   * @returns {string}
   * @memberof ApprovedVendorListService
   */
  getApiUrlPartNumbers(action: string): string {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.partNumbers}/${action}`;
  }

  /**
   * Get approved vendor by query params
   * @param {VendorDetailParams} params
   * @returns {Observable<ApprovedVendorDetail>}
   * @memberof ApprovedVendorListService
   */
  getApprovedVendorDetail = (
    vendorDetailParams: BasicParameters
  ): Observable<ApprovedVendorDetailResult> => {
    let params = new HttpParams();
    params = params.append('Plant', vendorDetailParams.plant);
    params = params.append('PartNumber', vendorDetailParams.partNumber.toUpperCase());
    if(vendorDetailParams.vendorCode){
    params = params.append('VendorCode', vendorDetailParams.vendorCode);}

    return this.http.get<ApprovedVendorDetailResult>(
      this.getApiUrlPartNumbers('GetPartNumberDetail'),
      {
        params: params,
      }
    );
  };

  /**
   * Get approved vendor detail by ID
   * @param {string} id
   * @returns {Observable<ApprovedVendorDetail>}
   * @memberof ApprovedVendorListService
   */
  getApprovedVendorDetailById = (id: string): Observable<ApprovedVendorDetail> => {
    let params = new HttpParams();
    params = params.append('Id', id);
    return this.http.get<ApprovedVendorDetail>(this.getApiUrlAvl('GetApprovedVendorDetailById'), {
      params: params,
    });
  };

  /**
   * Get approved vendor by id
   * @param {string} id
   * @returns {Observable<ApprovedVendor>}
   * @memberof ApprovedVendorListService
   */
  getApprovedVendorById = (id: string): Observable<ApprovedVendor> => {
    let params = new HttpParams();
    params = params.append('Id', id);
    return this.http.get<ApprovedVendor>(this.getApiUrlAvl('GetApprovedVendorByID'), {
      params: params,
    });
  };

  /**
   * Get array of Approved vendors
   * @param
   * @returns {Observable<ApprovedVendor[]>}
   * @memberof ApprovedVendorListService
   */
  getApprovedVendorList = (): Observable<ApprovedVendor[]> => {
    return this.http.get<ApprovedVendor[]>(this.getApiUrlAvl('GetApprovedVendorList'));
  };

  deleteContact(contacts:any): Observable<any>{
    return <Observable<any>> (
      this.http.post(`${this.getApiUrlPartNumbers('deletecontact')}`, contacts)
    );
  }

  createContact(contacts : any): Observable<any> {
    return <Observable<any>> (
      this.http.post(`${this.getApiUrlPartNumbers('createcontact')}`, contacts)
    );
  }
}
