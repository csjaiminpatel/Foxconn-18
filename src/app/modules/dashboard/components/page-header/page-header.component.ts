import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { Actions, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, distinctUntilChanged } from 'rxjs';
import { SupplyVisibilityRights } from '../../../auth/models/auth.model';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { AuthenticationState } from '../../../auth/store/authentication.state';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Helper } from '../../../shared/helper';
import { Forecast } from '../../models/forecast.model';
import { BasicParameters, PageHeaderAction, PnVendorCode, EnumSvSidebarSection, EnumPageHeaderAction } from '../../models/supply-visibility.model';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { VirtualPnGroupsService } from '../../services/Virtual-pn-group/virtual-pn-groups.service';
import { SetDashboardList, ChangeDashboard, UpdateDashboardInfo } from '../../stores/supply-visibility-shared/supply-visibility-shared.actions';
import { SupplyVisibilitySharedState } from '../../stores/supply-visibility-shared/supply-visibility-shared.state';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';
import { AuthService } from '../../../auth/services/auth.service';
import { BaseHeaderComponent } from '../../../shared/components/base-header/base-header.component';
import { PnFlagsComponent } from '../PN-Groups/pn-flags/pn-flags.component';
import { MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../shared-imports';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';



@Component({
  selector: 'orion-platform-page-header',
  standalone: true,
  imports: [...SHARED_IMPORTS,MAT_IMPORTS,MatToolbarModule,RouterModule,MatMenuModule,MatBadgeModule,ProgressSpinnerComponent,ReactiveFormsModule   ],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent extends BaseHeaderComponent {
  public store = inject(Store);
  public supplyVisibilityService = inject(SupplyVisibilityService); 

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() sidenavControls = false;
  @Input() routerLinks?: string;
  @Input() routerTitles?: string;
  @Input() partNumberVendorForReview?: BasicParameters;
  @Input() multiSV?: boolean;
  @Input() selectedForecast:any;
  @Input() isSharedSettingsEnabled:boolean = false;
  @Input() isSidebarOpened : boolean = false;
  @Input() pnFlags:any;
  @Input() userRights?: SupplyVisibilityRights;

  @Output() sideBarVisibility: EventEmitter<any> = new EventEmitter<any>();
  @Output() pageAction: EventEmitter<PageHeaderAction> = new EventEmitter<PageHeaderAction>();
  @Output() resetWidgetBehavior: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;
  @ViewChild('MatMenuTrigger', { static: false }) matMenuTrigger?: MatMenuTrigger;

  isDashboardLocked$: Observable<boolean> = this.store.select(SupplyVisibilitySharedState.getDashboardLockState);

  dashboardList$: Observable<any> = this.store.select(SupplyVisibilitySharedState.getDashboardList);

  defaultDashboard$: Observable<any> = this.store.select(SupplyVisibilitySharedState.getDefaultDashboard);
  
  userAction$: Observable<any> = this.store.select(SupplyVisibilityState.getUserAction);


  isDashboardLocked = true;
  cachedPnVc?: PnVendorCode;
  isBuyerHovered?:boolean;
  isCustomerHovered?:boolean;
  isSupplierHovered?:boolean;
  private ngUnsubscribe = new Subject();

  selectedDashboard: any;
  dashboardList: any = [];
  modificationRights = false;
  selectDashboard = new FormControl();
  disableToolbar = false;
  baseModule: string = Helper.SV_MODULE;
  isFlagLoaded: boolean = false;
  forecast: Forecast = {
    plant: '',
    partNumber: '',
    vendorCode: '',
    materialManagementViewID: '',
    weeks: 26,
    days: 1,
    reviewed: {
      partNumber: '',
      vendorCode: '',
      validity: 0,
      dateCreated: '',
    },
    staticvalues: [],
    projectionDetails: [],
  };
  dashboardRights: boolean = true;
  daysCountToMonday = 0;
  reviewButtonClass = '';
  breadcrumbs: any[] = [];
  multiSVFlag: any = [];
  additionalFlags: any = [];

  showBreadcrumbs = false;
  isMenuOpen = false;

  enumSvSidebarSection = EnumSvSidebarSection;
  private lastAction?: EnumSvSidebarSection;
  REVIEW_CUSTOMER_FLAG?: string;
  REVIEW_BUYER_FLAG?: string;
  REVIEW_SUPPLIER_FLAG?: string;
  sideNavOpen: boolean = false;


  private authService = inject(AuthService);
  constructor(
    public override actions$: Actions,
    public override translate: TranslateService,
    public override dialog: MatDialog,
    public override vpnsService: VirtualPnGroupsService,
    public override notificationService: NotificationService,

  ) {
    super(actions$, notificationService, dialog, vpnsService, translate);
  }

  override async ngOnInit() {
    this.REVIEW_CUSTOMER_FLAG = Helper.REVIEW_CUSTOMER_FLAG;
    this.REVIEW_BUYER_FLAG = Helper.REVIEW_BUYER_FLAG;
    this.REVIEW_SUPPLIER_FLAG = Helper.REVIEW_SUPPLIER_FLAG;
    this.breadcrumbs = this.createBreadCrumbs();
    this.vpnsService
      .getFlagOperation()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isFlagLoaded) => {
        if (isFlagLoaded) {
          this.getFlags();
        }
      });
    this.setDaysCountToMonday();
    if (this.isSharedSettingsEnabled) {
      this.initShareSettings();
    }

    this.userAction$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      this.lastAction = res;
    });

    this.setCachedPnVc(this.partNumberVendorForReview);
    // this.store.dispatch(new CacheReadOnlyFields());
    // this.catchTriggerLinkEventCommitDialog();

    if (this.multiSV) {
      //Method definition in base class
      this.catchSetMarkedPnFlagsSuccess();
      this.catchSetMarkedPnFlagsError();
      this.catchDeletePnFlagsSuccess();
      this.getFlags();
    }
    this.dashboardRights = false;
    const groupNames: string[] = await this.authService.getGroupNames();
    let isElementPresent = Helper.fullAccessRoles.some(searchString => groupNames.includes(searchString));
    if (isElementPresent) {
      this.dashboardRights = true;
    }

    this.userRights = this.store.selectSnapshot(AuthenticationState.supplyVisibilityModuleRights);

    /*TBD should be loaded from global helper.ts settings*/
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  /**
   * Sidenav toogle by sidenav service
   * @memberof PageHeaderComponent
   */

  createBreadCrumbs() {
    let routerLinks:any[] = [];
    let routerTitles:any[] = [];
    if (this.routerLinks && this.routerLinks.trim() !== '') {
      routerLinks = this.routerLinks.split('|');
    }
    if (this.routerTitles && this.routerTitles.trim() !== '') {
      routerTitles = this.routerTitles.split('|');
    }

    const breadcrumbs = [];

    if (routerLinks.length > 0 && routerTitles.length == routerLinks.length) {
      for (let i = 0; i < routerLinks.length; i++) {
        breadcrumbs.push({
          routerLink: routerLinks[i],
          routerTitle: routerTitles[i],
        });
      }
      this.showBreadcrumbs = true;
    }
    return breadcrumbs;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['sidenavControls'] !== null &&
      changes['sidenavControls'] !== undefined &&
      changes['sidenavControls'].currentValue === false
    ) {
      this.sideNavOpen = false;
    }
    if (changes['partNumberVendorForReview'] && changes['partNumberVendorForReview'].currentValue) {
      this.partNumberVendorForReview = changes['partNumberVendorForReview'].currentValue;
      //NOTE Caching Part Number and Vendor code for review flags
      this.setCachedPnVc(this.partNumberVendorForReview);
      this.getFlags();
    }

    if (
      changes['selectedForecast'] &&
      changes['partNumberVendorForReview'] &&
      changes['partNumberVendorForReview'].currentValue
    ) {
      const retrievedForecastData = changes['selectedForecast'].currentValue;

      if (retrievedForecastData) {
        if (retrievedForecastData.isLoaded === true) {
          this.forecast = retrievedForecastData.forecast;
        } else if (
          retrievedForecastData.isLoaded === false &&
          retrievedForecastData.loadingFailed === false
        ) {
          this.retrieveForecast();
        }
      } else {
        /* must be loading forecast */
      }
    } else {
      this.partNumberVendorForReview = undefined;
    }
  }

  retrieveForecast() {
    if (this.partNumberVendorForReview) {
      this.supplyVisibilityService
        .getForecast(this.partNumberVendorForReview)
        .subscribe((res) => {
          this.forecast = res;
        });
    }
  }

  /**
   * Counts number of days to next monday for Set PN as reviewed function
   * @returns
   * @memberof SupplyVisibilityComponent
   */
  setDaysCountToMonday() {
    const t = new Date();
    this.daysCountToMonday = 7 - t.getDay() + 1;
  }

  /**
   * Set PN as reviewed
   * @memberof SupplyVisibilityComponent
   */
  // setMarkPnReviewed(daysCount: number) {
  //   const pnReviewed: any = {
  //     partNumber: this.partNumberVendorForReview.partNumber,
  //     validity: String(daysCount),
  //     vendorCode: this.partNumberVendorForReview.vendorCode
  //   }

  //   this.supplyVisibilityService.setPnReviewed(pnReviewed)
  //     .subscribe(res => {
  //       if (res.validity || res.validity == 0) {
  //         this.forecast.reviewed = res;
  //       }
  //     });
  // }
  // /**
  //  * Call setMarkPnReviewed from parent component
  //  * @param numberOfDays number
  //  */
  // setReviewed(numberOfDays) {
  //   this.setMarkPnReviewed(numberOfDays);
  // }

  //#region Dashboard Toolbar
  
  async initShareSettings() {
    this.store.dispatch(new SetDashboardList());

    this.isDashboardLocked$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      this.isDashboardLocked = res;
    });
    this.dashboardList$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (res) => {
      res = res && res.length ? Helper.createCopy(res) : res;

      const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);

      const sharedDashboards = res.filter((e:any) => {
        return (!e.isPersonal && (e.plant == plant || e.plant == ''));
      });

      let isAnalyst: boolean = false;
      const groupNames: string[] = await this.authService.getGroupNames();
      isAnalyst = groupNames.includes('Orion_SCM_Analyst') || groupNames.includes('Orion_Administrator');

      let myDashboards: any = null

      if (!isAnalyst)
      {
        //NOTE - Remove the code after some time
        //start
        res.forEach((dashboard : any) => {
          if (dashboard.isPersonal && dashboard.name === 'My Dashboard') {
            this.supplyVisibilityService.deleteDashboard(dashboard.id).toPromise().catch((error) => {
              this.notificationService.showError(error);
            });
          }
        });
        //end

        myDashboards = res.filter((e :any) => {
          return (e.isPersonal && (e.plant == plant || e.plant == '') && e.name !== 'My Dashboard');
        });
      }
      else
      {
        myDashboards = res.filter((e:any) => {
        return (e.isPersonal && (e.plant == plant || e.plant == ''));
      });
      }

      this.dashboardList = [
        { name: 'My dashboards', type: 'self', data: myDashboards },
        {
          name: 'Shared dashboards',
          type: 'shared',
          data: this.getSharedDashboardsWithUsers(sharedDashboards),
        },
      ];
    });

    this.defaultDashboard$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      if (res) {
        this.selectedDashboard = res;
        this.selectDashboard.setValue(this.selectedDashboard?.id, {
          emitEvent: false,
        });
      }
    });

    this.setControlSub();
  }
  getSharedDashboardsWithUsers(sharedDashboards: any[]): any[] {
    let usersList: string[] = [];
    const sharedDashboardsWithUsers:any[] = [];
    const primarySid = this.store.selectSnapshot(AuthenticationState.primarySid);

    sharedDashboards.forEach(async (dashboard) => {
      const data = dashboard.name.split('~');
      if (data.length > 1) {
        dashboard['creator'] = data[data.length - 1];
        usersList.push(data[data.length - 1]);
      }
      else if (dashboard.createdBy == primarySid) {
        dashboard['creator'] = this.authService.getUserName();
        usersList.push(await this.authService.getUserName());
      }
      else {
        dashboard['creator'] = 'others';
      }
      dashboard.name = data[0];
    });

    usersList = Helper.removeDuplicate(usersList);
    usersList.push('others');

    usersList.forEach((userName) => {
      const dashboardList = sharedDashboards.filter((e) => e.creator == userName);
      sharedDashboardsWithUsers.push({
        userName: userName,
        sharedDashboards: dashboardList,
      });
    });

    return sharedDashboardsWithUsers;
  }
  setControlSub() {
    this.selectDashboard.valueChanges.pipe(distinctUntilChanged()).subscribe((id) => {
      if (id) {
        this.resetWidgetBehavior.emit(true);

        this.authService.invokeCancellationToken();
        this.pageAction.emit({
          actionType: EnumPageHeaderAction.DashboardLoading,
          actionData: true,
        });
        this.store.dispatch(new ChangeDashboard(id));
        this.disableToolbar = true;
      }
    });
  }

  shareDashboard() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.shareWidgetTitle'),
        content: this.translate.instant('style.shareDashboardContent'),
        button: this.translate.instant('style.ok'),
        cancelButton: this.translate.instant('style.cancel'),
        positiveBtnColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const payload = {
          Name: this.selectedDashboard.name,
          SecurityLevel: 'public',
        };
        this.store.dispatch(new UpdateDashboardInfo(payload));
      }
    });
  }

  //#region Dashboard Toolbar Events
  copyDashboard() {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardCopy,
      actionData: null,
    });
  }

  dashboardDelete() {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardDelete,
      actionData: null,
    });
  }

  dashboardEdit() {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardEdit,
      actionData: null,
    });
  }
  dashboardAdd() {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardAdd,
      actionData: null,
    });
  }

  dashboardLock() {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardLock,
      actionData: null,
    });
  }

  dashboardImport(importData: any) {
    this.pageAction.emit({
      actionType: EnumPageHeaderAction.DashboardImport,
      actionData: importData,
    })
  }

  //#endregion Dashboard Toolbar Events

  setReviewed(reviewFlag :any, isFlagAvailable?: boolean, isEditAvailable?: boolean) {
    if (isEditAvailable) {
      const vendorCode = this.cachedPnVc?.vendorCode
        ? this.cachedPnVc.vendorCode.toLowerCase()
        : this.cachedPnVc?.vendorCode;
      if (vendorCode == 'virtualvc') {
        this.openConfirmationDialog(reviewFlag, this.cachedPnVc?.partNumber, isFlagAvailable);
      } else {
        this.setMarkPnReviewed(reviewFlag, null, isFlagAvailable);
      }
    }
  }

  override async setMarkPnReviewed(reviewFlag : any, pnVcChild?: any, isFlagAvailable?: any) {
    this.isFlagLoaded = false;
    let selectedPnVc;
    if (pnVcChild) {
      if (pnVcChild.totalPnList && pnVcChild.totalPnList > 1) {
        this.isFlagLoaded = true;
      }
      selectedPnVc = {
        partNumber: pnVcChild.partNumber,
        vendorCode: pnVcChild.vendorCode,
      };
    } else {
      selectedPnVc = {
        partNumber: this.cachedPnVc?.partNumber,
        vendorCode: this.cachedPnVc?.vendorCode,
      };
      this.childrenFlags.clear();
    }
    this.supplyVisibilityService.setMarkPnReviewed(reviewFlag, selectedPnVc, isFlagAvailable)
  }

  toggleSidebar() {
    this.sideNavOpen = !this.sideNavOpen;
    if (this.isSidebarOpened) {
      this.sideNavOpen = false;
    }
    const sideNavPayload = {
      action: 'sideNav',
      result: this.sideNavOpen,
      sidebarSection: this.lastAction,
    };
    this.sideBarVisibility.emit(sideNavPayload);
  }

  setCachedPnVc(pnVc: any) {
    if (!pnVc) {
      return;
    }
    this.cachedPnVc = {
      partNumber: pnVc.partNumber,
      vendorCode: pnVc.vendorCode,
    };
  }
  get currentPnVc() {
    return this.cachedPnVc ? `${this.cachedPnVc.partNumber}${this.cachedPnVc.vendorCode}` : null;
  }

  //#endregion Dashboard Toolbar
  // catchTriggerLinkEventCommitDialog() {
  //   this.actions$
  //     .pipe(ofActionDispatched(TriggerLinkEventCommitDialog), takeUntil(this.ngUnsubscribe))
  //     .subscribe(({event}) => {
  //       const dialogRef = this.dialog.open(CommitDialogFormComponent, {
  //         width: '80%',
  //         data: {
  //           new: false,
  //           commit: event.eventValue,
  //           enableDraft: false,
  //           enableDummyHeader: false,
  //           actionType: 'edit',
  //           showPartNumber: true,
  //           isCommitModule: true,
  //           isLinkEvent: true,
  //         },
  //       });
  //       dialogRef.afterClosed().subscribe((response) => {
  //         if (response) {
  //           this.store.dispatch(
  //             new SetBasicParameters({
  //               plant: null,
  //               partNumber: null,
  //               vendorCode: null,
  //             })
  //           );
  //         }
  //       });
  //     });
  // }

  async getFlags() {
    this.isFlagLoaded = false;
    if (this.cachedPnVc) {
      const payload: PnVendorCode = {
        partNumber: this.cachedPnVc.partNumber,
        vendorCode: this.cachedPnVc.vendorCode
      }
      let res: any = await this.supplyVisibilityService.getPnFlags([payload]).toPromise().catch(
        (error) => res = null
      )
      if (res) {
        this.isFlagLoaded = true;
        const foundObject = res.find((item:any) => item.partNumber === this.cachedPnVc?.partNumber && item.vendorCode === this.cachedPnVc?.vendorCode);

        if (foundObject) {
          this.multiSVFlag = foundObject;
        }
        else {
          this.multiSVFlag = payload;
        }

        this.getFilteredData();
      }
    }
  }

  getFilteredData() {
    this.additionalFlags = {
      ...this.multiSVFlag,
      flags: this.filteredFlags()
    };
  }

  filteredFlags() {
    if (this.multiSVFlag && this.multiSVFlag.flags) {
      const reviewKeywords = ['ReviewByBuyer', 'ReviewByCustomer', 'ReviewBySupplier'];
      return this.multiSVFlag.flags.filter((flag:any) => !reviewKeywords.includes(flag));
    }
  }


  openPnVcFlags(pnData: any, key: any) {
    const dialogRef = this.dialog.open(PnFlagsComponent, {
      width: '60%',
      data: {
        pnData: pnData,
        key: key,
        module: this.baseModule
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // do something
    })
  }

  exportDashboard() {
    const DASHBOARD_EXTENSION = '.dashboard';
    const exportData = this.selectedDashboard;
    const jsonArray = JSON.parse(exportData.data);
    jsonArray.forEach((obj: any) => {
      if (obj.id) {
        obj.id = obj.id.split('-')[0];
      }
    });
    exportData.data = JSON.stringify(jsonArray);
    const dashboardData = JSON.stringify(exportData);
    const blob = new Blob([dashboardData], { type: 'application/json' });
    const tildeIndex = exportData.name.indexOf('~');
    const fileSaveName = tildeIndex !== -1 ? exportData.name.substring(0, tildeIndex) : exportData.name;
    FileSaver.saveAs(blob, fileSaveName + DASHBOARD_EXTENSION);
  }

  importDashboard() {
    this.fileInput?.nativeElement.click();
  }

  handleFileInput(event: any) {
    const selectedFile = event.target.files[0];
    event.target.value = null; // Reset the value of the file input so that we can select the same file again
    if (selectedFile) {
      this.readFileContents(selectedFile);
    }
  }

  private readFileContents(file: File) {
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = (e: any) => {
      const fileContents = e.target.result as string;
      const jsonData = this.parseJsonData(fileContents);
      this.dashboardImport(jsonData);
    }

  }

  private parseJsonData(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return null;
    }
  }

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
