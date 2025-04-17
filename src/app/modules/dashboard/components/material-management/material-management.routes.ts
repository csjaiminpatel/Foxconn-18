import { Route } from "@angular/router";
import { MaterialManagementComponent } from "./material-management/material-management.component";
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { SupplyVisibilityDashboardComponent } from "../supply-visibility-dashboard/supply-visibility-dashboard.component";

export const MATERIAL_MANAGEMENT_ROUTES: Route[] = [
  {
    path: '',
    component: MaterialManagementComponent,
    children: [
     
      {
        path: '',
        pathMatch: 'full',
        component: SupplyVisibilityDashboardComponent,
        // canActivate: [PlantHealthCheckGuard],
        data: {
          breadcrumb: 'supply-visibility-dashboard',
        },
        // redirectTo: 'supply-visibility-dashboard',
      },

      // {
      //   path: 'pn-groups',
      //   component: PnGroupsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'pn-groups',
      //     skip: true,
      //   },
      // },
      // {
      //   path: 'supply-visibility',
      //   component: SupplyVisibilityComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'supply-visibility',
      //   },
      // },
      // {
      //   path: 'supply-visibility-multi-pn',
      //   component: SupplyVisibilityMultiPnComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'supply-visibility',
      //   },
      // },
      // {
      //   path: 'material-management-views',
      //   component: MaterialManagementViewsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'material-management-views',
      //   },
      // },
      // {
      //   path: 'material-management-views/:viewid',
      //   component: MaterialManagementViewComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'material-management-views/viewid',
      //     skip: true,
      //   },
      // },
      // {
      //   path: 'commits',
      //   component: CommitsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'commits',
      //     skip: true,
      //   },
      // },
      // {
      //   path: 'material-management-views/:viewid/:calculationLineID',
      //   component: LineConfigurationComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'material-management-views/viewid/calculationLineID',
      //     skip: true,
      //   },
      // },
      // {
      //   path: 'vendorcodes-rights',
      //   component: VendorcodesRightsConfigurationComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'vendorcodesRights',
      //     skip: true,
      //   },
      // },
      {
        path: 'notifications',
        component: NotificationsComponent,
        // canActivate: [PlantHealthCheckGuard],
        data: {
          breadcrumb: 'notifications',
        },
      },
      // {
      //   path: 'qap',
      //   component: QapComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'qap',
      //   },
      // },
      // {
      //   path: 'vendors',
      //   component: VendorsListComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'vendorsList'
      //   }
      // },
      // {
      //   path: 'contacts',
      //   component: ContactsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'contacts'
      //   }
      // },
      // {
      //   path: 'quotations',
      //   component: QuotationsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'quotations'
      //   }
      // },
      // {
      //   path: 'quotations/:id',
      //   component: QuotationsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'quotations/id',
      //     skip: true
      //   }
      // },
      // {
      //   path: 'quotationsForVendor/:quotationId',
      //   component: QuotationsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'quotationsForVendor/quotationId',
      //     skip: true
      //   }
      // },
      // {
      //   path: 'shipments',
      //   component: ShipmentsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'shipments'
      //   }
      // },
      // {
      //   path: 'audit-log',
      //   component: AuditLogComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'audit-log'
      //   }
      // },
      // {
      //   path: 'partnumbers',
      //   component: PartnumberListComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'partnumberList'
      //   }
      // },
      // {
      //   path: 'carriers',
      //   component: CarriersListComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'carriersList'
      //   }
      // },
      // {
      //   path: 'portfolio',
      //   component: PortfolioComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'portfolio'
      //   }
      // },
      // {
      //   path: 'default-fields',
      //   component: DefaultFieldsComponent,
      //   // canActivate: [PlantHealthCheckGuard],
      //   data: {
      //     breadcrumb: 'default-fields'
      //   }
      // },
      // {
      //   path: 'global-notifications',
      //   component: GlobalNotificationsComponent,
      //   data: {
      //     breadcrumb: 'global-notifications'
      //   }
      // },
      // {
      //   path: 'ai',
      //   component: AiComponent,
      //   data: {
      //     breadcrumb: 'ai'
      //   }
      // },
      // {
      //   path: 'stocks',
      //   component: StocksListComponent,
      //   data: {
      //     breadcrumb: 'stockList'
      //   }
      // },
    ]
  },
];

