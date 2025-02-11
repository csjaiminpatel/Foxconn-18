import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./modules/dashboard/sidebar/sidebar.component";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { filter, distinctUntilChanged, map } from 'rxjs';
import { BreadCrumb } from './modules/auth/models/auth.model';
import { LoginSuccess, LoginSuccessDomain, LoginApplicationTest } from './modules/auth/store/authentication.actions';

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
  private actions = inject(Actions);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
  
    this.oidcSecurityService.checkAuth().subscribe(authResult => {
      console.log('Auth Result:', authResult);
      this.showSidebar = authResult.isAuthenticated;
      this.sidebarWidth = authResult.isAuthenticated ? this.SIDEBAR_COLLAPSE_WIDTH : 0;
      this.mainWindowWidth = authResult.isAuthenticated ? 100 - this.SIDEBAR_COLLAPSE_WIDTH : 100;
    });
    
     // ✅ Track Router Events for Toolbar & Sidebar
     this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const { url } = event;
        if (url !== '/dashboard') {
          // Example of session cancellation logic
          console.log('Session cancellation invoked');
        }
      }
      if (event instanceof NavigationEnd) {
        const { url } = event;
        this.showToolbar = !['/', '/login', '/home'].includes(url);
      }
    });

    // ✅ Update Breadcrumb Navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(() => this.buildBreadCrumb(this.activatedRoute.root))
      )
      .subscribe(res => {
        // this.store.dispatch(new SetApplicationUrl(res));
      });

    // ✅ Redirect on Login Success
    this.actions
      .pipe(ofActionDispatched(LoginSuccess, LoginSuccessDomain, LoginApplicationTest))
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

    // ✅ Set Language Configuration

    // const language = environment.language;
    // const defaultLang: AppConfigLanguageItem = language.default;
    // const languages: AppConfigLanguageItem[] = language.languages;

    // this.translate.setDefaultLang(defaultLang.code);
    // this.translate.use(defaultLang.code);
    // console.log('defaultLang-appcomponent',languages, defaultLang);
    // this.store.dispatch(new SetupLanguage(languages, defaultLang));

    // ✅ Set Favicon based on Environment
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
