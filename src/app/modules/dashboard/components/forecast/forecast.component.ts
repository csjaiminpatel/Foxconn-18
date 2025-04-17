import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { ActivatedRoute } from '@angular/router';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { DateService } from '../../../../services/Date/date.service';
import { LanguageState } from '../../../auth/store/language/language.state';
import { Helper } from '../../../shared/helper';
import { Forecast, RangeData, ForecastDetail, ForecastDate } from '../../models/forecast.model';
import { BasicParameters } from '../../models/supply-visibility.model';
import { SupplyVisibilityCommentService } from '../../services/Supply-Visibility-Comment/supply-visibility-comment.service';
import { SupplyVisibilityNotesService } from '../../services/Supply-Visibility-Notes/supply-visibility-notes.service';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { SetForecastError, SetForecastSuccess, SetForecast, AddCommitSuccess, AddDummyCommitSuccess, EditCommitSuccess, EditDummyCommitSuccess, DeleteCommitSuccess, DeleteDummyCommitSuccess } from '../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';
import { StaticValues } from '../../models/StaticValuesDto';
import { RoundDecimalPipe } from '../../../shared/pipe/round-decimal.pipe';
import { ReplacePipe } from '../../../shared/pipe/replace.pipe';
import { RangeNavigatorComponent } from '../range-navigator/range-navigator.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SvDataFormatterPipe } from '../../../shared/pipe/sv-data-formatter.pipe';

@Component({
  selector: 'orion-platform-forecast',
  standalone: true,
  imports: [TranslateModule,CommonModule,ProgressSpinnerComponent,ReplacePipe,RangeNavigatorComponent , MatIconModule ,MatMenuModule,SvDataFormatterPipe ],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent implements OnInit, OnDestroy {
  @Select(SupplyVisibilityState.getForecast) forecast$?: Observable<Forecast>;
  private ngUnsubscribe = new Subject();
  subscription: Subscription = new Subscription();
  infoMessage = false;
  showTable = true;
  loading = true;
  showRangeNav = true;
  dataSource : any;
  columns: any[] = [];
  rangeColumns: any[] = [];
  queryParams = true;
  toolbar: string[] = [];
  parentPN: any;
  pageSettings?: { pageSize: number };
  @Input() fontSize :any;
  fontSizeClass = 'medium-font-size';
  rangeData?: RangeData;

  /* Range Navigator setting */

  intervalType = 'number';
  interval = 1;
  labelFormat?: string;
  labelPosition?: 'Outside';
  type = 'Range';
  value: number[] = [];
  xName = 'x';
  yName = 'y';
  tooltip = { enable: false, displayMode: 'Always' };
  allowSnapping = true;

  navigatorStyleSettings = {
    thumb: {
      type: 'Rectangle',
    },
  };

  @Input() windowID :any;
  @Input() expandViewState?: boolean;
  @Input() indexInList = 0;
  @Input() explicitForecast?: Forecast;
  @Output() expandViewHandler: EventEmitter<boolean> = new EventEmitter();

  @Input() hasExpandView = false;
  @Input() expandContentLoaded = false;
  @Output() goToForecastEvent: EventEmitter<{
    partNumber: BasicParameters;
    index: number;
    isChildList: boolean;
  }> = new EventEmitter();
  @Output() downloadVirtualPNExcel: EventEmitter<any> = new EventEmitter();

  staticValues: StaticValues[] = [];
  rangeDataSource: object[] = [];
  helperRangeDataSource: object[] = [];
  filteredColumns: any[] = [];
  firstDates: string[] = [];

  @Input() validQuota?: boolean;
  @Input() basicParameters?: BasicParameters;
  // @Input() approvedVendorDetail;
  @Input() isFromSinglePnExport?: boolean;
  @Output() isSinglePnExportFinished: EventEmitter<{
    state: boolean;
    Msg: string;
  }> = new EventEmitter();

  @Select(SupplyVisibilityState.getChildrenPNInfo)
  parentPN$?: Observable<any>;
  @Select(LanguageState.getCurrentLang) currentLang$?: Observable<string>;
  currentLang: any;
  lastWeek = 0;
  currentYear = 0;
  forecastDate: any = ['', ''];
  variant?: string;

  constructor(
    private roundDecimalPipe: RoundDecimalPipe,
    private store: Store,
    private route: ActivatedRoute,
    private actions$: Actions,
    private supplyVisibilityCommentService: SupplyVisibilityCommentService,
    private supplyVisibilityNotesService: SupplyVisibilityNotesService,
    private supplyVisibilityService: SupplyVisibilityService,
    private dateService: DateService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;
    this.toolbar = ['ExcelExport'];
    this.pageSettings = { pageSize: 10 };
    this.setFontSizeClass();
    this.parentPN$?.pipe(takeUntil(this.ngUnsubscribe)
    ).subscribe(parentPN => {
      if (parentPN) {
        this.parentPN = parentPN.parentPnInfo;
      }
    })
    this.currentLang$?.subscribe((language: string) => {
      this.currentLang = language;
      //Apply Value From Direct Forecast
      if (this.explicitForecast) {
        this.onForecastReceiveProcess(this.explicitForecast);
        //  Helper.detachChangeDetection(this.ref);
      }
    });
    if (!this.explicitForecast) {
      this.catchAddCommitSuccess();
      this.forecast$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((forecast: Forecast) => {
        this.onForecastReceiveProcess(forecast);
      })

      this.subscription.add(
        this.route.queryParams.subscribe((res) => {
          this.staticValues = [];
        })
      );
    }

    this.catchEditCommitSuccess();
    this.catchEditDummyCommitSuccess();
    this.catchDeleteCommitSuccess();
    this.catchDeleteDummyCommitSuccess();
    this.catchAddDummyCommitSuccess();

    //Stop Automatic Export On Forecast Error
    if (this.isFromSinglePnExport) {
      this.catchSetForecastError();
    }
    this.catchSetForecastSuccess();
    this.catchSetForecast();

    this.setForecastDate();
  }
  onForecastReceiveProcess(forecast: Forecast) {
    this.loading = true;
    this.variant = forecast.variant;
    this.staticValues = [];
    if (forecast.staticvalues.length > 0) {
      forecast.staticvalues.map((sv: any) => {
        sv = { ...sv };
        let parsedFormat = '0-0';
        try {
          if (sv.calculationconditionalformat) {
            parsedFormat = JSON.parse(sv.calculationconditionalformat.format).singleValue;
          }
        } catch (e) { }

        sv.value = this.roundDecimalPipe.transform(sv.value, parsedFormat);
        this.staticValues.push(sv);
      });
    }

    if (forecast.projectionDetails.length > 0) {
      this.rangeColumns = [];
      this.columns = [];
      const start = forecast.projectionDetails[0].week;
      const end = start + (forecast.projectionDetails.length - 1);
      this.value = [start, end];
      this.transform(forecast.projectionDetails);

      this.helperRangeDataSource = this.generateWeekRangeDate(forecast.projectionDetails);
      if (this.helperRangeDataSource.length !== this.rangeDataSource.length) {
        //rangeDataSource is changed while passing it to range-navigator component via pipe
        this.rangeDataSource = this.helperRangeDataSource;
      }
    }
    setTimeout(async () => {
      this.loading = false;
      this.showRangeNav = this.value && this.value.length ? true : false;

      //Automatic Excel Export
      if (this.isFromSinglePnExport) {
        let response = await this.downloadExcel();
        let result;
        if (response !== undefined) {
          result = { state: false, Msg: 'Error' };
        } else {
          result = { state: true, Msg: 'Success' };
        }
        this.isSinglePnExportFinished.emit(result);
      }
    }, 500);
  }

  goToForecast() {
    let parentPNs = this.supplyVisibilityService.getParentPN();
    let index = parentPNs.findIndex((obj:any) => obj.partNumber == this.parentPN.partNumber);

    this.goToForecastEvent.emit({
      partNumber: this.basicParameters as BasicParameters,
      index: (index + 1) + this.indexInList,// Set childPN index to finding their parentPN index
      isChildList: true
    });
  }

  catchSetForecastError() {
    this.actions$
      .pipe(ofActionDispatched(SetForecastError), takeUntil(this.ngUnsubscribe))
      .subscribe((error) => {
        this.loading = false;
        const data = { isForecastLoaded: true };
        this.supplyVisibilityService.setLoadingDetail(data);
        const result = { state: false, Msg: 'Failed' };
        this.isSinglePnExportFinished.emit(result);
      });
  }
  catchSetForecastSuccess() {
    this.actions$
      .pipe(ofActionDispatched(SetForecastSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loading = false;
        if (this.basicParameters?.vendorCode != 'VirtualVC') {
          const data = { isForecastLoaded: true };
          this.supplyVisibilityService.setLoadingDetail(data);
        }
      });
  }
  catchSetForecast() {
    this.actions$
      .pipe(ofActionDispatched(SetForecast), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loading = true;
      });
  }
  /**
   * Catch Add Commit Success
   * @memberof CommitHistoryComponent
   */
  catchAddCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(AddCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  /**
   * Catch Add dummy Commit Success
   * @memberof CommitHistoryComponent
   */
  catchAddDummyCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(AddDummyCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  /**
   * Catch Edit Commit Success
   * @memberof CommitHistoryComponent
   */
  catchEditCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(EditCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  catchEditDummyCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(EditDummyCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  /**
   * Catch Delete Commit Success
   * @memberof CommitHistoryComponent
   */
  catchDeleteCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(DeleteCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  /**
   * Catch Delete Dummy Commit Success
   * @memberof CommitHistoryComponent
   */
  catchDeleteDummyCommitSuccess() {
    this.actions$
      .pipe(ofActionDispatched(DeleteDummyCommitSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.store.dispatch(new SetForecast());
      });
  }

  triggerExpandView() {
    this.expandViewState = !this.expandViewState;
    this.expandViewHandler.emit(this.expandViewState);
  }

  private generateWeekRangeDate(forecastDetail: ForecastDetail[]): object[] {
    const data:any[] = [];
    forecastDetail.forEach((item, index) => {
      data.push({
        x: item.sequence,
        y: item.sequence,
      });
    });

    return data;
  }

  private roundFunction(value: any, precision: number) {
    try {
      if (typeof value == 'number') {
        if (Math.floor(value.valueOf()) === value.valueOf()) return value;
        const size = value.toString().split('.')[1].length || 0;
        if (size > 2) {
          return value.toFixed(precision);
        }
        return value;
      } return
    } catch (error) {
      console.log('Not possible round value: ' + value);
      return undefined;
    }
  }

  //Transform forecast data for datagrid.
  private transform(rawData: ForecastDetail[]) {
    let rows = [];
    const weeks = rawData.map((q) => q.week);
    const columns = [];
    const result = [];
    this.columns.length = 0;
    rows = rawData[0].values.map((q) => {
      return q.label;
    });
    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i].values.map((q) => {
        return {
          value: this.roundFunction(q.value, 6),
          calculation: q.calculation,
          format: q.calculationconditionalformat,
        };
      });

      columns.push(item);
    }

    this.columns.push({
      isFrozen: true,
      field: 'label',
      headerText: 'Label',
      width: 150,
      textAlign: 'Left',
      visible: false,
    });

    for (let index = 0; index < weeks.length; index++) {
      const q = weeks[index];
      this.columns.push({
        field: `Week ${q}_${index}`,
        headerText: rawData[index].label,
        width: 120,
        textAlign: 'Right',
        visible: true,
        format: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
      });
      this.rangeColumns.push({ label: 'Week ' + q, value: q });
    }
    this.firstDates = [];
    for (let index = 0; index < rawData.length; index++) {
      const q = rawData[index];
      //const date = this.createDate(q.firstDateOfWeek);
      const date = this.dateService.getDate(q.date, this.currentLang.code);
      this.firstDates.push(this.createDate(q.date));
      try {
        (<any>this.columns[index + 1]).date = date;
      } catch (error) { }
    }

    for (let r = 0; r < rows.length; r++) {
      const item: any = {};
      item[this.columns[0].field] = rows[r];
      item['c_' + this.columns[0].field] = rows[r];
      for (let c = 0; c < columns.length; c++) {
        let tFormat = '0-0';
        try {
          tFormat = JSON.parse(columns[c][r].format.format).multiValues;
        } catch (e) { }

        item[this.columns[c + 1].field] = this.roundDecimalPipe.transform(
          columns[c][r].value,
          tFormat
        );
        item['c_' + this.columns[c + 1].field] = columns[c][r].calculation;
        item['f_' + this.columns[c + 1].field] = columns[c][r].format;
      }

      result.push(item);
    }
    this.dataSource = result;
  }

  addDate(item : any, date:any) {
    item.date = date;
    return item;
  }

  createDate(weekStartDate: string | number) {
    if (weekStartDate) {
      const firstDayOfWeek = new Date(weekStartDate);
      return firstDayOfWeek.toLocaleDateString('cs-CZ');
    }
    return '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  trackByFn(index : number, item : any) {
    return index;
  }

  // /**
  //  * Range Navigator Renge render
  //  * @param {ILabelRenderEventsArgs} args
  //  * @memberof ForecastComponent
  //  */
  // labelRender(args: ILabelRenderEventsArgs) {
  //   const { value } = args;
  //   args.text = `${value > 52 ? value - 52 : value}`;
  // }

  /**
   * Data filter by Range Navigator
   * @param {IChangedEventArgs} args
   * @memberof ForecastComponent
   */
  changeWeekRange(data: any) {
    if (this.rangeColumns && this.rangeColumns.length > 0) {
      const start = this.rangeColumns[0].value;
      for (let index = 0; index < this.rangeColumns.length; index++) {
        const q = this.rangeColumns[index];
        const show = index + start >= data.start && index + start <= data.end;
        if (this.columns && this.columns[index + 1]) {
          this.columns[index + 1].visible = show;
        }
      }
    } else {
    }
    this.filteredColumns = this.columns.filter((c) => c.visible);
  }

  getClasses(field :any) {
    const classes = ['sv-cell'];
    if (field && field !== null && field != 'undefined') {
      if (field.bordercolor) {
        classes.push(
          'border-' + field.bordercolor + '-' + (field.borderwidth ? field.borderwidth : 'medium')
        );
      }
      if (field.backgroundcolor) {
        classes.push('bg-' + field.backgroundcolor);
      }
    }
    if (this.fontSize) {
      classes.push(this.fontSize);
    }

    return classes.join(' ');
  }

  async downloadExcel() {
    //For download parent and children's excel data
    if (this.basicParameters?.vendorCode == 'VirtualVC') {
      this.downloadVirtualPNExcel.emit(false);
    } else {
      //For download individual PN excel data
      const daterangeParams = this.store.selectSnapshot(SupplyVisibilityState.getDaterangeParameters);
      const { dateFrom, dateTo } = daterangeParams;
      const { mmViewID, records, partNumber, vendorCode, plant, variant} = this.basicParameters || {};
      const fontSize = this.fontSize || 'small';
      const data = {
        mmViewID: mmViewID,
        records: records,
        fontSize: fontSize,
        dateFromValue: dateFrom,
        dateToValue: dateTo,
        partNumber: partNumber,
        vendorCode: vendorCode,
        plant: plant,
        variant: variant
      }

      this.supplyVisibilityService.svUrlList = [];
      this.supplyVisibilityService.svUrlList.push(this.supplyVisibilityService.getUrlForForecastWithParams(this.basicParameters as BasicParameters, this.supplyVisibilityService.dummyCommitHeaderForExcel));
      await this.supplyVisibilityService.downloadSupplyVisibility(data, false);
    }
  }

  async downloadExcelWithCommentsNotes() {
    //For download parent and children's excel data
    if (this.basicParameters?.vendorCode == 'VirtualVC') {
      this.downloadVirtualPNExcel.emit(true);
      return
    }

    //For download individual PN excel data
    else {
      this.isFetchingData = true;
      const exportData = await this.getExcelDataWithComments();
      this.isFetchingData = false;

      return this.supplyVisibilityService.downloadSupplyVisibility(exportData, true);
    }
  }

  public getForecastExcelData() {
    const exportData = {
      forecastDate: [this.forecastDate[0], this.forecastDate[1][0]],
      fontSize: Helper.formatFontsize(this.fontSize),
      staticValues: [...this.staticValues],
      data: [...this.dataSource],
      firstDates: [...this.firstDates],
    };

    if (!this.explicitForecast) {
      exportData.staticValues.unshift({
        label: 'Vendor Code',
        value:  (this.basicParameters && this.basicParameters.vendorCode) ? this.basicParameters.vendorCode : '',
        calculation: 'UNDEFINED',
        calculationrule: 'DEFAULT',
        calculationvalue: '0',
      });
      exportData.staticValues.unshift({
        label: 'PN',
        value: (this.basicParameters && this.basicParameters.partNumber) ? this.basicParameters.partNumber : '',
        calculation: 'UNDEFINED',
        calculationrule: 'DEFAULT',
        calculationvalue: '0',
      });
    }

    exportData.staticValues.unshift({
      label: 'Plant',
      value: (this.basicParameters && this.basicParameters.plant) ?this.basicParameters.plant : '',
      calculation: 'UNDEFINED',
      calculationrule: 'DEFAULT',
      calculationvalue: '0',
    });

    return exportData;
  }

  isFetchingData = false;



  async getExcelDataWithComments() {
    this.supplyVisibilityService.getUrlForForecastWithParams(this.basicParameters  as BasicParameters, this.supplyVisibilityService.dummyCommitHeaderForExcel);
    return this.basicParameters;
  }

  async getExcelDataWithComments2() {
    this.supplyVisibilityService.getUrlForForecastWithParams(this.basicParameters as BasicParameters);

    let exportData;
    try {
      const vendorCode = (this.basicParameters && this.basicParameters.vendorCode) ? this.basicParameters.vendorCode : '';
      const partNumber = this.basicParameters?.partNumber ? this.basicParameters.partNumber : '';
      const module = 'SupplyVisibility';
      const notesKey = 'VC:' + vendorCode + ';PN:' + partNumber;

      let comments = await this.supplyVisibilityCommentService
        .getSVCommentsByVendorPN(vendorCode, partNumber)
        .toPromise()
        .catch((error) => {
          comments = undefined;
        });
      let notes = await this.supplyVisibilityNotesService
        .getSVNotesByRecord(module, notesKey, undefined, 0, 0)
        .toPromise()
        .catch((error) => {
          notes = undefined;
        });


      exportData = {
        forecastDate: [this.forecastDate[0], this.forecastDate[1][0]],
        fontSize: Helper.formatFontsize(this.fontSize),
        staticValues: [...this.staticValues],
        data: [...this.dataSource],
        firstDates: [...this.firstDates],
        comments: comments,
        notes: notes,
      };

      if (!this.explicitForecast) {
        exportData.staticValues.unshift({
          label: 'Vendor Code',
          value: (this.basicParameters && this.basicParameters.vendorCode) ? this.basicParameters.vendorCode : '',
          calculation: 'UNDEFINED',
          calculationrule: 'DEFAULT',
          calculationvalue: '0',
        });
        exportData.staticValues.unshift({
          label: 'PN',
          value: (this.basicParameters && this.basicParameters.partNumber) ? this.basicParameters.partNumber : '',
          calculation: 'UNDEFINED',
          calculationrule: 'DEFAULT',
          calculationvalue: '0',
        });
      }

      exportData.staticValues.unshift({
        label: 'Plant',
        value: (this.basicParameters && this.basicParameters.plant) ? this.basicParameters.plant : '',
        calculation: 'UNDEFINED',
        calculationrule: 'DEFAULT',
        calculationvalue: '0',
      });

      return exportData;
      //end todo
    } catch (error) {
      return undefined;
     }
  }

  setFontSizeClass() {
    switch (this.fontSize) {
      case 'small':
        this.fontSizeClass = 'small-font-size';
        break;
      case 'medium':
        this.fontSizeClass = 'medium-font-size';
        break;
      case 'large':
        this.fontSizeClass = 'large-font-size';
        break;
    }
  }

  setForecastDate() {
    this.supplyVisibilityService.getForecastDate().subscribe((res: ForecastDate) => {
      this.forecastDate = res.date ? this.dateService.getForecastDate(res.date) : ['', ''];
    });
  }
}
