// export interface Settings {
//     title: string;
//     gridRow: number;
//     gridCol: number;
//     type:string;
//     width: number;
//     height: number;
//     maxHeight: number;
//     maxWidth: number;
//     minHeight: number;
//     minWidth: number;
//     dataUrl: string;
//     primaryColor: string;

import { DateRangeParameters } from './supply-visibility.model';
import { GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';
import { v4 as uuidv4 } from 'uuid';

// }
export interface DashboardType {
  fontSize?: 'small' | 'medium' | 'large';
  type: string;
  title: string;
  subTitle?: string;
  img: string;
  selected: boolean;
  cols: number;
  rows: number;
  id?: string;
  minItemCols?: number;
  minItemRows?: number;
  maxItemCols?: any;
  maxItemRows?: any;
  api?: string;
  weeks?: number;
  firstValue?: TabFilterForWidget;
  secondValue?: TabFilterForWidget;
  filters?: AdditionalFilter[];
  modificationRights?: boolean;
  chartColor?: string;
  selectMode?: string;
}
export interface SettingsUser {
  title?: string;
  subTitle?: string;
  row: number;
  col: number;
  sizeX: number;
  sizeY: number;
  filter?: string;
  primaryColor?: string;
  widgetTheme?: string;
  chartColor?: string;
  selectMode?: string;
}
export interface TabFilterForWidget {
  onlyMyPNs?: boolean;
  customQuery?: any;
  fulltextSearch?: boolean;
  partNumbersFilterOptions?: string;
  formula?: string;
  // reviewStatus?: EnumReviewedStatus;
  partNumbers?: string;
  view?: string;
  weeks?: number;
  days?: number;
  allowMultiple?: boolean;
  buyerReviewStatus?: boolean;
  customerReviewStatus?: boolean;
  supplierReviewStatus?: boolean;
  showVendorCode?: boolean;
  showVendorName?: boolean;
  useChart?: boolean;
  isChartVisible?: boolean;
  useFiltering?: boolean;
  isFilteringVisible?: boolean;
  showTotalBar?: boolean;
  showFlaggedBar?: boolean;
  showUnFlaggedBar?: boolean;
  showReviewStatus?: boolean;
  filters?: AdditionalFilter[];
}
export interface AdditionalFilter {
  field: string;
  operator: string;
  value: any;
}
export interface PanelCache {
  key: string;
  value: string;
}

export interface DashboardCache {
  dashboardId: string;
  data: any[];
}
export interface WidgetSettingsVisibility {
  onDashboard: boolean;
  onMenuDelete: boolean;
  [key: string]: boolean;
}
export interface SharedWidgetList {
  userName: string;
  userSharedList: SharedDashboardType[];
}
export interface SharedDashboardType extends DashboardType {
  creator: string;
}
export interface FilterData {
  shouldFilter: boolean;
  onlyMyPns: boolean;
  filters: Filter[];
}

export interface Filter {
  filter: string;
  enabled: boolean;
}

export class DashboardPanelModel implements GridsterItem {
  static isFilterSet(filter: TabFilterForWidget): boolean {
    if (filter) {
      return filter.onlyMyPNs || filter.partNumbers || filter.formula || filter.weeks || filter.days ? true : false;
    } else {
      return false;
    }
  }
  static copySettingToDashboardWidget(
    dashboardPanelModel: DashboardPanelModel,
    uiModel: DashboardPanelModel
  ) {
    // following commented ones are not used right now
    // dashboardPanelModel.dragEnabled=uiModel.dragEnabled;
    // dashboardPanelModel.resizeEnabled=uiModel.resizeEnabled;
    // dashboardPanelModel.compactEnabled=uiModel.compactEnabled;
    // dashboardPanelModel.maxItemRows=uiModel.maxItemRows;
    // dashboardPanelModel.minItemRows=uiModel.minItemRows;
    // dashboardPanelModel.maxItemCols=uiModel.maxItemCols;
    // dashboardPanelModel.minItemCols=uiModel.minItemCols;
    // dashboardPanelModel.minItemArea=uiModel.minItemArea;
    // dashboardPanelModel.maxItemArea=uiModel.maxItemArea;

    dashboardPanelModel.fontSize = uiModel.fontSize || 'medium';
    dashboardPanelModel.title = uiModel.title;
    dashboardPanelModel.subTitle = uiModel.subTitle;
    dashboardPanelModel.type = uiModel.type;
    dashboardPanelModel.link = uiModel.link;
    dashboardPanelModel.header = uiModel.header;
    dashboardPanelModel.dataUrl = uiModel.dataUrl;
    dashboardPanelModel.primaryColor = uiModel.primaryColor;
    dashboardPanelModel.widgetTheme = uiModel.widgetTheme;
    dashboardPanelModel.periods = uiModel.periods;
    dashboardPanelModel.settingsUser = uiModel.settingsUser;
    dashboardPanelModel['data'] = uiModel['data'];
    dashboardPanelModel['filterType'] = uiModel['filterType'];
    dashboardPanelModel.content = uiModel.content;

    // dashboardPanelModel.filterOptions = uiModel.filterOptions;
    dashboardPanelModel.filters = uiModel.filters;
    dashboardPanelModel.firstValue = uiModel.firstValue;
    dashboardPanelModel.secondValue = uiModel.secondValue;

    dashboardPanelModel.panelCache = uiModel.panelCache;
    dashboardPanelModel.allowPrecalculations = uiModel.allowPrecalculations;
    dashboardPanelModel.allowSystemHealth = uiModel.allowSystemHealth;
    dashboardPanelModel.modificationRights = uiModel.modificationRights; //Enables Share Settings
    dashboardPanelModel.sharedId = uiModel.sharedId; //

    dashboardPanelModel['endpoint'] = uiModel['endpoint'];
    dashboardPanelModel.chartColor = uiModel.chartColor;
    dashboardPanelModel.selectMode = uiModel.selectMode;
    //A2
    // don't copy following as this will conflict with dashboard settings, placement and size should be decided by dashboard and not widget
    // dashboardPanelModel.x = uiModel.x;
    // dashboardPanelModel.y = uiModel.y;
    // dashboardPanelModel.rows = uiModel.rows;
    // dashboardPanelModel.cols = uiModel.cols;
  }
  firstValue?: TabFilterForWidget;
  secondValue?: TabFilterForWidget;
  filters?: AdditionalFilter[];
  fontSize?: 'small' | 'medium' | 'large';
  x: number = 0;
  y: number = 0;
  rows: number = 0;
  cols: number = 0;
  [propName: string]: any;
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  title?: string;
  subTitle?: string;
  type?: string;
  link?: string;
  header?: string;
  dataUrl?: string;
  primaryColor?: string;
  widgetTheme?: string;
  periods?: number;
  settingsUser?: SettingsUser;
  panelCache?: PanelCache[];
  allowPrecalculations?: boolean;
  allowSystemHealth?: boolean;
  content?: string;
  sharedId?: string;
  modificationRights?: boolean;
  chartColor?: string;
  selectMode?: string;
  refresh$?: () => {};
  public static assignIdIfMissing(panel: DashboardPanelModel) {
    if (!panel['id']) {
      panel['id'] = `${panel.type}-${uuidv4()}`;
    }
  }
  public static createPanelFromType(type: DashboardType) {
    const panel = new DashboardPanelModel();
    panel.fontSize = type.fontSize || 'medium';
    panel.maxItemCols = type.maxItemCols;
    panel.maxItemRows = type.maxItemRows;
    panel.minItemCols = type.minItemCols;
    panel.minItemRows = type.minItemRows;
    panel.x = 0;
    panel.y = 0;
    panel.cols = type.cols;
    panel.rows = type.rows;
    panel.title = type.title;
    panel.subTitle = type.subTitle;
    panel.type = type.type;
    panel.firstValue = type.firstValue;
    panel.secondValue = type.secondValue;
    panel.filters = type.filters;
    panel.modificationRights = type.modificationRights;
    panel.chartColor = type.chartColor;
    panel.selectMode = type.selectMode;

    if (type.id) {
      panel['id'] = type.id;
    } else {
      type.modificationRights ? DashboardPanelModel.assignIdIfMissing(panel) : null;
    }

    return panel;
  }
}

export interface DownloadSupplyVisibilityTableByWidget {
  materialManagementViewID: any;
  records: any;
  variant: string;
  partNoVendors: any;
  fontSize: number;
  userId: string;
}
