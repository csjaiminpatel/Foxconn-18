import { LogLevel, provideAuth } from "angular-auth-oidc-client";

export const authConfig = provideAuth({
  config: {
    authority: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
    redirectUrl: `${window.location.origin}/home`,
    clientId: "orionweb-dev-x698wqpF8lLaHEWfCVDkOoczTW",
    responseType: "code",
    scope: "openid profile email offline_access",
    postLogoutRedirectUri: `${window.location.origin}/home`,
    startCheckSession: true,
    tokenRefreshInSeconds: 1200,
    silentRenew: true,
    silentRenewUrl: `${window.location.origin}/silent-renew.html`,
    renewTimeBeforeTokenExpiresInSeconds: 10,
    postLoginRoute: "/dashboard",
    forbiddenRoute: "/forbidden",
    unauthorizedRoute: "/unauthorized",
    logLevel: LogLevel.None,
    maxIdTokenIatOffsetAllowedInSeconds: 600,
    autoUserInfo: false,
    issValidationOff: true,
    triggerAuthorizationResultEvent: true,
    historyCleanupOff: true,
    useRefreshToken: true,
    authWellknownEndpointUrl: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd",
    // TODO:- NEED TO SET DYNAMIC URL BASED ON ENVIRONMENT API URL :- JAIMIN
    authWellknownEndpoints: {
      jwksUri: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/certs",
      authorizationEndpoint: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/auth",
      tokenEndpoint: "https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/token",
      userInfoEndpoint : "/userinfo",
      endSessionEndpoint :"https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/logout",
    },
    customParamsAuthRequest: {
      token_endpoint: 'https://auth.prod.orion.cz.foxconn.com/realms/OrionProd/protocol/openid-connect/token',
      client_secret: 'fsWmHB63ZybMtvIkdYIqUKwP7sewuggV',
    },
  },
});