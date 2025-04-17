import { inject, Injectable } from '@angular/core';
import { BasicParameters } from '../../models/supply-visibility.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class BufferRulesService {
  apiUrl;

    private configService = inject(ConfigService);
    private http = inject(HttpClient);


  constructor() {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }


   /**
   * Get API URL for Buffer Rulels
   * @param {string} action
   * @returns
   * @memberof BufferRulesService
   */
   getApiUrlCommits(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.bufferRules}/${action}`;
  }

  /**
   * Get Buffer Rules By Filter
   * @param {BasicParameters} parameters
   * @returns {Observable<any>}
   * @memberof BufferRulesService
   */
  getBufferRules(parameters: BasicParameters): Observable<any> {
    return this.http.post(`${this.getApiUrlCommits('GetBufferRulesByFilter')}`, parameters);
  }
}

