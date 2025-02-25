import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CacheDefaultFields, GetIdentityList, GetIdentityListError, GetIdentityListSuccess, ResetAllDefaultFields } from "./common.action";
import { CommonService } from "../../services/common/common.service";

export interface CommonStateModel {
    cachedDefaultFields?: any;
}

@State<CommonStateModel>({
    name: 'common',
    defaults: {
        cachedDefaultFields: {}
    },
})

export class CommonState {

    constructor(
        private commonService: CommonService,
    ) { }

    @Selector()
    static getDefaultFields(state: CommonStateModel) {
        return state.cachedDefaultFields;
    }

    @Action(CacheDefaultFields)
    async cacheDefaultFields(
        { patchState, getState }: StateContext<CommonStateModel>,
        { service, moduleName, key, fields, refresh }: CacheDefaultFields
    ) {
        let state = getState();

        if (refresh || !(fields && fields.length)) {
            let defaultFields = await service
                .getDefaultFormSettingFields(key)
                .toPromise()
                .catch(() => {
                    defaultFields = undefined;
                });
            if (defaultFields) {
                let cachedDefaultFields = {
                    ...(state.cachedDefaultFields ? state.cachedDefaultFields : {})
                }

                if (!state.cachedDefaultFields[moduleName]) {
                    state.cachedDefaultFields[moduleName] = {};
                }

                cachedDefaultFields[moduleName][key] = fields;
                patchState({ cachedDefaultFields: cachedDefaultFields })
            }
        }
        else {

            if (!state.cachedDefaultFields[moduleName]) {
                state.cachedDefaultFields[moduleName] = {};
            }

            state.cachedDefaultFields[moduleName][key] = fields;
            patchState({ cachedDefaultFields: state.cachedDefaultFields })
        }
    }

    @Action(GetIdentityList)
    getIdentityList(
        { dispatch }: StateContext<CommonStateModel>,
    ) {
        this.commonService.getIdentityListForBuyers().subscribe((res) => {
            dispatch(new GetIdentityListSuccess(res));
        },
            (error: any) => {
                dispatch(new GetIdentityListError(error));
            }
        )
    }

    @Action(ResetAllDefaultFields)
    async resetState(
        { patchState }: StateContext<CommonStateModel>,
    ) {
        patchState({ cachedDefaultFields: {} })
    }
}