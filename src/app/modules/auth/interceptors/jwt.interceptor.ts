import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../../../services/config.service';
import { AuthenticationState } from '../store/authentication.state';
import { Store } from '@ngxs/store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private store = inject(Store);

  constructor(
  ) {
    console.log('JwtInterceptor works!!');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.create((observer: any) => {
      const item = this.configService;
      observer.next(item);
      observer.complete();
    }).pipe(
      mergeMap((res: ConfigService) => {
        let modifiedRequest;

        //modify request if there's an id_token_hint parameter, then remove it
        if (req.url.includes('id_token_hint')) {
          const url = req.url.split('?');
          const urlParams = url[1].split('&');
          const newUrl = urlParams.filter((param) => !param.includes('id_token_hint')).join('&');
          modifiedRequest = req.clone({
            url: `${url[0]}?${newUrl}`,
          });
        } else {
          modifiedRequest = req;
        }
        if (this.authService.ignoreUrlsForToken(req.url)) {
          modifiedRequest = this.setAuthorizationAdfsHeaders(req);
          return next.handle(modifiedRequest).pipe(takeUntil(this.authService.getCancellationTokenObservable())); // Regular API Calls
        } else {
          return next.handle(req); // OIDC related API calls
        }
      })
    );
  }

  /**
   * Sets token to header for every request
   * @param request
   */
  private setTokenHeaders(request: HttpRequest<any>) {
    const token = this.store.selectSnapshot(AuthenticationState.token);

    if (token) {
      return request.clone({
        headers: request.headers.append('token', token),
      });
    }
    return request;
  }

  /**
   * Sets Authorization header for every request
   * @param request
   */
  private setAuthorizationHeaders(request: HttpRequest<any>) {
    const token = this.store.selectSnapshot(AuthenticationState.token);

    if (token) {
      return request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`),
      });
    }

    return request;
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
