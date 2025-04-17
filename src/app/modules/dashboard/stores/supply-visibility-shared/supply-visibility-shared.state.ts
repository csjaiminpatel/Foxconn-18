import { TranslateService } from "@ngx-translate/core";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { NotificationService } from "../../../auth/services/Notification/notification.service";
import { DashboardSetting } from "../../models/shared-sv.model";
import { UserSettings, NewUserSetting as NewUserSettings, } from "../../models/supply-visibility.model";
import { DashboardCache } from "../../models/sv-dashboard";
import { SupplyVisibilityService } from "../../services/Supply-Visibility/supply-visibility.service";
import { AddUserSettings, EditUserSettings } from "../supply-visibility/supply-visibility.actions";
import { SetUserSettingsAvailability, SetDashboardLockState, SetDashboardModificationRights, SetDashboardList, SetDashboardListSuccess, SetDashboardListError, AddNewDashboard, AddNewDashboardSuccess, AddNewDashboardError, UpdateDashboard, UpdateDashboardSuccess, UpdateDashboardError, UpdateDashboardInfo, UpdateDashboardInfoSuccess, DeleteDashboard, DeleteDashboardSuccess, DeleteDashboardError, SetDefaultDashboard, SetSelectedDashboard, ChangeDashboard, ChangeDashboardSuccess, AddCommonUserSettings, AddCommonUserSettingsSuccess, AddCommonUserSettingsError, UpdateCommonUserSettings, UpdateCommonUserSettingsSuccess, UpdateCommonUserSettingsError, DeleteCommonUserSettings, SetDashboardCache } from "./supply-visibility-shared.actions";
import { AuthService } from "../../../auth/services/auth.service";
import { inject, Injectable } from "@angular/core";

export interface SupplyVisibilitySharedStateModel {
  isDashboardLocked: boolean;
  modificationRights: boolean;
  defaultDashboard: any;
  dashboardList: DashboardSetting[];
  isUserSettingAvailable: boolean;
  createdDashboardIdList: string[];
  dashboardCache: DashboardCache[];
}

@State<SupplyVisibilitySharedStateModel>({
  name: 'supplyvisibilityshared',
  defaults: {
    isDashboardLocked: true,
    modificationRights: false,
    defaultDashboard: null,
    dashboardList: [],
    isUserSettingAvailable: false,
    createdDashboardIdList: [],
    dashboardCache: [],
  },
})
export class SupplyVisibilitySharedState {
  public readonly DASHBOARD_KEY = 'svDashboard';
  public readonly DASHBOARD_LIST_KEY = 'svCreatedList';

    private supplyVisibilityService = inject(SupplyVisibilityService);
    private notificationService = inject(NotificationService);
    private translate = inject(TranslateService);
    private authService = inject(AuthService);

  /**
   *
   * @returns Get Dashboard Lock Status
   */
  @Selector()
  static getDashboardLockState(state: SupplyVisibilitySharedStateModel) {
    return state.isDashboardLocked;
  }
  /**
   *
   * @returns Get Dashboard Modification Rights Status
   */
  @Selector()
  static getDashboardModificationRightsState(state: SupplyVisibilitySharedStateModel) {
    return state.modificationRights;
  }
  /**
   *
   * @returns Get DashboardList
   */
  @Selector()
  static getDashboardList(state: SupplyVisibilitySharedStateModel) {
    return state.dashboardList;
  }

  @Selector()
  static getUsersDashboardList(state: SupplyVisibilitySharedStateModel) {
    return state.dashboardList;
  }

  /**
   *
   * @returns Get DashboardList
   */
  @Selector()
  static getDefaultDashboardId(state: SupplyVisibilitySharedStateModel) {
    return state.defaultDashboard ? state.defaultDashboard.Id : null;
  }

  /**
   *
   * @returns Get isUserSharedDashboard
   */
  @Selector()
  static isUserSharedDashboard(state: SupplyVisibilitySharedStateModel) {
    const dashboardList = state.dashboardList;
    const currentDashboard = state.defaultDashboard;
    const searchResult = dashboardList.find((e) => e.id == currentDashboard.id);
    return searchResult && !searchResult.isPersonal ? true : false;
  }

  /**
   *
   * @returns Get DashboardList
   */
  @Selector()
  static getDefaultDashboard(state: SupplyVisibilitySharedStateModel) {
    return state.defaultDashboard;
  }

  @Selector()
  static getUserSettingsAvailability(state: SupplyVisibilitySharedStateModel) {
    return state.isUserSettingAvailable;
  }

  @Selector()
  static getDashboardCache(state: SupplyVisibilitySharedStateModel) {
    return state.dashboardCache;
  }

  @Action(SetUserSettingsAvailability)
  setUserSettingsAvailability(
    {patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {isUserSettingAvailable}: SetUserSettingsAvailability
  ) {
    patchState({
      isUserSettingAvailable: isUserSettingAvailable,
    });
  }

  @Action(SetDashboardLockState)
  setDashboardLockState(
    {patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {state}: SetDashboardLockState
  ) {
    patchState({
      isDashboardLocked: state,
    });
  }

  @Action(SetDashboardModificationRights)
  setDashboardModificationRights(
    {patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {state}: SetDashboardModificationRights
  ) {
    patchState({
      modificationRights: state,
    });
  }
  @Action(SetDashboardList)
  async setDashboardList({patchState, dispatch}: StateContext<SupplyVisibilitySharedStateModel>) {
    return await this.supplyVisibilityService.getDashboardList().subscribe(
      (res) => {
        if (res) {
          patchState({
            dashboardList: res,
          });
          dispatch(new SetDashboardListSuccess());
        }
      },
      (error) => {
        dispatch(new SetDashboardListError());
      }
    );
  }

  @Action(AddNewDashboard)
  addNewDashboard(
    {dispatch, patchState, getState}: StateContext<SupplyVisibilitySharedStateModel>,
    {dashboard}: AddNewDashboard
  ) {
    const state = getState();
    return this.supplyVisibilityService.insertDashboard(dashboard).subscribe(
      (res) => {
        if (res) {
          dispatch(new AddNewDashboardSuccess(res));
        }
      },
      (error) => {
        dispatch(new AddNewDashboardError());
      }
    );
  }
  @Action(UpdateDashboard)
  updateDashboard(
    {dispatch, getState, patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {data, isNotificationRequired}: UpdateDashboard
  ) {
    const state = getState();
    const dashboardData = state.defaultDashboard;
    if (dashboardData) {
      //dashboardData.data = JSON.stringify(data); //replaced with following was throwing readonly error. Why was this here?
      let newData = JSON.stringify(data);
      let newDashboardData = { ...dashboardData, data: newData };

      this.authService.setCancellationToken(false, 'updateDashboard API');
      return this.supplyVisibilityService.updateDashboard(newDashboardData).subscribe(
        (res) => {
          patchState({
            defaultDashboard: newDashboardData
          })
          dispatch(new UpdateDashboardSuccess(res));
          this.authService.setCancellationToken(true, 'updateDashboard API');
          if (isNotificationRequired) {
            this.notificationService.showMessage(
              this.translate.instant('global.settingsSaveSuccess')
            );
          }
        },
        (error) => {
          dispatch(new UpdateDashboardError(error));
          this.authService.setCancellationToken(true);
          this.notificationService.showError(this.translate.instant('global.settingsSaveFailed'));
        }
      );
    } else {
      dispatch(new UpdateDashboardError('dashboard N/A'));
      this.notificationService.showError(this.translate.instant('global.settingsSaveFailed'));
      return;
    }
  }
  @Action(UpdateDashboardInfo)
  updateDashboardInfo(
    {dispatch, getState, patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {data}: UpdateDashboardInfo
  ) {
    const state = getState();
    const dashboardData = state.defaultDashboard;
    if (dashboardData) {
      dashboardData.securityLevels = data.securityLevels;
      dashboardData.name = data.name;
      dashboardData.isDefault = data.isDefault;
      // dashboardData.data = (dashboardData.securityLevel == 'personal') ? dashboardData.data : this.processDashboardOnShared(dashboardData.data);

      return this.supplyVisibilityService.updateDashboard(dashboardData).subscribe(
        (res) => {
          patchState({
            defaultDashboard: dashboardData,
          });
          dispatch(new SetDashboardList());
          this.notificationService.showMessage(
            this.translate.instant('global.settingsSaveSuccess')
          );
          dispatch(new UpdateDashboardInfoSuccess(dashboardData));
        },
        (error) => {
          this.notificationService.showError(this.translate.instant('global.settingsSaveFailed'));
        }
      );
    } else {
      this.notificationService.showError(this.translate.instant('global.settingsSaveFailed'));
      dispatch(new UpdateDashboardError('dashboardInfo N/A'));
      return;
    }
  }
  @Action(DeleteDashboard)
  deleteDashboard(
    {getState, patchState, dispatch}: StateContext<SupplyVisibilitySharedStateModel>,
    {dashboard}: DeleteDashboard
  ) {
    const state = getState();
    let dashboardList: DashboardSetting[] = state ? state.dashboardList : [];
    return this.supplyVisibilityService.deleteDashboard(dashboard.id).subscribe(
      (res) => {
        if (dashboardList.length) {
          dashboardList = dashboardList.filter((e) => e.id != dashboard.id);


          patchState({
            dashboardList: dashboardList,
          });


          dispatch(new DeleteDashboardSuccess(dashboardList));
        }
        try {
          const widgetsData: any[] = JSON.parse(dashboard.data);
          widgetsData.forEach((widget) => {
            if (widget.sharedId && widget.modificationRights) {
              this.supplyVisibilityService.deleteSharedWidget(widget.id).subscribe((e) => {});
            }
          });
        } catch (e) {}
        this.notificationService.showMessage('Dashboard Deleted Successfully');
      },
      (e) => {
        dispatch(new DeleteDashboardError());
        if (e.error && e.error.title) {
          this.notificationService.showError(e.error.title);
        }
      }
    );
  }

  @Action(SetDefaultDashboard)
  setDefaultDashboard(
    {dispatch, patchState, getState}: StateContext<SupplyVisibilitySharedStateModel>,
    {dashboard, isSettingAvailable}: SetDefaultDashboard
  ) {
    const state = getState();

    // let createdDashboardIdList: string[] = [...state.createdDashboardIdList, dashboard.id];
    // createdDashboardIdList = Helper.removeDuplicate(createdDashboardIdList);


    if (isSettingAvailable === null) {
      isSettingAvailable = state.isUserSettingAvailable;
    }

    const DASHBOARD_KEY = 'svDashboard';
    const DASHBOARD_LIST_KEY = 'svCreatedList';

    const dashboardSelection = {
      selectedDashboardId: dashboard.id,
      dashboardCache: state.dashboardCache,
    };
    patchState({
      defaultDashboard: dashboard,
    });

    const settings = {
      key: DASHBOARD_KEY,
      data: JSON.stringify(dashboardSelection),
    };

    if (!isSettingAvailable) {
      dispatch(new AddUserSettings(settings));
    } else {
      dispatch(new EditUserSettings(settings, false));
    }
  }

  @Action(SetSelectedDashboard)
  setSelectedDashboard(
    {patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {dashboard}: SetSelectedDashboard
  ) {
    patchState({
      defaultDashboard: dashboard,
    });
  }

  @Action(ChangeDashboard)
  changeDashboard(
    {dispatch}: StateContext<SupplyVisibilitySharedStateModel>,
    {dashboardId}: ChangeDashboard
  ) {
    return this.supplyVisibilityService.getDashboardDetail(dashboardId).subscribe((dashboard) => {
      if (dashboard) {
        dispatch(new SetDefaultDashboard(dashboard));
        dispatch(new ChangeDashboardSuccess(dashboard));
      }
    });
  }


  /**
   * Add New Common UserSetting
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {AddUserSettings} { userSetting }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(AddCommonUserSettings)
  addUserSetting(
    {getState, patchState, dispatch}: StateContext<SupplyVisibilitySharedStateModel>,
    {userSettings}: AddCommonUserSettings
  ) {
    const state = getState();

    if (userSettings) {
      const addUserSetting: NewUserSettings = userSettings;

      return this.supplyVisibilityService.addCommonUserSettings(addUserSetting).subscribe(
        (userSetting: UserSettings) => {
          if (userSetting) {
            const userSettingsData = userSettings;
            dispatch(new AddCommonUserSettingsSuccess());
          }
        },
        (error: any) => {
          dispatch(new AddCommonUserSettingsError(error));
        }
      );
    }
    return undefined;
  }

  /**
   * Edit New UserSetting
   * @param {StateContext<SupplyVisibilityStateModel>} { getState, patchState }
   * @param {EditUserSettings} { userSetting }
   * @returns
   * @memberof SupplyVisibilityState
   */
  @Action(UpdateCommonUserSettings)
  editUserSetting(
    {dispatch}: StateContext<SupplyVisibilitySharedStateModel>,
    {userSettings}: UpdateCommonUserSettings
  ) {
    if (userSettings) {
      const editUserSetting: NewUserSettings = userSettings;

      return this.supplyVisibilityService.updateCommonUserSettings(editUserSetting).subscribe(
        (userSetting: UserSettings) => {
          dispatch(new UpdateCommonUserSettingsSuccess());
        },
        (error: any) => {
          dispatch(new UpdateCommonUserSettingsError(error));
        }
      );
    }
    return undefined;
  }
  @Action(DeleteCommonUserSettings)
  DeleteUserSettings(ctx: StateContext<SupplyVisibilitySharedStateModel>,{key}: DeleteCommonUserSettings) {
    if (!key) {
      return undefined;
    }
    this.supplyVisibilityService.deleteCommonUserSettings(key).subscribe((res) => {
      // const result = userSettings.filter(q => q.id !== res.id);
      // patchState({
      //   userSettings: result
      // });
    });
  }

  @Action(SetDashboardCache)
  SetDashboardCache(
    {patchState}: StateContext<SupplyVisibilitySharedStateModel>,
    {data}: SetDashboardCache
  ) {
    patchState({
      dashboardCache: data,
    });
  }
}
