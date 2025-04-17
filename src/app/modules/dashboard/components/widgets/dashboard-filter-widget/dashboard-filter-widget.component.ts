import { Component, Input, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';
import { widgetHelper } from '../../../../shared/widgetHelper';
import { FilterData, Filter, PanelCache, WidgetSettingsVisibility } from '../../../models/sv-dashboard';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { BaseDashboardPanelComponent } from '../../base-dashboard-panel/base-dashboard-panel.component';
import { ToggleButtonDTO } from '../../../models/commonDTOs';
@Component({
  selector: 'orion-platform-dashboard-filter-widget',
  standalone: true,
  imports: [...SHARED_IMPORTS,MatSlideToggleModule,MatFormFieldModule,MatMenuModule ,FormsModule ],
  templateUrl: './dashboard-filter-widget.component.html',
  styleUrl: './dashboard-filter-widget.component.scss'
})
export class DashboardFilterWidgetComponent extends BaseDashboardPanelComponent {

  // widgetData: WidgetBehaviorModel;
  @Input() widgetBehavior?: BehaviorSubject<any>;
  isDisableAll: boolean = false;

  title: string = 'Filter Widget'
  applyAllFilter: boolean = true;
  newFilter: string = '';
  isOnlyMyPn: boolean = false;
  filterData?: FilterData;
  filter: Filter[] = [];
  allChecked = false;
  selectedSort: any;
  @ViewChild(SortMenuComponent, { static: true }) sortMenu?: SortMenuComponent;
  private ngUnsubscribe = new Subject();

  toggleButtons: ToggleButtonDTO[] = [];

  constructor(
    public override translate: TranslateService,
    public override dialog: MatDialog,
    public override store: Store,
    public override supplyVisibilityService: SupplyVisibilityService
  ) {
    super(translate, dialog, supplyVisibilityService);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.subscribeDashboardEvents(this);
    this.setWidgetCachedSettings();
  }

  ngAfterViewInit() {
    this.setSortMenuRefreshSub();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  get activePlant(): string {
    return this.store.selectSnapshot(AuthenticationState.getActiveplant);
  }
  get currentUser(): string {
    return this.store.selectSnapshot(AuthenticationState.username);
  }
  get currentUpn(): string {
    return this.store.selectSnapshot(AuthenticationState.upn);
  }

  createToggle() {
    if (this.newFilter) {
      this.toggleButtons.push({
        filter: this.newFilter,
        enabled: false
      });

      this.filter = this.toggleButtons;

      this.sendFilterData();
    }
    this.newFilter = '';
  }

  deleteToggle(toggle:ToggleButtonDTO) {
    const index = this.toggleButtons.indexOf(toggle);
    this.toggleButtons.splice(index, 1);
    this.filter = this.filter.filter((filter) => filter.filter !== toggle.filter);

    this.sendFilterData();
  }

  configureTo(e: any, name?: any) {
    this.filter.forEach((filter) => {
      if (filter.filter === name) {
        filter.enabled = e.checked;
      }
    });
    this.sendFilterData();
  }

  applyFilter(event: any) {
    this.applyAllFilter = event.checked
    this.sendFilterData();

  }

  onlyMyPn(e: any) {
    this.isOnlyMyPn = e.checked;
    this.sendFilterData();
  }

  disableAll() {
    this.isDisableAll = true;
  }

  enableAll() {
    this.isDisableAll = false;
  }

  sendFilterData() {
    this.filterData = {
      shouldFilter: this.applyAllFilter,
      onlyMyPns: this.isOnlyMyPn,
      filters: this.filter
    };
    this.setCatchPanel();
    // if (this.applyAllFilter){
    this.widgetBehavior?.next(this.filterData);
    // }
  }

  checkAll() {
    if (this.filter && this.filter.length) {
      this.allChecked = !this.allChecked;
      this.filter.forEach((filter) => {
        filter.enabled = this.allChecked ? true : false;
      });
      this.sendFilterData();
    }
  }
  clearAll() {
    if (this.filter && this.filter.length) {
      this.allChecked = !this.allChecked;
      this.filter.forEach((filter) => {
        filter.enabled = this.allChecked ? true : false;
      });
      this.sendFilterData();
    }
  }

  setWidgetCachedSettings() {
    const widgetData: any = this.dashboardPanelModel.panelCache
      ? this.dashboardPanelModel.panelCache.find((widget) => widget.key == this.activePlant)
      : null;
    if (widgetData) {
      const panelCache = JSON.parse(widgetData.value);
      if (panelCache) {

        const { sort, shouldFilter, onlyMyPns, filters } =
          widgetHelper.getFormattedSettings(panelCache);


        // filters.forEach(obj => {
        //   obj.enabled = false;
        // });

        this.selectedSort = sort;
        this.applyAllFilter = shouldFilter;
        // this.isOnlyMyPn = onlyMyPns;
        this.toggleButtons = filters;
        this.filter = filters;

        this.sendFilterData();
      }
    }
  }

  setSortMenuRefreshSub() {
    if (this.sortMenu) {
      this.sortMenu.refresh$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
        this.selectedSort = res;
        try {
          const panelCache: PanelCache[] = widgetHelper.getSettingsWithSort(
            this.selectedSort,
            this.dashboardPanelModel.panelCache
          );
          this.saveWidgetCache(this.store, panelCache);
        } catch (e) { }
      });
    }
  }


  async setCatchPanel() {
    //Set User Settings For Widget
    const cache: any = [
      { key: 'shouldFilter', value: this.applyAllFilter },
      { key: 'onlyMyPns', value: this.isOnlyMyPn },
      { key: 'filters', value: this.filter },
    ];
    this.createPanelCache(cache);
    if (this.dashboardPanelModel.panelCache) {
      this.saveWidgetCache(this.store, this.dashboardPanelModel.panelCache);
    }
  }

  createPanelCache(cache: PanelCache[]) {
    const panelCache: PanelCache = {
      key: this.activePlant,
      value: JSON.stringify(cache),
    };

    if (this.dashboardPanelModel.panelCache) {
      const index = this.dashboardPanelModel.panelCache.findIndex(
        (widget) => widget.key == this.activePlant
      );
      if (index != -1) {
        this.dashboardPanelModel.panelCache[index] = panelCache;
      } else {
        this.dashboardPanelModel.panelCache.push(panelCache);
      }
    } else {
      this.dashboardPanelModel.panelCache = [panelCache];
    }
  }

  override deleteWidget() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('style.confirmDeleteTitle'),
        content: this.translate.instant(
          this.dashboardPanelModel.modificationRights && this.dashboardPanelModel.sharedId
            ? 'style.sharedWidgetDeleteContent'
            : 'style.widgetDeleteContent'
        ),
        button: this.translate.instant('style.delete'),
        cancelButton: this.translate.instant('style.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete.emit(this.dashboardPanelModel);
        // emit null values
        this.filterData = {
          shouldFilter: false,
          onlyMyPns: false,
          filters: []
        };
        this.widgetBehavior?.next(this.filterData);
      }
    });
  }

  visibility: WidgetSettingsVisibility = {
    onDashboard: false,
    onMenuConfig: false,
    onMenuDelete: false,
  };
  /**
   * calculate visibility on depending factor for widget
   */
  override calculatedVisibility(self: DashboardFilterWidgetComponent){
    self.visibility.onDashboard = !self.isDashboardLocked && <boolean>self.dashboardRights;
    self.visibility['onMenuConfig'] = !self.isDashboardLocked && <boolean>self.dashboardRights;
    self.visibility.onMenuDelete = !self.isDashboardLocked && <boolean>self.dashboardRights;
  }
}
