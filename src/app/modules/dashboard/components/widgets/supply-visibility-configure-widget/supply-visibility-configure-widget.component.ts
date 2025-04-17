import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Helper } from '../../../../shared/helper';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Actions, Store } from '@ngxs/store';
import { Subscription, Observable, Subject, takeUntil, startWith, map, distinctUntilChanged, debounceTime, firstValueFrom } from 'rxjs';
import { ConfigurationRights } from '../../../../auth/models/auth.model';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { SidenavService } from '../../../../shared/services/sidenav.service';
import { MaterialManagementViews } from '../../../models/material-management-views.model';
import { SharedWidget } from '../../../models/shared-sv.model';
import { UserSettingsCls, KeyValuePair, KeyTypePair, EnumPartNoFilters, EnumControls } from '../../../models/supply-visibility.model';
import { DashboardPanelModel, AdditionalFilter } from '../../../models/sv-dashboard';
import { CommitsService } from '../../../services/Commits/commits.service';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { DeleteUserSettings, CacheCommitsCarriers } from '../../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../../stores/supply-visibility/supply-visibility.state';
import { Carriers } from '../../../models/commits.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { FileUploadWidgetService } from '../../../services/File-Upload-Widget/file-upload-widget.service';
import { FinancialModuleService } from '../../../services/Financial-Module/financial-module.service';
import { FormatStyle$ } from '../../../models/calculation-line-conditional-formats';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectCheckAllComponent } from '../../../../shared/components/select-check-all/select-check-all.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CircularChartWidgetComponent } from '../circular-chart-widget/circular-chart-widget.component';
import { ConfigurationLinkWidgetComponent } from '../configuration-link-widget/configuration-link-widget.component';
import { DashboardFilterWidgetComponent } from '../dashboard-filter-widget/dashboard-filter-widget.component';
import { FileUploadWidgetComponent } from '../file-upload-widget/file-upload-widget.component';
import { FilterCommitsWidgetComponent } from '../filter-commits-widget/filter-commits-widget.component';
import { InvoiceListWidgetComponent } from '../invoice-list-widget/invoice-list-widget.component';
import { MyPnListWidgetComponent } from '../my-pn-list-widget/my-pn-list-widget.component';
import { OrdersWidgetComponent } from '../orders-widget/orders-widget.component';
import { ParamsInputWidgetComponent } from '../params-input-widget/params-input-widget.component';
import { SearchPnListWidgetComponent } from '../search-pn-list-widget/search-pn-list-widget.component';
import { SharedWarningWidgetComponent } from '../shared-warning-widget/shared-warning-widget.component';
import { SimplePnListWidgetComponent } from '../simple-pn-list-widget/simple-pn-list-widget.component';
import { StatusReportWidgetComponent } from '../status-report-widget/status-report-widget.component';
export const MY_DATE_FORMATS_CS = {
  parse: {
    dateInput: Helper.getInputDateFormats(),
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    locale: 'cs_CZ',
  },
};
@Component({
  selector: 'orion-platform-supply-visibility-configure-widget',
  standalone: true,
  imports: [SelectCheckAllComponent,MatAutocompleteModule,MatRadioModule,ReactiveFormsModule ,MatTabsModule,MatCheckboxModule,MatSidenavModule,MatButtonToggleModule,MatTooltipModule,TranslateModule, CommonModule,MatMenuModule,MatIconModule,MatFormFieldModule,MatSelectModule,
    CircularChartWidgetComponent,ConfigurationLinkWidgetComponent,DashboardFilterWidgetComponent,FileUploadWidgetComponent,FilterCommitsWidgetComponent,InvoiceListWidgetComponent, MyPnListWidgetComponent ,OrdersWidgetComponent,ParamsInputWidgetComponent,SearchPnListWidgetComponent,
    SharedWarningWidgetComponent,SimplePnListWidgetComponent ,StatusReportWidgetComponent
  ],
  templateUrl: './supply-visibility-configure-widget.component.html',
  styleUrl: './supply-visibility-configure-widget.component.scss',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'cs_CZ' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS_CS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class SupplyVisibilityConfigureWidgetComponent implements OnInit {
  
    private store = inject(Store);
    private translate = inject(TranslateService);
    private sidenavService = inject(SidenavService);
    private notificationService = inject(NotificationService);
    private authenticationService = inject(AuthService);
    private fileUploadWidgetService = inject(FileUploadWidgetService);
    private financialModuleService = inject(FinancialModuleService);

    
  @ViewChild('sidenav_configure', { static: true })
  public sidenav?: MatSidenav;
  @Output() refreshChild: EventEmitter<any> = new EventEmitter();
  submitted = false;
  actionSubscription?: Subscription;
  configForm?: FormGroup;
  model?: UserSettingsCls;
  radioList: string[] = [];

  mmViews$: Observable<MaterialManagementViews[]> = this.store.select(SupplyVisibilityState.getMaterialManagementViews);

  forwarder$: Observable<Carriers[] | undefined> = this.store.select(SupplyVisibilityState.getCommitsCarriers);

  widgetId: any;
  uiModel?: DashboardPanelModel;
  isNew = false;
  isDataAvailable = false;
  partNumbersFilterOptionsList: KeyValuePair[] = [];
  additionalFilterList: KeyTypePair[] = [];
  operatorList: string[] = [];
  weeksRange: number[] = [];
  reviewedStatusList: KeyValuePair[] = [];
  widgetType?: string;
  EnumPartNoFilters = EnumPartNoFilters;
  EnumControls = EnumControls;
  isSharedWidgetType = false;
  sharedWidgetId?: string = undefined;
  private ngUnsubscribe = new Subject();
  commitStatusList?: { id: string; name: string }[];
  invoiceStatusList:any = [];
  carriers:any = [];
  carriersNames:string[] = [];
  filteredOptions?: Observable<string[]>;
  daysRange: number[] = [];
  showWeeks: boolean = true;
  weeksShown: boolean = true;
  formGroupDef: any;
  userConfigRights?: ConfigurationRights;

  widgetThemeColors: any = [
    { name: 'default' },
    { name: 'dark' },
    { name: 'primary'},
    { name: 'secondary'},
    { name: 'warning' },
    { name: 'danger'},
    { name: 'success' },
    { name: 'info' },

    // ... add more colors here
  ];
  selectedColor?: string;
  colorList = ['green', 'blue'];


  //Filter Keys
  KEY_FILTER_VENDORCODES = 'filterVendorCodes';
  KEY_FILTER_EXCLUDE_VENDORCODES = 'filterExcludeVendorCodes';
  KEY_FILTER_MATERIALGROUPS = 'filterMaterialGroups';
  KEY_FILTER_EXCLUDE_MATERIALGROUPS = 'filterExcludeMaterialGroups';
  INVALID_VENDOR_CODE = 'invalidVC';
  INVALID_MATERIAL_GROUP = 'invalidMG';
  fileUploadEndpoints = this.fileUploadWidgetService.getEndpoints();

  
    
  constructor(
    public dialog: MatDialog,
    private actions$: Actions,
    private fb: FormBuilder,
    private supplyVisibilityService: SupplyVisibilityService,
    private commitsService: CommitsService,
    private ref: ChangeDetectorRef,
  ) { }
  // title, width, height, row,col,data,view,color

  async ngOnInit() {
    this.userConfigRights = this.store.selectSnapshot(AuthenticationState.configurationRights);
    this.commitStatusList = this.commitsService.getCommitStatusList();
    this.sidenavService.setSidenav(this.sidenav);
    //----------getting data
    this.radioList = FormatStyle$.getColorRadioListForWidget();
    this.partNumbersFilterOptionsList = KeyValuePair.getPartNoFilterOptions();
    this.operatorList = KeyValuePair.getOperatorsList();
    this.reviewedStatusList = KeyValuePair.getReviewedStatuses();
    this.weeksRange = this.range(1, 105);
    this.daysRange = this.range(1,101);

    this.actionSubscription = this.sidenavService.action$.subscribe(
      async (res: DashboardPanelModel) => {
        this.resetData();
        this.widgetId = res.id;
        this.widgetType = res.type;
        this.isSharedWidgetType = false;
        this.uiModel = res;
        if (this.uiModel.firstValue) {
          this.showWeeks = Object.keys(this.uiModel.firstValue).includes('weeks');
        }
        if (this.uiModel.secondValue) {
          this.weeksShown = Object.keys(this.uiModel.secondValue).includes('weeks');
        }


        if (this.uiModel.firstValue) {
          this.showWeeks = Object.keys(this.uiModel.firstValue).includes('weeks');
        }
        if (this.uiModel.secondValue) {
          this.weeksShown = Object.keys(this.uiModel.secondValue).includes('weeks');
        }

        try {
          //TODO - Remove the if block after few days
          if(this.uiModel.sharedId == 'NA') {
            this.uiModel.sharedId = undefined;
          }
          this.sharedWidgetId = this.uiModel.sharedId;

          if (!this.uiModel.type) {
            this.uiModel.type = this.widgetType;
          }
          this.isNew = false;
        } catch (error) {
          this.isNew = true;
          this.uiModel = res;
        } finally {
          // create form
          this.createForm();
          await this.fillAdditionalFilterList(
            {
              widgetType : this.uiModel.type
            }
          );
          //fill form
          this.fillForm(this.uiModel);

          this.mmViews$.subscribe((res) => {
            if (res && res.length > 0) {
              //Set-up Values

              if (this.firstValue && this.fvView) {
                let isViewAvailable: boolean = false;

                if (this.fvView.value) {
                  res.forEach((view) => {
                    if (view.id == this.fvView.value) {
                      this.fvView.setValue(view.id);
                      isViewAvailable = true;
                    }
                  });
                }

                if (!isViewAvailable) {
                  this.fvView.setValue(res[0].id);
                }

                //!this.fvView.value ? this.fvView.setValue(res[0].id) : null;
              }

              if (this.secondValue && this.svView) {
                let isViewAvailable: boolean = false;

                if (this.svView.value) {
                  res.forEach((view) => {
                    if (view.id == this.svView.value) {
                      this.svView.setValue(view.id);
                      isViewAvailable = true;
                    }
                  });
                }

                if (!isViewAvailable) {
                  this.svView.setValue(res[0].id);
                }
                //!this.svView.value ? this.svView.setValue(res[0].id) : null;
              }
            }
          });
          this.isDataAvailable = true;
        }
      }
    );
    // this.catchEditSuccess();
    // this.catchAddSuccess();
    // this.catchErrorSuccess();
    await this.forwarder$.subscribe((forwarder) => {
      if (forwarder) {
        this.carriers = forwarder;
        this.carriers.forEach((obj :any) => {
          this.carriersNames.push(obj.name);
        });
      }
    });
  }

  get currentUpn(): string {
    return this.store.selectSnapshot(AuthenticationState.upn);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.carriersNames) {
      return this.carriersNames.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
    return [];
  }

  onForwarderFieldClick(i: number) {
    let carriersNames:any = [];
    this.carriers.forEach((obj : any) => {
      carriersNames.push(obj.name);
    });
    this.carriersNames = carriersNames;
    this.getForwarderOptions(i);
  }

  getForwarderOptions(index: number) {
    console.log(this.fvFilters.at(index).get('value'));
    this.filteredOptions = this.fvFilters.at(index).get('value')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private createForm() {
    if (
      this.widgetType === 'circularChart' ||
      this.widgetType === 'simplePNList' ||
      this.widgetType === 'smartPNList' ||
      this.widgetType === 'filterWidget'
    ) {
      this.formGroupDef = {
        //Common Controls
        fontSize: new FormControl('medium'),
        title: new FormControl('', Validators.required),
        subTitle: new FormControl(''),
        primaryColor: new FormControl(this.radioList[0], Validators.required),

        //FirstValue Tab Controls
        firstValue: new FormGroup({
          allowMultiple: new FormControl(''),
          onlyMyPNs: new FormControl(false),
          partNumbersFilterOptions: new FormControl(this.partNumbersFilterOptionsList[1].key),
          formula: new FormControl(''),
          partNumbers: new FormControl(''),
          view: new FormControl('', Validators.required),
          [this.showWeeks ? 'weeks' : 'days']: this.showWeeks ?
            new FormControl(this.uiModel?.firstValue?.weeks ? this.uiModel.firstValue.weeks : this.weeksRange[25])
            : new FormControl(this.uiModel?.firstValue?.days ? this.uiModel.firstValue.days : this.daysRange[5]),

          filters: this.fb.array([]), //Common Filter Option
        }),
      };

      if (this.widgetType === 'circularChart') {
        this.formGroupDef = {
          ...this.formGroupDef,
          secondValue: new FormGroup({
            allowMultiple: new FormControl(''),
            onlyMyPNs: new FormControl(false),
            partNumbersFilterOptions: new FormControl(this.partNumbersFilterOptionsList[1].key),
            formula: new FormControl(),
            partNumbers: new FormControl(),
            view: new FormControl(),
            [this.weeksShown ? 'weeks' : 'days']: this.weeksShown ?
              new FormControl(this.uiModel?.secondValue?.weeks ? this.uiModel.secondValue.weeks : this.weeksRange[25])
              : new FormControl(this.uiModel?.secondValue?.days ? this.uiModel.secondValue.days : this.daysRange[5]),
            filters: this.fb.array([]), //Common Filter Option
          }),
        };
      }

      this.configForm = this.fb.group(this.formGroupDef);
      this.isSharedWidgetType = true;
    }

    else if (this.widgetType === 'mypnlist'){
      this.formGroupDef = {
        //Common Controls
        fontSize: new FormControl('medium'),
        title: new FormControl('', Validators.required),
        subTitle: new FormControl(''),
        widgetTheme: new FormControl(this.widgetThemeColors[0].name, Validators.required),

        //FirstValue Tab Controls
        firstValue: new FormGroup({
          allowMultiple: new FormControl(''),
          onlyMyPNs: new FormControl(false),
          useChart: new FormControl(false),
          isChartVisible: new FormControl(false),
          useFiltering: new FormControl(false),
          isFilteringVisible: new FormControl(false),
          showTotalBar: new FormControl(false),
          showFlaggedBar: new FormControl(false),
          showUnFlaggedBar: new FormControl(false),
          showReviewStatus: new FormControl(false),
          customerReviewStatus: new FormControl(false),
          supplierReviewStatus: new FormControl(false),
          showVendorName: new FormControl(false),
          showVendorCode: new FormControl(true),
          buyerReviewStatus: new FormControl(false),
          partNumbersFilterOptions: new FormControl(this.partNumbersFilterOptionsList[1].key),
          formula: new FormControl(''),
          partNumbers: new FormControl(''),
          view: new FormControl('', Validators.required),
          [this.showWeeks ? 'weeks' : 'days']: this.showWeeks ?
            new FormControl(this.uiModel?.firstValue?.weeks ? this.uiModel.firstValue.weeks : this.weeksRange[25])
            : new FormControl(this.uiModel?.firstValue?.days ? this.uiModel.firstValue.days : this.daysRange[5]),

          filters: this.fb.array([]), //Common Filter Option
        }),
      };
      this.configForm = this.fb.group(this.formGroupDef);
      this.isSharedWidgetType = true;
    }

    else if ( this.widgetType === 'waterfall') {
       this.configForm = this.fb.group({
        fontSize: new FormControl('medium'),
        title: new FormControl('', Validators.required),
        periods: new FormControl('')})
    }

    else if (this.widgetType === 'commitList') {
      this.configForm = this.fb.group({
        fontSize: new FormControl('medium'),
        title: new FormControl('', Validators.required),
        primaryColor: new FormControl(this.radioList[0], Validators.required),
        status: new FormControl(''),
        onlyMyCommits: new FormControl(false),
        formula: new FormControl(''),
        firstValue: new FormGroup({
          filters: this.fb.array([]) //Common Filter Option
        })

        // loadIdentity: new FormControl(false)
        // firstValue: new FormGroup({
        //   partNumbers: new FormControl(''),
        //   vendorCodes: new FormControl(''),
        //   invoiceNumber: new FormControl(''),
        //   buyers: new FormControl(''),
        //   status: new FormControl(''),
        //   containerNumber: new FormControl(''),
        //   trackNumber: new FormControl(''),
        //   dateFrom: new FormControl(''),
        //   dateTo: new FormControl(''),
        //   loadIdentity: new FormControl(false)
        // })
      });
    } 
    else if (this.widgetType === 'invoiceList') {
      this.configForm = this.fb.group({
        fontSize: new FormControl('medium'),
        title: new FormControl('', Validators.required),
        primaryColor: new FormControl(this.radioList[0], Validators.required),
        status: new FormControl(''),
        formula: new FormControl(''),
        firstValue: new FormGroup({
          filters: this.fb.array([])
        })
      });
    } else if (this.widgetType === 'searchV2' || this.widgetType === 'orders') {
      this.configForm = this.fb.group({
        //Common Controls
        fontSize: new FormControl('medium'),
        x: new FormControl('', Validators.required),
        y: new FormControl('', Validators.required),
        cols: new FormControl('', Validators.required),
        rows: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        primaryColor: new FormControl(this.radioList[0], Validators.required),
      });
    } else if (this.widgetType === 'statusMonitor') {
      this.configForm = this.fb.group({
        //Common Controls
        fontSize: new FormControl('medium'),
        x: new FormControl('', Validators.required),
        y: new FormControl('', Validators.required),
        cols: new FormControl('', Validators.required),
        rows: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        subTitle: new FormControl(''),
        allowPrecalculations: new FormControl(true),
        allowSystemHealth: new FormControl(true),
        chartColor: new FormControl('green'),
        selectMode: new FormControl('precalculations'),
      });
    } else if (this.widgetType === 'fileUpload') {
      this.configForm = this.fb.group({
        fontSize: new FormControl('medium'),
        x: new FormControl('', Validators.required),
        y: new FormControl('', Validators.required),
        cols: new FormControl('', Validators.required),
        rows: new FormControl('', Validators.required),
        title: new FormControl('', Validators.required),
        subTitle: new FormControl(''),
        endpoint: new FormControl('', Validators.required),
      });
    } else {
      {
        this.configForm = this.fb.group({
          fontSize: new FormControl('medium'),
          x: new FormControl('', Validators.required),
          y: new FormControl('', Validators.required),
          cols: new FormControl('', Validators.required),
          rows: new FormControl('', Validators.required),
          title: new FormControl('', Validators.required),
          // allowMultiple: new FormControl(''),
          // onlyMyPNs: new FormControl(true),
          // primaryColor: new FormControl(this.radioList[0], Validators.required),
          // partNumbersFilterOptions: new FormControl(this.partNumbersFilterOptionsList[1].key),
          // reviewStatus: new FormControl(this.reviewedStatusList[0].key),
          // formula: new FormControl(''),
          // vendor: new FormControl(''),
          // buyer: new FormControl(''),
          // partNumbers: new FormControl(''),
          // view: new FormControl('', Validators.required)
        });
      }
    }
  }

  private updateFirstFormControls() {
    const firstValueGroup = this.formGroupDef.firstValue as FormGroup;

    // Remove existing controls
    ['weeks', 'days'].forEach(controlName => {
      if (firstValueGroup.controls[controlName]) {
        firstValueGroup.removeControl(controlName);
      }
    });

    const controlToAdd = this.showWeeks ? 'weeks' : 'days';
    const defaultControlValue = this.showWeeks ?
      (this.uiModel?.firstValue?.weeks ? this.uiModel.firstValue.weeks
        : this.weeksRange[25]) : (this.uiModel?.firstValue?.days ? this.uiModel.firstValue.days : this.daysRange[5]);

    firstValueGroup.addControl(controlToAdd, new FormControl(defaultControlValue));
  }

  private updateSecondFormControls() {
    const seconfValueGroup = this.formGroupDef.secondValue as FormGroup;

    // Remove existing controls
    ['weeks', 'days'].forEach(controlName => {
      if (seconfValueGroup.controls[controlName]) {
        seconfValueGroup.removeControl(controlName);
      }
    });

    const controlToAdd = this.weeksShown ? 'weeks' : 'days';
    const defaultControlValue = this.weeksShown ?
      (this.uiModel?.secondValue?.weeks ? this.uiModel.secondValue.weeks
        : this.weeksRange[25]) : (this.uiModel?.secondValue?.days ? this.uiModel.secondValue.days : this.daysRange[5]);


    seconfValueGroup.addControl(controlToAdd, new FormControl(defaultControlValue));
  }

  defaultValues(record: AbstractControl) {
    const formGroup = record as FormGroup;
    formGroup.value.operator = '=';
    formGroup.get('operator')?.setValue(formGroup.value.operator);
  }

  nextOperator(record: AbstractControl) {
    if (record.value.field$.key === 'filterLeadtimeQuery') {
      record.value.operator = FormatStyle$.getNextOperator(
        this.operatorList,
        record.value.operator
      );
      record.get('operator')?.setValue(record.value.operator);
    } else {
      //do nothing
    }
  }

  onFilterAdd(formArray: FormArray, filter?: AdditionalFilter, isSecondForm?: boolean) {
    //TODO - the if condition should be removed after sometime
    if(filter && filter.field == 'reviewStatus') {
      filter.value = undefined;
      filter = undefined;
    }
    if (filter) {
      const index = this.additionalFilterList.findIndex((c) => c.key === filter.field);
      formArray.push(
        this.fb.group({
          field$: new FormControl(this.additionalFilterList[index]),
          operator: [filter.operator],
          value: new FormControl(filter.value),
        })
      );
    } else {
      formArray.push(
        this.fb.group({
          field$: new FormControl(this.additionalFilterList[0]),
          operator: ['='],
          value: new FormControl(),
        })
      );
    }

    this.setControlSubscription(
      formArray,
      <FormGroup>formArray.controls[formArray.controls.length - 1]
    );
  }

  onFilterRemove(formArray: FormArray, index: number, isSecondForm?: boolean) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('style.confirmDeleteTitle'),
        content: this.translate.instant('style.confirmDeleteContent'),
        button: this.translate.instant('style.delete'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        formArray.removeAt(index);
        this.validateVendorCodeControls(formArray, isSecondForm);
      } else {
        // do nothing
      }
    });
  }

  setControlSubscription(formArray: FormArray, formGroup: FormGroup, isSecondForm?: boolean) {
    const filterFieldControl = formGroup.controls['field$'];
    const filterValueControl = formGroup.controls['value'];
    filterFieldControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        if (value) {
          this.validateVendorCodeControls(formArray, isSecondForm);
          this.validateMaterialGroup(formArray, isSecondForm);
        }
      });
    filterValueControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (typeof data === 'string') {
          console.log('filterValueControl Changed!');
          if (
            filterFieldControl.value.key == this.KEY_FILTER_EXCLUDE_VENDORCODES ||
            filterFieldControl.value.key == this.KEY_FILTER_VENDORCODES
          ) {
            this.validateVendorCodeControls(formArray, isSecondForm);
          }
          if (
            filterFieldControl.value.key == this.KEY_FILTER_EXCLUDE_MATERIALGROUPS ||
            filterFieldControl.value.key == this.KEY_FILTER_VENDORCODES
          ) {
            this.validateMaterialGroup(formArray, isSecondForm);
          }
        }
      });
  }

  validateVendorCodeControls(formArray: FormArray, isSecondForm?: boolean): boolean {
    if (
      this.validateIncludeExcludeFields(
        formArray,
        this.KEY_FILTER_VENDORCODES,
        this.KEY_FILTER_EXCLUDE_VENDORCODES,
        this.INVALID_VENDOR_CODE
      )
    ) {
      return false;
    }
    return true;
  }

  validateMaterialGroup(formArray: FormArray, isSecondForm?: boolean): boolean {
    if (
      this.validateIncludeExcludeFields(
        formArray,
        this.KEY_FILTER_MATERIALGROUPS,
        this.KEY_FILTER_EXCLUDE_MATERIALGROUPS,
        this.INVALID_MATERIAL_GROUP
      )
    ) {
      return false;
    }
    return true;
  }
  validateIncludeExcludeFields(
    formArray: FormArray,
    includeKey: string,
    excludeKey: string,
    errorCode: string
  ) {
    const includeControls: FormControl[] = this.getAdditionFormControlByField(includeKey, formArray);
    const excludeControls: FormControl[] = this.getAdditionFormControlByField(excludeKey, formArray);

    //Set Validation
    let isInvalid = false;
    if (includeControls.length && excludeControls.length) {
      let includeValues: any[] = this.getFormControlsValueWithFormat(includeControls, includeKey);
      let excludeValues: any[] = this.getFormControlsValueWithFormat(excludeControls, excludeKey);

      includeValues = Helper.removeDuplicate([].concat.apply([], includeValues));
      excludeValues = Helper.removeDuplicate([].concat.apply([], excludeValues));
      if (Helper.checkIfArrayElementMatch(includeValues, excludeValues)) {
        isInvalid = true;
      }
    }
    [...includeControls, ...excludeControls].forEach((control) => {
      isInvalid ? control.markAsTouched() : undefined;
      Helper.setValidation(control, isInvalid, errorCode);
      // console.log(isInvalid?"some controls are invalid":"controls are valid",control);
    });
    this.ref.detectChanges();
    return isInvalid;
  }

  getAdditionFormControlByField(key: string, formArray: FormArray): FormControl[] {
    const formControls: FormControl[] = [];
    for (let j = 0; j < formArray.controls.length; j++) {
      const formGroup = <FormGroup>formArray.controls[j];
      if (formGroup.controls['field$'].value.key == key) {
        formControls.push(<FormControl>formGroup.controls['value']);
      }
    }
    return formControls;
  }
  getFormControlsValueWithFormat(formControls: FormControl[], key: string): any[] {
    let extractedValue: any[] = [];
    if (formControls.length) {
      extractedValue = formControls.map((control) => {
        return this.supplyVisibilityService.getFilterList(key, [
          { field: key, operator: '', value: control.value },
        ]);
      });
    }
    return extractedValue;
  }

  //Generates number of weeks
  range = (start: number, stop: number, step: number = 1): number[] =>
    Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);

  //-----------------firstVal Controls Starts
  get firstValue(): FormGroup {
    return this.configForm?.get('firstValue') as FormGroup;
  }
  get fvOnlyMyPNs(): FormControl {
    return this.configForm?.get('firstValue.onlyMyPNs') as FormControl;
  }
  get fvPartNumbersFilterOptions(): FormControl {
    return this.configForm?.get('firstValue.partNumbersFilterOptions') as FormControl;
  }
  get fvReviewStatus(): FormControl {
    return this.configForm?.get('firstValue.reviewStatus') as FormControl;
  }
  get fvFormula(): FormControl {
    return this.configForm?.get('firstValue.formula') as FormControl;
  }
  get fvVendor(): FormControl {
    return this.configForm?.get('firstValue.vendor') as FormControl;
  }
  get fvBuyer(): FormControl {
    return this.configForm?.get('firstValue.buyer') as FormControl;
  }
  get fvPartNumbers(): FormControl {
    return this.configForm?.get('firstValue.partNumbers') as FormControl;
  }
  get fvView(): FormControl {
    return this.configForm?.get('firstValue.view') as FormControl;
  }
  get fvFilters(): FormArray {
    return this.configForm?.get('firstValue.filters') as FormArray;
  }
  get statusFormControl(): FormControl {
    return this.configForm?.get('status') as FormControl;
  }
  //----------------firstVal Controls Ends

  //-----------------secondVal Controls Starts
  get secondValue(): FormGroup {
    return this.configForm?.get('secondValue') as FormGroup;
  }
  get svOnlyMyPNs(): FormControl {
    return this.configForm?.get('secondValue.onlyMyPNs') as FormControl;
  }
  get svPartNumbersFilterOptions(): FormControl {
    return this.configForm?.get('secondValue.partNumbersFilterOptions') as FormControl;
  }
  get svReviewStatus(): FormControl {
    return this.configForm?.get('secondValue.reviewStatus') as FormControl;
  }
  get svFormula(): FormControl {
    return this.configForm?.get('secondValue.formula') as FormControl;
  }
  get svVendor(): FormControl {
    return this.configForm?.get('secondValue.vendor') as FormControl;
  }
  get svBuyer(): FormControl {
    return this.configForm?.get('secondValue.buyer') as FormControl;
  }
  get svPartNumbers(): FormControl {
    return this.configForm?.get('secondValue.partNumbers') as FormControl;
  }
  get svView(): FormControl {
    return this.configForm?.get('secondValue.view') as FormControl;
  }
  get svFilters(): FormArray {
    return this.configForm?.get('secondValue.filters') as FormArray;
  }
  //----------------secondVal Controls Ends

  get filterOptions(): FormControl {
    return this.configForm?.get('filterOptions') as FormControl;
  }
  //A2

  get fontSize(): FormControl {
    return this.configForm?.get('fontSize') as FormControl;
  }
  get x(): FormControl {
    return this.configForm?.get('x') as FormControl;
  }
  get y(): FormControl {
    return this.configForm?.get('y') as FormControl;
  }
  get cols(): FormControl {
    return this.configForm?.get('cols') as FormControl;
  }
  get rows(): FormControl {
    return this.configForm?.get('rows') as FormControl;
  }

  get title(): FormControl {
    return this.configForm?.get('title') as FormControl;
  }
  get primaryColor(): FormControl {
    return this.configForm?.get('primaryColor') as FormControl;
  }
  get widgetTheme(): FormControl {
    return this.configForm?.get('widgetTheme') as FormControl;
  }
  get allowMultiple(): FormControl {
    return this.configForm?.get('allowMultiple') as FormControl;
  }
  get onlyMyPNs(): FormControl {
    return this.configForm?.get('onlyMyPNs') as FormControl;
  }
  get partNumbersFilterOptions(): FormControl {
    return this.configForm?.get('partNumbersFilterOptions') as FormControl;
  }
  get reviewStatus(): FormControl {
    return this.configForm?.get('reviewStatus') as FormControl;
  }

  get formula(): FormControl {
    return this.configForm?.get('formula') as FormControl;
  }

  get formula1(): FormControl {
    return this.configForm?.get('formula1') as FormControl;
  }

  get formula2(): FormControl {
    return this.configForm?.get('formula2') as FormControl;
  }
  get vendor(): FormControl {
    return this.configForm?.get('vendor') as FormControl;
  }
  get buyer(): FormControl {
    return this.configForm?.get('buyer') as FormControl;
  }

  get partNumbers(): FormControl {
    return this.configForm?.get('partNumbers') as FormControl;
  }
  get view(): FormControl {
    return this.configForm?.get('view') as FormControl;
  }

  get endpoint(): FormControl {
    return this.configForm?.get('endpoint') as FormControl;
  }

  get allowPrecalculations(): FormControl {
    return this.configForm?.get('allowPrecalculations') as FormControl;
  }
  get allowSystemHealth(): FormControl {
    return this.configForm?.get('allowSystemHealth') as FormControl;
  }
  get chartColor(): FormControl {
    return this.configForm?.get('chartColor') as FormControl;
  }
  get selectMode(): FormControl {
    return this.configForm?.get('selectMode') as FormControl;
  }

  submitForm() {
    this.submitted = true;
    try {
      const form = this.configForm?.value;
      // if(this.widgetType === 'commitList') {
      //  if(form['vendorCodes'].trim() == '' && form['buyers'].trim() == '') {
      //   this.notificationService.showErrorOrMessage("","At least one of VendorCodes or Buyers must be filled");
      //   this.submitted = false;
      //   return
      //  }
      // }
      if (form) {
        Object.assign(form, { type: this.widgetType });
        const formData = form;

        if (formData.onlyMyCommits){
          formData.contact = this.currentUpn
        }

        this.adjustAsPerFilterSelected(formData.firstValue);
        this.adjustAsPerFilterSelected(formData.secondValue);
        if(this.uiModel)
          Object.assign(this.uiModel, formData);
        //set PanelCache
        if (this.uiModel && this.uiModel.panelCache) {
          formData.panelCache = this.uiModel.panelCache;
        }
        formData.sharedId = this.sharedWidgetId;
        formData.modificationRights = this.uiModel?.modificationRights;

        if (
          formData.type == 'statusMonitor' &&
          !this.allowPrecalculations.value &&
          !this.allowSystemHealth.value
        ) {
          this.notificationService.showErrorOrMessage(
            '',
            'At least one checkbox is required to check'
          );
          this.submitted = false;
          return;
        }

        if (formData.onlyMyPNs) {
          formData.buyer = null;
        }
        if (formData.partNumbersFilterOptions === EnumPartNoFilters.FixedList) {
          formData.formula = null;
          formData.vendor = null;
          formData.buyer = null;
          formData.onlyMyPNs = false;
        } else if (formData.partNumbersFilterOptions === EnumPartNoFilters.Criteria) {
          formData.partNumbers = null;
        } else {
          //do nothing
        }
        // const changedData = {
        //   key: this.widgetId,
        //   data: JSON.stringify(formData)
        // };
        // if (this.isNew) {
        //   this.store.dispatch(new AddUserSettings(changedData));
        // } else {
        //   this.store.dispatch(new EditUserSettings(changedData));
        // }
        if (this.sharedWidgetId) {
          this.updateShareWidget();
        }
        this.refreshChild.emit(this.uiModel);
        if (this.submitted) {
          this.resetData();
          this.resetForm();
          this.close();
        }
      }
    } catch (error) {
      this.submitted = false;
    }
  }
  adjustAdditionalFiltersArray(formData: any): AdditionalFilter[] {
    return formData.filters.map((c :any) => {
      return { field: c.field$.key, operator: c.operator, value: c.value };
    });
  }
  adjustAsPerFilterSelected(filterData: any) {
    if (!filterData) {
      return;
    }
    if (filterData.onlyMyPNs) {
      filterData.buyer = undefined;
    }
    if (filterData.partNumbersFilterOptions === EnumPartNoFilters.FixedList) {
      filterData.formula = undefined;
      filterData.vendor = undefined;
      filterData.buyer = undefined;
      filterData.onlyMyPNs = false;
    } else if (filterData.partNumbersFilterOptions === EnumPartNoFilters.Criteria) {
      filterData.partNumbers = undefined;
    } else {
      //do nothing
    }
    if (filterData.filters) {
      filterData.filters = this.adjustAdditionalFiltersArray(filterData);
    }
  }

  // /**
  //  */
  // catchEditSuccess() {
  //   this.actions$
  //     .pipe(ofActionDispatched(EditUserSettingsSuccess))
  //     .subscribe(data => {
  //       this.refreshChild.emit(this.uiModel);
  //       if (data.isNotificationRequired) {
  //         this.notificationService.showMessage('Settings saved successfully');
  //       }
  //       if(this.submitted){
  //         this.resetData();
  //         this.resetForm();
  //         this.close();
  //       }

  //     });
  // }
  // catchErrorSuccess() {
  //   this.actions$
  //     .pipe(ofActionDispatched(EditUserSettingsError))
  //     .subscribe(error => {
  //       this.notificationService.showErrorOrMessage(error, 'Settings save failed!');
  //     });
  //   this.actions$
  //     .pipe(ofActionDispatched(AddUserSettingsError))
  //     .subscribe(error => {
  //       this.notificationService.showErrorOrMessage(error, 'Settings save failed!');
  //     });
  // }

  // catchAddSuccess() {
  //   this.actions$
  //     .pipe(ofActionDispatched(AddUserSettingsSuccess))
  //     .subscribe(data => {
  //       this.refreshChild.emit(this.uiModel);
  //       this.notificationService.showMessage('Settings saved successfully');

  //       this.resetData();
  //       this.resetForm();
  //       this.close();

  //     });
  // }

  fillForm(uiModel: DashboardPanelModel) {
    if (uiModel.firstValue) {
      if (uiModel.firstValue.filters && uiModel.firstValue.filters.length > 0) {
        for (let index = 0; index < uiModel.firstValue.filters.length; index++) {
          this.onFilterAdd(this.fvFilters, uiModel.firstValue.filters[index], false);
        }
      }
    }
    if (uiModel.secondValue) {
      if (uiModel.secondValue.filters && uiModel.secondValue.filters.length > 0) {
        for (let index = 0; index < uiModel.secondValue.filters.length; index++) {
          this.onFilterAdd(this.svFilters, uiModel.secondValue.filters[index], true);
        }
      }
    }
    this.uiModel ? this.configForm?.patchValue(uiModel) : undefined;
  }
  ngOnDestroy() {
    this.actionSubscription?.unsubscribe();
  }

  async close() {
    await this.sidenavService.close();
  }
  resetData() {
    this.submitted = false;
    this.widgetId = undefined;
    this.widgetType = undefined;
    this.model = undefined;
    this.uiModel = undefined;
  }
  resetForm() {
    if (this.configForm) {
      this.configForm.reset();
    }
  }

  shareWidget() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.shareWidgetTitle'),
        content: this.translate.instant('style.shareWidgetContent'),
        button: this.translate.instant('style.ok'),
        cancelButton: this.translate.instant('style.cancel'),
        positiveBtnColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const widget: SharedWidget = {
          Name: `${this.uiModel?.title}~${this.uiModel?.type
            }~${this.authenticationService.getUserName()}`,
          SecurityLevel: 'public',
          RightForModifying: 'creator',
          Data: JSON.stringify(this.removeUnusedWidgetData(Helper.createCopy(this.uiModel))),
        };
        this.supplyVisibilityService.insertSharedWidget(widget).subscribe(
          (res) => {
            if (res && res.id) {
              if(this.uiModel){
              this.uiModel.sharedId = res.id;
            }
              this.sharedWidgetId = res.id;
              this.refreshChild.emit(this.uiModel);
              // this.createUserSettingsOnShared(this.uiModel);
            }
          },
          (error) => { }
        );
      }
    });
  }
  updateShareWidget() {
    const widget: any = {
      id: this.sharedWidgetId,
      Name: `${this.uiModel?.title}~${this.uiModel?.type
        }~${this.authenticationService.getUserName()}`,
      SecurityLevel: 'public',
      RightForModifying: 'creator',
      Data: JSON.stringify(this.removeUnusedWidgetData(Helper.createCopy(this.uiModel))),
    };
    this.supplyVisibilityService.updateSharedWidget(widget).subscribe((res) => {
      //NOTE Add After Update Logic
    },
    (error) => {
      this.notificationService.showError(error.message);
    });
  }
  unshareWidget() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.shareWidgetTitle'),
        content: this.translate.instant('style.unshareWidgetContent'),
        button: this.translate.instant('style.ok'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && this.sharedWidgetId) {
        this.supplyVisibilityService.deleteSharedWidget(this.sharedWidgetId).subscribe(
          (res) => {
            if(this.uiModel)
            this.uiModel.sharedId = undefined;
            this.sharedWidgetId = undefined;
            this.refreshChild.emit(this.uiModel);
          },
          (error) => { }
        );
      }
    });
  }

  removeUnusedWidgetData(widgetData : any) {
    const unusedProps: string[] = [
      'cols',
      'minItemCols',
      'minItemRows',
      'rows',
      'x',
      'y',
      'maxItemCols',
      'maxItemRows',
      'id',
      'modificationRights',
    ];

    unusedProps.forEach((prop) => {
      delete widgetData[prop];
    });

    return widgetData;
  }
  // createUserSettingsOnShared(widgetData: DashboardPanelModel): void {

  //   let userSettings = null;
  //   switch (widgetData.type) {

  //     case 'searchV2':
  //       userSettings = {
  //         key: `cache-${widgetData.id}`,
  //         data: JSON.stringify('null')
  //       };
  //       break

  //     //implement other cases
  //     default:
  //       break;
  //   }

  //   userSettings ? this.store.dispatch(new AddUserSettings(userSettings)) : null;

  // }

  deleteUserSettingsOnUnshared(widgetData: DashboardPanelModel): void {
    let key = null;
    switch (widgetData.type) {
      case 'searchV2':
        key = `cache-${widgetData.id}`;
        break;

      //implement other cases
      default:
        break;
    }

    key ? this.store.dispatch(new DeleteUserSettings(key)) : null;
  }

  async fillAdditionalFilterList(config : any) {

    let fields: any;

    if (config && config.widgetType == "commitList") {
      fields = this.store.selectSnapshot(SupplyVisibilityState.getCommitFilterAdditions);
      if (!(fields && fields.length)) {
        fields = await this.supplyVisibilityService.getFilterAdditionsForCommits().toPromise().catch(
          e => {
            fields = []
          }
        )
      }
      this.store.dispatch(new CacheCommitsCarriers());
    }

    if (config && config.widgetType == "invoiceList") {
      fields = await firstValueFrom(this.financialModuleService.getFilterAdditionsForInvoice())
        .catch(e => fields = []);
      this.invoiceStatusList = this.financialModuleService.getInvoiceStatusList();
    }

    config.fields = fields;
    config.mapControls = true;
    this.additionalFilterList = KeyTypePair.getAdditionalFilterList(config);
  }

  toggleDaysAndWeeksView() {
    this.showWeeks = !this.showWeeks;
    this.updateFirstFormControls();
  }

  toggleDaysAndWeeksView2() {
    this.weeksShown = !this.weeksShown;
    this.updateSecondFormControls();
  }

}
