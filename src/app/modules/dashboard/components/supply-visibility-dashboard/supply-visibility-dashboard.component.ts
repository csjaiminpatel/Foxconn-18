import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store, Actions, ofActionDispatched, Select } from '@ngxs/store';
import { GridsterConfig, GridsterItem, GridsterItemComponent, GridType, CompactType, GridsterItemComponentInterface, GridsterModule } from 'angular-gridster2';
import { Observable, Subject, Subscription, BehaviorSubject, switchMap, takeUntil, skip, firstValueFrom } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { ConfigurationRights } from '../../../auth/models/auth.model';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { FetchAdfsPlants } from '../../../auth/store/authentication.actions';
import { AuthenticationState } from '../../../auth/store/authentication.state';
import { LanguageState } from '../../../auth/store/language/language.state';
import { Helper } from '../../../shared/helper';
import { SignalRService } from '../../../shared/services/signal-r.service';
import { UserSettings, UserSettingsCls, PageHeaderAction, EnumPageHeaderAction, NewUserSetting } from '../../models/supply-visibility.model';
import { DashboardPanelModel, DashboardCache, dashboardInfoDto } from '../../models/sv-dashboard';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { ResetCache, EditUserSettings, DeleteUserSettings, SetDefaultDashboardSettings, SetWidgetCache } from '../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';
import { SupplyVisibilitySharedState } from '../../stores/supply-visibility-shared/supply-visibility-shared.state';
import { SupplyVisibilityConfigureWidgetComponent } from '../widgets/supply-visibility-configure-widget/supply-visibility-configure-widget.component';
import { MatSidenav } from '@angular/material/sidenav';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { AuthService } from '../../../auth/services/auth.service';
import { SidenavService } from '../../../shared/services/sidenav.service';
import { AddNewDashboard, AddNewDashboardSuccess, ChangeDashboard, ChangeDashboardError, ChangeDashboardSuccess, DeleteDashboard, DeleteDashboardError, DeleteDashboardSuccess, SetDashboardCache, SetDashboardList, SetDashboardLockState, SetDashboardModificationRights, SetDefaultDashboard, SetSelectedDashboard, SetUserSettingsAvailability, UpdateDashboard, UpdateDashboardInfo, UpdateDashboardInfoSuccess } from '../../stores/supply-visibility-shared/supply-visibility-shared.actions';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SetDefaultDashboardDto } from '../../models/shared-sv.model';
import { DashboardSelectDialogComponent } from '../../pages/dashboard-select-dialog/dashboard-select-dialog.component';
import { AddEditDashboardFormComponent } from '../../pages/add-edit-dashboard-form/add-edit-dashboard-form.component';
import { SimplePnListWidgetComponent } from '../widgets/simple-pn-list-widget/simple-pn-list-widget.component';
import { DashboardFilterWidgetComponent } from '../widgets/dashboard-filter-widget/dashboard-filter-widget.component';
import { ParamsInputWidgetComponent } from '../widgets/params-input-widget/params-input-widget.component';
import { ConfigurationLinkWidgetComponent } from '../widgets/configuration-link-widget/configuration-link-widget.component';
import { SearchPnListWidgetComponent } from '../widgets/search-pn-list-widget/search-pn-list-widget.component';
import { CircularChartWidgetComponent } from '../widgets/circular-chart-widget/circular-chart-widget.component';
import { MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../shared-imports';
import { StatusReportWidgetComponent } from '../widgets/status-report-widget/status-report-widget.component';
import { OrdersWidgetComponent } from '../widgets/orders-widget/orders-widget.component';
import { FilterCommitsWidgetComponent } from '../widgets/filter-commits-widget/filter-commits-widget.component';
import { MyPnListWidgetComponent } from '../widgets/my-pn-list-widget/my-pn-list-widget.component';
import { SyncPloWidgetComponent } from '../widgets/sync-plo-widget/sync-plo-widget.component';
import { SharedWarningWidgetComponent } from '../widgets/shared-warning-widget/shared-warning-widget.component';
import { FileUploadWidgetComponent } from '../widgets/file-upload-widget/file-upload-widget.component';
import { InvoiceListWidgetComponent } from '../widgets/invoice-list-widget/invoice-list-widget.component';

export enum EnumView {
  OldDashboard,
  NewDashboard,
}

@Component({
  selector: 'orion-platform-supply-visibility-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...MAT_IMPORTS, SupplyVisibilityConfigureWidgetComponent, PageHeaderComponent, ProgressSpinnerComponent,
    GridsterModule, SimplePnListWidgetComponent, DashboardFilterWidgetComponent, ParamsInputWidgetComponent, ConfigurationLinkWidgetComponent,
    SyncPloWidgetComponent],
  templateUrl: './supply-visibility-dashboard.component.html',
  styleUrl: './supply-visibility-dashboard.component.scss'
})
export class SupplyVisibilityDashboardComponent implements OnInit,AfterViewInit {

  private store = inject(Store);

  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);
  dashboard$: Observable<UserSettings> = this.store.select(SupplyVisibilityState.getUserSettings);
  isDashboardLocked$: Observable<boolean> = this.store.select(SupplyVisibilitySharedState.getDashboardLockState);
  selectedDashboard$: Observable<any> = this.store.select(SupplyVisibilitySharedState.getDefaultDashboard);

  // @Select(LanguageState.getCurrentLang) currentLang$?: Observable<string>;
  // @Select(SupplyVisibilityState.getUserSettings) dashboard$?: Observable<UserSettings>;
  // @Select(SupplyVisibilitySharedState.getDashboardLockState) isDashboardLocked$?: Observable<boolean>;
  // @Select(SupplyVisibilitySharedState.getDefaultDashboard) selectedDashboard$?: Observable<any>;

  public readonly DASHBOARD_KEY = 'svDashboard';
  // public readonly DASHBOARD_LIST_KEY = 'svCreatedList';
  enumView = EnumView;
  oldView = EnumView.OldDashboard; // just to change view
  public count = 8;
  public cellSpacing: number[] = [10, 10];
  data: DashboardPanelModel[] = [];
  currentPlant: string;
  materialManagementTitle = {
    title: '',
    subtitle: '',
  };
  pnGroupsTitle = {
    title: '',
    subtitle: '',
  };



  opened?: boolean;
  selectedDashboard: any = undefined;

  @ViewChild(SupplyVisibilityConfigureWidgetComponent, { static: true })
  public configureWidgetComponent?: SupplyVisibilityConfigureWidgetComponent;
  @ViewChild('supplysidenav', { static: true }) public sidenav?: MatSidenav;
  @ViewChild(PageHeaderComponent, { static: true })
  public pageHeader?: PageHeaderComponent;

  toggleActive: any;
  temp: DashboardPanelModel[] = [];
  dashboardAlreadySaved = false;
  options?: GridsterConfig;
  dashboard: GridsterItem[] = [];
  itemToPush?: GridsterItemComponent;
  loading = false;
  isDraggable = false;
  isResizable = false;
  isDashboardLocked = true;
  private ngUnsubscribe = new Subject();
  allowModification = false;
  rightForModifyList: any[] = [];
  ignoreItemStack: any[] = [];
  dashboardList: any[] = [];
  defaultDashboardId?: string = undefined;
  isSharedSettingsReady: boolean = false;
  private subscription: Subscription = new Subscription();

  public widgetBehavior: BehaviorSubject<any> = new BehaviorSubject(undefined);


  // dashboardList$: Observable<any> = this.store.select(SupplyVisibilitySharedState.getDashboardList);
  dashboardList$: Observable<any> = this.store.select(SupplyVisibilitySharedState.getDashboardList);

  userConfigRights?: ConfigurationRights;
  userWidgetRights: string[] = [];

  /**
   *
   */
  private translate = inject(TranslateService);
  private supplyVisibilityService = inject(SupplyVisibilityService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private sidenavService = inject(SidenavService);


  constructor(
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private actions$: Actions,
    private router: Router,
  ) {
    this.currentLang$?.pipe(switchMap(({ code }: any) => this.translate.getTranslation(code)), takeUntil(this.ngUnsubscribe))
      .subscribe(({ cards }: any) => {
        this.materialManagementTitle = cards.materialManagementViews;
        this.pnGroupsTitle = cards.pngroups;
      });
    this.currentPlant = this.store.selectSnapshot(AuthenticationState.activePlant);
  }

  //#region  Init

  async ngOnInit() {
    this.loading = true;
    this.userWidgetRights = this.store.selectSnapshot(AuthenticationState.widgetAccessRightList) || [];
    this.userConfigRights = this.store.selectSnapshot(AuthenticationState.configurationRights);
    this.unSubscribe();
    this.setIcon(
      'configurator-logo',
      'commits',
      'pn-groups',
      'vendorcode-rights',
      'supply-visibility-logo',
      'qap',
      'outline-cancel',
      'warning',
      'ploSync',
      'file-upload',
      'waterfall',
      'filter-icon',
      'artificial'
    );

    const wasLoggedOutAt: string = localStorage.getItem('lastUrlBeforeLogout') || '';
    const relativeUrl = wasLoggedOutAt.replace(window.location.origin, ''); // Remove domain
    if (relativeUrl !== '') {
      localStorage.removeItem('lastUrlBeforeLogout');
      this.router.navigateByUrl(relativeUrl);
      // window.location.href = wasLoggedOutAt;
    }


    this.initGridster();
    this.isDashboardLocked$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: boolean) => {
      this.isDashboardLocked = res;

      if (this.isDashboardLocked) {
        this.setGridFreeze(!this.isDashboardLocked);
      } else {
        this.setGridFreeze(this.allowModification);
      }
    });
    this.loading = false;
    console.log('Resetting cache...');
    this.store.dispatch(new ResetCache());

    this.store.dispatch(new FetchAdfsPlants());

    this.finantialRedirect(await this.authService.getGroupNames());

    this.selectedDashboard$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((dashboard) => {
      this.selectedDashboard = dashboard;
    });
    this.catchAddNewDashboard();
    this.catchAddNewDashboardSuccess();
    this.catchUpdateDashboardInfoSuccess();
    this.catchDeleteDashboardSuccess();
    this.catchDeleteDashboardError();
    this.catchChangeDashboardSuccess();
    this.catchChangeDashboardError();
    this.catchSetWidgetCache();
    // this.deleteData();
    // this.setAccessRoles();
  }

  ngAfterViewInit() {
     this.getDashboardsList();
  }
  hasWidgetOnDashboard(widgetType: string) {
    let index = this.data.findIndex(widget => widget.type == widgetType);
    return (index != -1)
  }

  ngOnDestroy() {
    this.unSubscribe();
    this.subscription.unsubscribe();
  }

  unSubscribe() {
    if (this.ngUnsubscribe) {
      this.ngUnsubscribe.next(undefined);
      this.ngUnsubscribe.complete();
    }
  }

  initGridster() {
    this.options = {
      gridType: GridType.Fixed,
      fixedColWidth: 75,
      fixedRowHeight: 75,
      compactType: CompactType.None,
      pushItems: true,
      itemChangeCallback: SupplyVisibilityDashboardComponent.itemChange.bind(this),
      draggable: {
        delayStart: 0,
        enabled: this.isDraggable,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'drag-handler',
      },
      resizable: {
        enabled: this.isResizable,
      },
    };
  }

  resetWidgetBehavior(isReady: boolean) {
    if (isReady) {
      this.widgetBehavior.next(undefined); // Reset the null values when the dashboard is changed
    }
  }

  private setIcon(...names: string[]) {
    for (const name of names) {
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(`/icons/dashboard/${name}.svg`)
      );
    }
  }

  //#endregion Init
  trackByFun(index: number, item: any) {
    return item.id;
  }
  //#region Load Dashboard
  private async fillUserSettings() {
    try {
      const defaultDashboardInfo = await this.fetchDefaultDashboardInfo();
      this.dashboardAlreadySaved = defaultDashboardInfo.dashboardAlreadySaved;
      this.store.dispatch(new SetUserSettingsAvailability(this.dashboardAlreadySaved));

      let defaultDashboardData = this.store.selectSnapshot(
        SupplyVisibilityState.getDefaultDashboard
      );
      if (defaultDashboardData && defaultDashboardData.defaultDashboardId) {
        this.defaultDashboardId = defaultDashboardData.defaultDashboardId[this.currentPlant];
      }
      //it will run when plant is not change
      if (defaultDashboardInfo && defaultDashboardInfo.id && this.dashboardList.find(item => item.id === defaultDashboardInfo.id)) {
        this.getDefaultDashboardData(defaultDashboardInfo)
      } else {
        // it will run when plant is changed and check two condition first is last selected default dashboard and second is any selected default dashboard in current plant ,if first condition is failed
        let defaultDashboardInfo_ = this.dashboardList.find(item =>
          this.defaultDashboardId && item.isDefault && item.id === this.defaultDashboardId
        );

        if (!defaultDashboardInfo_) {
          defaultDashboardInfo_ = this.dashboardList.find(item =>
            item.isDefault && item.plant === this.currentPlant && item.isPersonal
          );
        }

        if (!defaultDashboardInfo_) {
          defaultDashboardInfo_ = this.dashboardList.find(item =>
            item.isDefault && item.plant === this.currentPlant
          );
        }

        if (defaultDashboardInfo_ && defaultDashboardInfo_.id) {
          this.getDefaultDashboardData(defaultDashboardInfo_)
          this.store.dispatch(new ChangeDashboard(defaultDashboardInfo_.id));
        }
        //it is default UserSettings if above is failed
        // else if (defaultDashboardInfo && defaultDashboardInfo.id) {
        //   this.getDefaultDashboardData(defaultDashboardInfo)
        // }
        else {
          this.setDefaultDashboard([], undefined, true);
        }
      }
      //Background Caching.....
      // if (this.hasWidgetOnDashboard('commitList')) {
      //   this.store.dispatch(new GetFilterAdditions())
      //   this.store.dispatch(new CacheCommitsCarriers())
      //   this.store.dispatch(new CacheCommitsCountries())
      //   this.store.dispatch(new CacheCommitsTransportType())
      //   this.store.dispatch(new CacheCommitsReasons())
      //   this.store.dispatch(new CacheReadOnlyFields())
      //   this.store.dispatch(new SetPlantMandatoryDates())
      // }
    } catch (e) {
      Helper.printError(e);
    }
    // this.store.dispatch(new SetDefaultDashboardSettings(false, 'isPlantChanged'));
    // this.store.dispatch(new SetDefaultDashboardSettings(false, 'isLogin'));
  }

  async getDefaultDashboardData(dashboardInfo: any) {
    const dashboardData = await this.fetchDashboardData(dashboardInfo);
    this.assignIdIfMissing(dashboardData);
    this.data = Helper.getWidgetAccess(this.userWidgetRights, dashboardData); // filtering the widget access according to role
  }


  // setAccessRoles(){
  //     if (this.signalRService.tokenValue) {
  //       const groupNames: string[] = this.authService.getGroupNames();
  //       this.isFullAccess = Helper.getWidgetAccess(groupNames)
  //     }
  //     else {
  //       this.signalRService
  //         .getTokenReady()
  //         .pipe(takeUntil(this.ngUnsubscribe))
  //         .subscribe((isTokenReady) => {
  //           if (isTokenReady) {
  //             const groupNames: string[] = this.authService.getGroupNames();
  //             this.isFullAccess = Helper.getWidgetAccess(groupNames)
  //           }
  //         });
  //     }
  //   }

  finantialRedirect(groupNames: string[]) {
    if (Helper.fullAccessRoles.some(value => groupNames.includes(value))) {
      return;
    }
    if (Helper.limitedAccessRoles.some(value => groupNames.includes(value))) {
      return;
    }
    if (Helper.finantialAccessRoles.some(value => groupNames.includes(value))) {
      //this.router.navigate(['/financial-module/invoicing']);
      this.router.navigate([`/financial-module/invoicing`]);
    }

  }


  async getDashboardsList() {
    this.subscription.add(
      await this.dashboardList$?.pipe(skip(1), takeUntil(this.ngUnsubscribe)).subscribe(async (res) => {
        res = res && res.length ? Helper.createCopy(res) : res;
        this.dashboardList = res;
        await this.fillUserSettings();
        // this.data = Helper.getWidgetAccess(this.userWidgetRights, this.data);
      }));
  }

  /**
   *
   * @returns default dashboard id and dashboardAlreadySaved
   */
  private async fetchDefaultDashboardInfo() {
    let dashboardInfo: dashboardInfoDto = {
      id: undefined,
      dashboardAlreadySaved: false,
      dashboardCache: undefined,
    };

    //START selected dashboard id process
    let selectedDashboardData: any = await firstValueFrom(this.supplyVisibilityService
      .getUserSettings(this.DASHBOARD_KEY))
      .catch(() => {
        selectedDashboardData = undefined;
      });
    if (selectedDashboardData) {
      selectedDashboardData = plainToClass(UserSettingsCls, selectedDashboardData);
      try {
        const temp = JSON.parse(selectedDashboardData.data);
        selectedDashboardData = temp ? temp : null;
        if (selectedDashboardData.dashboardCache) {
          this.store.dispatch(new SetDashboardCache(selectedDashboardData.dashboardCache));
        }
      } catch (e) {
        selectedDashboardData = null;
      }
    } else {

      //Setting default value
      selectedDashboardData = {
        selectedDashboardId: undefined,
        dashboardCache: undefined
      }

      const initSVDashboard = {
        selectedDashboardId: undefined,
      };

      const payload: NewUserSetting = {
        key: this.DASHBOARD_KEY,
        data: JSON.stringify(initSVDashboard),
      };


      await this.supplyVisibilityService
        .addUserSettings(payload)
        .toPromise()
        .catch((e) => {
        });
    }

    //END selected dashboard id process

    let rightForModifyList = this.dashboardList.filter(item => item.rightForModify === true).map(item => item.id);
    this.rightForModifyList = rightForModifyList;

    //END created Dashboard List process

    // this.store.dispatch(new SetUserSettingsAvailability(true));
    dashboardInfo = {
      id: selectedDashboardData.selectedDashboardId,
      dashboardAlreadySaved: true,
      dashboardCache: selectedDashboardData.dashboardCache,
    };

    if (this.rightForModifyList.length) {
      this.allowModification = this.getModificationRights(
        selectedDashboardData.selectedDashboardId || ''
      );
      !this.isDashboardLocked ? this.setGridFreeze(this.allowModification) : null;

      // // Below code was not executing due to above error and so createdDashboardList is not set -- and so it is set to []
      // this.store.dispatch(new SetCreatedDashboardIdList(myDashboardIdList));
    }

    return dashboardInfo;
  }

  private async fetchDashboardData(dashboardInfo: any) {
    let response = await this.supplyVisibilityService
      .getDashboardDetail(dashboardInfo.id)
      .toPromise()
      .catch((e) => {
        response = undefined;
      });
    let dashboardData = [];
    if (response) {
      dashboardData = plainToClass(
        DashboardPanelModel,
        JSON.parse(response.data) as DashboardPanelModel[]
      );

      if (!this.allowModification) {
        dashboardData.forEach((widget) => {
          //Shared Widgets modificationRights always false
          if (widget.modificationRights) {
            //widget.id = null;
            widget.sharedId = undefined;
            widget.modificationRights = false;
          }
        });
        this.applySharedDashboardCache(
          dashboardData,
          dashboardInfo.id,
          dashboardInfo.dashboardCache
        );
      }

      this.store.dispatch(new SetSelectedDashboard(response));
    } else {
      dashboardData = plainToClass(
        DashboardPanelModel,
        this.supplyVisibilityService.SVDefaultDashboard
      );
    }
    return dashboardData;
  }

  //#endregion Load Dashboard

  //#region Dashboard miscellaneous

  /**
   *
   * @param dashboardData
   * @param id
   * @param dashboardCache
   * @returns dashboardData
   */
  applySharedDashboardCache(
    dashboardData: any[],
    id: string,
    dashboardCache: DashboardCache[]
  ): any[] {
    const currentDashboardCache: DashboardCache | undefined = (dashboardCache && dashboardCache.length) ? dashboardCache.find((e) => e.dashboardId == id) : undefined;
    const cacheableWidgetsType = ['mypnlist', 'simplePNList', 'smartPNList', 'filterWidget', 'order', 'searchV2'];

    if (currentDashboardCache && currentDashboardCache.data && currentDashboardCache.data.length) {
      for (let i = 0; i < dashboardData.length; i++) {
        const widget = dashboardData[i];
        if (cacheableWidgetsType.includes(widget.type)) {
          const cache = currentDashboardCache.data.find((cache) => cache.id == widget.id);
          if (widget.type != 'searchV2') {
            widget.panelCache = cache ? cache.panelCache : [] as Array<any>; //set [] incase of error
          }
          else if (cache && widget.panelCache && cache.panelCache) {
            // set the partNumber value from the userSetting to dashboardData

            if (widget.panelCache.length > 0 && cache.panelCache.length > 0) {
              let findOwnerPanelCache = widget.panelCache.find((obj: any) => obj.key == this.currentPlant);
              let findUserPanelCache = cache.panelCache.find((obj: any) => obj.key == this.currentPlant);

              if (!findOwnerPanelCache && findUserPanelCache) {
                widget.panelCache.push(findUserPanelCache);
                findOwnerPanelCache = findUserPanelCache;
              }

              if (findOwnerPanelCache && findUserPanelCache) {
                let ownerCache = JSON.parse(findOwnerPanelCache.value);
                let userCache = JSON.parse(findUserPanelCache.value);

                let ownerPartNumberObj = ownerCache.find((item: any) => item.key === 'partNumber');
                let userPartNumberObj = userCache.find((item: any) => item.key === 'partNumber');

                if (ownerPartNumberObj && userPartNumberObj) {
                  ownerPartNumberObj.value = userPartNumberObj.value;
                }
                findOwnerPanelCache.value = JSON.stringify(ownerCache);
              }
            }
          }
          dashboardData[i] = widget;
        } else {
          //do nothing
        }
      }
    } else {
      dashboardData = dashboardData.map((widget) => {
        if (cacheableWidgetsType.includes(widget.type) && widget.type != 'searchV2') {
          widget.panelCache = null;
        }
        return widget;
      });
    }

    return dashboardData;
  }

  private async setDashboard(selectedDashboard: any) {
    let dashboardData: any = await this.supplyVisibilityService
      .getDashboardDetail(selectedDashboard.id)
      .toPromise()
      .catch((e) => (dashboardData = undefined));
    if (dashboardData) {
      this.allowModification = this.getModificationRights(dashboardData.id);
      !this.isDashboardLocked ? this.setGridFreeze(this.allowModification) : null;
      this.data = plainToInstance(
        DashboardPanelModel,
        JSON.parse(dashboardData.data) as DashboardPanelModel[]
      );
      this.store.dispatch(new SetDefaultDashboard(dashboardData, this.dashboardAlreadySaved));
    } else {
      this.setDefaultDashboard();
    }
  }

  private setDefaultDashboard(data: DashboardPanelModel[] = [], title: string | undefined = undefined, isDefault?: boolean) {
    if (data == null || data.length == 0) {
      const dashboardData = plainToClass(
        DashboardPanelModel,
        this.supplyVisibilityService.SVDefaultDashboard
      );
      this.assignIdIfMissing(dashboardData);
      this.data = dashboardData;
    }

    const tDashboard = {
      Name: title || 'My Dashboard',
      SecurityLevels: ['personal'],
      RightForModifying: 'creator',
      Data: JSON.stringify(this.data),
      DefaultForRole: '',
      plant: this.currentPlant,
      isDefault: isDefault ? isDefault : false
    };
    this.store.dispatch(new AddNewDashboard(tDashboard, this.dashboardAlreadySaved));
  }

  setUnavailableWidget(dashboardPanelModel: DashboardPanelModel) {
    const index = this.data.findIndex((e) => e.id == dashboardPanelModel.id);
    if (index != -1) {
      this.data[index].type = 'sharedUnavailable';
    }
    this.saveChanges();
  }

  saveDashboardCache(dashboardPanelCache: DashboardCache) {
    const dashboardCache = this.store.selectSnapshot(SupplyVisibilitySharedState.getDashboardCache);
    const index = dashboardCache.findIndex((e) => e.dashboardId == dashboardPanelCache.dashboardId);
    if (index != -1) {
      const widgetIndex = dashboardCache[index].data.findIndex(
        (widget) => widget.id == dashboardPanelCache.data[0].id
      );
      if (widgetIndex != -1) {
        dashboardCache[index].data[widgetIndex].panelCache = dashboardPanelCache.data[0].panelCache;
      } else {
        dashboardCache[index].data.push(dashboardPanelCache.data[0]);
      }
    } else {
      dashboardCache.push(dashboardPanelCache);
    }
    const svDashboarddata = {
      selectedDashboardId: this.selectedDashboard.id,
      dashboardCache: dashboardCache,
    };
    const wrappedCache = {
      key: this.DASHBOARD_KEY,
      data: JSON.stringify(svDashboarddata),
    };
    this.store.dispatch(new SetDashboardCache(dashboardCache));
    this.store.dispatch(new EditUserSettings(wrappedCache));
  }

  resize(dashboardPanelModel: DashboardPanelModel) {
  }

  assignIdIfMissing(data: DashboardPanelModel[]) {
    if (data) {
      for (let index = 0; index < data.length; index++) {
        DashboardPanelModel.assignIdIfMissing(data[index]);
      }
    }
  }

  setGridFreeze(state: boolean) {
    this.isResizable = this.isDraggable = state;
    this.initGridster();
  }

  getModificationRights(id: string) {
    const rights = this.rightForModifyList.find((e) => e.trim() == id.trim()) ? true : false;
    this.pageHeader ? (this.pageHeader.modificationRights = rights) : false;
    this.store.dispatch(new SetDashboardModificationRights(rights));
    return rights;
  }

  openModificationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.confirmTitle'),
        content: this.translate.instant('style.createCopyDashboardContent'),
        button: this.translate.instant('style.ok'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createLocalCopy();
        this.loading = true;
      }
    });
  }

  async addSelectedWidget(dashboardTypes: any, newDashboard?: boolean) {
    const widgetPanelList = [];
    for (let index = 0; index < dashboardTypes.length; index++) {
      const type = dashboardTypes[index];
      const panel = DashboardPanelModel.createPanelFromType(type);
      widgetPanelList.push(panel);
    }

    if (newDashboard) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    } else {
      this.ignoreItemStack = widgetPanelList;
      this.data = [...this.data, ...widgetPanelList];
      this.saveChanges();
    }
  }

  //#endregion Dashboard miscellaneous
  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenavService.toggle();
  }

  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    const self = <any>this;

    // NOTE ignore for mass widget addition
    const length = self.ignoreItemStack.length;
    if (item && length) {
      self.ignoreItemStack = self.ignoreItemStack.filter((e: any) => e.id != item['id']);
      self.ignoreItemStack.length == length ? self.saveChanges() : null;
    } else {
      self.saveChanges();
    }
  }

  saveChanges(isNotificationRequired = true) {
    if (!this.allowModification) {
      return;
    }
    const dashboardData = plainToClass(
      DashboardPanelModel,
      Helper.createCopy(this.data) as DashboardPanelModel[]
    );
    this.store.dispatch(new UpdateDashboard(dashboardData, isNotificationRequired));
  }

  setWidgetModificationRights(dashboardData: any[], id: any) {
    const modificationRights = this.rightForModifyList.find((e) => e.trim() == id.trim())
      ? true
      : false;
    dashboardData.forEach((widget) => {
      widget['modificationRights'] = modificationRights;
    });
  }

  async createLocalCopy() {
    let Name = ' - copy';
    if (this.selectedDashboard) {
      Name = `${this.selectedDashboard.name}${Name}`;
    }
    this.data.forEach((widget) => {
      if (!widget.id || !widget.sharedId) {
        widget.modificationRights = true;
      }
      // if (!widget.id) {
      //     widget.modificationRights = true;
      // }
    });

    // For reset filters from the filterWidget when copy someone dashboard.
    const filterWidgetObjects = this.data.filter(item => item.type === 'filterWidget');
    if (filterWidgetObjects) {
      filterWidgetObjects.forEach(filterWidgetObject => {
        if (filterWidgetObject.panelCache) {
          filterWidgetObject.panelCache.forEach(cache => {
            cache.value = '';
          });
        }
      });
    }

    this.assignIdIfMissing(filterWidgetObjects.length > 0 ? filterWidgetObjects : this.data);
    this.setDefaultDashboard(filterWidgetObjects.length > 0 ? filterWidgetObjects : this.data, Name);
  }

  //#region Dashboard Interaction Methods
  /**
   * Open Widget Selection Dialog
   * @memberof SupplyVisibilityComponent
   */
  openDashboardSelectDialog() {
    if (!this.allowModification) {
      this.openModificationDialog();
      return;
    }

    const dialogRef = this.dialog.open(DashboardSelectDialogComponent, {
      width: '800px',
      data: {
        actionType: 'select',
      },
    });

    dialogRef.afterClosed().subscribe((dashboardTypes: any) => {
      if (dashboardTypes) {
        this.addSelectedWidget(dashboardTypes);
      }
    });
  }

  resetDashboard() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.reset'),
        content: this.translate.instant('style.resetDashboardContent'),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.data = Helper.createCopy(this.supplyVisibilityService.SVDefaultDashboard);
        this.saveChanges();
      }
    });

  }

  deleteWidgetConfig(configs: any[]) {
    configs.forEach((config) => {
      config['id'] ? this.store.dispatch(new DeleteUserSettings(config['id'])) : null;
    });
  }

  configure(dashboardPanelModel: DashboardPanelModel) {
    // this.toggleRightSidenav();
    setTimeout(() => {
      this.sidenavService.setAction(dashboardPanelModel);
      this.sidenavService.toggle();
    }, 100);
  }

  delete(dashboardPanelModel: DashboardPanelModel) {
    try {
      // this.store.dispatch(new DeleteUserSettings(dashboardPanelModel.id));
      if (dashboardPanelModel.modificationRights && dashboardPanelModel.sharedId) {
        this.supplyVisibilityService
          .deleteSharedWidget(dashboardPanelModel.sharedId)
          .subscribe((res) => {
          });
      }
      this.data.splice(
        this.data.findIndex((c) => c.id === dashboardPanelModel.id),
        1
      );
      setTimeout(() => {
        this.saveChanges();
      }, 100);
    } catch (error) {
    }
  }

  async refreshChild(panelSettings: DashboardPanelModel) {
    try {
      if (panelSettings && panelSettings.id) {
        const panel = this.data.find((c) => c.id === panelSettings.id);

        if (panel) {
          Object.assign(panel, panelSettings);
          if (panel.refresh$) {
            panel.refresh$();
          }
        }
      }
      this.saveChanges();
    } catch (e) {
      Helper.printError(e, 'refreshChild');
    }
    //await this.fillUserSettings();
  }

  //#endregion Dashboard Interaction Methods

  //#region catchAction

  private catchChangeDashboardSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(ChangeDashboardSuccess), takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          this.disablePageHeaderControls(false);
          try {
            if (res && res.dashboard) {
              this.allowModification = this.getModificationRights(res.dashboard.id); //this.myDashboardIdList.find(e => e.trim() == res.dashboard.id.trim())
              !this.isDashboardLocked ? this.setGridFreeze(this.allowModification) : null;
              const data = plainToClass(
                DashboardPanelModel,
                JSON.parse(res.dashboard.data) as DashboardPanelModel[]
              );
              if (this.allowModification) {
                this.data = data;
              } else {
                data.forEach((widget) => {
                  //Shared Widgets modificationRights always false
                  if (widget.modificationRights) {
                    //widget.id = null;
                    widget.sharedId = undefined;
                    widget.modificationRights = false;
                  }
                  // else {
                  //Must have a shared widget
                  // }
                });

                const dashboardCache = this.store.selectSnapshot(
                  SupplyVisibilitySharedState.getDashboardCache
                );
                this.data = this.applySharedDashboardCache(data, res.dashboard.id, dashboardCache);
                this.data = Helper.getWidgetAccess(this.userWidgetRights, this.data);

                //this.data = data;
              }
            }
          } catch (e) {
            Helper.printError(e);
          }
          this.setLoading(false);
        }));
  }

  private catchChangeDashboardError() { // TODO:  Debug and find the values, not needed  -- Jaimin  
    // this.subscription.add(
    //   this.actions$
    //     .pipe(ofActionDispatched(ChangeDashboardError), takeUntil(this.ngUnsubscribe))
    //     .subscribe((res) => {
    //       this.disablePageHeaderControls(false);
    //       if (res && res.dashboard) {
    //         this.data = plainToClass(
    //           DashboardPanelModel,
    //           JSON.parse(res.dashboard.data) as DashboardPanelModel[]
    //         );
    //       }
    //       this.setLoading(false);
    //     }));
  }

  private catchAddNewDashboard() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(AddNewDashboard), takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          this.loading = true;
        }));
  }

  private catchAddNewDashboardSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(AddNewDashboardSuccess), takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          this.disablePageHeaderControls(false);

          if (res.dashboard) {
            this.allowModification = true;
            this.pageHeader ? (this.pageHeader.modificationRights = this.allowModification) : false;
            this.store.dispatch(new SetDashboardModificationRights(this.allowModification));

            !this.isDashboardLocked ? this.setGridFreeze(this.allowModification) : null;

            if (res.dashboard.rightForModifying) {
              this.rightForModifyList.push(res.dashboard.id);
            }

            //create widget user-settings
            if (res.dashboard.data) {
              const widgets: DashboardPanelModel[] = plainToClass(
                DashboardPanelModel,
                JSON.parse(res.dashboard.data) as DashboardPanelModel[]
              );
              if (widgets) {
                this.data = widgets;
                this.addSelectedWidget(Helper.createCopy(widgets), true);
              }
            }

            if (res.dashboard.isDefaultForRole) {
              const dashboardInfo = {
                plant: this.currentPlant,
                id: res.dashboard.id
              }
              this.store.dispatch(new SetDefaultDashboardSettings(dashboardInfo, 'defaultDashboardId'));
            }
          }

          this.store.dispatch(new SetDashboardList());
          this.store.dispatch(new SetDefaultDashboard(res.dashboard as SetDefaultDashboardDto));
        }));
  }

  private catchUpdateDashboardInfoSuccess() {
    this.actions$.pipe(ofActionDispatched(UpdateDashboardInfoSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (res && res.data) {
          if (res.data.isDefault) {
            const dashboardInfo = {
              plant: this.currentPlant,
              id: res.data.id
            }
            this.store.dispatch(new SetDefaultDashboardSettings(dashboardInfo, 'defaultDashboardId'));
          } else {
            if (res.data.id == this.defaultDashboardId) {
              const dashboardInfo = {
                plant: this.currentPlant,
                id: null
              }
              this.store.dispatch(new SetDefaultDashboardSettings(dashboardInfo, 'defaultDashboardId'));
            }
          }
        }
      });
  }

  private catchDeleteDashboardSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(DeleteDashboardSuccess), takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          this.disablePageHeaderControls(false);

          if (!res || !res.dashboardList) {
            return;
          }
          const selectedFromList = res.dashboardList.find((e) => e.isPersonal && (e.plant == this.currentPlant || e.plant == ''));

          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '500px',
            data: {
              title: 'Select',
              content: this.translate.instant('style.removeDashboardChoice'),
              button: this.translate.instant('style.removeDashboardPositiveBtn'),
              cancelButton: this.translate.instant('style.removeDashboardNegativeBtn'),
              positiveBtnColor: 'primary',
            },
          });
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
              if (selectedFromList) {
                this.setDashboard(selectedFromList);
              } else {
                this.setDefaultDashboard();
              }
            } else {
              if (selectedFromList) {
                this.setDashboard(selectedFromList);
              } else {
                this.setDefaultDashboard([], 'My New Dashboard');
              }
            }
          });
        }));
  }

  private catchDeleteDashboardError() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(DeleteDashboardError), takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          this.disablePageHeaderControls(false);
        }));
  }

  private catchSetWidgetCache() {
    this.subscription.add(
      this.actions$
        .pipe(ofActionDispatched(SetWidgetCache), takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          if (!data) {
            return;
          }
          if (data.widget.modificationRights) {
            const widget = data.widget;
            const index = this.data.findIndex((c) => c.id === widget.id);
            if (index != -1) {
              this.data[index].panelCache = widget.panelCache;
            }
            const isNotificationRequired = false;
            this.saveChanges(isNotificationRequired);
          } else {
            //Save cache on shared

            const dashboardCache: DashboardCache = {
              dashboardId: this.selectedDashboard.id,
              data: [
                {
                  id: data.widget.id,
                  panelCache: data.widget.panelCache,
                },
              ],
            };
            this.saveDashboardCache(dashboardCache);
          }
        }));
  }

  //#endregion catchAction

  //#region PageHeader Methods

  pageHeaderActionHandler(action: PageHeaderAction) {
    switch (action.actionType) {
      case EnumPageHeaderAction.DashboardLoading:
        this.setLoading(action.actionData);
        break;

      case EnumPageHeaderAction.DashboardAdd:
        //Logic
        this.addEditDashboardDialog('new');
        break;

      case EnumPageHeaderAction.DashboardEdit:
        this.addEditDashboardDialog('edit');
        break;

      case EnumPageHeaderAction.DashboardCopy:
        this.openModificationDialog();
        break;

      case EnumPageHeaderAction.DashboardDelete:
        this.deleteDashboard();
        break;

      case EnumPageHeaderAction.DashboardLock:
        this.setDashboardLock();
        break;

      case EnumPageHeaderAction.DashboardImport:
        this.addEditDashboardDialog('import', action.actionData);
        break;

      default:
        //do not write
        break;
    }
  }

  // Dashboard Toolbar Events Method
  disablePageHeaderControls(state: boolean) {
    if (this.pageHeader) {
      this.pageHeader.disableToolbar = state;
    }
  }

  setLoading(state: any) {
    this.loading = state;
  }

  addEditDashboardDialog(actionType: string, importData?: any) {
    const dialogRef = this.dialog.open(AddEditDashboardFormComponent, {
      width: '400px',
      data: {
        actionType: actionType,
        dashboard: importData ? importData : this.selectedDashboard,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        switch (actionType) {
          case 'new':
            this.disablePageHeaderControls(true);
            const data = plainToClass(
              DashboardPanelModel,
              this.supplyVisibilityService.SVDefaultDashboard
            );
            result.data = JSON.stringify(data);
            this.store.dispatch(new AddNewDashboard(result));
            break;
          case 'edit':
            this.store.dispatch(new UpdateDashboardInfo(result));
            break;
          case 'import':
            result.data = this.supplyVisibilityService.appendUuidForImportWidget(importData);
            this.store.dispatch(new AddNewDashboard(result));
            break;
          default:
            this.notificationService.showError(
              'Something went wrong! please contact administrator'
            );
            break;
        }
      }
    });
  }

  deleteDashboard() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.delete'),
        content: this.translate.instant('style.removeDashboardContent'),
        button: this.translate.instant('style.ok'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.disablePageHeaderControls(true);

        if (this.selectedDashboard && this.selectedDashboard.isDefault && this.selectedDashboard.id == this.defaultDashboardId) {
          const dashboardInfo = {
            plant: this.currentPlant,
            id: null
          }
          this.store.dispatch(new SetDefaultDashboardSettings(dashboardInfo, 'defaultDashboardId'));
        }

        this.store.dispatch(
          new DeleteDashboard(this.selectedDashboard ? this.selectedDashboard : null)
        );
      }
    });
  }

  setDashboardLock() {
    // this.testAuth.refreshTokens();
    const dialogData = this.getDashboardLockDialogData(this.isDashboardLocked);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant(dialogData.title),
        content: this.translate.instant(dialogData.content),
        button: this.translate.instant(dialogData.button),
        cancelButton: this.translate.instant('style.cancel'),
        positiveBtnColor: dialogData.positiveBtnColor,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.isDashboardLocked = !this.isDashboardLocked;
        this.store.dispatch(new SetDashboardLockState(this.isDashboardLocked));
      }
    });
  }

  getDashboardLockDialogData(state: boolean) {
    if (state) {
      return {
        title: 'style.unlockConfirmTitle',
        content: 'style.unlockConfirmContent',
        button: 'style.unlock',
        positiveBtnColor: 'primary',
      };
    } else {
      return {
        title: 'style.lockConfirmTitle',
        content: 'style.lockConfirmContent',
        button: 'style.lock',
        positiveBtnColor: 'primary',
      };
    }
  }

  //#endregion PageHeader Methods
}

