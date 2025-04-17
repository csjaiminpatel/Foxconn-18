import { Component, DestroyRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PanelComponent } from '../../panel/panel.component';
import { ForecastComponent } from '../../forecast/forecast.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Observable, Subscription, Subject, map, takeUntil, take } from 'rxjs';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { SetActivePlant } from '../../../../auth/store/authentication.actions';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Helper } from '../../../../shared/helper';
import { Forecast } from '../../../models/forecast.model';
import { MaterialManagementViews } from '../../../models/material-management-views.model';
import { PanelDescription } from '../../../models/panelDto';
import { DummyCommitHeader, BasicParameters, DateRangeParameters, DummyCommitHeadersFilter, PnReviewed } from '../../../models/supply-visibility.model';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { VirtualPnGroupsService } from '../../../services/Virtual-pn-group/virtual-pn-groups.service';
import { SetAVLDetail, ResetAVL } from '../../../stores/approved-vendor-list/approved-vendor-list.actions';
import { SetBasicParameters, SetMaterialManagementViews, SetCommitModuleOn, GetDummyCommitHeaders, ResetSupplyVisibilityAndCommits, SetCommitWithDummySuccess, CacheCommitsWithDummy, SetForecastSuccess, CacheForecast, SetForecastError, AddDummyCommitHeaderError, SetPnReviewed, SetActiveVendor, UpdateDummyCommitHeader, AddDummyCommitHeader, DeleteDummyCommitHeader, SetDummyCommitHeader, SetVendorCodes } from '../../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../../stores/supply-visibility/supply-visibility.state';
import { SupplyVisibilitySidenavService } from '../../../services/Supply-Visibility-Sidenav/supply-visibility-sidenav.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateRangeDialogComponent } from '../../date-range-dialog/date-range-dialog.component';
import { DummyCommitHeadersDialogComponent } from '../../dummy-commit-headers-dialog/dummy-commit-headers-dialog.component';
import { CommitDialogFormComponent } from '../../commit-dialog-form/commit-dialog-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'orion-platform-single-pn-excel-export',
  standalone: true,
  imports: [ProgressSpinnerComponent,TranslateModule,PanelComponent,ForecastComponent,CommonModule],
  templateUrl: './single-pn-excel-export.component.html',
  styleUrl: './single-pn-excel-export.component.scss'
})
export class SinglePnExcelExportComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
  
    
  @ViewChild('supplysidenav', {static: true}) public sidenav?: MatSidenav;
  @Select(SupplyVisibilityState.getDummyCommitsHeaders)
  dummyCommitHeaders$?: Observable<DummyCommitHeader[]>;
  @Select(SupplyVisibilityState.getSelectedDummyCommitsHeader)
  selectedDummyCommitHeader$?: Observable<DummyCommitHeader>;
  allLoaded = false;
  // @Select(ApprovedVendorListState.getApprovedVendorDetail)
  // approvedVendorDetail$: Observable<ApprovedVendorDetail>;

  DEFAULT_VIEW = '5ddbb80c26c15c16b843c5fa';

  subscription: Subscription = new Subscription();

  basicParameters?: BasicParameters;
  partNumber = '';
  description?: PanelDescription;
  toggleActive = false;
  opened?: boolean;
  loading = true;
  queryParametersForChart :any;
  selectedView = '';
  selectedDummyCommitHeader?:any;
  forecast?: Forecast;
  dummyCommitHeaders: DummyCommitHeader[] = [];
  daysCountToMonday = 0;
  chartDataAvailable = false;
  hideVendor = false;

  partNumbersList:any[] = [];
  currentPartNumber = 0;
  nextPartNumber = '';
  previousPartNumber:string = '';
  validCombination = true;
  validQuota = true;
  private ngUnsubscribe?: Subject<any>;

  @Select(SupplyVisibilityState.getMaterialManagementViews)
  mmViews$?: Observable<MaterialManagementViews[]>;
  @Select(SupplyVisibilityState.getForecast)
  forecast$?: Observable<Forecast>;

  @Select(SupplyVisibilityState.getUserAction) userAction$?: Observable<string>;
  @Select(SupplyVisibilityState.getDaterangeParameters)
  daterangeParameters$?: Observable<DateRangeParameters>;
  @Select(AuthenticationState.activePlant) activePlant$?: Observable<any>;
  activePlant: any;

  // @Select(SupplyVisibilityState.getPartNumberListParameters) selectedPartNumberList$: Observable<BasicParameters[]>;
  selectedPartNumberList$?: Observable<BasicParameters[]>;
  dialogData: any;
  loadingText?: string;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<SinglePnExcelExportComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any,
    private dialog: MatDialog,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private sidenavService: SupplyVisibilitySidenavService,
    private supplyVisibilityService: SupplyVisibilityService,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private vpnsService: VirtualPnGroupsService,
    private notificationService: NotificationService
  ) {
    this.dialogData = incomingData;
    this.setBasicParameters();
  }

  ngOnInit() {
    this.ngUnsubscribe = new Subject();
    this.setDaysCountToMonday();
    this.sidenavService.setSidenav(this.sidenav);
    this.selectedPartNumberList$ = this.store
      .select(SupplyVisibilityState.getPartNumberListParameters)
      .pipe(map((filterFn) => filterFn(this.basicParameters?.widgetId ?? '')));
    this.setReceivedPns();
    this.description = {label: '', value: 0};
    this.setCommitHistoryDate();
    if(this.basicParameters){
    this.store.dispatch(new SetBasicParameters(this.basicParameters));}
    //this.store.dispatch(new SetForecast());
    this.store.dispatch(new SetAVLDetail());
    this.store.dispatch(new SetMaterialManagementViews());
    this.store.dispatch(new SetCommitModuleOn(false)).subscribe(() => {});

    this.subscription.add(
      this.dummyCommitHeaders$?.subscribe((response: DummyCommitHeader[]) => {
        this.dummyCommitHeaders = response;
      })
    );
    this.subscription.add(
      this.selectedDummyCommitHeader$?.subscribe((response: DummyCommitHeader) => {
        this.selectedDummyCommitHeader = response;
      })
    );
    this.activePlant$?.subscribe((activePlant: any) => {
      this.activePlant = activePlant;
    });

    const dummyCommitHeadersFilter: DummyCommitHeadersFilter = {
      partNumber: this.basicParameters?.partNumber,
      vendorCode: this.basicParameters?.vendorCode,
    };
    this.isValidQuota(this.basicParameters?.partNumber, this.basicParameters?.vendorCode);
    //if turned on, it forces SV to reload several times
    //TODO fix somehow
    this.store.dispatch(new GetDummyCommitHeaders(dummyCommitHeadersFilter));
    this.catchSetForecastError();
    this.catchSetForecastSuccess();
    this.catchAddDummyCommitHeaderError();
    this.catchSetCommitsWithDummySuccess();

    this.loadingText = this.basicParameters?.partNumber + '|' + this.basicParameters?.vendorCode;
  }
  ngOnDestroy() {
    //this.store.dispatch(new ResetBufferRules());
    this.store.dispatch(new ResetSupplyVisibilityAndCommits());
    // this.store.dispatch(new ResetSupplyVisibilityPartNumberList());
    this.store.dispatch(new ResetAVL());
    this.unSubscribe();
  }
  unSubscribe() {
    if (this.ngUnsubscribe) {
      this.ngUnsubscribe.next(undefined);
      this.ngUnsubscribe.complete();
    }
    if (this.selectedPartNumberList$) {
      delete this.selectedPartNumberList$;
    }
  }
  setBasicParameters() {
    const self = this;
    this.queryParametersForChart = this.dialogData.params;

    if (this.queryParametersForChart.plant) {
      self.basicParameters = {
        plant: this.queryParametersForChart.plant,
        partNumber: this.queryParametersForChart.partNumber,
        vendorCode: this.queryParametersForChart.vendorCode,
        weeks: this.queryParametersForChart.weeks,
        currentPartNumber: this.currentPartNumber,
        widgetId: this.queryParametersForChart.widgetId,
        mmViewID: this.queryParametersForChart.materialManagementViewID,
      };

      self.store.dispatch(new SetBasicParameters(self.basicParameters));
      self.store
        .dispatch(new SetActivePlant(this.queryParametersForChart.plant))
        .subscribe(() => {});

      self.mmViews$?.subscribe((res) => {
        const mmView = res.find((view) => view.id === self.basicParameters?.mmViewID);
        self.selectedView = mmView ? mmView.configurationName : (self.basicParameters?.mmViewID || '');
      });
      self.forecast$?.subscribe((res) => {
        self.forecast = res;
      });
    }
  }
  /**
   * Catch Set Dummy Commits
   * @memberof CommitHistoryComponent
   */
  catchSetCommitsWithDummySuccess() {
    this.actions$
      .pipe(ofActionDispatched(SetCommitWithDummySuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (
          this.nextPartNumber !== null &&
          this.nextPartNumber !== undefined &&
          this.nextPartNumber !== ''
        ) {
          this.store.dispatch(new CacheCommitsWithDummy(this.nextPartNumber));
        }
      });
  }
  catchSetForecastSuccess() {
    this.actions$
      .pipe(ofActionDispatched(SetForecastSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.nextPartNumber !== null && this.nextPartNumber !== undefined) {
          this.store.dispatch(new CacheForecast(this.nextPartNumber));
        }
        this.loading = false;
      });
  }
  catchSetForecastError() {
    this.actions$
      .pipe(ofActionDispatched(SetForecastError), takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.loading = false;
        this.showError(error, 'Set forecast state error');
      });
  }
  catchAddDummyCommitHeaderError() {
    this.actions$
      .pipe(ofActionDispatched(AddDummyCommitHeaderError), takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        this.notificationService.showError(
          this.translate.instant('supply-visibility.addDummyCommitHeaderError')
        );
      });
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
   * Right sidenav toogle
   * @memberof SupplyVisibilityComponent
   */
  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenavService.toggle();
  }

  /**
   * Set PN as reviewed
   * @memberof SupplyVisibilityComponent
   */
  setMarkPnReviewed(flags: string) {
    const pnReviewed: PnReviewed = {
      partNumber: this.basicParameters ? this.basicParameters.partNumber : '',
      flag: flags,
      vendorCode: (this.basicParameters && this.basicParameters.vendorCode) ? this.basicParameters.vendorCode : '',
    };
    this.store.dispatch(new SetPnReviewed(pnReviewed));
  }

  /**
   * Set Active Vendor
   * @param {string} vendor
   * @memberof SupplyVisibilityComponent
   */
  setActiveVendor(vendorCode: string) {
    this.store.dispatch(new SetActiveVendor(vendorCode));
    const {plant, partNumber, weeks, mmViewID, widgetId} = this.basicParameters || {};

    this.router.navigate([`/material-management/supply-visibility`], {
      queryParams: {
        plant: plant,
        vendorCode: vendorCode,
        partNumber: partNumber,
        weeks: weeks,
        materialManagementViewID: mmViewID,
        currentPartNumber: this.currentPartNumber,
        widgetId: widgetId,
        mmViewID: mmViewID,
      },
    });
    if(this.basicParameters)
    this.store.dispatch(new SetBasicParameters(this.basicParameters));
  }

  /**
   * Open new Commit Dialog
   * @memberof SupplyVisibilityComponent
   */
  openCommitNewDialog() {
    const dialogRef = this.dialog.open(CommitDialogFormComponent, {
      width: '80%',
      data: {
        actionType: 'new',
        enableDraft: true,
        enableDummyHeader: true,
        isCommitModule: false,
      },
    });
  }

  /**
   * Open Setting Date Range Dialog
   * @memberof SupplyVisibilityComponent
   */
  openDateRangeDialog() {
    const dialogRef = this.dialog.open(DateRangeDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const dateFrom = result.dateFrom;
        const dateTo = result.dateTo;
        this.supplyVisibilityService.setDateRange({
          dateFrom,
          dateTo,
        });
      }
    });
  }
  setCommitHistoryDate() {
    const dateRange = Helper.getCommitHistoryDateRange();
    this.supplyVisibilityService.setDateRange(dateRange);
  }
  /**
   * Open Dummy Commit Headers Dialog
   * @param {string} actionType new|edit
   * @memberof SupplyVisibilityComponent
   */
  openDummyCommitHeadersDialog(actionType: string) {
    const dialogRef = this.dialog.open(DummyCommitHeadersDialogComponent, {
      width: '600px',
      data: {
        actionType: actionType,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const {vendorCode, partNumber} = this.basicParameters || {};
        const selectedDummyCommitHeader = {
          vendorCode: vendorCode,
          partNumber: partNumber,
          ...result.editedDummyCommitHeader,
        };
        const dummyCommitHeadersFilter: DummyCommitHeadersFilter = {
          partNumber: partNumber,
          vendorCode: vendorCode,
        };

        if (actionType === 'edit') {
          this.store.dispatch(
            new UpdateDummyCommitHeader(selectedDummyCommitHeader, dummyCommitHeadersFilter)
          );
        } else {
          this.store.dispatch(
            new AddDummyCommitHeader(selectedDummyCommitHeader, dummyCommitHeadersFilter)
          );
        }
      }
    });
  }

  deleteDummyCommitHeader(selectedDummyCommitHeader :any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('style.confirmDeleteTitle'),
        content: this.translate.instant('supply-visibility.confirmDeleteHeader', {
          headerName: selectedDummyCommitHeader.name,
        }),
        button: this.translate.instant('style.delete'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const {vendorCode, partNumber} = this.basicParameters || {};
        const dummyCommitHeadersFilter: DummyCommitHeadersFilter = {
          partNumber: partNumber,
          vendorCode: vendorCode,
        };
        this.store.dispatch(
          new DeleteDummyCommitHeader(selectedDummyCommitHeader, dummyCommitHeadersFilter)
        );
      }
    });
  }

  setActiveView(data: any) {
    if(this.basicParameters){
    this.basicParameters.mmViewID = data;}
    const {plant, vendorCode, partNumber, weeks} = this.basicParameters || {};

    this.router.navigate([`/material-management/supply-visibility`], {
      queryParams: {
        plant: plant,
        vendorCode: vendorCode,
        partNumber: partNumber,
        weeks: weeks,
        materialManagementViewID: data,
      },
    });
    if(this.basicParameters){
    this.store.dispatch(new SetBasicParameters(this.basicParameters));}
  }

  setSelectedDummyCommitHeader(event: any) {
    const value = event.source.value === undefined ? null : event.source.value;
    this.selectedDummyCommitHeader = value;

    if (event.isUserInput) {
      this.store.dispatch(new SetDummyCommitHeader(value));
    }
  }

  compareDummyHeaders(o1: any, o2: any): boolean {
    return o1 && o2 && o1.name === o2.name && o1.id === o2.id;
  }

  setAvailableDataForCharts(availableData :any) {
    this.chartDataAvailable = true;
  }

  get showSupplyVisibilityFunc() {
    return this.showSupplyVisibility.bind(this);
  }

  get setMarkPnReviewedFunc() {
    return this.setMarkPnReviewed.bind(this);
  }

  showSupplyVisibility(moveTo: number) {
    this.loading = true;
    this.setPrevNextButtons(moveTo);
    const newPartNumber = this.partNumbersList[this.currentPartNumber];
    if(this.basicParameters){
    this.basicParameters.currentPartNumber = this.currentPartNumber;
    this.basicParameters.vendorCode = newPartNumber.vendorCode;
    this.basicParameters.partNumber = newPartNumber.partNumber;
    this.basicParameters.mmViewID = newPartNumber.mmViewID;
    this.basicParameters.plant = newPartNumber.plant;
}
    // added to update navigation on go to diff part
    this.router.navigate([`/material-management/supply-visibility`], {
      queryParams: {
        plant: this.basicParameters?.plant,
        vendorCode: this.basicParameters?.vendorCode,
        partNumber: this.basicParameters?.partNumber,
        weeks: this.basicParameters?.weeks ? this.basicParameters.weeks : 26,
        materialManagementViewID: this.basicParameters?.mmViewID,
        currentPartNumber: moveTo,
        widgetId: this.basicParameters?.widgetId,
      },
    });
  }

  setPrevNextButtons(pnIndex:number) {
    this.currentPartNumber = pnIndex;
    if (pnIndex > 0) {
      this.previousPartNumber = this.partNumbersList[pnIndex - 1];
    } else {
      this.previousPartNumber = '';
    }
    if (this.partNumbersList.length > pnIndex) {
      this.nextPartNumber = this.partNumbersList[pnIndex + 1];
    } else {
      this.nextPartNumber = '';
    }
  }

  async setReceivedPnsFromVC(partNumber:any) {
    const tmpPnList = await this.vpnsService.getPartNumbersListForSV(partNumber);
    if (tmpPnList) {
      tmpPnList.unshift({partNumber: partNumber, vendorCode: 'VirtualVC'});
      this.hideVendor = true;
      this.partNumbersList = tmpPnList;
      this.currentPartNumber = 0;
      if (this.partNumbersList.length - 1 > this.currentPartNumber) {
        this.nextPartNumber = this.partNumbersList[this.currentPartNumber + 1];
      }
    }
  }

  setReceivedPns() {
    const self = this;
    const counterTemp = 0;

    this.selectedPartNumberList$?.pipe(take(1)).subscribe((partNumbersList) => {
      self.partNumbersList = partNumbersList;
      const pnList = partNumbersList.map((c) => c.partNumber);
      try {
        const currentPn = pnList[this.currentPartNumber];
        if (pnList && pnList.length > 0) {
          this.store.dispatch(new SetVendorCodes([currentPn]));
        }
      } catch (error) {
        console.log(error);
      }
      if (partNumbersList) {
        self.setPrevNextButtons(self.currentPartNumber);
      }
    });
  }

  isValidCombination(partNumber:any, vendorCode:any) {
    const partNumberDetail = this.supplyVisibilityService
      .getValidCombination(partNumber, vendorCode)
      .subscribe((res) => {
        if (res.isValidCombination) {
          this.validCombination = res.isValidCombination;
        }
      });
  }

  isValidQuota(partNumber?:string, vendorCode?:string) {
    if (vendorCode !== undefined && vendorCode.trim() !== 'VirtualVC' && vendorCode.trim() !== '') {
      const partNumberDetail = this.supplyVisibilityService
        .getValidCombination(partNumber, vendorCode)
        .subscribe((res) => {
          this.validQuota = res.isValidQuota ? res.isValidQuota : false;
        });
    }
  }
  showError(error: any, msg: string) {
    let message = error.message ? error.message : msg;
    if (error.detail) {
      message = error.detail;
    }
    this.notificationService.showError(
      this.translate.instant('supply-visibility.addDummyCommitHeaderError')
    );
  }
  resultHandler(e:any) {
    if (e.state) {
      this.notificationService.showMessage(e.Msg);
    } else {
      this.notificationService.showError(e.Msg);
    }
    setTimeout(() => {
      this.dialogRef.close();
      this.allLoaded = true;
    }, 500);
  }
}

