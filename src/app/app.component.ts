import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./modules/dashboard/sidebar/sidebar.component";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { filter, distinctUntilChanged, map } from 'rxjs';
import { AppConfigLanguageItem, BreadCrumb } from './modules/auth/models/auth.model';
import { LoginSuccess, LoginSuccessDomain, LoginApplicationTest } from './modules/auth/store/authentication.actions';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from '../environments/environment';
import { SetupLanguage } from './modules/auth/store/language/language.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  // title = 'orion18';


  showToolbar = false;
  showSidebar = false;
  showNotification: boolean = false;
  SIDEBAR_EXPAND_WIDTH = 16;
  SIDEBAR_COLLAPSE_WIDTH = 7;
  sidebarWidth = 0;
  mainWindowWidth = 100;
  isSidebarCollapse = true;
  isAuthenticated: boolean = false;


  // service
  public oidcSecurityService = inject(OidcSecurityService);
  public authService = inject(AuthService);
  private actions = inject(Actions);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private readonly translate= inject(TranslateService);
  private readonly store= inject(Store);


  ngOnInit() {
    this.authService.getIsAuthorized().subscribe((isAuthorized) => {
      let isAuthorizedToken = isAuthorized;
      this.showSidebar = isAuthorizedToken.isAuthenticated;
      this.sidebarWidth = isAuthorizedToken ? this.SIDEBAR_COLLAPSE_WIDTH : 0;
      this.mainWindowWidth = isAuthorizedToken ? 100 - this.SIDEBAR_COLLAPSE_WIDTH : 100;
    });
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.authService.getCancellationToken()) {
        const {url} = event;
        if (url !== '/dashboard')
        this.authService.invokeCancellationToken();
      }
      if (event instanceof NavigationEnd) {
        const {url} = event;
        if (url === '/' || url === '/login' || url === '/home') {
          this.showToolbar = false;
        } else {
          this.showToolbar = true;
        }
      }
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map((event) => this.buildBreadCrumb(this.activatedRoute.root))
      )
      .subscribe((res) => {
        // this.store.dispatch(new SetApplicationUrl(res));
      });

    this.actions
      .pipe(ofActionDispatched(LoginSuccess, LoginSuccessDomain, LoginApplicationTest))
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

    const language = environment.language;
    const defaultLang: AppConfigLanguageItem = language.default;
    const languages: AppConfigLanguageItem[] = language.languages;

    this.translate.setDefaultLang(defaultLang.code);
    this.translate.use(defaultLang.code);
    this.store.dispatch(new SetupLanguage(languages, defaultLang));
    this.changeFaviconBasedOnEnvironment();

    
  }

  // Change favicon dynamically
  private changeFaviconBasedOnEnvironment() {
    const favicons: { [key: string]: string } = {
      stag: 'favicon_stag.ico',
      prod: 'favicon_prod.ico',
    };
    const environment = window.location.href.replace('https://', '').split('.')[0];
    const favicon = favicons[environment] || undefined;
    const link = document.querySelector("link[rel*='icon']") || undefined;
    if (link && favicon) {
      link.setAttribute('href', favicon);
    }
  }

  // Build breadcrumb navigation dynamically
  private buildBreadCrumb(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadCrumb[] = []
  ): BreadCrumb[] {
    if (route.routeConfig?.data?.['skip']) return breadcrumbs;

    const label = route.routeConfig?.data?.['breadcrumb'] ?? 'home';
    const path = route.routeConfig?.path ?? '';
    const nextUrl = `${url}${path}/`.replace('//', '/');
    const breadcrumb = { url: nextUrl, label: label };

    let snapshotParams = route.snapshot.params ?? undefined;
    let newBreadcrumbs = [...breadcrumbs, breadcrumb];

    if (snapshotParams && breadcrumb.url.includes('/:')) {
      const updatedBreadcrumbs = this.replaceParamsInBreadcrumb(breadcrumb, snapshotParams);
      newBreadcrumbs = [...breadcrumbs, ...updatedBreadcrumbs];
    }

    return route.firstChild ? this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs) : newBreadcrumbs;
  }

  private replaceParamsInBreadcrumb(breadcrumb: BreadCrumb, params: any): BreadCrumb[] {
    const splitUrl = breadcrumb.url.split('/:');
    const splitLabel = breadcrumb.label.split('/');
    let fullPath = '';

    return splitUrl.map((item, i) => {
      item = params[item] ? params[item] : item;
      splitLabel[i] = params[item] ? params[item] : splitLabel[i];

      fullPath = fullPath ? `${fullPath}/${item}` : item;
      return { url: fullPath, label: splitLabel[i] };
    });
  }
}
