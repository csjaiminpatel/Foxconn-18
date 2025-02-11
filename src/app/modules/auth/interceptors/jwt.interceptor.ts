import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../../../services/config.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);

  constructor(
  ) {
    console.log('JwtInterceptor works!!');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this.configService).pipe(
      mergeMap((res: ConfigService) => {
        let modifiedRequest: HttpRequest<any>;
        if (req.url.includes('id_token_hint')) {
          const [baseUrl, queryString] = req.url.split('?');
          const newQueryParams = queryString
            ?.split('&')
            .filter(param => !param.includes('id_token_hint'))
            .join('&');

          modifiedRequest = req.clone({ url: `${baseUrl}?${newQueryParams}` });
        } else {
          modifiedRequest = req;
        }

        if (this.authService.ignoreUrlsForToken(req.url)) {
          modifiedRequest = this.setAuthorizationAdfsHeaders(modifiedRequest);
          return next.handle(modifiedRequest).pipe(takeUntil(this.authService.getCancellationTokenObservable())); // Regular API Calls
        } else {
          return next.handle(modifiedRequest); // OIDC related API calls
        }
      })
    );
  }


  /**
   * Sets Authorization header for every request
   * @param request
   */
  private setAuthorizationAdfsHeaders(request: HttpRequest<any>) {

    this.authService.resetIdleTimeout();
    const token = this.authService.getIdToken();
    if (token) {
      return request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`),
      });
    }

    return request;
  }
}
