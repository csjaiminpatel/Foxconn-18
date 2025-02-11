import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private http= inject(HttpClient)
  constructor() { }

  private apiEndpoint = 'https://dev.orion.cz.foxconn.com/api/FrontEndLogger/LogError';

  logErrorToApi(error: any): Observable<any> {
      return this.http.post(this.apiEndpoint, error).pipe(
          retry(3),
          catchError((err) => {
              return of(null);
          })
      );
  }
}
