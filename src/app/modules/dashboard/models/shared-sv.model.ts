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
  Id?: string;
  Name?: string;
  SecurityLevel?: string;
  RightForModifying?: string;
  Data?: string;
  IsPersonal?: boolean;
  IsDefaultForRole?: boolean;
  DefaultForRole?: string;
  [propName: string]: any;
}
