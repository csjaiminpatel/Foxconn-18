import {DashboardSetting, SetDefaultDashboardDto} from '../../models/shared-sv.model';
import { UserSettings } from '../../models/supply-visibility.model';

export class SetDashboardLockState {
  static readonly type = '[SupplyVisibilityShared] set dashboard lock state';
  constructor(public readonly state: boolean) {}
}
export class SetDashboardLockStateSuccess {
  static readonly type = '[SupplyVisibilityShared] set dashboard lock state success';
}
export class SetDashboardLockStateError {
  static readonly type = '[SupplyVisibilityShared] set dashboard lock state error';
}

export class SetDashboardModificationRights {
  static readonly type = '[SupplyVisibilityShared] set Dashboard Modification Rights state';
  constructor(public readonly state: boolean) {}
}
export class SetDashboardModificationRightsSuccess {
  static readonly type = '[SupplyVisibilityShared] set Dashboard Modification Rights success';
}
export class SetDashboardModificationRightsError {
  static readonly type = '[SupplyVisibilityShared] set Dashboard Modification Rights error';
}

export class SetDefaultDashboard {
  static readonly type = '[SupplyVisibilityShared] set default dashboard';
  constructor(
    public readonly dashboard: SetDefaultDashboardDto,
    public readonly isSettingAvailable: boolean| undefined = undefined 
  ) {}
}
export class SetDefaultDashboardSuccess {
  static readonly type = '[SupplyVisibilityShared] set default dashboard success';
  constructor(public readonly dashboardId: DashboardSetting) {}
}
export class SetDefaultDashboardError {
  static readonly type = '[SupplyVisibilityShared] set default dashboard error';
}
export class SetSelectedDashboard {
  static readonly type = '[SupplyVisibilityShared] set selected dashboard';
  constructor(public readonly dashboard: any) {}
}
export class SetDashboardList {
  static readonly type = '[SupplyVisibilityShared] set dashboardList';
}
export class SetDashboardListSuccess {
  static readonly type = '[SupplyVisibilityShared] set dashboardList success';
}
export class SetDashboardListError {
  static readonly type = '[SupplyVisibilityShared] set dashboardList error';
}

export class AddNewDashboard {
  static readonly type = '[SupplyVisibilityShared] add new dashboard';
  constructor(
    public readonly dashboard: DashboardSetting,
    public readonly isSettingAvailable: boolean|undefined = undefined
  ) {}
}
export class AddNewDashboardSuccess {
  static readonly type = '[SupplyVisibilityShared] add new dashboard success';
  constructor(public readonly dashboard: DashboardSetting) {}
}
export class AddNewDashboardError {
  static readonly type = '[SupplyVisibilityShared] add new dashboard error';
}

export class UpdateDashboard {
  static readonly type = '[SupplyVisibilityShared] update dashboard';
  constructor(public readonly data: any, public readonly isNotificationRequired: boolean = true) {}
}

export class UpdateDashboardSuccess {
  static readonly type = '[SupplyVisibilityShared] update dashboard success';
  constructor(public readonly dashboard: DashboardSetting) {}
}

export class UpdateDashboardError {
  static readonly type = '[SupplyVisibilityShared] update dashboard error';
  constructor(public readonly error: string) {}
}
export class UpdateDashboardInfo {
  static readonly type = '[SupplyVisibilityShared] update dashboard Info';
  constructor(public readonly data: any) {}
}
export class UpdateDashboardInfoSuccess {
  static readonly type = '[SupplyVisibilityShared] update dashboard Info Success';
  constructor(public readonly data: any) {}
}
export class DeleteDashboard {
  static readonly type = '[SupplyVisibilityShared] Delete dashboard';
  constructor(public readonly dashboard: any) {}
}

export class DeleteDashboardSuccess {
  static readonly type = '[SupplyVisibilityShared] Delete dashboard success';
  constructor(public readonly dashboardList: any[]) {}
}

export class DeleteDashboardError {
  static readonly type = '[SupplyVisibilityShared] Delete dashboard error';
}

export class SetUserSettingsAvailability {
  static readonly type = '[SupplyVisibilityShared] Add SetUserSettingsAvailability';
  constructor(public readonly isUserSettingAvailable: any) {}
}
export class ChangeDashboard {
  static readonly type = '[SupplyVisibilityShared] change dashboard';
  constructor(public readonly dashboardId: string) {}
}
export class ChangeDashboardSuccess {
  static readonly type = '[SupplyVisibilityShared] change dashboard success';
  constructor(public readonly dashboard: any) {}
}
export class ChangeDashboardError {
  static readonly type = '[SupplyVisibilityShared] change dashboard error';
}
export class SetCreatedDashboardIdList {
  static readonly type = '[SupplyVisibilityShared] set Created ';
  constructor(public readonly dashboardIdList: string[]) {}
}

export class AddCommonUserSettings {
  static readonly type = '[SupplyVisibilityShared] Add Common UserSettings on plants';
  constructor(public readonly userSettings: UserSettings) {}
}
export class AddCommonUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Success';
}
export class AddCommonUserSettingsError {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Error';
  constructor(public readonly error: any) {}
}

export class UpdateCommonUserSettings {
  static readonly type = '[SupplyVisibilityShared] Update Common UserSettings on plants';
  constructor(public readonly userSettings: UserSettings) {}
}
export class UpdateCommonUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Success';
}
export class UpdateCommonUserSettingsError {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Error';
  constructor(public readonly error: any) {}
}

export class DeleteCommonUserSettings {
  static readonly type = '[SupplyVisibilityShared] Delete Common UserSettings on plants';
  constructor(public readonly key: string) {}
}
export class DeleteCommonUserSettingsSuccess {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Success';
}
export class DeleteCommonUserSettingsError {
  static readonly type = '[SupplyVisibility] Delete Common UserSettings on plants Error';
  constructor(public readonly error: any) {}
}

export class SetDashboardCache {
  static readonly type = '[SupplyVisibility] Save dashboard cache';
  constructor(public data: any) {}
}
