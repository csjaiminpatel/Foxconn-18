import { Action, Selector, State, StateContext } from "@ngxs/store";
import { DeleteVirtualPartNumber, DeleteVirtualPartNumberDetail, DeleteVirtualPartNumberDetailError, DeleteVirtualPartNumberDetailSuccess, DeleteVirtualPartNumberError, DeleteVirtualPartNumberSuccess, GetPartNumberVendorCodeFlags, GetPartNumberVendorCodeFlagsError, GetPartNumberVendorCodeFlagsSuccess, GetVirtualPartNumbers, GetVirtualPartNumbersDetails, GetVirtualPartNumbersDetailsError, GetVirtualPartNumbersDetailsSuccess, GetVirtualPartNumbersError, GetVirtualPartNumbersSuccess, InsertVirtualPartNumber, InsertVirtualPartNumberDetail, InsertVirtualPartNumberDetailError, InsertVirtualPartNumberDetailSuccess, InsertVirtualPartNumberError, InsertVirtualPartNumberSuccess, UpdateVirtualPartNumber, UpdateVirtualPartNumberDetail, UpdateVirtualPartNumberDetailError, UpdateVirtualPartNumberDetailSuccess, UpdateVirtualPartNumberError, UpdateVirtualPartNumberSuccess } from "./pn-groups.action";
import { VirtualPnGroupsService } from "../../services/Virtual-pn-group/virtual-pn-groups.service";

export interface PnGroupsStateModel {
    pnGroups: any;
}
@State<PnGroupsStateModel>({
    name: 'pnGroups',
    defaults: {
        pnGroups: []
    },
})

export class PnGroupsState {
    constructor(
        private virtualPnGroupsService: VirtualPnGroupsService
    ) { }


    @Action(UpdateVirtualPartNumber)
    updateVirtualPartNumber({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnGroup }: UpdateVirtualPartNumber
    ) {
        this.virtualPnGroupsService.updateVirtualPartNumber(pnGroup).subscribe((response) => {
            dispatch(new UpdateVirtualPartNumberSuccess(response));
        },
            (error: any) => {
                dispatch(new UpdateVirtualPartNumberError(error));
            }
        );
    }

    @Action(InsertVirtualPartNumber)
    insertVirtualPartNumber({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnGroup }: InsertVirtualPartNumber
    ) {
        this.virtualPnGroupsService.insertVirtualPartNumber(pnGroup).subscribe((response) => {
            dispatch(new InsertVirtualPartNumberSuccess(response));
        },
            (error: any) => {
                dispatch(new InsertVirtualPartNumberError(error));
            }
        );
    }

    @Action(DeleteVirtualPartNumber)
    deleteVirtualPartNumber({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnGroup }: DeleteVirtualPartNumber
    ) {
        this.virtualPnGroupsService.deleteVirtualPartNumber(pnGroup).subscribe((response) => {
            dispatch(new DeleteVirtualPartNumberSuccess(response));
        },
            (error: any) => {
                dispatch(new DeleteVirtualPartNumberError(error));
            }
        );
    }

    @Action(GetPartNumberVendorCodeFlags)
    getPartNumberVendorCodeFlags({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnGroup }: GetPartNumberVendorCodeFlags
    ) {
        this.virtualPnGroupsService.getPartNumberVendorCodeFlags(pnGroup).subscribe((response) => {
            dispatch(new GetPartNumberVendorCodeFlagsSuccess(response));
        },
            (error: any) => {
                dispatch(new GetPartNumberVendorCodeFlagsError(error));
            }
        );
    }

    @Action(GetVirtualPartNumbersDetails)
    getVirtualPartNumbersDetails({ dispatch }: StateContext<PnGroupsStateModel>,
        { id, skip, top }: GetVirtualPartNumbersDetails
    ) {
        this.virtualPnGroupsService.getVirtualPartNumbersDetails(id, skip, top).subscribe((response) => {
            dispatch(new GetVirtualPartNumbersDetailsSuccess(response));
        },
            (error: any) => {
                dispatch(new GetVirtualPartNumbersDetailsError(error));
            }
        );
    }

    @Action(InsertVirtualPartNumberDetail)
    insertVirtualPartNumberDetail({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnData }: InsertVirtualPartNumberDetail
    ) {
        this.virtualPnGroupsService.insertVirtualPartNumberDetail(pnData).subscribe((response) => {
            dispatch(new InsertVirtualPartNumberDetailSuccess(response));
        },
            (error: any) => {
                dispatch(new InsertVirtualPartNumberDetailError(error));
            }
        );
    }
    
    @Action(UpdateVirtualPartNumberDetail)
    updateVirtualPartNumberDetail({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnData }: UpdateVirtualPartNumberDetail
    ) {
        this.virtualPnGroupsService.updateVirtualPartNumberDetail(pnData).subscribe((response) => {
            dispatch(new UpdateVirtualPartNumberDetailSuccess(response));
        },
            (error: any) => {
                dispatch(new UpdateVirtualPartNumberDetailError(error));
            }
        );
    }

    @Action(DeleteVirtualPartNumberDetail)
    deleteVirtualPartNumberDetail({ dispatch }: StateContext<PnGroupsStateModel>,
        { pnData }: DeleteVirtualPartNumberDetail
    ) {
        this.virtualPnGroupsService.deleteVirtualPartNumberDetail(pnData).subscribe((response) => {
            dispatch(new DeleteVirtualPartNumberDetailSuccess());
        },
            (error: any) => {
                dispatch(new DeleteVirtualPartNumberDetailError(error));
            }
        );
    }

}