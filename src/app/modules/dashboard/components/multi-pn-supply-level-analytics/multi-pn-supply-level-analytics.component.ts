import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../shared-imports';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { Router } from '@angular/router';
import { Select, Actions, ofActionDispatched, Store } from '@ngxs/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { DateService } from '../../../../services/Date/date.service';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { LanguageState } from '../../../auth/store/language/language.state';
import { Helper } from '../../../shared/helper';
import { RoundDecimalPipe } from '../../../shared/pipe/round-decimal.pipe';
import { Forecast, ForecastDetail } from '../../models/forecast.model';
import { StaticValues } from '../../models/StaticValuesDto';
import { BasicParameters } from '../../models/supply-visibility.model';
import { ApprovedVendorListService } from '../../services/Approved-Vendor-List/approved-vendor-list.service';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { GetMultiProjectionsError, SliderChangeForMultiPN } from '../../stores/supply-visibility/supply-visibility.actions';
import { ReplacePipe } from '../../../shared/pipe/replace.pipe';

@Component({
  selector: 'orion-platform-multi-pn-supply-level-analytics',
  standalone: true,
  imports: [...SHARED_IMPORTS,ProgressSpinnerComponent,ReplacePipe],
  templateUrl: './multi-pn-supply-level-analytics.component.html',
  styleUrl: './multi-pn-supply-level-analytics.component.scss'
})
export class MultiPnSupplyLevelAnalyticsComponent implements OnInit, OnDestroy {
  forecast$?: Observable<Forecast>;
  @Input() selectedPartNumber?: BasicParameters;
  @Input() indexInList = 0;
  @Input() weeks?:number = 0;
  @Input() cumulativeListParams:any;
  @Input() forecast: any;
  @Input() forecastDate: string[] = ['', ''];

  public store = inject(Store);

  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);

  // approvedVendorDetail: ApprovedVendorDetail;
  protected destroy$ = new Subject<boolean>();
  @Output() childDataFilled: EventEmitter<{
    fontSize: number;
    firstDates: string[];
    staticValues: StaticValues[];
    data: any;
    partNumber: BasicParameters;
    sliderValues: number[];
    rangeDataSource: object[];
  }> = new EventEmitter();
  @Output() goToForecastEvent: EventEmitter<{
    partNumber: BasicParameters;
    index: number;
  }> = new EventEmitter();
  @Input() fontSize:any;
  subscription: Subscription = new Subscription();
  infoMessage = false;
  showTable = true;
  loading = false;
  loadingFailed = false;
  dataSource:any;
  displayedColumns: any[] = [];
  columns: any[] = [];
  rangeColumns: any[] = [];
  queryParams = true;
  toolbar: string[] =[];
  pageSettings?: {pageSize: number};
  /* Range Navigator setting */

  intervalType = 'number';
  interval = 1;
  labelFormat?: string;
  labelPosition?: 'Outside';
  type = 'Range';
  value: number[] = [];
  xName = 'x';
  yName = 'y';
  tooltip = {enable: false, displayMode: 'Always'};
  allowSnapping = true;
  @Output() emitForecast = new EventEmitter<any>();
  @Output() reloadForecast = new EventEmitter<any>();

  navigatorStyleSettings = {
    thumb: {
      type: 'Rectangle',
    },
  };

  staticValues: StaticValues[] = [];
  openView: any = [];

  rangeDataSource: object[] = [];
  helperRangeDataSource: object[] = [];
  filteredColumns: any[]=[];
  validQuota = true;
  firstDates: string[]=[];

  currentLang: any;
  fontSizeClass = 'medium-font-size';
  private ngUnsubscribe = new Subject();

  constructor(
    private actions$: Actions,
    private roundDecimalPipe: RoundDecimalPipe,
    public approvedVendorService: ApprovedVendorListService,
    private supplyVisibilityService: SupplyVisibilityService,
    private dateService: DateService,
    private notificationService: NotificationService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {
    this.loading = true;
    this.currentLang$.subscribe((language: string) => (this.currentLang = language));
  }

  async ngOnInit() {
    this.toolbar = ['ExcelExport'];
    this.pageSettings = {pageSize: 10};
    this.setFontSizeClass();
    if (this.cumulativeListParams) {
      this.forecast$ = this.supplyVisibilityService.getCumulativeList(this.cumulativeListParams);

      this.subscription.add(
        this.forecast$.pipe(takeUntil(this.destroy$)).subscribe(
          async (forecast: Forecast) => {
            this.loadingFailed = false;
            this.postForecastProcess(forecast);
            this.detectChanges();
          },
          (error) => {
            if (this.cumulativeListParams) {
              this.validQuota = false;
              if (error.error && error.error.detail)
                this.notificationService.showError(error.error.detail);
            }
            this.loading = false;
            this.loadingFailed = true;
            this.emitForecast.emit({ forecast: null, loadFailed: true });
            this.detectChanges();
          }
        )
      );
    }
    // await this.fetchAVDetails();
    this.catchGetMultiProjectionError();
  }
  ngAfterViewInit() {
    this.detachChangeDetection();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['forecast'] && changes['forecast'].currentValue) {
      this.loadingFailed = false;
      this.postForecastProcess(changes['forecast'].currentValue);
      this.detectChanges();
    }
  }

  catchGetMultiProjectionError() {
    this.actions$
      .pipe(ofActionDispatched(GetMultiProjectionsError))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((error) => {
        this.loading = false;
        this.loadingFailed = true;
        this.detectChanges();
      });
  }

  reloadPN($event: any) {
    $event.stopPropagation();

    this.loadingFailed = false;
    this.loading = true;
    this.detectChanges();
    this.reloadForecast.emit(true);
  }

  postForecastProcess(forecast:any) {
    let partNumber, vendorCode, view, weeks, plant;

    this.emitForecast.emit({forecast: forecast, loadFailed: false});

    if (this.cumulativeListParams) {
      partNumber = forecast.partNumber || '';
      vendorCode = forecast.vendorCode || '';
      view = this.cumulativeListParams.MaterialManagementViewID || '';
      plant = this.cumulativeListParams.Plant;
      weeks = this.cumulativeListParams.Weeks || 26;
    } else {
      partNumber = this.selectedPartNumber?.partNumber;
      vendorCode = this.selectedPartNumber?.vendorCode;
      view = this.selectedPartNumber?.mmViewID;
      plant = this.selectedPartNumber?.plant;
      weeks = this.weeks || 26;

      this.isValidQuota(this.selectedPartNumber?.partNumber, this.selectedPartNumber?.vendorCode);
    }

    this.staticValues = [];
    this.staticValues.push({
      label: 'PN',
      value: partNumber,
      calculation: '',
      calculationrule: '',
      calculationvalue: '',
    });
    this.staticValues.push({
      label: 'Vendor Code',
      value: vendorCode,
      calculation: '',
      calculationrule: '',
      calculationvalue: '',
    });

    this.openView = {
      view: view,
      vendorCode: vendorCode,
      weeks: weeks || 26,
      plant: plant,
    };

    if (forecast.staticvalues.length > 0) {
      forecast.staticvalues.forEach((sv: any) => {
        let parsedFormat = '0-0';
        try {
          if (sv.calculationconditionalformat && sv.calculationconditionalformat.format) {
            parsedFormat = JSON.parse(sv.calculationconditionalformat.format).singleValue;
          }
        } catch (e) {}
        sv.value = this.roundDecimalPipe.transform(sv.value, parsedFormat);

        this.staticValues.push(sv);
      });
    }

    if (forecast.projectionDetails.length > 0) {
      this.displayedColumns = [];
      this.rangeColumns = [];
      this.columns = [];
      const start = forecast.projectionDetails[0].week;
      const end = start + forecast.projectionDetails.length;
      this.value = [start, end];
      try {
        this.transform(forecast);
        this.filteredColumns = this.columns.filter((c) => c.visible);
        this.loading = false;
      } catch (error) {
        if (this.cumulativeListParams && this.selectedPartNumber) {
          this.selectedPartNumber.$loaded = true;
        }
      }
    }
  }
  // private async fetchAVDetails() {
  //   await this.approvedVendorService.getApprovedVendorDetail(this.selectedPartNumber).subscribe(
  //     (avlDetailResult: ApprovedVendorDetailResult) => {
  //       const infoRecordFiltered = avlDetailResult.infoRecords.filter(
  //         infoRecord => infoRecord.infoRecordCategory == "2"
  //       );
  //       let avlDetail: ApprovedVendorDetail = <ApprovedVendorDetail><unknown>avlDetailResult;
  //       avlDetail.infoRecord = infoRecordFiltered[0];
  //       //buyer
  //       if (avlDetailResult && avlDetailResult.contacts) {
  //         const contactsFiltered = avlDetailResult.contacts.filter(
  //           contact => contact.contactType == "Buyer"
  //         );
  //         if (avlDetail) { avlDetail.avlBuyer = contactsFiltered[0]; }
  //       }
  //       this.approvedVendorDetail = avlDetail;
  //       this.selectedPartNumber.$avlLoaded = true;
  //       this.fillAVLDetailsSend2Parent();

  //     },
  //     (error: any) => {
  //       this.selectedPartNumber.$avlLoaded = true;
  //     }
  //   );
  // }

  private generateWeekRangeDate(forecastDetail: ForecastDetail[]): object[] {
    const data: object[] = [];
    forecastDetail.forEach((item) => {
      data.push({
        x: item.sequence,
        y: 0,
      });
    });
    return data;
  }

  private roundFunction(value: any, precision: number) {
    if (typeof value == 'number') {
      if (Math.floor(value.valueOf()) === value.valueOf()) return value;
      const size = value.toString().split('.')[1].length || 0;
      if (size > 2) {
        return value.toFixed(precision);
      }
      return value;
    }
    return
  }

  //Transform forecast data for datagrid.
  public transform(forecast: Forecast) {
    const rawData: ForecastDetail[] = forecast.projectionDetails;
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
        field: `Record ${q}_${index}`,
        headerText: rawData[index].label,
        width: 120,
        textAlign: 'Right',
        visible: true,
        format: {maximumFractionDigits: 2, minimumFractionDigits: 2},
      });
      this.rangeColumns.push({label: 'Record ' + q, value: q});
    }
    this.firstDates = [];
    for (let index = 0; index < rawData.length; index++) {
      const q = rawData[index];
      //const date = this.createDate(q.firstDateOfWeek);
      const date = this.dateService.getDate(q.date, this.currentLang.code);

      this.firstDates.push(this.createDate(q.date));
      try {
        (<any>this.columns[index + 1]).date = date;
      } catch (error) {}
    }
    for (let r = 0; r < rows.length; r++) {
      const item: any = {};
      item[this.columns[0].field] = rows[r];
      item['c_' + this.columns[0].field] = rows[r];
      for (let c = 0; c < columns.length; c++) {
        let tFormat = '0-0';
        try {
          tFormat = JSON.parse(columns[c][r].format.format).multiValues;
        } catch (e) {}
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

    // inform parent that loading is complete and send all data to parent so that they can manage export.
    this.helperRangeDataSource = this.generateWeekRangeDate(forecast.projectionDetails);
    if (this.helperRangeDataSource.length !== this.rangeDataSource.length) {
      this.rangeDataSource = this.helperRangeDataSource;
    }
    // value: `${this.approvedVendorDetail.avlBuyer.firstName} ${this.approvedVendorDetail.avlBuyer.lastName}`
    if (!this.cumulativeListParams && this.selectedPartNumber) {
      this.selectedPartNumber.$loaded = true;
    }
    this.fillAVLDetailsSend2Parent();
  }
  private fillAVLDetailsSend2Parent() {
    this.childDataFilled.emit({
      fontSize: Helper.formatFontsize(this.fontSize),
      firstDates: this.firstDates,
      staticValues: this.staticValues,
      data: this.dataSource,
      partNumber: this.selectedPartNumber as BasicParameters,
      sliderValues: this.value,
      rangeDataSource: this.rangeDataSource,
    });
  }

  addDate(item: any, date: string) {
    item.date = date;
    return item;
  }
  createDate(weekStartDate :any) {
    if (weekStartDate) {
      const firstDayOfWeek = new Date(weekStartDate);
      return firstDayOfWeek.toLocaleDateString('cs-CZ');
    }
    return '';
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.handleCallCancelled();
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
  catchSliderChangeForMultiPN() {
    this.actions$.pipe(ofActionDispatched(SliderChangeForMultiPN)).subscribe((data) => {
      this.changeWeekRange(data.data);
      this.detectChanges();
    });
  }
  protected handleCallCancelled() {
    if (this.destroy$) {
      this.destroy$.next(true);
      // This completes the subject property.
      this.destroy$.complete();
    }
  }
  trackByFn(index:number, item:any) {
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

  getClass(row:any, col: any, index: number): string {
    let clsFirstCol = '';
    if (index === 0) {
      clsFirstCol = 'mw-200';
    }

    if (col.field.startsWith('Week')) {
      if (row['f_' + col.field]) {
        const format = row['f_' + col.field];
        if (format) return `clsFirstCol bg-${format.backgroundcolor} border-${format.bordercolor}`;
        else return clsFirstCol;
      }
    }
    return clsFirstCol;
  }

  getClasses(field:any) {
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
  customiseCell(args: any) {
    if (args.column.field.startsWith('Week')) {
      if (args.data['f_' + args.column.field]) {
        const formatStyle = args.data['f_' + args.column.field];
        args.cell.classList.add('bg-' + formatStyle.backgroundcolor);
        args.cell.classList.add('border-' + formatStyle.bordercolor);
      }
    }
  }
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

  async isValidQuota(partNumber?:string, vendorCode?:string) {
    if (vendorCode && vendorCode !== undefined && vendorCode.trim() !== 'VirtualVC' && vendorCode.trim() !== '') {
      const res = await this.supplyVisibilityService
        .getValidCombination(partNumber, vendorCode)
        .toPromise();
      this.validQuota = res.isValidQuota ? res.isValidQuota : false;
    }
  }
  goToForecast() {
    /*
    this.goToForecastEvent.emit({
      partNumber: this.selectedPartNumber,
      index: this.indexInList,
    });
    */
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/material-management/supply-visibility'],
      {
        queryParams: {
          plant: this.selectedPartNumber?.plant,
          vendorCode: this.selectedPartNumber ? this.selectedPartNumber.vendorCode : undefined,
          partNumber: this.selectedPartNumber ? this.selectedPartNumber.partNumber : undefined,
          records: this.selectedPartNumber?.records,
          variant: this.selectedPartNumber?.variant,
          materialManagementViewID: this.selectedPartNumber?.mmViewID,
          currentPartNumber:  0,
          widgetId: this.selectedPartNumber?.widgetId,
          fontSize: this.fontSize,
          widgetName: null,
          child: false
        }
      })
    )
    window.open(url, '_blank');
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
  private detectChanges() {
    this.ref.detectChanges();
  }
  private detachChangeDetection() {
    this.ref.detach();
  }

}
