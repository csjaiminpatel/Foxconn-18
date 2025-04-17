import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, switchMap } from 'rxjs';
import { FetchAdfsPlants } from '../../../auth/store/authentication.actions';
import { LanguageState } from '../../../auth/store/language/language.state';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BasicWidgetComponent } from '../basic-widget/basic-widget.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'orion-platform-dashboard',
  standalone: true,
  imports: [BasicWidgetComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  materialManagementVersion = 'v1.2';

  // TODO - remove
  configuratorTitle = {
    title: '',
    subtitle: '',
  };
  visualizatorTitle = {
    title: '',
    subtitle: '',
  };
  supplyVisibilityTitle = {
    title: '',
    subtitle: '',
  };
  materialManagementDashboardTitle = {
    title: '',
    subtitle: '',
  };
  materialManagementCommitsTitle = {
    title: '',
    subtitle: '',
  };
  
  private translate = inject(TranslateService);
  private store = inject(Store);
  

  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.currentLang$
      .pipe(switchMap(({code}: any) => this.translate.use(code)))
      .subscribe(({cards}: any) => {
        this.configuratorTitle = cards.configurator;
        this.visualizatorTitle = cards.visualizator;
        this.supplyVisibilityTitle = cards.supplyVisibility;
        this.materialManagementDashboardTitle = cards.materialManagementDashboard;
        this.materialManagementCommitsTitle = cards.materialManagementCommits;
      });
  }

  ngOnInit() {
    //todo turn on after configuration added to sv dashboard
    //this.router.navigate(['material-management/supply-visibility-dashboard']);
    this.setIcon('configurator-logo');
    this.setIcon('supply-visibility-logo');
    this.setIcon('outline-cancel');
    this.setIcon('commits');
    this.setIcon('filter-icon');
    this.setIcon('qap');

    this.store.dispatch(new FetchAdfsPlants());
  }

  private setIcon(name: string) {
    this.iconRegistry.addSvgIcon(
      name,
      this.sanitizer.bypassSecurityTrustResourceUrl(`/icons/dashboard/${name}.svg`)
    );
  }
}
