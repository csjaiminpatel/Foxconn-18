import { UserRights } from "../models/auth.model";

// Actions
export class LoginApplication {
  static readonly type = '[Authentication] Login Application';
  constructor(public readonly username: string, public readonly password: string) { }
}

export class LoginApplicationTest {
  static readonly type = '[Authentication] Login Application Test';
  constructor(public readonly username: string) { }
}

export class Logout {
  static readonly type = '[Authentication] Logout';
}

export class LogoutTest {
  static readonly type = '[Authentication] Logout Test';
}

// Mutation Actions
export class LoginSuccess {
  static readonly type = '[Authentication] Login Success';
  constructor(public readonly token: string, public readonly username: string) { }
}

export class LoginCanceled {
  static readonly type = '[Authentication] Login Canceled';
}

/**visualizator domain login */
export class LoginApplicationDomain {
  static readonly type = '[Authentication] Login Application Domain';
  constructor(
    public readonly domain: string,
    public readonly username: string,
    public readonly password: string,
    public readonly plant: string
  ) { }
}

export class LogoutDomain {
  static readonly type = '[Authentication] Logout Domain';
}

// Mutation Actions
export class LoginSuccessDomain {
  static readonly type = '[Authentication] Login Success Domain';
  constructor(
    public readonly token: string,
    public readonly plant: string,
    public readonly username: string
  ) { }
}

export class LoginErrorDomain {
  static readonly type = '[Authentication] Login Error Domain';
}

export class LoginCanceledDomain {
  static readonly type = '[Authentication] Login Canceled Domain';
}

/**
 * Fetch possible plants - Visualizator only
 */
export class FetchPlants {
  static readonly type = '[Authentication] Fetch Plants';
}

/**
 * Login to Adfs - Orion only
 */
export class LoginAdfs {
  static readonly type = '[Authentication] Login Adfs';
}

export class LoginAdfsSuccess {
  static readonly type = '[Authentication] Login Adfs Success';
  constructor(
    public readonly username: string,
    public readonly upn: string,
    public readonly primarySid: string
  ) { }
}

/**
 * Logout Adfs - Orion only
 */
export class LogoutAdfs {
  static readonly type = '[Authentication] Logout Adfs';
}

export class FetchAdfsPlants {
  static readonly type = '[Authentication] Fetch Adfs Plants';
}

export class SetActivePlant {
  static readonly type = '[Authentication] Set Active Plant';
  constructor(public readonly plant: string) { }
}

export class SetUserRights {
  static readonly type = '[Authentication] Set User Rights';
  constructor(public readonly userRights: UserRights) { }
}

export class SetUserRightsSuccess {
  static readonly type = '[Authentication] Set User Rights Success';
  constructor(public readonly userRights: UserRights) { }
}

export class SetManageCommitsRights {
  static readonly type = '[Authentication] Set Manage Commits Rights';
  constructor(public readonly permission: boolean) { }
}

export class SetUserRole {
  static readonly type = '[Authentication] Set User Role';
  constructor(public readonly role: string) { }
}

export class GetGlobalNotificationsByFilter {
  static readonly type = '[Authentication] Get Global Notifications By Filter'
  constructor(public readonly filter: any) { }
}

export class GetGlobalNotificationsByFilterSuccess {
  static readonly type = '[Authentication] Get Global Notifications By Filter Success'
  constructor(public readonly response: any) { }
}

export class GetGlobalNotificationsByFilterError {
  static readonly type = '[Authentication] Get Global Notifications By Id Error'
  constructor(public readonly error: any) { }
}