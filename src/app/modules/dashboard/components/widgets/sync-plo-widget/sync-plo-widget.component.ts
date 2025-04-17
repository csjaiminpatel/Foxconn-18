import { Component, Input, OnInit } from '@angular/core';
import { MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../../shared-imports';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { WidgetSettingsVisibility } from '../../../models/sv-dashboard';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { BaseDashboardPanelComponent } from '../../base-dashboard-panel/base-dashboard-panel.component';

@Component({
  selector: 'orion-platform-sync-plo-widget',
  standalone: true,
  imports: [...SHARED_IMPORTS,...MAT_IMPORTS,ProgressSpinnerComponent,MatMenuModule ],
  templateUrl: './sync-plo-widget.component.html',
  styleUrl: './sync-plo-widget.component.scss'
})
export class SyncPloWidgetComponent extends BaseDashboardPanelComponent implements OnInit {
  @Input() icon?: string;
  loading = false;
  constructor(
    public override translate: TranslateService,
    public override dialog: MatDialog,
    public override supplyVisibilityService: SupplyVisibilityService,
    private notificationService: NotificationService
  ) {
    super(translate, dialog, supplyVisibilityService);
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.subscribeDashboardEvents(this);
    // this.setWidgetCachedSettings();
  }

  onSync() {
    

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: this.translate.instant('style.confirmProcessPloTitle'),
        content: this.translate.instant('style.confirmProcessPloContent'),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
            //START Loading Timeout Handler
    let isApiCallFinish = false;
    let loadingTimeout = 4;

    const timeoutHandler = setInterval(() => {
      loadingTimeout = loadingTimeout - 1;
      if (loadingTimeout < 0 && isApiCallFinish) {
        clearInterval(timeoutHandler);
        this.loading = false;
      }
    }, 1000);
    //END Loading Timeout Handler

    this.supplyVisibilityService.syncPLO().subscribe(
      (data) => {
        if (data) {
          // this.notificationService.showMessage(data);
        }
        isApiCallFinish = true;
      },
      (error) => {
        this.notificationService.showError('Error while syncing PLO');
        isApiCallFinish = true;
      }
    );
      } else {
        // do nothing
      }
    });  
  }

  visibility: WidgetSettingsVisibility = {onDashboard: true, onMenuDelete: false};
  /**
   * calculate visibility on depending factor for widget
   */
  override calculatedVisibility(that: SyncPloWidgetComponent): void {
    that.visibility.onDashboard = that.isDashboardLocked || !that.dashboardRights;
  }
}

