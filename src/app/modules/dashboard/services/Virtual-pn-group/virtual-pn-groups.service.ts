import { HttpParams, HttpHeaders, HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ConfigService } from "../../../../services/config.service";
import { NotificationService } from "../../../auth/services/Notification/notification.service";
import { virtualPartNumberGroup, virtualPartNumber, PnVcFlags, createPnVcFlags, virtualPartNumbersDto } from "../../models/virtual-pn-groups.model";

@Injectable({
  providedIn: 'root',
})
export class VirtualPnGroupsService {
  private apiUrl: string;
  private isFlagLoaded = new Subject<boolean>();

  public VIRTUAL_VENDOR_CODE = 'VirtualVC';

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private notificationService: NotificationService
  ) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  getFlagOperation(): Observable<any> {
    return this.isFlagLoaded.asObservable();
  }

  setFlagOperation(isFlagLoaded: any) {
    this.isFlagLoaded.next(isFlagLoaded);
  }

  /**
   * Get Endpoint
   * @param {string} action
   * @returns
   * @memberof VirtualPnGroupsService
   */
  getEndpoint(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.virtualPartNumbers}${'/'}${action}`;
  }

  getPartNumbers(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.partNumbers}${'/'}${action}`;
  }

  /**
   * getVirtualPartNumbers
   *
   * @description Get virtualPartNumber GROUPS
   * @memberof VirtualPnGroupsService
   * @param skip
   * @param top
   * @param filter
   */
  getVirtualPartNumbers(payload: virtualPartNumbersDto): Observable<any> {
    let params = new HttpParams();
    if (payload.skip && payload.skip !== undefined) {
      params = params.append('$skip', payload.skip);
    }
    if (payload.top && payload.top !== undefined) {
      params = params.append('$top', payload.top);
    }
    if (payload.sort && payload.sort !== undefined) {
      params = params.append('$orderby', payload.sort);
    }
    if (payload.searchValue) {
      params = params.append('searchText', payload.searchValue);
    }

    return this.http
      .get(`${this.getEndpoint('GetVirtualPartNumbers')}`, {
        params: params,
      })
    // .pipe(catchError(this.handleError));
  }

  /**
   * getVirtualPartNumbersDetails
   *
   * @description Get list of PARTNUMBERS within the GROUP
   * @param id
   * @param skip
   * @param top
   */
  getVirtualPartNumbersDetails(id: string, skip: any, top: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('VirtualPartNumberID', id);
    params = params.append('$skip', skip);
    params = params.append('$top', top);
    return this.http
      .get(`${this.getEndpoint('GetVirtualPartNumberDetails')}`, {
        params: params,
      })
      .pipe(catchError(this.handleError));
  }
  /**
   * insertVirtualPartNumber
   *
   * @description create new VirtualPartNumber GROUP
   * @param partNumber
   *  */
  insertVirtualPartNumber(partNumber: virtualPartNumberGroup): Observable<any> {
    partNumber.virtualVendorCode = this.VIRTUAL_VENDOR_CODE;
    partNumber.virtualPartnumber = partNumber.virtualPartnumber.trim();
    //Gets Error When Duplicate GroupNumber
    //Send "duplicate" in case title: "Validation exception", status: 400, detail: "Already exists VirtualPartnumbers combination"
    return this.http.post(`${this.getEndpoint('InsertVirtualPartNumber')}`, partNumber, {});
  }

  /**
   * updateVirtualPartNumber
   *
   * @description update VirtualPartNumber GROUP
   * @param partNumber
   */
  updateVirtualPartNumber(partNumber: virtualPartNumberGroup): Observable<any> {
    partNumber.virtualVendorCode = this.VIRTUAL_VENDOR_CODE;
    partNumber.virtualPartnumber = partNumber.virtualPartnumber.trim();
    return this.http
      .post(`${this.getEndpoint('UpdateVirtualPartNumber')}`, partNumber, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * deleteVirtualPartNumber
   *
   * @description delete VirtualPartNumber GROUP
   * @param partNumber
   */
  deleteVirtualPartNumber(partNumber: virtualPartNumberGroup): Observable<any> {
    const params = new HttpParams();
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http
      .delete(
        `${this.getEndpoint('DeleteVirtualPartNumber')}/${partNumber.id}`,
        {
          params,
          headers,
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * insertVirtualPartNumber
   *
   * @description create new VirtualPartNumber
   * @param partNumber
   *  */
  insertVirtualPartNumberDetail(partNumber: virtualPartNumber): Observable<any> {
    if (!partNumber.virtualPartNumberId) {
      this.notificationService.showError('PartNumberGroup Id missing!');
      return throwError('PartNumberGroup Id missing!');
    }
    return this.http
      .post(`${this.getEndpoint('InsertVirtualPartNumberDetail')}`, partNumber, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * insertVirtualPartNumber
   *
   * @description create new VirtualPartNumber
   * @param partNumber
   *  */
  updateVirtualPartNumberDetail(partNumber: virtualPartNumber): Observable<any> {
    if (!partNumber.virtualPartNumberId) {
      this.notificationService.showError('PartNumberGroup Id missing!');
      return throwError('PartNumberGroup Id missing!');
    }
    if (!partNumber.id) {
      this.notificationService.showError('PartNumber Id missing!');
      return throwError('PartNumber Id missing!');
    }

    return this.http
      .post(`${this.getEndpoint('UpdateVirtualPartNumberDetail')}`, partNumber, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * deleteVirtualPartNumber
   *
   * @description delete VirtualPartNumber GROUP
   * @param partNumber
   */
  deleteVirtualPartNumberDetail(partNumber: virtualPartNumber): Observable<any> {
    const params = new HttpParams();
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http
      .delete(
        `${this.getEndpoint('DeleteVirtualPartNumberDetail')}/${partNumber.id}`,
        {
          params,
          headers,
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * getPartNumberVendorCodeFlags 
   *
   * @description get PnVcFlags
   * @param partNumber
   *  */
  getPartNumberVendorCodeFlags(PNGroup: PnVcFlags[]): Observable<any> {
    return this.http
      .post(`${this.getPartNumbers('GetPartNumberVendorCodeFlags')}`, PNGroup)
      .pipe(catchError(this.handleError));
  }

  /**
   * createPartNumberVendorCodeFlags 
   *
   * @description create new PnVcFlags
   * @param partNumber
   *  */
  createPartNumberVendorCodeFlags(PNFlags: createPnVcFlags): Observable<any> {
    return this.http
      .post(`${this.getPartNumbers('CreatePartNumberVendorCodeFlag')}`, PNFlags)
      .pipe(catchError(this.handleError));
  }


  /**
   * deletePartNumberVendorCodeFlags 
   *
   * @description delete PnVcFlags
   * @param partNumber
   *  */
  deletePartNumberVendorCodeFlags(PNFlags: createPnVcFlags): Observable<any> {
    // encode when data contains special character (#,@,...)
    PNFlags.partNumber = encodeURIComponent(PNFlags.partNumber);
    PNFlags.vendorCode = encodeURIComponent(PNFlags.vendorCode);
    PNFlags.flag = encodeURIComponent(PNFlags.flag);

    return this.http
      .delete(`${this.getPartNumbers('DeletePartNumberVendorCodeFlag')}/${PNFlags.partNumber}/${PNFlags.vendorCode}/${PNFlags.flag}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error.detail}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  getPartNumbersListForSV(virtualPn: any): Promise<any> {
    let payload = {
      skip: 0,
      top: 10,
      searchValue: virtualPn
    }
    return new Promise((resolve) => {
      this.getVirtualPartNumbers(payload).subscribe((res) => {
        if (res && res.result) {
          for (let i = 0; i < res.result.length; i++) {
            if (res.result[i].virtualPartnumber.trim() === virtualPn.trim()) {
              this.getVirtualPartNumbersDetails(res.result[i].id, '0', '1000').subscribe((list) => {
                if (list && list.result && list.result.length > 0) {
                  resolve(list.result);
                }
              });
            }
          }
        }
      });
    });
  }
}
