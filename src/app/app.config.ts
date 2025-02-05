import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthService } from './modules/auth/services/auth.service';
import { provideStore } from '@ngxs/store';
import { AuthenticationState } from './modules/auth/store/authentication.state';
import { provideTranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/app/', '.json?v=0001');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      loader: {
        provide: TranslateHttpLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
      useDefaultLang: true,
    }),
    provideHttpClient(),
    provideAuth({
      config: {
        authority: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
        redirectUrl: `${window.location.origin}/home`,
        authWellknownEndpointUrl: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
        clientId: "orionweb-dev-x698wqpF8lLaHEWfCVDkOoczTW",
        responseType: "code",
        scope: "openid profile",
        postLogoutRedirectUri: `${window.location.origin}/home`,
        startCheckSession: false,
        silentRenew: true,
        silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        renewTimeBeforeTokenExpiresInSeconds: 10,
        postLoginRoute: "/dashboard",
        forbiddenRoute: "/forbidden",
        unauthorizedRoute: "/unauthorized",
        logLevel: 0,
        maxIdTokenIatOffsetAllowedInSeconds: 600,
        autoUserInfo: false,
        issValidationOff: true,
        triggerAuthorizationResultEvent: true,
        historyCleanupOff: true,
      }
    }),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (configService: ConfigService) => () => configService.loadConfig(),
    //   deps: [ConfigService],
    //   multi: true
    // },
    AuthService,
    provideStore([AuthenticationState]),

  ]
};
