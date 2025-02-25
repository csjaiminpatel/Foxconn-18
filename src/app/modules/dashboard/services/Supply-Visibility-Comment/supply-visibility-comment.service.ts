import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { ConfigService } from "../../../../services/config.service";
import { SVComments } from "../../models/sv-comments.model";
import { Observable } from "rxjs";


@Injectable()
export class SupplyVisibilityCommentService {
  apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  /**
   * Get API URL for Buffer Rulels
   * @param {string} vendor
   * @param {string} partNumber
   * @returns
   * @memberof SupplyVisibilityCommentService
   **/

  getSVCommentsByVendorPN(vendor: string, partNumber: string) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getSVCommentsByVendorPN}`;

    let params = new HttpParams();
    params = params.append('$skip', '0');
    params = params.append('$top', '100');
    params = params.append('modul', 'SupplyVisibility');
    params = params.append('key', 'VC:' + vendor + ';PN:' + partNumber.toUpperCase());

    return this.http.get<any>(url, { params: params });
  }
  createSVComment(data: SVComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.createSVComment}`;
    return this.http.post<SVComments>(url, data);
  }

  updateSVComment(data: SVComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.updateSVComment}`;
    return this.http.post<SVComments>(url, data);
  }

  deleteSVComment(data: SVComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.deleteSVComment}`;
    let params = new HttpParams();
    if (data.id) {
      params = params.append('id', data.id);
    }

    return this.http.post<any>(url, data, { params });
  }
}
