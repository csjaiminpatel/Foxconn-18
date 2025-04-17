import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadWidgetService {
  constructor(private http: HttpClient, private configService: ConfigService) {
  }

  getEndpoints() {
    let apiUrl = `${this.configService.getSettings('apiBaseUrl')}api/v1/filemanagement/endpointlist`;
    return this.http.get<any[]>(apiUrl);
  }
  upload(file: File, locationName: string) {
    let apiUrl = `${this.configService.getSettings('apiBaseUrl')}api/v1/filemanagement/upload/${locationName}`;
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials,content-type=multipart/*',
    });
    const formData: FormData = new FormData();

    formData.append('fileName', file.name);
    formData.append('file', file);

    const req = new HttpRequest('POST', apiUrl, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
}
