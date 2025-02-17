import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { OidcSecurityService, provideAuth, PublicEventsService } from 'angular-auth-oidc-client';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthService } from './modules/auth/services/auth.service';
import { provideStore } from '@ngxs/store';
import { AuthenticationState } from './modules/auth/store/authentication.state';
import { authConfig } from './models/application-configurations/auth.config';
import { translateModule } from './models/application-configurations/ngx-translate-config';
import { jwtInterceptors } from './models/application-configurations/http-interceptor';
import { LanguageState } from './modules/auth/store/language/language.state';
import { JwtInterceptor } from './modules/auth/interceptors/jwt.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,

    // HTTP Interceptors
    // jwtInterceptors,
    provideHttpClient(withInterceptorsFromDi()),

    // Zone optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Routing
    provideRouter(routes),


    // Authentication
    authConfig,

    // Translation Service
    importProvidersFrom(translateModule),

    // Services
    OidcSecurityService,
    PublicEventsService,

    // Store Management
    provideStore([AuthenticationState, LanguageState]),

  ]
};
