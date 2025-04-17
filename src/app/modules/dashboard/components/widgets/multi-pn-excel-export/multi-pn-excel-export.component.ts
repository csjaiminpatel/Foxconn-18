import { Component, ElementRef, inject, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import { PanelComponent } from '../../panel/panel.component';
import { RangeNavigatorComponent } from '../../range-navigator/range-navigator.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { MaterialManagementViews } from '../../../models/material-management-views.model';
import { PanelDescription } from '../../../models/panelDto';
import { StaticValues } from '../../../models/StaticValuesDto';
import { BasicParameters, EnumSvSidebarSection } from '../../../models/supply-visibility.model';
import { SupplyVisibilitySidenavService } from '../../../services/Supply-Visibility-Sidenav/supply-visibility-sidenav.service';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { ResetBufferRules } from '../../../stores/buffer-rule/buffer-rules.actions';
import { SetMaterialManagementViews, ResetSupplyVisibilityAndCommits, ResetSupplyVisibilityPartNumberList, SliderChangeForMultiPN } from '../../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../../stores/supply-visibility/supply-visibility.state';
import { ExcelService } from '../../../services/Excel/excel.service';
import { MultiPnSupplyLevelAnalyticsComponent } from '../../multi-pn-supply-level-analytics/multi-pn-supply-level-analytics.component';

@Component({
  selector: 'orion-platform-multi-pn-excel-export',
  standalone: true,
  imports: [...SHARED_IMPORTS,ProgressSpinnerComponent,PanelComponent,RangeNavigatorComponent,MultiPnSupplyLevelAnalyticsComponent],
  templateUrl: './multi-pn-excel-export.component.html',
  styleUrl: './multi-pn-excel-export.component.scss'
})
export class MultiPnExcelExportComponent implements OnInit {
  @ViewChild('supplysidenav', {static: true}) public sidenav?: MatSidenav;
  @ViewChild('multiPNTable', {static: true}) public multiPNTable?: ElementRef;

    public store = inject(Store);
  
    
  DEFAULT_VIEW = '5ddbb80c26c15c16b843c5fa';
  childData: {
    firstDates: string[];
    staticValues: StaticValues[];
    data: any;
    partNumber: BasicParameters;
  }[];

  partNumber = '';
  description: PanelDescription;
  toggleActive = false;
  opened?: boolean;
  loading = true;
  queryParametersForChart:any;
  selectedView = '';
  skip = 0;
  top = 20;

  @ViewChildren(MultiPnSupplyLevelAnalyticsComponent) multiPnSupplyLevelAnalyticsComponents!: QueryList<MultiPnSupplyLevelAnalyticsComponent>;

  selectedPlant: any;
  basicParameters?: {plant: any; widgetId: any; mmViewID: any; weeks: number};
  totalPartNumbers = 0;
  totalColumns = 0;
  navigateToForecast = false;
  selectedPartNumberList: BasicParameters[] = [];
  downloadStatusChecker:any;
  loadingText?: string;

  dialogData: any;
  constructor(
    public dialogRef: MatDialogRef<MultiPnExcelExportComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any,
    private dialog: MatDialog,
    private sidenavService: SupplyVisibilitySidenavService,
    private supplyVisibilityService: SupplyVisibilityService,
    private router: Router,
    private excelService: ExcelService,
    private notificationService: NotificationService
  ) {
    this.dialogData = incomingData;
    this.description = {label: '', value: 0};
    this.childData = [];
    this.skip = this.top;
  }

  mmViews$: Observable<MaterialManagementViews[]> = this.store.select(SupplyVisibilityState.getMaterialManagementViews);

  userAction$: Observable<EnumSvSidebarSection> = this.store.select(SupplyVisibilityState.getUserAction);
  // @Select(SupplyVisibilityState.getPartNumberListParameters) selectedPartNumberList$: Observable<BasicParameters[]>;
  selectedPartNumberList$?: Observable<BasicParameters[]>;

  async ngOnInit() {
    await this.setBasicParameters();
    this.selectedPartNumberList$ = this.store
      .select(SupplyVisibilityState.getPartNumberListParameters)
      .pipe(map((filterFn) => filterFn(this.basicParameters?.widgetId)));

    this.sidenavService.setSidenav(this.sidenav);
    //this.store.dispatch(new SetBufferRules());
    this.store.dispatch(new SetMaterialManagementViews());

    this.setViewFromQueryParams();
    this.selectedPartNumberList$.subscribe((c) => {
      if (c) {
        this.totalPartNumbers = c.length;
      }
      this.selectedPartNumberList = c;
    });

    const self = this;
    this.downloadStatusChecker = setInterval(function () {
      if (self.allLoaded && self.allChildrenLoaded) {
        self.downloadExcel();
        clearInterval(self.downloadStatusChecker);
      } else {
        //do nothing
      }
    }, 1000);
  }

  async setBasicParameters() {
    this.queryParametersForChart = this.dialogData.params;
    if (this.dialogData.params.plant) {
      this.basicParameters = {
        plant: this.dialogData.params.plant,
        widgetId: this.dialogData.params.widgetId,
        weeks: this.dialogData.params.weeks,
        mmViewID: this.dialogData.params.materialManagementViewID,
      };
    }
  }

  ngOnDestroy() {
    if (!this.navigateToForecast) {
      // do not clear state as we need it as it is when we migrate to forecast page from here
      // console.log('reset called');
      this.store.dispatch(new ResetBufferRules());
      this.store.dispatch(new ResetSupplyVisibilityAndCommits());
      this.store.dispatch(new ResetSupplyVisibilityPartNumberList());
    }
    clearInterval(this.downloadStatusChecker);
  }

  get allLoaded(): boolean {
    if (this.selectedPartNumberList) return this.selectedPartNumberList.every((c) => c.$loaded);
    else return false;
  }

  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenavService.toggle();
  }

  //Exports PartNumbers And Vendors
  exportAll() {
    // excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
    const excelExportProperties: any = {multipleExport: {blankRows: 0}};
    const data = [];
    const grids = this.multiPnSupplyLevelAnalyticsComponents.toArray();
    for (let index = 0; index < grids.length; index++) {
      const grid = grids[index];
      data.push(
        ...[
          {
            label: grid.selectedPartNumber?.partNumber + '::' + grid.selectedPartNumber?.vendorCode,
          },
        ]
      );
      // data.push(...[{ label:'Static values' },...grid.staticValues]);
      data.push(...grid.dataSource);
    }
    for (let index = 0; index < data.length; index++) {
      const record = data[index];
      for (const key in record) {
        if (key.indexOf('_') >= 0) {
          delete record[key];
        }
      }
    }
    this.excelService.exportAsExcelFile(data, 'multi-part-data');
    // this.excelService.exportTableAsExcelFile(this.multiPNTable.nativeElement, 'multi-part-number-data');
  }
  setViewFromQueryParams() {
    this.mmViews$.subscribe((res) => {
      const mmView = res.find(
        (view) => view.id === this.dialogData.params.materialManagementViewID
      );
      this.selectedView = mmView
        ? mmView.configurationName
        : this.dialogData.params.materialManagementViewID;
    });
    this.selectedPlant = this.dialogData.params.plant;
  }

  loadMore() {
    this.skip = this.skip >= this.totalPartNumbers ? this.totalPartNumbers : this.skip + this.top;
  }
  setActiveView(data: any) {
    this.selectedPartNumberList$?.subscribe((partNumbersList) => {
      for (let index = 0; index < partNumbersList.length; index++) {
        const partNumber = partNumbersList[index];
        partNumber.mmViewID = data || this.DEFAULT_VIEW;
      }
      //this.store.dispatch(new SetPartNumberListParameters(partNumbersList));
      this.router.navigate([`/material-management/supply-visibility-multi-pn`], {
        queryParams: {
          plant: this.selectedPlant,
          materialManagementViewID: data || this.DEFAULT_VIEW,
        },
      });
    });
  }
  public get allChildrenLoaded(): boolean {
    return this.totalPartNumbers !== 0 && this.totalPartNumbers === this.childData.length;
  }

  childDataFilled(data: {
    firstDates: string[];
    staticValues: StaticValues[];
    data: any;
    partNumber: BasicParameters;
    sliderValues: number[];
    rangeDataSource: object[];
  }) {
    this.loadingText = data.partNumber.partNumber + '|' + data.partNumber.vendorCode;
    if (!data.staticValues) {
      data.staticValues = [];
    }
    data.staticValues.unshift({
      label: 'Plant',
      value: this.basicParameters?.plant,
      calculation: 'UNDEFINED',
      calculationrule: 'DEFAULT',
      calculationvalue: '0',
    });
    this.childData.push(data);
    if (data.data) {
      this.totalColumns = data.data.length;
    }
    if (!this.value || this.value.length === 0) {
      this.value = data.sliderValues;
    }
    if (!this.rangeDataSource || this.rangeDataSource.length === 0) {
      this.rangeDataSource = data.rangeDataSource;
    }
  }
  goToForecast(data: {partNumber: BasicParameters; index: number}) {
    this.navigateToForecast = true;
    this.router.navigate([`/material-management/supply-visibility`], {
      queryParams: {
        plant: this.basicParameters?.plant,
        vendorCode: data.partNumber.vendorCode,
        partNumber: data.partNumber.partNumber,
        weeks: this.basicParameters?.weeks,
        materialManagementViewID: this.basicParameters?.mmViewID,
        currentPartNumber: data.index || 0,
        widgetId: this.basicParameters?.widgetId,
      },
    });
  }
  downloadExcel() {
    console.error(this.childData);
    const result = this.supplyVisibilityService.downloadMultiPNSupplyVisibilityTable(
      this.childData
    );
    if (result) {
      this.notificationService.showErrorOrMessage(result, 'Error');
    }
    this.dialogRef.close();
  }
  rangeDataSource: object[]= [];
  value: number[]=[];

  changeWeekRange($event:any) {
    this.store.dispatch(new SliderChangeForMultiPN($event));
  }
}

function selectedPartNumberList(selectedPartNumberList: any) {
  throw new Error('Function not implemented.');
}
