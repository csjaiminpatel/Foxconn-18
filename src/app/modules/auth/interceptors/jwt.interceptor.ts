import { inject, Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { from, mergeMap, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authService!: AuthService;

  constructor(private injector: Injector) {}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
      console.log('✅ JwtInterceptor AuthService Loaded:', this.authService.idToken);
    }

    if (!this.authService || typeof this.authService.ignoreUrlsToSetToken !== 'function') {
      return next.handle(req);
    }

    const ignoredUrls = this.authService.ignoreUrlsToSetToken();
    if (ignoredUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    return from(this.authService.getToken()).pipe(
      mergeMap(token => {
        if (!token) {
          return next.handle(req);
        }

        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });

        return next.handle(authReq);
      })
    );
  }
}