import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Subject, Observable, filter, takeUntil, distinctUntilChanged } from 'rxjs';
import { ServerErrorInterceptor } from '../../../../auth/interceptors/server-error.interceptor';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { Helper } from '../../../../shared/helper';
import { MaterialManagementViews } from '../../../models/material-management-views.model';
import { BuyersPartnumbersResult, BuyersPartnumbers } from '../../../models/mm-buyers-partnumbers.model';
import { VendorParametersFilter, EnumMMViews, BasicParameters } from '../../../models/supply-visibility.model';
import { PanelCache, DashboardPanelModel, TabFilterForWidget, AdditionalFilter, WidgetSettingsVisibility } from '../../../models/sv-dashboard';
import { BuyersPartnumbersListService } from '../../../services/Buyers-PartnumbersList/buyers-partnumbers-list.service';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { SetPartNumberListParameters, SetPartNumberListParametersSuccess } from '../../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../../stores/supply-visibility/supply-visibility.state';
import { BaseDashboardPanelComponent } from '../../base-dashboard-panel/base-dashboard-panel.component';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { DataErrorComponent } from '../../../../shared/components/data-error/data-error.component';
import { widgetHelper } from '../../../../shared/widgetHelper';
import { SinglePnExcelExportComponent } from '../single-pn-excel-export/single-pn-excel-export.component';
import { MultiPnExcelExportComponent } from '../multi-pn-excel-export/multi-pn-excel-export.component';

@Component({
  selector: 'orion-platform-simple-pn-list-widget',
  standalone: true,
  imports: [MatIconModule ,MatTooltipModule,ProgressSpinnerComponent,TranslateModule,CommonModule,NoDataComponent,DataErrorComponent,ScrollingModule,FormsModule,MatMenuModule,SortMenuComponent],
  templateUrl: './simple-pn-list-widget.component.html',
  styleUrl: './simple-pn-list-widget.component.scss'
})
export class SimplePnListWidgetComponent extends BaseDashboardPanelComponent {

  public override store = inject(Store);

  DEFAULT_WEEKS = 26;
  DEFAULT_DAYS = 5;
  DEFAULT_PLANT = 'LS51';
  DEFAULT_VIEW = '5ddbb80c26c15c16b843c5fa';
  DEFAULT_BUYER_LS51 = 'Sarka Desenska';
  DEFAULT_BUYER_CZ03 = 'Lucie Baierova';
  loading = true;
  USE_REAL_BUYER = true;
  buyersPartNumbersFilteredByVPNsList: BuyersPartnumbersResult;
  protected ngUnsubscribe = new Subject();
  stepByStepReview = true;
  widgetFilterReady: boolean = false;
  currentPartNumberIndex = 0;
  public readonly TOP = 0; //page size
  skip = 0;
  excelDownloading = false;
  showWeeks?: boolean;
  filterData: any;

  mmViews$: Observable<MaterialManagementViews[]> = this.store.select(SupplyVisibilityState.getMaterialManagementViews);

  @Input() widgetBehavior?: Observable<any>;

  @ViewChild(SortMenuComponent, { static: true }) sortMenu!: SortMenuComponent;
  selectedSort: any;
  REVIEW_BUYER_FLAG?: string;
  REVIEW_SUPPLIER_FLAG?: string;
  REVIEW_CUSTOMER_FLAG?: string;
  isMasterFilter: boolean = false;

  constructor(
    protected router: Router,
    public override translate: TranslateService,
    public override dialog: MatDialog,
    protected actions$: Actions,
    public override supplyVisibilityService: SupplyVisibilityService,
    protected notificationService: NotificationService,
    public supplyVisibilityBuyersPartNumbersService: BuyersPartnumbersListService
  ) {
    super(translate, dialog, supplyVisibilityService);
    this.buyersPartNumbersFilteredByVPNsList = { result: [], count: -1 };
  }
  vendorsPartNumbers?: VendorParametersFilter;


  buyersPartnumbers$: Observable<BuyersPartnumbers[]> = this.store.select(SupplyVisibilityState.getBuyersPartNumberList);

  buyersPartNumberListFilterByArg$: Observable<(vendorsPartNumbers: VendorParametersFilter) => BuyersPartnumbers[]> = this.store.select(SupplyVisibilityState.getBuyersPartNumberListFilterByArg);

  enumMMViews = EnumMMViews;
  viewStatus = this.enumMMViews.NO_DATA;
  override async ngOnInit() {
    this.REVIEW_BUYER_FLAG = Helper.REVIEW_BUYER_FLAG;
    this.REVIEW_SUPPLIER_FLAG = Helper.REVIEW_SUPPLIER_FLAG;
    this.REVIEW_CUSTOMER_FLAG = Helper.REVIEW_CUSTOMER_FLAG;

    await super.ngOnInit();
    if (this.widgetBehavior) {
      await this.widgetBehavior.pipe(
        filter(value => !!value), // Skip null values
        takeUntil(this.ngUnsubscribe)).subscribe((value) => {
          this.widgetFilterReady = true;
          // if (value){
          const enabledFilters = value.filters
            .filter((filter: any) => filter.enabled)
            .map((filter: any) => filter.filter);

          this.isMasterFilter = enabledFilters.length != 0 ? true : false;
          let filterQuery = enabledFilters.join(",")
          this.filterData = {
            // onlyMyPNs: value.onlyMyPns,
            filterQuery: filterQuery
          }
          if (value.onlyMyPns) {
            this.filterData['onlyMyPNs'] = value.onlyMyPns;
          }
          if (value.shouldFilter == false) {
            this.isMasterFilter = false;
            this.filterData = {};
          }
          this.refresh(this.filterData);
          // }
          // else {
          //    this.refresh();
          // }
        });
    }

    if (!this.widgetFilterReady) {
      this.fillData();
    }
    this.setWidgetCachedSettings();
    this.catchSetPartNumberListParametersSuccess();
    this.containerId += Math.ceil(Math.random() * 1000).toString();

    this.subscribeDashboardEvents(this);
  }
  ngAfterViewInit() {
    this.setSortMenuRefreshSub();
  }
  async ngOnDestroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  getAvailableViews() {
    if (this.dashboardPanelModel.modificationRights) {
      this.mmViews$
        .pipe(
          distinctUntilChanged((prev, cur) => {
            return Helper.compareArrayObjects(prev, cur, ['dateCreated']);
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((res) => {

          if (this.dashboardPanelModel && this.dashboardPanelModel.firstValue && this.dashboardPanelModel.firstValue.view) {
            const currentView = this.dashboardPanelModel.firstValue.view
            if (res && res.length) {
              if (res.find((x) => x.id === currentView)) {
                this.viewStatus = this.enumMMViews.FOUND;
              } else {
                this.viewStatus = this.enumMMViews.NOT_FOUND;
              }
            }
          }
        });
    }
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id
  }
  setSortMenuRefreshSub() {
    if (this.sortMenu) {
      this.sortMenu.refresh$.subscribe((res) => {
        try {
          this.selectedSort = res;
          const panelCache: PanelCache[] = widgetHelper.getSettingsWithSort(
            this.selectedSort,
            this.dashboardPanelModel.panelCache
          );

          this.fillData(this.filterData, panelCache);
          this.saveWidgetCache(this.store, panelCache);
        } catch (e) { }
      });
    }
  }
  /**
   * Set Widget Cached Values
   */
  setWidgetCachedSettings() {
    if (this.dashboardPanelModel.panelCache) {
      const { sort } = widgetHelper.getFormattedSettings(this.dashboardPanelModel.panelCache);
      this.selectedSort = sort;
    }
  }

  get activePlant(): string {
    return this.store.selectSnapshot(AuthenticationState.getActiveplant);
  }
  override refresh(filterData?: any) {
    this.selectedPartNumbers = [];
    if (
      this.buyersPartNumbersFilteredByVPNsList &&
      this.buyersPartNumbersFilteredByVPNsList.result
    ) {
      this.buyersPartNumbersFilteredByVPNsList.result.length = 0;
      this.buyersPartNumbersFilteredByVPNsList.$error = null;
    }
    if (filterData) {
      this.fillData(filterData);
    }
    else {
      this.fillData();
    }
  }

  get currentUser(): string {
    return this.store.selectSnapshot(AuthenticationState.username);
  }
  get currentUpn(): string {
    return this.store.selectSnapshot(AuthenticationState.upn);
  }
  loadMore() {
    this.skip += this.TOP;
    this.fillData();
  }

  protected async fillData(filterData?: any, sortingData?: any) {
    this.getAvailableViews();
    this.loading = true;
    let buyer = this.currentUpn;
    if (this.USE_REAL_BUYER === false) {
      buyer = this.DEFAULT_BUYER_LS51;
      if (this.activePlant !== this.DEFAULT_PLANT) {
        buyer = this.DEFAULT_BUYER_CZ03;
      }
    }
    if (filterData) {
      await this.fillDataFromFilter(this.dashboardPanelModel, buyer, true, filterData, (sortingData ? sortingData : null));
    }
    else {
      await this.fillDataFromFilter(this.dashboardPanelModel, buyer, true, null, (sortingData ? sortingData : null));
    }
  }

  protected async fillDataFromFilter(
    panelModel: DashboardPanelModel,
    buyer: string,
    calledForFirstValue = true,
    filterData?: any,
    sortingData?: any
  ) {
    // apply first value
    let filter = calledForFirstValue ? panelModel.firstValue : panelModel.secondValue;
    if (!filter) {
      filter = {};
    }

    // sorting value changed
    if (sortingData) {
      panelModel['panelCache'] = sortingData;
    }

    const dataFilter = filterData ? filterData : null;
    const {
      formula,
      vendors,
      buyers,
      contacts,
      flags,
      filterDeliveryTerms,
      filterTaxCodes,
      filterVirtualVC,
      filterVirtualVCIncludeChild,
      filterLeadtimeQuery,
      partNumbers,
      filterMaterialGroups,
      filterSearch,
      filterExcludeMaterialGroups,
      filterExcludeVendorCodes,
      customQuery,
      filterVariant,
      sorting
    } = this.getAPIFilters(filter, panelModel, buyer, dataFilter);

    try {
      let response = await this.supplyVisibilityBuyersPartNumbersService
        .getPNsPrecalculateProjectionByFilter(
          formula,
          vendors,
          buyers,
          partNumbers,
          flags,
          this.skip,
          this.TOP,
          filterDeliveryTerms,
          filterTaxCodes,
          filterVirtualVC,
          filterVirtualVCIncludeChild,
          filterLeadtimeQuery,
          filterMaterialGroups,
          filterSearch,
          filterExcludeMaterialGroups,
          filterExcludeVendorCodes,
          ((dataFilter && dataFilter.onlyMyPNs) ? dataFilter.onlyMyPNs : filter.onlyMyPNs) ? contacts.concat(buyer) : contacts,
          customQuery,
          filterVariant,
          false, //fulltextSearch
          false, //loadVendorName,
          sorting
        )
        .toPromise().catch((error) => {
          response = undefined;
          if (error.error) {
            throw new Error(error.error.detail || error.error.title || null);
          }
        });

      if (response) {
        if (calledForFirstValue) {
          this.buyersPartNumbersFilteredByVPNsList.count = response.count;
          const indexedCommit = Helper.setIndexFieldToArray(response.result);

          this.buyersPartNumbersFilteredByVPNsList.result = response.result;
          this.loading = false;
          this.calculatedVisibility(this);
        }
      }
      if (!response) {
        this.loading = false;
        throw new Error('Error while fetching part list');
      }

    } catch (error :any) {
      this.buyersPartNumbersFilteredByVPNsList.$error = error;
      this.loading = false;

      let errorMessage = error;
      if (error.error) {
        errorMessage = error.error.detail || error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      if (ServerErrorInterceptor.unauthorizedErrorOccurred === false) {
        this.notificationService.showError(
          `Error while loading data for "${this.dashboardPanelModel.title}": ${errorMessage} please check configuration of the widget.`
        );
      }
    }
    return partNumbers;
  }

  protected getAPIFilters(
    filter: TabFilterForWidget,
    panelModel: DashboardPanelModel,
    buyer: string,
    filterData?: any
  ) {
    let partNumbers:any = undefined;
    try {
      partNumbers = filter.partNumbers ? this.supplyVisibilityService.createPNVendorList(filter.partNumbers, undefined) : undefined;
    } catch (error) {
      console.log(error);
    }
    const partNumbersRe = /\n/gi;
    const filterSearch = filter.partNumbers ? filter.partNumbers.replace(partNumbersRe, ';') : undefined;
    const formula = filter.formula;
    const customQuery = filterData ? filterData.filterQuery : undefined;
    const additionalFilters = filter.filters;
    const filterVendorCodes = <string[]>this.getFilterList('filterVendorCodes', additionalFilters);
    const filterBuyers = <string[]>this.getFilterList('filterBuyers', additionalFilters);
    const filterContacts = <string[]>this.getFilterList('filterContacts', additionalFilters, true, true);
    const filterDeliveryTerms = <string[]>(
      this.getFilterList('filterDeliveryTerms', additionalFilters, true, true)
    );
    const filterTaxCodes = <string[]>this.getFilterList('filterTaxCodes', additionalFilters);
    const filterVirtualVC = <boolean>this.getFilterList('filterVirtualVC', additionalFilters);
    const filterVirtualVCIncludeChild = <boolean>this.getFilterList('filterVirtualVCIncludeChild', additionalFilters);
    const filterLeadtimeQuery = <string>(
      this.getFilterList('filterLeadtimeQuery', additionalFilters)
    );
    const vendors = filterVendorCodes ? filterVendorCodes : undefined;
    // const buyers = filter.onlyMyPNs
    //   ? buyer
    //     ? buyer
    //         .split(/\s+|,/)
    //         .map((c) => (c ? c.trim() : ''))
    //         .filter((c) => c)
    //     : null
    //   : filterBuyers
    //   ? filterBuyers
    //   : null;
    const buyers = filterBuyers ? filterBuyers : undefined;
    const contacts = filterContacts ? filterContacts : [];
    const filterMaterialGroups = <string[]>(
      this.getFilterList('filterMaterialGroups', additionalFilters)
    );
    const flags = <string[]>this.getFilterList('flags', additionalFilters);
    const filterExcludeVendorCodes = <string[]>(
      this.getFilterList('filterExcludeVendorCodes', additionalFilters)
    );
    const filterExcludeMaterialGroups = <string[]>(
      this.getFilterList('filterExcludeMaterialGroups', additionalFilters)
    );

    const filterVariant: string = filter.weeks ? 'Weekly' : 'Daily';
    const sorting: string = this.supplyVisibilityBuyersPartNumbersService.convertSortingString(panelModel);

    return {
      formula,
      vendors,
      buyers,
      contacts,
      flags,
      filterDeliveryTerms,
      filterTaxCodes,
      filterVirtualVC,
      filterVirtualVCIncludeChild,
      filterLeadtimeQuery,
      partNumbers,
      filterMaterialGroups,
      filterSearch,
      filterExcludeVendorCodes,
      filterExcludeMaterialGroups,
      customQuery,
      filterVariant,
      sorting
    };
  }

  getFilterList(
    arg0: string,
    filters: AdditionalFilter[] = [],
    ignoreSpace = false,
    useSemicolon = false
  ): string[] | boolean | string | undefined {
    if (filters && filters.length > 0) {
      const filter = filters.find((c) => c.field === arg0);
      if (filter) {
        if (arg0 === 'filterLeadtimeQuery') {
          return filter.value ? filter.operator + filter.value : undefined;
        } else if (arg0 === 'filterVirtualVC') {
          return filter.value; // true false or null
        }
        // else if (arg0 === 'reviewStatus') {
        //   return filter.value === EnumReviewedStatus.OnlyReviewedPNs
        //     ? [this.REVIEW_FLAG_KEY]
        //     : filter.value === EnumReviewedStatus.ToBeReviewed
        //     ? ['!' + this.REVIEW_FLAG_KEY]
        //     : [];
        // }
        else if (arg0 === 'filterVirtualVCIncludeChild') {
          return filter.value; // true, false or null
        } else {
          if (ignoreSpace) {
            if (useSemicolon) {
              return filter.value
                ? filter.value
                  .split(/;/)
                  .map((c:any) => (c ? c.trim() : ''))
                  .filter((c:any) => c)
                : [];
            } else {
              return filter.value
                ? filter.value
                  .split(/,/)
                  .map((c:any) => (c ? c.trim() : ''))
                  .filter((c:any) => c)
                : [];
            }
          } else {
            if (useSemicolon) {
              return filter.value
                ? filter.value
                  .split(/\s+|;/)
                  .map((c:any) => (c ? c.trim() : ''))
                  .filter((c:any) => c)
                : [];
            } else {
              return filter.value
                ? filter.value
                  .split(/\s+|,/)
                  .map((c:any) => (c ? c.trim() : ''))
                  .filter((c:any) => c)
                : [];
            }
          }
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  showSupplyVisibility(partNumber: BuyersPartnumbers, index = 0) {
    this.currentPartNumberIndex = index;
    this.onReviewClick(true);
  }

  selectedPartNumbers:any[] = [];
  addElementInArray(partNumber: BuyersPartnumbers) {
    const index = this.selectedPartNumbers.indexOf(partNumber);
    if (partNumber.$selected) {
      this.selectedPartNumbers.push(partNumber);
    } else if (!partNumber.$selected) {
      this.selectedPartNumbers.splice(index, 1);
    }
  }
  //---------------Download Excels
  isSinglePnExcelExport?: boolean;
  dialogDownload = false;

  async initPnExcelExportPrecalculations(comments = false) {
    if (this.viewStatus != this.enumMMViews.NOT_FOUND) {
      const currentView =
        (this.dashboardPanelModel.firstValue
          ? this.dashboardPanelModel.firstValue.view
          : this.DEFAULT_VIEW) || this.DEFAULT_VIEW;
      const records = this.getRecordValue();
      const variant = this.showWeeks ? 'Weekly' : 'Daily';
      const plant = this.activePlant;
      const userId = this.store.selectSnapshot(AuthenticationState.primarySid);
      let fontSize = Helper.formatFontsize(this.dashboardPanelModel.fontSize);
      this.excelDownloading = true;
      this.isSinglePnExcelExport = false;

      if (this.selectedPartNumbers && this.selectedPartNumbers.length > 0) {
        const data = {
          materialManagementViewID: currentView,
          // weeks: weeks > 26 ? 26 : weeks,
          records: records,
          variant: variant,
          partNoVendors: this.selectedPartNumbers,
          fontSize: fontSize,
          userId: userId
        };
        await this.supplyVisibilityService.downloadSupplyVisibilityTableByWidget(data, null, comments);
        this.excelDownloading = false;
      } else {
        const data = {
          materialManagementViewID: currentView,
          // weeks: weeks > 26 ? 26 : weeks,
          records: records,
          variant: variant,
          partNoVendors: this.buyersPartNumbersFilteredByVPNsList.result
            ? this.buyersPartNumbersFilteredByVPNsList.result
            : [],
          fontSize: fontSize,
          userId: userId
        };
        await this.supplyVisibilityService.downloadSupplyVisibilityTableByWidget(data);
        this.excelDownloading = false;
      }
    } else {
      this.notificationService.showError(`View selected in widget does not exist for this plant`);
    }
  }

  // async initPnExcelExport() {
  //   this.isSinglePnExcelExport = false;
  //   this.downloadingExcel = true;
  //   if (this.selectedPartNumbers && this.selectedPartNumbers.length > 0) {
  //     if (this.selectedPartNumbers.length == 1) {
  //       this.isSinglePnExcelExport = true;
  //     }
  //     this.dispatchSetPNList({
  //       result: this.selectedPartNumbers,
  //       count: this.selectedPartNumbers.length,
  //     });
  //   } else {
  //     //review all
  //     this.dispatchSetPNList(this.buyersPartNumbersFilteredByVPNsList);
  //   }
  // }

  downloadDialogMultiPn(params: any) {
    const dialogRef = this.dialog.open(MultiPnExcelExportComponent, {
      width: '30%',
      disableClose: true,
      data: {
        params: params,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //nothing
    });
  }
  downloadDialogSinglePn(params: any) {
    console.log('naka pyca to vola');
    const dialogRef = this.dialog.open(SinglePnExcelExportComponent, {
      width: '30%',
      disableClose: true,
      data: {
        params: params,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //nothing
    });
  }
  async onReviewClick(stepByStep = false) {
    if (this.viewStatus != this.enumMMViews.NOT_FOUND) {
      this.stepByStepReview = stepByStep;
      if (this.selectedPartNumbers && this.selectedPartNumbers.length > 1) {
        this.dispatchSetPNList({
          result: this.selectedPartNumbers,
          count: this.selectedPartNumbers.length,
        });
      } else {
        //review all
        this.dispatchSetPNList(this.buyersPartNumbersFilteredByVPNsList);
      }
    } else {
      this.notificationService.showError('View selected in widget does not exist for this plant');
    }
  }
  isCumulativeList : boolean = false;
  async onManualListReviewClick() {
    if (this.viewStatus != this.enumMMViews.NOT_FOUND) {
      this.isCumulativeList = true;
      if (this.selectedPartNumbers && this.selectedPartNumbers.length > 0) {
        this.dispatchSetPNList({
          result: this.selectedPartNumbers,
          count: this.selectedPartNumbers.length,
        });
      } else {
        //review all
        this.dispatchSetPNList(this.buyersPartNumbersFilteredByVPNsList);
      }
    } else {
      this.notificationService.showError('View selected in widget does not exist for this plant');
    }
  }

  getRecordValue() {
    this.showWeeks = this.dashboardPanelModel.firstValue && this.dashboardPanelModel.firstValue.weeks ? true : false;
    return this.showWeeks ?
      (this.dashboardPanelModel.firstValue && this.dashboardPanelModel.firstValue.weeks ? this.dashboardPanelModel.firstValue.weeks : this.DEFAULT_WEEKS) :
      (this.dashboardPanelModel.firstValue && this.dashboardPanelModel.firstValue.days ? this.dashboardPanelModel.firstValue.days : this.DEFAULT_DAYS);
  }

  protected async dispatchSetPNList(partNumbersList: BuyersPartnumbersResult) {
    const partNumbers: BasicParameters[] = [];
    let currentView =
      (this.dashboardPanelModel.firstValue
        ? this.dashboardPanelModel.firstValue.view
        : this.DEFAULT_VIEW) || this.DEFAULT_VIEW;
    const viewList = this.store.selectSnapshot(SupplyVisibilityState.getMaterialManagementViews);
    if (viewList && viewList.length > 0) {
      let isViewAvailable: boolean = false;
      viewList.forEach((view) => {
        if (view.id == currentView) {
          currentView = view.id;
          isViewAvailable = true;
        }
      });
      if (!isViewAvailable) {
        currentView = viewList[0].id;
      }
    }

    const records = this.getRecordValue();
    const variant = this.showWeeks ? 'Weekly' : 'Daily';
    if(partNumbersList.result){
    for (let index = 0; index < partNumbersList.result.length; index++) {
      const partNumber = partNumbersList.result[index];
      //if (partNumber.reviewed) continue;// already reviewed so ignore
      if (
        !this.selectedPartNumbers ||
        this.selectedPartNumbers.length <= 0 ||
        partNumber.$selected
      ) {
        partNumbers.push({
          plant: this.activePlant,
          partNumber: partNumber.partNo || partNumber.partNumber,
          records: records,
          variant: variant,
          vendorCode: partNumber.vendorCode,
          mmViewID: currentView,
        });
      }
    }}
    if(this.dashboardPanelModel.id)
    this.store.dispatch(new SetPartNumberListParameters(this.dashboardPanelModel.id, partNumbers));
  }

  catchSetPartNumberListParametersSuccess() {
    const self = this;
    this.actions$
      .pipe(ofActionDispatched(SetPartNumberListParametersSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(({ widgetId, pnList }) => {
        if (
          self.dashboardPanelModel.id === widgetId &&
          pnList &&
          pnList.length > 0 &&
          (self.stepByStepReview !== undefined || self.excelDownloading !== undefined)
        ) {
          let currentView =
            (this.dashboardPanelModel.firstValue
              ? this.dashboardPanelModel.firstValue.view
              : this.DEFAULT_VIEW) || this.DEFAULT_VIEW;
          const viewList = this.store.selectSnapshot(
            SupplyVisibilityState.getMaterialManagementViews
          );
          if (viewList && viewList.length > 0) {
            let isViewAvailable: boolean = false;
            viewList.forEach((view) => {
              if (view.id == pnList[0].mmViewID) {
                currentView = view.id;
                isViewAvailable = true;
              }
            });
            if (!isViewAvailable) {
              currentView = viewList[0].id;
            }
          }

          const records = this.getRecordValue();
          const variant = this.showWeeks ? 'Weekly' : 'Daily';
          if (self.excelDownloading && this.dialogDownload) {
            if (this.isSinglePnExcelExport) {
              const currentPNIndex = self.currentPartNumberIndex || 0;
              const Params = {
                plant: self.activePlant,
                vendorCode: pnList[currentPNIndex].vendorCode,
                partNumber: pnList[currentPNIndex].partNo || pnList[currentPNIndex].partNumber,
                records: records,
                variant: variant,
                materialManagementViewID: currentView,
                currentPartNumber: self.currentPartNumberIndex || 0,
                widgetId: widgetId,
              };
              this.downloadDialogSinglePn(Params);
            } else {
              const Params = {
                plant: this.activePlant,
                materialManagementViewID: currentView,
                widgetId: this.dashboardPanelModel.id,
                records: records,
                variant: variant
              };
              this.downloadDialogMultiPn(Params);
            }
          } else if (self.isCumulativeList) {
            self.router.navigate([`/material-management/supply-visibility-multi-pn`], {
              queryParams: {
                plant: self.activePlant,
                materialManagementViewID: currentView,
                widgetId: widgetId,
                records: records,
                variant: variant,
                fontSize: this.dashboardPanelModel.fontSize,
                widgetName: this.dashboardPanelModel.title || null,
                isCumulativeList: true,
              },
            });
          } else {
            if (self.stepByStepReview) {
              const currentPNIndex = self.currentPartNumberIndex || 0;
              self.router.navigate([`/material-management/supply-visibility`], {
                queryParams: {
                  plant: self.activePlant,
                  vendorCode: pnList[currentPNIndex].vendorCode,
                  partNumber: pnList[currentPNIndex].partNo || pnList[currentPNIndex].partNumber,
                  records: records,
                  variant: variant,
                  materialManagementViewID: currentView,
                  currentPartNumber: self.currentPartNumberIndex || 0,
                  widgetId: widgetId,
                  fontSize: this.dashboardPanelModel.fontSize,
                  widgetName: this.dashboardPanelModel.title || null,
                },
              });
            } else {
              self.router.navigate([`/material-management/supply-visibility-multi-pn`], {
                queryParams: {
                  plant: self.activePlant,
                  materialManagementViewID: currentView,
                  widgetId: widgetId,
                  records: records,
                  variant: variant,
                  fontSize: this.dashboardPanelModel.fontSize,
                  widgetName: this.dashboardPanelModel.title || null,
                },
              });
            }
          }
          self.stepByStepReview = false;
        }
      });
  }

  allChecked = false;
  containerId = 'smartPnList-';
  checkAll() {
    this.selectedPartNumbers.length = 0;
    this.allChecked = !this.allChecked;
    if (
      this.buyersPartNumbersFilteredByVPNsList &&
      this.selectedPartNumbers.length !== this.buyersPartNumbersFilteredByVPNsList.result?.length
    ) {
      this.buyersPartNumbersFilteredByVPNsList.result?.forEach((rPartNumber) => {
        rPartNumber.$selected = this.allChecked;
        if (this.allChecked) {
          this.addElementInArray(rPartNumber);
        }
      });
    }
  }
  //NOTE Add to Widget to generate custom visibility on dashboard
  //Handles complex visibility
  visibility: WidgetSettingsVisibility = {
    onDashboard: false,
    onMenuConfig: false,
    onMenuDelete: false,
  };
  /**
   * calculate visibility on depending factor for widget
   */
  override calculatedVisibility(that: SimplePnListWidgetComponent) {
    that.visibility.onMenuDelete = !that.isDashboardLocked && (that.dashboardRights ?? false);
    
    that.visibility['onMenuConfig'] = !that.isDashboardLocked && (that.dashboardRights ?? false) && !that.isSharedByOther;

    that.visibility['onMenuSort'] = this.buyersPartNumbersFilteredByVPNsList.result?.length
      ? true
      : false;
    if (this.dashboardPanelModel.firstValue) {
      that.visibility['onMenuCheckAll'] =
        !this.loading &&
        (this.dashboardPanelModel.firstValue.allowMultiple
          ? this.dashboardPanelModel.firstValue.allowMultiple &&
          this.buyersPartNumbersFilteredByVPNsList.result?.length != 0
          : false);
    } else {
      that.visibility['onMenuCheckAll'] =
        !this.loading && this.buyersPartNumbersFilteredByVPNsList.result?.length !== 0;
    }
    that.visibility.onDashboard =
      that.visibility.onMenuDelete ||
      that.visibility['onMenuConfig'] ||
      that.visibility['onMenuSort'] ||
      that.visibility['onMenuCheckAll'];
  }
}
