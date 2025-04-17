import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Helper } from '../../../../shared/helper';
import { WidgetSettingsVisibility } from '../../../models/sv-dashboard';
import { CommitsService } from '../../../services/Commits/commits.service';
import { SupplyVisibilityService } from '../../../services/Supply-Visibility/supply-visibility.service';
import { BaseDashboardPanelComponent } from '../../base-dashboard-panel/base-dashboard-panel.component';

@Component({
  selector: 'orion-platform-configuration-link-widget',
  standalone: true,
  imports: [...SHARED_IMPORTS,MatMenuModule],
  templateUrl: './configuration-link-widget.component.html',
  styleUrl: './configuration-link-widget.component.scss'
})
export class ConfigurationLinkWidgetComponent extends BaseDashboardPanelComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() link?: string;
  @Input() version?: string;
  @Input() widgetClass?: string;

  constructor(
    private router: Router,
    public override store: Store,
    public override translate: TranslateService,
    public override dialog: MatDialog,
    public override supplyVisibilityService: SupplyVisibilityService,
    private commitsService: CommitsService
  ) {
    super(translate, dialog, supplyVisibilityService);
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.subscribeDashboardEvents(this);
  }
  navigateTo(path?: string) {
    if (this.icon == 'commits') {
      this.commitsService.setFilteredData(null);
    }
    this.router.navigate(['/' + path]);
  }
  middleClickHandle(event:MouseEvent,url?:string) {
    if (url && (event.which == 2 || event.buttons == 4)) {
      Helper.openInNewTab(url, this.router);
    }
  }

  visibility: WidgetSettingsVisibility = {onDashboard: true , onMenuDelete :false};
  /**
   * calculate visibility on depending factor for widget
   */
  override calculatedVisibility(self: ConfigurationLinkWidgetComponent): void {
    self.visibility.onDashboard = !self.isDashboardLocked && <boolean>self.dashboardRights;
  }
}
