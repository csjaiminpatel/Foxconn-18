import { State, StateContext, Selector, createSelector, Action } from '@ngxs/store';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
// import {AuthenticationService} from './authentication.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../services/config.service';
import { SupplyVisibilityRights, AuthenticatedUser, AuthenticationStateModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { LoginAdfsSuccess, SetUserRights, SetUserRightsSuccess, SetManageCommitsRights, LoginApplication, LoginSuccess, LoginCanceled, LoginApplicationTest, Logout, LogoutTest, FetchAdfsPlants, LogoutAdfs, LoginSuccessDomain, LoginErrorDomain, FetchPlants, GetGlobalNotificationsByFilter, GetGlobalNotificationsByFilterSuccess, GetGlobalNotificationsByFilterError, SetUserRole } from './authentication.actions';

@State<AuthenticationStateModel>({
  name: 'authentication',
  defaults: {
    token: '',
    tenants: [],
    username: '',
    upn: '',
    primarySid: '',
    activeTenant: '',
    isLoggedIn: false,
    applicationForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    plant: '',
    plants: [],
    currentRole: '',
    supplyVisibilityRights: {
      forecastView: false,
      graphsView: false,
      manageCommits: false, //TODO remove dependency
      cancelCommits: false,
      deleteCommits: false,
      dummyCommits: false,
      commitsLayout: false,
      notesView: false,
      notesEdit: false,
      commentsView: false,
      commentsEdit: false,
      masterDataView: false,
      reviewFlags: false,
    },
    commitsModuleRights: {
      createCommits: false,
      downloadExcel: false,
      layoutChanges: false,
      massChanges: false,
      searchCommits: false,
      cancelCommits: false,
      deleteCommits: false,
      deletePLO:false,
      documentsView: false,
      documentsCreate: false,
      documentsDelete: false,
    },
  },
})

@Injectable()
export class AuthenticationState {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  
  async ngxsOnInit({dispatch}: StateContext<AuthenticationStateModel>) {
    await this.configService.loadConfig();
    
    this.authService.getIsAuthorized().subscribe(async (isAuthorized) => {
      if (isAuthorized) {
        const username = await this.authService.getUserName();
        const upn = await this.authService.getUpn();
        const primarySid = await this.authService.getPrimarySid();

        dispatch(new LoginAdfsSuccess(username, upn, primarySid));
      } 
    });
  }

  @Selector()
  static token({token}: AuthenticationStateModel) {
    return token;
  }

  @Selector()
  static plants({plants}: AuthenticationStateModel) {
    return plants;
  }

  @Selector()
  static plant({plant}: AuthenticationStateModel) {
    return createSelector([AuthenticationState], (state: AuthenticationStateModel) => {
      return state.plants.find((p) => p.Code === plant);
    });
  }

  @Selector()
  static activePlant({plant, plants}: AuthenticationStateModel) {
    //TODO Remove this line of code after sometime
    plant = typeof(plant) == 'object' ? plant.Code : plant;
    const storedPlant = plants.find((p) => p.Code === plant );
    if (storedPlant) {
      return storedPlant.Code;
    }
    return plant;
  }

  @Selector()
  static getActiveplant({plant}: AuthenticationStateModel, ) {
    // VISUALIZATOR HACK, REMOVE AFTER VISUALIZATOR WILL NOT BE USED ANYMORE
    const plantType: 'visualizator' | 'configurator' =
      typeof plant === 'object' ? 'visualizator' : 'configurator';

    if (plantType === 'visualizator') {
      return plant.Code;
    }

    if (plantType === 'configurator') {
      return plant;
    }
  }

  @Selector()
  static isLoggedIn({isLoggedIn}: AuthenticationStateModel) {
    return isLoggedIn;
  }

  @Selector()
  static tenants({tenants}: AuthenticationStateModel) {
    return tenants;
  }

  @Selector()
  static activeTenant({activeTenant}: AuthenticationStateModel) {
    return activeTenant;
  }

  @Selector()
  static username({username}: AuthenticationStateModel) {
    return username;
  }
  @Selector()
  static upn({upn}: AuthenticationStateModel) {
    return upn;
  }
  @Selector()
  static primarySid({primarySid}: AuthenticationStateModel) {
    return primarySid;
  }

  @Selector()
  static commitModuleRights({commitsModuleRights}: AuthenticationStateModel) {
    return commitsModuleRights;
  }

  @Selector()
  static configurationRights({configurationRights}: AuthenticationStateModel) {
    return configurationRights;
  }

  @Selector()
  static dashboardRights({dashboardRights}: AuthenticationStateModel) {
    return dashboardRights;
  }

  @Selector()
  static vendorListRights({vendorListRights}: AuthenticationStateModel) {
    return vendorListRights;
  }

  @Selector()
  static supplyVisibilityRights({supplyVisibilityRights}: AuthenticationStateModel) {
    return supplyVisibilityRights;
  }

  @Selector()
  static finantialModuleRights({finantialModuleRights}: AuthenticationStateModel) {
    return finantialModuleRights;
  }

  @Selector()
  static dateTypeRights({dateTypeRights}: AuthenticationStateModel) {
    return dateTypeRights;
  }
  
  @Selector()
  static dateTypeRightList({dateTypeRightList}: AuthenticationStateModel) {
    return dateTypeRightList;
  }

  @Selector()
  static menuAccessRightList({menuAccessRightList}: AuthenticationStateModel) {
    return menuAccessRightList;
  } 
   
  @Selector()
  static widgetAccessRightList({widgetAccessRightList}: AuthenticationStateModel) {
    return widgetAccessRightList;
  }

  @Selector()
  static statusRightList({statusRightList}: AuthenticationStateModel) {
    return statusRightList;
  }


  @Selector()
  static supplyVisibilityModuleRights({
    supplyVisibilityRights,
  }: AuthenticationStateModel): SupplyVisibilityRights | undefined {
    return supplyVisibilityRights;
  }

  @Action(SetUserRights)
  setUserRights({patchState, dispatch}: StateContext<AuthenticationStateModel>, {userRights}: SetUserRights) {
    patchState({
      supplyVisibilityRights: userRights.supplyVisibilityRights,
      commitsModuleRights: userRights.commitsModuleRights,
      dashboardRights: userRights.dashboardRights,
      vendorListRights: userRights.vendorListRights,
      configurationRights: userRights.configurationRights,
      finantialModuleRights: userRights.finantialModuleRights,
      dateTypeRights: userRights.dateTypeRights,
      dateTypeRightList: userRights.dateTypeRightList,
      menuAccessRightList: userRights.menuAccessRightList,
      widgetAccessRightList: userRights.widgetAccessRightList,
      statusRightList: userRights.statusRightList,
    });
    dispatch(new SetUserRightsSuccess(userRights));
  }

  @Action(SetManageCommitsRights)
  setManageCommitsRights(
    {patchState, getState}: StateContext<AuthenticationStateModel>,
    {permission}: SetManageCommitsRights
  ) {
    const state = getState();
    const commitsRights = state.commitsModuleRights;
    const svRights = state.supplyVisibilityRights;
    const dashRights = state.dashboardRights;
    const venlRights = state.vendorListRights;
    const confRights = state.configurationRights;
    const finRight = state.finantialModuleRights;
    const dateRite = state.dateTypeRights;
    const dateListRight = state.dateTypeRightList;
    const menuRight = state.menuAccessRightList;
    const WidgetRight = state.widgetAccessRightList;
    const statusListRight = state.statusRightList;

    if (commitsRights) {
      commitsRights['deleteCommits'] = permission;
    }
    if (svRights) {
      svRights['deleteCommits'] = permission;
    }

    patchState({
      supplyVisibilityRights: svRights,
      commitsModuleRights: commitsRights,
      dashboardRights: dashRights,
      vendorListRights: venlRights,
      configurationRights: confRights,
      finantialModuleRights: finRight,
      dateTypeRights: dateRite,
      dateTypeRightList: dateListRight,
      menuAccessRightList: menuRight,
      widgetAccessRightList: WidgetRight,
      statusRightList: statusListRight
    });
  }

  @Selector()
  static getCurrentRole({ currentRole }: AuthenticationStateModel) {
    return currentRole;
  }

  @Action(LoginApplication)
  loginApplication(
    {dispatch}: StateContext<AuthenticationStateModel>,
    {password, username}: LoginApplication
  ) {
    this.authService.loginApplication({password, username}).subscribe(
      (user: AuthenticatedUser) => {
        dispatch(new LoginSuccess(user.token, username));
      },
      (err) => dispatch(new LoginCanceled())
    );
  }

  @Action(LoginApplicationTest)
  loginApplicationTest(
    {patchState}: StateContext<AuthenticationStateModel>,
    {username}: LoginApplicationTest
  ) {
    patchState({
      token: 'testtest',
      username: username,
    });
  }

  @Action(LoginCanceled)
  loginCanceled() {}

  @Action(LoginSuccess)
  loginSuccess(
    {patchState}: StateContext<AuthenticationStateModel>,
    {token, username}: LoginSuccess
  ) {
    // const tenants = jwt(token).Tenant as string[];
    const decodedToken = jwtDecode(token) as { Tenant: string[] };
    const tenants = decodedToken.Tenant || [];
    


    patchState({
      token: token,
      tenants: tenants,
      activeTenant: tenants[0],
      isLoggedIn: true,
      username: username,
      plant: tenants[0],
      plants: tenants,
    });
  }

  @Action(Logout)
  logout({getState, setState}: StateContext<AuthenticationStateModel>) {
    const {plant, plants, activeTenant} = getState();

    return this.authService.logout().pipe(
      tap(() => {
        setState({
          token: '',
          tenants: [],
          activeTenant: activeTenant,
          isLoggedIn: false,
          applicationForm: null,
          username: '',
          upn: '',
          primarySid: '',
          plant: plant,
          plants: plants,
        });
      })
    );
  }

  @Action(LogoutTest)
  logoutTest({getState, setState}: StateContext<AuthenticationStateModel>) {
    const {plant, plants, activeTenant} = getState();

    setState({
      token: '',
      tenants: [],
      activeTenant: activeTenant,
      isLoggedIn: false,
      applicationForm: null,
      username: '',
      upn: '',
      primarySid: '',
      plant: plant,
      plants: plants,
    });
  }


  @Action(LoginAdfsSuccess)
  loginAdfsSuccess(
    {dispatch, patchState}: StateContext<AuthenticationStateModel>,
    {username, upn, primarySid}: LoginAdfsSuccess
  ) {
    patchState({
      isLoggedIn: true,
      username,
      upn,
      primarySid,
    });

    dispatch(new FetchAdfsPlants());
  }

  @Action(LogoutAdfs)
  LogoutAdfs({setState, getState}: StateContext<AuthenticationStateModel>) {
    const {plant, plants, activeTenant} = getState();
    setState({
      token: '',
      tenants: [],
      activeTenant: activeTenant,
      isLoggedIn: false,
      applicationForm: null,
      username: '',
      upn: '',
      primarySid: '',
      plant: plant,
      plants: plants,
    });
    return this.authService.logoutAdfs();
  }



  @Action(LoginSuccessDomain)
  loginSuccessDomain(
    {patchState}: StateContext<AuthenticationStateModel>,
    {token, plant, username}: LoginSuccessDomain
  ) {
    patchState({
      token: token,
      plant: plant,
      isLoggedIn: true,
      username: username,
    });
  }

  @Action(LoginErrorDomain)
  loginCanceledDomain() {}

  @Action(FetchPlants)
  fetchPlants({patchState}: StateContext<AuthenticationStateModel>) {
    const plants = this.authService.fetchPlants();

    patchState({plants: plants});
  }

  @Action(FetchAdfsPlants)
  async fetchAfdsPlants({getState, patchState}: StateContext<AuthenticationStateModel>) {
    // const groupName: string[] = this.authService.getPayloadFromIdToken().GroupsName;
    const { plant, plants } = getState();
    let tPlants: string[] = await this.getActivePlants();

    if (tPlants && tPlants.length > 0) {
      if (!plant) {
        var setPlant = tPlants[0];
      } else {
        var setPlant = <string>plant;
      }
    }
    else if (plants && plants.length > 0) {
      if (!plant) {
        var setPlant = <string>plants[0];
      } else {
        var setPlant = <string>plant;
      }
      tPlants = plants
    }
    else {
      var setPlant = '';
    }

    patchState({
      plant: setPlant,
      plants: tPlants,
    });
  }

  private async getActivePlants() {
    const apiUrl = this.configService.getSettings('userSettingsService');
    const result = await firstValueFrom(
      this.http.get<any>(`${apiUrl}${environment.activePlants.getactiveplants}`)
    );
    return result;
  }

  private async getGlobalNotificationByFilter(filter: any) {
    const apiUrl = this.configService.getSettings('userSettingsService');
    const result = await this.http
      .post<any>(`${apiUrl}${environment.modulesBaseUrl.materialManagement.globalNotifications}/ByFilter`, filter)
      .toPromise();
    return result;
  }

 
  @Action(GetGlobalNotificationsByFilter)
  async getGlobalNotificationsByFilter(
    { dispatch }: StateContext<AuthenticationStateModel>,
    { filter }: GetGlobalNotificationsByFilter
  ) {
    const notifications: any = await this.getGlobalNotificationByFilter(filter);

    if (notifications) {
      dispatch(new GetGlobalNotificationsByFilterSuccess(notifications));
    }
    else {
      dispatch(new GetGlobalNotificationsByFilterError('error'));
    }
  }

  @Action(SetUserRole)
  setUserRole(
    { patchState }: StateContext<AuthenticationStateModel>,
    { role }: SetUserRole
  ) {
    patchState({
      currentRole: role,
    });
  }

}
