import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private configService: ConfigService, private http: HttpClient) { }

  get apiUrl() {
    return this.configService.getSettings('apiBaseUrl');
  }

  get textUrl() {
    return `${this.apiUrl}api/v1/ArtificialIntelligence/OpenAI/Assistant/DEFAULT/`;
  }

  callText(message: string) {
    return this.http.put(this.textUrl, { message: message }, {});
  }
}
