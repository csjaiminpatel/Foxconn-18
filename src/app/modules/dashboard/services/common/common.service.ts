import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl: string;

  private DataGridVisible = new Subject<any>();
  private isGridRefreshed = new Subject<any>();
  private isGridCollapsed = new Subject<any>();

  isDataGridVisible?: boolean;

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  getShowDataGrid(): Observable<any> {
    return this.DataGridVisible.asObservable();
  }
  setShowDataGrid(data?: any) {
    this.isDataGridVisible = data;
    this.DataGridVisible.next(data);
  }

  getRefreshGridValue(): Observable<any> {
    return this.isGridRefreshed.asObservable();
  }

  setRefreshGridValue(isRefreshed?: any) {
    this.isGridRefreshed.next(isRefreshed);
  }

  getCollapseGridValue(): Observable<any> {
    return this.isGridCollapsed.asObservable();
  }

  setCollapseGridValue(isCollapsed: boolean, rowId?: any) {
    let data = {
      isCollapsed: isCollapsed,
      rowId: rowId
    }
    this.isGridCollapsed.next(data);
  }

  //NOTE - IdentityList API

  getApiUrlIdentityList() {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.identityList}`;
  }

  getIdentityListForBuyers(): Observable<any> {
    let params = new HttpParams();
    params = params.append('identitytype', 'identity');
    return this.http.get(`${this.getApiUrlIdentityList()}`, {
      params: params,
    });
  }
}
