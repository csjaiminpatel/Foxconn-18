import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../services/auth.service';
import { Actions, Store } from '@ngxs/store';
import { AppConfigLanguageItem, Plant } from '../../models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../../store/authentication.state';
import { CommonModule } from '@angular/common';
import { LanguageState } from '../../store/language/language.state';
import { SetLanguage } from '../../store/language/language.actions';


const formItemCompose = Validators.compose([Validators.required, Validators.minLength(0)]);

@Component({
  selector: 'orion-platform-login',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

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

  //#endregion

  ngOnInit() {
    console.warn('Login loaded', this.langs$);
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

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe((result) => console.log(result));
  }
  // activeLanguage = ({code}: any) => code === this.currentLang.code;

  activeLanguage(language: string) {
    return language === this.currentLang;
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.store.dispatch(new SetLanguage(language));
  }

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
