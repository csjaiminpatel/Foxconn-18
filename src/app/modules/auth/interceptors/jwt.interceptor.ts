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

  constructor(
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JwtInterceptor: Checking AuthService instance:', this.authService);

    if (!this.authService) {
      console.error('JwtInterceptor: AuthService is undefined!');
      return next.handle(req);
    }


    console.log('✅ JwtInterceptor: Intercepting request', req);

    const ignoreUrlsForToken: string[] = this.authService.ignoreUrlsToSetToken?.() || [];
    const ignoreUrls = [...ignoreUrlsForToken, '/config/config.', 'i18n/', 'openid-configuration', 'openid-connect'];

    // 1️⃣ **Skip authentication for ignored URLs**
    console.log('❌ ignoreUrls: ', this.authService.isAuth());
    let ignoreUrl = ignoreUrls.some(url => req.url.includes(url));
    if (ignoreUrl) {
      console.warn('⚠️ JwtInterceptor: Ignoring token attachment for URL', req.url);
      return next.handle(req);
    }

    // 2️⃣ **Ensure user is authenticated**
    const isAuthenticated = this.authService.isAuth();
    if (!isAuthenticated) {
      console.warn('JwtInterceptor: User is not authenticated, skipping token attachment.');
      return next.handle(req);
    } else {
      console.log('JwtInterceptor: User is authenticated');
    }

    // 3️⃣ **Retrieve token**
    const token = this.authService.getIdToken();
    if (!token) {
      console.warn('JwtInterceptor: No token found, skipping token attachment.');
      return next.handle(req);
    } else {
      console.log('JwtInterceptor: Token found', token);
    }

    // 4️⃣ **Modify request to include Authorization header**
    const modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    console.log('JwtInterceptor: Token added to request', modifiedReq);

    return next.handle(modifiedReq);
  }

}