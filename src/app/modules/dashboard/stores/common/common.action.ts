export class CacheDefaultFields {
    static readonly type = "[Common] Get Default Fields";
    constructor(public readonly service: any, public readonly moduleName: string, public readonly key: string, public readonly fields: any, public readonly refresh?: boolean) { }
}
export class GetIdentityList {
    static readonly type = '[Common] Get Identity List';
}

export class GetIdentityListSuccess {
    static readonly type = '[Common] Get Identity List Success';
    constructor(public readonly response?: any[]) { }
}

export class GetIdentityListError {
    static readonly type = '[Common] Get Identity List Error';
    constructor(public readonly error?: any) { }
}

export class ResetAllDefaultFields {
    static readonly type = '[Common] Reset All Default Fields';
}