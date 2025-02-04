import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { AuthService } from './modules/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),AuthService,
    provideAuth({
      config : {
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
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => configService.loadConfig(),
      deps: [ConfigService],
      multi: true
    }
  ]
};
