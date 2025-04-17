import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { plainToClass } from 'class-transformer';
import { Observable, combineLatest } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DashboardPanelModel, PanelCache } from '../../models/sv-dashboard';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { SupplyVisibilitySharedState } from '../../stores/supply-visibility-shared/supply-visibility-shared.state';
import { SetWidgetCache } from '../../stores/supply-visibility/supply-visibility.actions';

@Component({
  selector: 'orion-platform-base-dashboard-panel',
  standalone: true,
  imports: [],
  templateUrl: './base-dashboard-panel.component.html',
  styleUrl: './base-dashboard-panel.component.scss'
})
export class BaseDashboardPanelComponent implements OnInit {

  public store = inject(Store);

  @Input() dashboardPanelModel!: DashboardPanelModel;
  @Output() resize: EventEmitter<DashboardPanelModel> = new EventEmitter();
  @Output() configure: EventEmitter<DashboardPanelModel> = new EventEmitter();
  @Output() delete: EventEmitter<DashboardPanelModel> = new EventEmitter();
  @Output() sharedNA: EventEmitter<DashboardPanelModel> = new EventEmitter();

  isDashboardLocked$: Observable<boolean> = this.store.select(SupplyVisibilitySharedState.getDashboardLockState);

  dashboardRights$: Observable<boolean> = this.store.select(SupplyVisibilitySharedState.getDashboardModificationRightsState);

  isDashboardLocked?: boolean;
  dashboardRights?: boolean;
  isSharedByOther:boolean = false;

  uiModel?: DashboardPanelModel;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    public supplyVisibilityService: SupplyVisibilityService
  ) {}

  async ngOnInit() {
    try {
      this.isSharedByOther = !this.dashboardPanelModel.modificationRights;
      this.dashboardPanelModel.modificationRights
        ? this.loadUserSettings()
        : await this.loadSharedSettings();
    } catch (error) {}

    this.dashboardPanelModel.refresh$ = this.refresh.bind(this);
  }

  loadUserSettings() {
    if(this.uiModel){
    DashboardPanelModel.copySettingToDashboardWidget(this.dashboardPanelModel, this.uiModel);}
  }
  async loadSharedSettings() {
    //Other dashboard non-shared widget
    if (!this.dashboardPanelModel.sharedId && this.uiModel) {
      DashboardPanelModel.copySettingToDashboardWidget(this.dashboardPanelModel, this.uiModel);
      return;
    }

    //shared widget
    if(this.dashboardPanelModel.id){
    let model = await this.supplyVisibilityService
      .getSharedWidgetById(this.dashboardPanelModel.id)
      .toPromise()
      .catch((res) => {
        model = null;
      });
    if (model) {
      this.uiModel = plainToClass(DashboardPanelModel, JSON.parse(model.data));
      this.uiModel.sharedId = model.id;
      DashboardPanelModel.copySettingToDashboardWidget(this.dashboardPanelModel, this.uiModel);
    } else {
      this.sharedNA.emit(this.dashboardPanelModel);
    }}
  }

  configureWidget() {
    this.configure.emit(this.dashboardPanelModel);
  }

  deleteWidget() {
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
      } else {
        // do nothing
      }
    });
  }
  /**
   * Save Widget Cached Values
   */
  saveWidgetCache(store : Store, panelCache: PanelCache[]) {
    this.dashboardPanelModel.panelCache = panelCache;
    store.dispatch(new SetWidgetCache(this.dashboardPanelModel));
  }

  /**
   * @param that context of widget class
   * @param getVisibilityCallbackFn call back function for calculate custom visibility, if any
   *
   * NOTE:- call in case of custom visibility,
   * or use observable @property dashboardRights$ @property isDashboardLocked$
   * call only in derived class
   */
  subscribeDashboardEvents(that: any) {
    combineLatest<[boolean, any]>(that.isDashboardLocked$, that.dashboardRights$).subscribe(
      ([isDashboardLocked, dashboardRights]) => {
        that.isDashboardLocked = isDashboardLocked;
        that.dashboardRights = dashboardRights;

        if (!that.visibility) {
          return;
        }
        that.calculatedVisibility(that);
      }
    );
  }

  //#region override methods
  calculatedVisibility(context: any) {}
  refresh() {}
  //#endregion override methods
}
