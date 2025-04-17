export interface SetDefaultDashboardDto {
  id: string;
  [propName: string]: any;
}
export interface DashboardConfig {
  selectedDashboardId: string;
  dashboardIdList: string[];
}
export interface SharedWidget {
  Id?: string;
  Name?: string;
  SecurityLevel?: string;
  RightForModifying?: string;
  Data?: string;
}
export interface DashboardSetting {
  id?: string;
  name?: string;
  securityLevel?: string;
  rightForModifying?: string;
  data?: string;
  isPersonal?: boolean;
  isDefaultForRole?: boolean;
  defaultForRole?: string;
  [propName: string]: any;
}
