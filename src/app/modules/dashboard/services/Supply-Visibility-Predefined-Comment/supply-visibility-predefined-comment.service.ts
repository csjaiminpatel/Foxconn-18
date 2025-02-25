import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../services/config.service';
import { SVPredefinedComments } from '../../models/sv-predefined-comments.model';


@Injectable()
export class SupplyVisibilityPredefinedCommentService {
  apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  /**
   * Get API URL for Buffer Rulels
   * @param {string} category
   * @returns
   * @memberof SupplyVisibilityPredefinedCommentService
   **/

  getSVCommentsByCategory(category: string) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getSVPredefinedComment}`;

    let params = new HttpParams();
    params = params.append('$skip', '0');
    params = params.append('$top', '100');
    params = params.append('category', category);

    return this.http.get<any>(url, { params: params });
  }

  createSVPredefinedComment(comment: SVPredefinedComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.createSVPredefinedComment}`;
    return this.http.post<SVPredefinedComments>(url, comment);
  }

  updateSVPredefinedComment(comment: SVPredefinedComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.updateSVPredefinedComment}/${comment.id}`;
    return this.http.put<SVPredefinedComments>(url, comment);
  }

  deleteSVPredefinedComment(comment: SVPredefinedComments) {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.deleteSVPredefinedComment}/${comment.id}`;

    return this.http.delete(url, { responseType: 'text' });
  }
}
