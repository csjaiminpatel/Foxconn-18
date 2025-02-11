import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import {
  SideNavOptions,
  SidebarData,
  SideNavDataSource,
  EnumSideNavTypes,
} from '../models/sidebar.model';
import { Store } from '@ngxs/store';
import { Helper } from '../../shared/helper';
import { AuthenticationState } from '../../auth/store/authentication.state';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalRService } from '../../shared/services/signal-r.service';
// import { SignalRService } from '../../shared/services/signal-r.service';

@Component({
  selector: 'orion-platform-sidebar',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly signalRService= inject(SignalRService);
  private noOfChildren = 0;
  userRights: string[] = [];
  public env2 = '';

  private _transformer = (node: SideNavOptions, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      icon: node.icon,
      index: node.index || 0,
      options: node.options,
      visible: node.visible,
      type: node.type,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<SidebarData>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hoverTimeOut: any;
  nodeData: any;
  sideNavData: SideNavDataSource = new SideNavDataSource();

  constructor() {
    console.log('SidebarComponent');
    // this.dataSource.data = this.sideNavData.sideNavDataSource;
  }

  ngOnInit() {

    console.log('SignalRService:', this.signalRService);
    
    this.userRights =
      this.store.selectSnapshot(AuthenticationState.menuAccessRightList) || [];
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const { url } = event;
          for (let i = 0; i < this.noOfChildren; i++) {
            const element = document.getElementById('child-' + i);
            if (element) {
              if (this.sideNavData.matchRouterLink(url)) {
                element.classList.toggle('active', i === this.nodeData.index);
              } else {
                this.treeControl.collapseAll();
              }
            }
          }
        }
      });

    if (this.signalRService.tokenValue) {
      this.setItemsAccess();
    } else {
      this.signalRService
        .getTokenReady()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((isTokenReady) => {
          if (isTokenReady) {
            this.setItemsAccess();
          }
        });
    }
  }

  ngOnDestroy() {
    clearTimeout(this.hoverTimeOut);
  }

  setItemsAccess() {
    this.dataSource.data = this.sideNavData.sideNavDataSource;
    for (const item of this.dataSource.data) {
      if (item.children && item.children.length > 0) {
        this.noOfChildren += item.children.length;
      }
    }
    const menuAccessRights = this.store.selectSnapshot(
      AuthenticationState.menuAccessRightList,
    );
    this.userRights = menuAccessRights ? menuAccessRights : [];
    if (this.userRights) {
      const cumulativeMenu = this.dataSource.data
        .map((item) => {
          const children = item.children?.filter((child) =>
            this.userRights.includes(child.name),
          );
          return { ...item, children };
        })
        .filter((item) => item.children && item.children.length > 0);
      this.dataSource.data = cumulativeMenu;
    }
  }

  hasChild = (_: number, node: SidebarData) => node.expandable;

  middleClickHandle(url: string, event: any) {
    if (event.which == 2 || event.buttons == 4) {
      Helper.openInNewTab(url, this.router);
    }
  }

  onHover(event: any) {
    const sidebarMenu = document.getElementById('sidenav-hover');
    if (sidebarMenu) {
      switch (event.type) {
        case 'mouseenter':
          this.hoverTimeOut = setTimeout(() => {
            sidebarMenu.classList.add('hover');
          }, 500);
          break;

        case 'mouseleave':
          clearTimeout(this.hoverTimeOut);
          sidebarMenu.classList.remove('hover');
      }
    }
  }

  onChildClick(node: any) {
    this.nodeData = node;
    if (this.nodeData) {
      switch (this.nodeData.type) {
        case EnumSideNavTypes.LINK:
          this.router.navigate([this.nodeData.options.routerLink[0]]);
          break;
        case EnumSideNavTypes.BUTTON:
          break;
        default:
          console.log('unknown type');
          break;
      }
    }
  }

  onToggle(isExpanded: boolean): void {
    for (let i = 0; i < this.noOfChildren; i++) {
      const childMenu = document.getElementById('childMenu-' + i);
      if (childMenu) {
        isExpanded
          ? childMenu.classList.add('onToggle')
          : childMenu.classList.remove('onToggle');
      }
    }
  }

  getEnvironmentFromBrowser() {
    const hostname = window.location ? window.location.hostname : '';
    if (hostname.split('.')[0] != 'prod') {
      this.env2 = hostname.split('.')[0];
    }
  }

  ngAfterViewInit() {
    this.getEnvironmentFromBrowser();
    this.cdr.detectChanges();
  }
}
