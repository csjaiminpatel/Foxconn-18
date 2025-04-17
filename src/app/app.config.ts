import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthService } from './modules/auth/services/auth.service';
import { provideStore } from '@ngxs/store';
import { AuthenticationState } from './modules/auth/store/authentication.state';
import { authConfig } from './models/application-configurations/auth.config';
import { translateModule } from './models/application-configurations/ngx-translate-config';
import { LanguageState } from './modules/auth/store/language/language.state';
import { JwtInterceptor } from './modules/auth/interceptors/jwt.interceptor';
import { SupplyVisibilityState } from './modules/dashboard/stores/supply-visibility/supply-visibility.state';
import { APP_SERVICES } from './app_services';
import { SupplyVisibilitySharedState } from './modules/dashboard/stores/supply-visibility-shared/supply-visibility-shared.state';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,

    // HTTP Interceptors
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    provideHttpClient(),

    // Zone optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Routing
    provideRouter(routes),


    // Authentication
    authConfig,

    // Translation Service
    importProvidersFrom(translateModule),

    // Services
    APP_SERVICES,
    // Store Management
    provideStore([AuthenticationState, LanguageState, SupplyVisibilityState,SupplyVisibilitySharedState]),

  ]
};
