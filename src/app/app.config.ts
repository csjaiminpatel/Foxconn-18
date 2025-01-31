import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(),
    provideAuth({
      config : {
        authority: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
        redirectUrl: `${window.location.origin}/home`,
        authWellknownEndpointUrl: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
        clientId: "orionweb-dev-x698wqpF8lLaHEWfCVDkOoczTW",
        // client_secret: "fsWmHB63ZybMtvIkdYIqUKwP7sewuggV",
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
        // eagerLoadAuthWellKnownEndpoints: false,
        maxIdTokenIatOffsetAllowedInSeconds: 600,
        autoUserInfo: false,
        issValidationOff: true,
        triggerAuthorizationResultEvent: true,
        historyCleanupOff: true,
        // jwksUri_route: "/protocol/openid-connect/certs",
        // authorizationEndpoint: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/auth",
        // token_route: "/protocol/openid-connect/token",
        // userinfo_route: "/userinfo",
        // endSessionEndpoint: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/logout",
        // config_version: "0.1"
      }
    }),
  ]
};
