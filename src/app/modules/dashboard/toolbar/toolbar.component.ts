import { Component, inject, Input, OnInit } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { ConfigService } from '../../../services/config.service';
import { ThemePalette } from '@angular/material/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthenticationState } from '../../auth/store/authentication.state';
import { LanguageState } from '../../auth/store/language/language.state';
import { SetActivePlant, LogoutAdfs } from '../../auth/store/authentication.actions';
import { SetLanguage } from '../../auth/store/language/language.actions';
import { EnumDataStatus, Helper } from '../../shared/helper';
import { SVNotification } from '../models/sv-notification.model';
import { GetNotificationsSuccess, GetNotificationsUnreadCountSuccess, GetNotificationsError, ResetPlantDependentCache, ShowNotifications } from '../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../stores/supply-visibility/supply-visibility.state';
import { DxDateBoxModule } from 'devextreme-angular';
import { ResetAllDefaultFields } from '../stores/common/common.action';
@Component({
  selector: 'orion-platform-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatRadioModule, MatIconModule, MatProgressSpinnerModule, MatMenuModule, MatBadgeModule, CommonModule, TranslateModule, DxDateBoxModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  private actions$ = inject(Actions);
  private translate = inject(TranslateService);
  private store = inject(Store);
  private router = inject(Router);
  private config = inject(ConfigService);


  userName$: Observable<any> = this.store.select(AuthenticationState.username);
  langs$: Observable<any[]> = this.store.select(LanguageState.getLangs);
  currentLang$: Observable<any> = this.store.select(LanguageState.getCurrentLang);
  plants$: Observable<any[]> = this.store.select(AuthenticationState.plants);
  activePlant$: Observable<any> = this.store.select(AuthenticationState.activePlant);
  notifications$?: Observable<SVNotification[]> = this.store.select(SupplyVisibilityState.getNotificationsList);
  notificationsUnreadCount$?: Observable<number> = this.store.select(SupplyVisibilityState.getNotificationsUnreadCount);

  private ngUnsubscribe = new Subject();
  currentLang: any;
  activePlant: any;
  plants: any;
  notifications: SVNotification[] = [];
  notificationsStatus: EnumDataStatus = EnumDataStatus.FETCHING;
  notificationsUnreadCount = 0;
  @Input() diameter = 25;
  @Input() value = undefined;
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() color: ThemePalette = 'primary';
  documentationLink: string = '';


  ngOnInit() {
    this.currentLang$.subscribe((language: string) => (this.currentLang = language));
    this.plants$.subscribe((plants: any[]) => (this.plants = plants));
    this.activePlant$.subscribe((activePlant: any) => {
      const that = this;

      if (that.plants) {
        that.activePlant = that.plants.find((item: any) => item.Code == activePlant);
        if (that.activePlant) {
          that.documentationLink = that.config.getSettings('documentationLink')
            .replace('{DivisionCode}', that.activePlant.DivisionCode.toLowerCase());
        } else {
          that.activePlant = that.plants[0];
        }
      }
    });
    this.catchGetNotificationsSuccess();
    this.catchGetNotificationsUnreadCountSuccess();
    this.catchGetNotificationsError();
    this.notificationsStatus = EnumDataStatus.FETCHING;
  }

  catchGetNotificationsSuccess() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationsSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.setNotificationsStatus(res.notifications);
        this.notifications = res.notifications;
      });
  }

  catchGetNotificationsUnreadCountSuccess() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationsUnreadCountSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.notificationsUnreadCount = res.count;
      });
  }

  catchGetNotificationsError() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationsError), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.setNotificationsStatus();
      });
  }

  setNotificationsStatus(notifications?: SVNotification[]) {
    if (notifications) {
      if (notifications.length) {
        this.notificationsStatus = EnumDataStatus.AVAILABLE;
      } else {
        this.notificationsStatus = EnumDataStatus.NONE;
      }
    } else {
      this.notificationsStatus = EnumDataStatus.ERROR;
    }
  }

  setLanguage({ value }: MatRadioChange) {
    this.currentLang = value;
    this.translate.use(value.code);
    this.store.dispatch(new SetLanguage(this.currentLang));
  }

  resetAllState() {
    this.store.dispatch(new ResetPlantDependentCache());
    this.store.dispatch(new ResetAllDefaultFields());
    // this.store.dispatch(new SetDefaultDashboardSettings(true,'isPlantChanged'))
  }

  setActivePlant({ value }: MatRadioChange) {
    this.store.dispatch(new SetActivePlant(value.Code)).subscribe(() => {
      this.resetAllState();
      const currentPath: string = Helper.getUrlPaths();
      const redirectPath = '/dashboard';
      if (currentPath != redirectPath) {
        this.router.navigate([redirectPath]);
      } else {
        location.reload();
      }
      // NOTE Uncomment if need to redirect on the same page
      // const basicParameters = this.store.selectSnapshot(
      //   SupplyVisibilityState.getBasicParameters
      // );
      // console.log(basicParameters);
      // if (basicParameters !== null && basicParameters.partNumber != "" && basicParameters.mmViewID !== "") {
      //   const {vendorCode, partNumber, weeks, mmViewID} = basicParameters;
      //   this.router.navigate([`/material-management/supply-visibility`], {
      //       queryParams: {
      //         plant: value,
      //         vendorCode: vendorCode,
      //         partNumber: partNumber,
      //         weeks: weeks,
      //         materialManagementViewID: mmViewID
      //       }
      //     });
      //   } else {
      //     location.reload();
      //   }
    });
  }

  logout() {
    this.store.dispatch(new LogoutAdfs()).subscribe((res: any) => {
      // this.navigateToHome();
    });
  }

  navigateToHome = () => this.router.navigate(['/home']);
  middleClickHandle(url: string, event: MouseEvent) {
    if (event.which == 2 || event.buttons == 4) {
      Helper.openInNewTab(url, this.router);
    }
  }

  goToNotifications(id: string) {
    this.store.dispatch(new ShowNotifications(id));
  }
}
