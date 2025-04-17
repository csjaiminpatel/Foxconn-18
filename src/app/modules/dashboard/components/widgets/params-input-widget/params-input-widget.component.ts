import { Component, inject } from '@angular/core';
import { MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../../shared-imports';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { Helper } from '../../../../shared/helper';
import { MaterialManagementViews } from '../../../models/material-management-views.model';
import { BasicParameters } from '../../../models/supply-visibility.model';
import { PanelCache, WidgetSettingsVisibility } from '../../../models/sv-dashboard';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { VirtualPnGroupsService } from '../../../services/Virtual-pn-group/virtual-pn-groups.service';
import { SetMaterialManagementViews, SetVendorCodes, SetPartNumberListParameters, SetPartNumberListParametersSuccess, SetPanelCacheSuccess } from '../../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../../stores/supply-visibility/supply-visibility.state';
import { BaseDashboardPanelComponent } from '../../base-dashboard-panel/base-dashboard-panel.component';
import { PartNumberDTO } from '../../../models/commonDTOs';

@Component({
  selector: 'orion-platform-params-input-widget',
  standalone: true,
  imports: [...SHARED_IMPORTS,...MAT_IMPORTS,ProgressSpinnerComponent,MatMenuModule,ReactiveFormsModule ],
  templateUrl: './params-input-widget.component.html',
  styleUrl: './params-input-widget.component.scss'
})
export class ParamsInputWidgetComponent extends BaseDashboardPanelComponent {
  public override store = inject(Store);
  


  weeksRange: number[] = [];
  loading = false;
  showWeeks: boolean = true;
  daysRange: number[] = [];
  vendorCode: boolean = false;
  inputForm?: FormGroup;
  isFormLoaded: boolean = false;
  private ngUnsubscribe = new Subject();

  mmViews$: Observable<MaterialManagementViews[]> = this.store.select(SupplyVisibilityState.getMaterialManagementViews);

  constructor(
    private router: Router,
    private vpnsService: VirtualPnGroupsService,
    public override translate: TranslateService,
    public override dialog: MatDialog,
    private actions$: Actions,
    public override supplyVisibilityService: SupplyVisibilityService
  ) {
    super(translate, dialog, supplyVisibilityService);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.setWeeksOrDaysField();
    this.subscribeDashboardEvents(this);
    this.store.dispatch(new SetMaterialManagementViews());
    this.weeksRange = this.range(1, 105);
    this.daysRange = this.range(1, 101);
    this.createForm();
    // this.modificationRights$.subscribe(res=>{})
    this.catchSetPartNumberListParametersSuccess();
    this.catchWidgetCacheSuccess();
    this.setWidgetCachedSettings();
    this.inputForm?.get('vendorCode')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      data ? this.vendorCode = true : this.vendorCode = false;
    });
  }

  setWeeksOrDaysField() {
    if (this.dashboardPanelModel && this.dashboardPanelModel.panelCache && this.dashboardPanelModel.panelCache.length > 0) {
      const panelcatch = this.dashboardPanelModel.panelCache;
      if (panelcatch) {
        const weeks = panelcatch.find((item) => item.key === 'weeks');
        this.showWeeks = weeks ? true : false;
      }
    }
  }

  createForm() {
    this.inputForm = new FormGroup({
      plant: new FormControl(
        this.store.selectSnapshot(AuthenticationState.getActiveplant),
        Validators.required
      ),
      vendorCode: new FormControl(''),
      partNumber: new FormControl('', Validators.required),
      [this.showWeeks ? 'weeks' : 'days']: this.showWeeks ? new FormControl(this.weeksRange[25]) : new FormControl(this.daysRange[5]),
      view: new FormControl('', Validators.required),
    });
    this.isFormLoaded = true;
  }

  get weeks(): FormControl {
    return this.inputForm?.get('weeks') as FormControl;
  }
  get days(): FormControl {
    return this.inputForm?.get('days') as FormControl;
  }

  private updateFormControls() {
    const firstValueGroup = this.inputForm as FormGroup;

    // Remove existing controls
    ['weeks', 'days'].forEach(controlName => {
      if (firstValueGroup.controls[controlName]) {
        firstValueGroup.removeControl(controlName);
      }
    });

    const controlToAdd = this.showWeeks ? 'weeks' : 'days';
    const defaultControlValue = this.showWeeks ? this.weeksRange[25] : this.daysRange[5];

    firstValueGroup.addControl(controlToAdd, new FormControl(defaultControlValue));
  }

  getRecordValue() {
    return this.showWeeks ?
      (this.weeks && this.weeks.value ? this.weeks.value : null) :
      (this.days && this.days.value ? this.days.value : null);
  }

  //Generates number of weeks
  range = (start:number, stop:number, step = 1) =>
    Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);

  async showSupplyVisibility() {
    //Set Used Settings For Widget
    if (
      (this.weeks && this.weeks.dirty) ||
      (this.days && this.days.dirty) ||
      this.inputForm?.controls['view'].dirty ||
      !this.dashboardPanelModel.panelCache
    ) {
      const panelCache: PanelCache[] = [
        { key: (this.showWeeks ? 'weeks' : 'days'), value: this.showWeeks ? (this.weeks ? this.weeks.value : 26) : (this.days ? this.days.value : 5) },
        { key: 'view', value: this.inputForm?.controls['view'].value },
      ];
      this.saveWidgetCache(this.store, panelCache);
    }

    let { plant, vendorCode, partNumber, view } = this.inputForm?.value;
    let records = this.getRecordValue();
    let variant = this.showWeeks ? 'Weekly' : 'Daily';

    vendorCode = vendorCode ? Helper.virtualVCReplace(vendorCode) : vendorCode;
    if (vendorCode === 'VirtualVC') {
      this.setReceivedPnsFromVC(partNumber, records, variant, view);
    } else {
      const partNumberList = this.supplyVisibilityService.createPNVendorList(
        partNumber,
        vendorCode ? vendorCode : ''
      );
      if (partNumberList && partNumberList[0]) {
        const PN = partNumberList[0].partNumber;
        const VN = partNumberList[0].vendorCode;
        const tabPattern = /\t/;
        const pipePattern = /\|/;
        const isMultiList =
          partNumber.search(tabPattern) !== -1 || partNumber.search(pipePattern) !== -1;
        if (vendorCode === '' && !isMultiList) {
          this.loading = true;
          this.store.dispatch(new SetVendorCodes([partNumber])).subscribe(
            () => {
              this.dispatchSetPNList(partNumberList, records, variant, view);
            },
            (error) => {
              this.loading = false;
            }
          );
        } else {
          this.dispatchSetPNList(partNumberList, records, variant, view);
        }
      }
    }
  }
  async setReceivedPnsFromVC(partNumber: string, records: number, variant:string, view: string) {
    const partNumberList = await this.vpnsService.getPartNumbersListForSV(partNumber);
    if (partNumberList) {
      partNumberList.unshift({
        partNumber: partNumber,
        vendorCode: 'VirtualVC',
      });

      this.dispatchSetPNList(partNumberList, records, variant, view);
    }
  }
  get activePlant(): string {
    return this.store.selectSnapshot(AuthenticationState.getActiveplant);
  }
  private async dispatchSetPNList(
    partNumbersList: PartNumberDTO[],
    records: number,
    variant: string,
    view: string
  ) {
    const partNumbers: BasicParameters[] = [];
    for (let index = 0; index < partNumbersList.length; index++) {
      const partNumber = partNumbersList[index];
      //if (partNumber.reviewed) continue;// already reviewed so ignore
      partNumbers.push({
        plant: this.activePlant,
        partNumber: partNumber.partNumber,
        records: records,
        variant: variant,
        vendorCode: partNumber.vendorCode,
        mmViewID: view,
      });
    }
    if(this.dashboardPanelModel.id){
    this.store.dispatch(new SetPartNumberListParameters(this.dashboardPanelModel.id, partNumbers));}
  }
  catchSetPartNumberListParametersSuccess() {
    const self = this;
    this.actions$
      .pipe(ofActionDispatched(SetPartNumberListParametersSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(({widgetId, pnList}) => {
        if (widgetId == this.dashboardPanelModel.id) {
          if (pnList && pnList.length > 0) {
            const currentPNIndex = 0;
            const records = this.getRecordValue();
            const variant = this.showWeeks ? 'Weekly' : 'Daily';
            self.router.navigate([`/material-management/supply-visibility`], {
              queryParams: {
                plant: self.activePlant,
                vendorCode: pnList[currentPNIndex].vendorCode,
                partNumber: pnList[currentPNIndex].partNo || pnList[currentPNIndex].partNumber,
                records: records,
                variant: variant,
                materialManagementViewID: this.inputForm?.controls['view'].value,
                currentPartNumber: 0,
                widgetId: widgetId,
                fontSize: this.dashboardPanelModel.fontSize,
                widgetName: this.dashboardPanelModel.title || null,
              },
            });
          }
        }
      });
  }

  /**
   * Set Widget Cached Values
   */
  setWidgetCachedSettings() {
    if (this.dashboardPanelModel.panelCache) {
      const weeks = this.dashboardPanelModel.panelCache.find((e) => e.key === 'weeks');
      const days = this.dashboardPanelModel.panelCache.find((e) => e.key === 'days');
      const view = this.dashboardPanelModel.panelCache.find((e) => e.key === 'view');
      this.inputForm?.patchValue({
        view: view,
        [this.showWeeks ? 'weeks' : 'days']: this.showWeeks
          ? (weeks ? weeks.value : 26)
          : (days ? days.value : 5),
      });
    }
    this.mmViews$.subscribe((res) => {
      if (res && res.length > 0) {
        this.inputForm?.patchValue({
          view: res[0].id,
        });
      }
    });
  }
  catchWidgetCacheSuccess() {
    this.actions$
      .pipe(ofActionDispatched(SetPanelCacheSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (this.dashboardPanelModel.id === res.widgetId) {
          // this.inputForm.controls.weeks.markAsPristine();
          // this.inputForm.controls.view.markAsPristine();
        }
      });
  }

  visibility: WidgetSettingsVisibility = {onDashboard: false, onMenuDelete: false};
  /**
   * calculate visibility on depending factor for widget
   * @returns visibility on screen
   */
  override calculatedVisibility = (that: ParamsInputWidgetComponent) => {
    that.visibility.onDashboard = that.isDashboardLocked || !that.dashboardRights;
  };

  onClick(){
    this.showWeeks = !this.showWeeks;
    this.updateFormControls();
  }
}
