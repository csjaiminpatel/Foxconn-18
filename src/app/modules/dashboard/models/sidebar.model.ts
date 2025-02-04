export interface SidebarData {
    expandable: boolean;
    name: string;
    icon: string;
    options: any;
    visible: boolean;
    index: number;
    type: EnumSideNavTypes;
    level: number;
  }

  export enum EnumSideNavTypes {
    LINK = 0,
    BUTTON = 1,
  }

  export interface MatTreeNode {
    type: EnumSideNavTypes;
    name: string;
    icon: string;
    visible: boolean;
    index?: number;
    options?: {routerLink?: any; params?: any};
  }

  export interface SideNavOptions extends MatTreeNode {
    children?: SideNavChild[];
  }
export type SideNavChild = MatTreeNode

  export class SideNavDataSource {
    public sideNavDataSource: SideNavOptions[] = [
      {
        name: 'PORTFOLIO',
        icon: 'dataset',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
          {
            name: 'Portfolio',
            icon: 'P',
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 0,
            options: {  routerLink: ['/material-management/portfolio'] }
          },
          {
            name: 'PartNumbers',
            icon: 'P',
            index: 1,
            visible: true,
            options: { routerLink: ['/material-management/partnumbers'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'Vendors',
            icon: 'V',
            index: 2,
            visible: true,
            options: { routerLink: ['/material-management/vendors'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'Vendor Codes Rights',
            icon: 'V',
            index: 3,
            visible: true,
            options: { routerLink: ['material-management/vendorcodes-rights'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'Carriers',
            icon: 'C',
            index: 4,
            visible: true,
            options: { routerLink: ['/material-management/carriers'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'Contacts',
            icon: 'C',
            index: 5,
            visible: true,
            options: { routerLink: ['/material-management/contacts'] },
            type: EnumSideNavTypes.LINK,
          },
        ],
      },
      {
        name: 'SCM',
        icon: 'inventory_2',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
          {
            name: 'Commits',
            icon: 'C',
            index: 6,
            visible: true,
            options: { routerLink: ['material-management/commits'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'PN Groups',
            icon: 'P',
            index: 7,
            visible: true,
            options: { routerLink: ['material-management/pn-groups'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'QAP',
            icon: 'Q',
            index: 8,
            visible: true,
            options: { routerLink: ['/material-management/qap'] },
            type: EnumSideNavTypes.LINK,
          },
          {
            name: 'RFQ',
            icon: 'R',
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 9,
            options: { routerLink: ['/material-management/quotations'] }
          },
          {
            name: 'Default Fields',
            icon: 'D',
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 10,
            options: { routerLink: ['/material-management/default-fields'] }
          }
        ],
      },
      // {
      //   name: 'Passport',
      //   icon: 'flight_takeoff',
      //   type: EnumSideNavTypes.LINK,
      //   visible: true,
      //   children: [
      //     {
      //       name: 'My Portfolio',
      //       icon: 'M',
      //       index: 3,
      //       visible: true,
      //       options: { routerLink: ['/material-management/my-portfolio'] },
      //       type: EnumSideNavTypes.LINK,
      //     },
      //     {
      //       name: 'Vendors',
      //       icon: 'V',
      //       index: 4,
      //       visible: true,
      //       options: { routerLink: ['/material-management/vendors'] },
      //       type: EnumSideNavTypes.LINK,
      //     },
      //     {
      //       name: 'Contacts',
      //       icon: 'C',
      //       index: 5,
      //       visible: true,
      //       options: { routerLink: ['/material-management/contacts'] },
      //       type: EnumSideNavTypes.LINK,
      //     },
      //   ],
      // },
      {
        name: 'Financial Module',
        icon: 'account_balance',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
  
          {
            name: 'Invoicing',
            icon: 'I',
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 11,
            options: { routerLink: ['/financial-module/invoicing'] }
          },
          {
            name: 'Goods Receipts',
            icon: "G",
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 12,
            options: { routerLink: ['/financial-module/goods-receipts'] }
          },
          {
            name: 'Invoice Reconciliation',
            icon: "IR",
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 13,
            options: { routerLink: ['/financial-module/invoice-reconciliation'] }
          }
        ]
      },
      {
        name: 'Logistic',
        icon: 'local_shipping',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
          {
            name: 'Shipments',
            icon: "S",
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 14,
            options: { routerLink: ['/material-management/shipments'] }
          }
        ]
      },
      {
        name: 'Activity',
        icon: 'timelapse',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
          {
            name: 'Audit Log',
            icon: "A",
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 15,
            options: { routerLink: ['/financial-module/audit-log'] }
          }
        ]
      },
      {
        name: 'Administration',
        icon: 'admin_panel_settings',
        type: EnumSideNavTypes.LINK,
        visible: true,
        children: [
          {
            name: 'Global Notifications',
            icon: "GN",
            type: EnumSideNavTypes.LINK,
            visible: true,
            index: 16,
            options: { routerLink: ['material-management/global-notifications'] }
          }
        ]
      }
    ]
  
    matchRouterLink(url:any) {
      return this.sideNavDataSource.some(data => {
        const childUrl = data.children?.find((child:any) => url.includes(child.options.routerLink));
        if (childUrl) {
          console.log(`${url} clicked`);
          return true;
        }
        return false;
      });
    }
  
  }