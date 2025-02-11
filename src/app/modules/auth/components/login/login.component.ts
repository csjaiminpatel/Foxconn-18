import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../services/auth.service';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { AppConfigLanguageItem, EnumAuthFlags, Plant } from '../../models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../../store/authentication.state';
import { CommonModule } from '@angular/common';
import { LanguageState } from '../../store/language/language.state';
import { SetLanguage } from '../../store/language/language.actions';
import { LoginErrorDomain, LoginCanceled, LoginAdfs, LogoutAdfs, FetchPlants, LoginApplication, LoginApplicationTest, LogoutTest, Logout, LoginApplicationDomain, LogoutDomain } from '../../store/authentication.actions';


const formItemCompose = Validators.compose([Validators.required, Validators.minLength(0)]);

@Component({
  selector: 'orion-platform-login',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  plantActivated?: Plant;

  //#region injectors or services

  private oidcSecurityService = inject(OidcSecurityService);
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private translate = inject(TranslateService);
  private formBuilder = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  //#endregion

  //#region selectors 
  langs$: Observable<any[]> = this.store.select(LanguageState.getLangs);
  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);
  plants$: Observable<Plant[]> = this.store.select(AuthenticationState.plants);
  //#endregion

  //#region variables
  isAuthenticated: boolean = false;
  form: FormGroup;
  error: boolean = false;
  currentLang: string = 'en';
  loading:boolean = false;

  //#endregion

  ngOnInit() {
    console.warn('Login loaded', this.langs$);
    // this.plantActivated = this.store.selectSnapshot(AuthenticationState.activePlant);

    // if (this.plantActivated && this.plantActivated.Code) {
    //   this.selectedPlant = this.plantActivated.Code;
    // }

    this.currentLang$.subscribe((language: any) => (this.currentLang = language));
    this.authService.getIsAuthorized().subscribe((isAuthorized) => {
      this.isAuthenticated = isAuthorized
    });

    this.actions$.pipe(ofActionDispatched(LoginErrorDomain)).subscribe((res) => {
      this.loading = false;
      this.error = true;
      this.form.get('visualizator')?.enable();
    });

    this.actions$.pipe(ofActionDispatched(LoginCanceled)).subscribe((res) => {
      this.loading = false;
      this.error = true;
      this.form.get('orion')?.enable();
    });
  }

  constructor() {
    this.form = this.formBuilder.group({
      orion: this.formBuilder.group({
        username: ['', formItemCompose],
        password: ['', formItemCompose],
      }),
      visualizator: this.formBuilder.group({
        domain: ['', formItemCompose],
        username: ['', formItemCompose],
        password: ['', formItemCompose],
        plant: ['', formItemCompose],
      }),
    });
  }

  // login() {
  //   this.oidcSecurityService.authorize();
  // }


  login() {
    localStorage.removeItem(EnumAuthFlags.IsLoggedOffLocal);
    this.loginAdfs();
  }
  
  loginAdfs = () => this.store.dispatch(new LoginAdfs());

  logoutAdfs = () => this.store.dispatch(new LogoutAdfs());
  
  fetchPlants = () => this.store.dispatch(new FetchPlants());

  loginApplication() {
    const {username, password} = this.form.get('orion')?.value;
    this.loading = true;

    this.form.get('orion')?.disable();

    this.store.dispatch(new LoginApplication(username, password));
  }

  // logout() {
  //   this.oidcSecurityService.logoff().subscribe((result) => console.log(result));
  // }
  logout() {
    this.logoutAdfs();
  }

  
  loginScm() {
    const {username, password} = this.form.get('orion')?.value;

    if (username && password) {
      this.store.dispatch(new LoginApplicationTest(username));
    }
  }

  logoutScm = () => this.store.dispatch(new LogoutTest());

    /**
   * Logout Mock
   */
    logoutApplication = () => this.store.dispatch(new Logout());

    /**
     * Login via application user account - mainly for visualizator (eFox.NET4 login)
     */
    loginApplicationDomain() {
      const {domain, username, password, plant} = this.form.get('visualizator')?.value;
  
      this.loading = true;
      this.form.get('visualizator')?.disable();
  
      this.store.dispatch(new LoginApplicationDomain(domain, username, password, plant));
    }
  

  activeLanguage(language: string) {
    return language === this.currentLang;
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.store.dispatch(new SetLanguage(language));
  }


  trackLanguageByFn = (index: number) => index;
  /**
   * Logout application user account - mainly for visualizator (eFox.NET4 logout)
   */
  logoutDomain = () => this.store.dispatch(new LogoutDomain());

  /**
   * Checks if looped language is active language
   */

  // activeLanguage = ({code}: any) => code === this.currentLang.code;

  /**
   * redirect to dashboard
   *
   */
  async onDashboard() {
    const authSvc = this.authService;
    //Block Guards Start
    if (!this.isAuthenticated) {
      return;
    }
    if (authSvc.checkIfRefreshTokenExpired(authSvc, authSvc.getCurrentTime())) {
      authSvc.logoutAdfs();
      return;
    }
    //Block Guards End

    if (authSvc.checkIfIdleTimeout(authSvc)) {
      await authSvc.refreshTokens();
    }
    this.router.navigate(['/dashboard']);
  }

}
