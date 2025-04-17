import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { ApprovedVendor, ApprovedVendorDetail, ApprovedVendorDetailResult } from "../../models/approved-vendor-list.model";
import { SupplyVisibilityState } from "../supply-visibility/supply-visibility.state";
import { SetAVLDetail, SetAVLDetailSuccess, SetAVLDetailError, SetAVLDetailByParams, SetAVLDetailById, SetAVLDetailByIdSuccess, SetAVLDetailByIdError, SetAVL, ResetAVL } from "./approved-vendor-list.actions";
import { ApprovedVendorListService } from "../../services/Approved-Vendor-List/approved-vendor-list.service";


export interface ApprovedVendorListModel {
  list: ApprovedVendor[];
  detail?: ApprovedVendorDetail;
}
@State<ApprovedVendorListModel>({
  name: 'approvedvendorlist',
  defaults: {
    list: [],
    detail: undefined,
  },
})
export class ApprovedVendorListState {
  constructor(public store: Store, public approvedVendorService: ApprovedVendorListService) { }

  /**
   * Get approved vendor detail
   * @param {ApprovedVendorListModel} state
   * @returns {ApprovedVendorListModel}
   * @memberof ApprovedVendorListState
   */
  @Selector()
  static getApprovedVendorDetail(state: ApprovedVendorListModel): ApprovedVendorDetail | undefined {
    return state.detail;
  }

  /**
   * Get approved vendor
   * @param {ApprovedVendorListModel} state
   * @returns {ApprovedVendor}
   * @memberof ApprovedVendorListState
   */
  @Selector()
  static getApprovedVendor(state: ApprovedVendorListModel): ApprovedVendor | undefined {
    if (state.detail)
      return state.detail.approvedVendor;
    return undefined;
  }

  /**
   * Get Approved Vendor List
   * @param {ApprovedVendorListModel} list
   * @returns {ApprovedVendor[]}
   * @memberof ApprovedVendorListState
   */
  @Selector()
  static getApprovedVendorList({ list }: ApprovedVendorListModel): ApprovedVendor[] {
    return list;
  }

  /**
   * Set Approved Vendor Detail
   * @param {StateContext<ApprovedVendorListModel>} { patchState, dispatch }
   * @param {SetAVLDetail} { params }
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetail)
  async setAVLDetail({ patchState, dispatch }: StateContext<ApprovedVendorListModel>) {
    const parameters = this.store.selectSnapshot(SupplyVisibilityState.getBasicParameters);

    if (parameters.vendorCode) {
      await this.approvedVendorService.getApprovedVendorDetail(parameters).subscribe(
        (avlDetailResult: ApprovedVendorDetailResult) => {
          const basicParams = this.store.selectSnapshot(SupplyVisibilityState.getBasicParameters);
          if (
            basicParams.partNumber != parameters.partNumber ||
            basicParams.vendorCode != parameters.vendorCode
          ) {
            return;
          }
          dispatch(new SetAVLDetailSuccess());
          const avlDetail = ApprovedVendorListState.parseAVLDetailResult(avlDetailResult);
          patchState({
            detail: avlDetail,
          });
        },
        (error: any) => {
          dispatch(new SetAVLDetailError(error));
        }
      );
    } else {
      // All Vendors selection
      dispatch(new SetAVLDetailError());
    }
  }

  /**
   * Set Approved Vendor Detail
   * @param {StateContext<ApprovedVendorListModel>} { patchState, dispatch }
   * @param {SetAVLDetailByParams} { params }
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailByParams)
  async setAVLDetailByParams(
    { patchState, dispatch }: StateContext<ApprovedVendorListModel>,
    { plant, partNumber, vendorCode }: SetAVLDetailByParams
  ) {
    const parameters = {
      plant: plant,
      partNumber: partNumber,
      vendorCode: vendorCode,
    };

    if (parameters.vendorCode) {
      await this.approvedVendorService.getApprovedVendorDetail(parameters).subscribe(
        (avlDetailResult: ApprovedVendorDetailResult) => {
          dispatch(new SetAVLDetailSuccess());

          const avlDetail = ApprovedVendorListState.parseAVLDetailResult(avlDetailResult);

          patchState({
            detail: avlDetail,
          });
        },
        (error: any) => {
          dispatch(new SetAVLDetailError(error));
        }
      );
    } else {
      // All Vendors selection
      dispatch(new SetAVLDetailError());
    }
  }

  private static parseAVLDetailResult(
    avlDetailResult: ApprovedVendorDetailResult
  ): ApprovedVendorDetail {
    const avlDetail: ApprovedVendorDetail = <ApprovedVendorDetail>(<unknown>avlDetailResult);

    if (avlDetailResult.infoRecords) {
      const infoRecordFiltered = avlDetailResult.infoRecords.filter(
        (infoRecord) => infoRecord.infoRecordCategory == '2'
      );
      avlDetail.infoRecord = infoRecordFiltered[0];
    }

    if (avlDetailResult.additionInfos) {
      avlDetail.additionInfos = avlDetailResult.additionInfos[0];
    }

    if (avlDetailResult.contacts) {
      //whBuyer
      const whBuyersFiltered = avlDetailResult.contacts.filter(
        (contact) => contact.contactType == 'WHBuyer'
      );
      avlDetail.whBuyer = whBuyersFiltered[0];

      //whBuyer
      const customersFiltered = avlDetailResult.contacts.filter(
        (contact) => contact.contactType == 'Customer'
      );
      avlDetail.customer = customersFiltered[0];

      //buyer
      const contactsFiltered = avlDetailResult.contacts.filter(
        (contact) => contact.contactType == 'Buyer' && contact.active == true
      );
      avlDetail.avlBuyer = contactsFiltered[0];

      //vendor
      const vendorsFiltered = avlDetailResult.contacts.filter(
        (vendor) => vendor.contactType == 'SystemVendor'
      );

      avlDetail.vendor = vendorsFiltered[0];

      if (avlDetail.vendor && avlDetail.vendor.additionInfos) {
        const vatInfo = avlDetail.vendor.additionInfos.filter(
          (vatInfo) => vatInfo.propertyName == 'VAT'
        );

        avlDetail.vendor.vatNumber = vatInfo[0] && vatInfo[0].value ? vatInfo[0].value : 'N/a';
      }

      //supplier
      const suppliersFiltered = avlDetailResult.contacts.filter(
        (supplier) => supplier.contactType == 'Supplier'
      );

      avlDetail.supplier = suppliersFiltered[0];
    }

    return avlDetail;
  }

  /**
   * Set Aproved Vendor Detail Success
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailSuccess)
  setAVLDetailSuccess() { }

  /**
   * Set Approved Vendor Detail Error
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailError)
  setAVLDetailError() { }

  /**
   * Set Approved Vendor Detail By ID
   * @param {StateContext<ApprovedVendorListModel>} setState
   * @returns
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailById)
  async setAVLDetailById(
    { patchState }: StateContext<ApprovedVendorListModel>,
    { id }: SetAVLDetailById
  ) {
    await this.approvedVendorService
      .getApprovedVendorDetailById(id)
      .subscribe((avlDetail: ApprovedVendorDetail) => {
        patchState({
          detail: avlDetail,
        });
      });
  }

  /**
   * Set Approved Vendor Detail By ID Success
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailByIdSuccess)
  setAVLDetailByIdSuccess() { }

  /**
   * Set Approved Vendor Detail By ID Error
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVLDetailByIdError)
  SetAVLDetailByIdError() { }

  /**
   * Set Approved Vendor List from API
   * @param {StateContext<ApprovedVendorListModel>} patchState
   * @returns
   * @memberof ApprovedVendorListState
   */
  @Action(SetAVL)
  async setAVL({ patchState }: StateContext<ApprovedVendorListModel>) {
    await this.approvedVendorService.getApprovedVendorList().subscribe((avl: ApprovedVendor[]) => {
      patchState({
        list: avl,
      });
    });
  }

  /**
   * Reset Approved Vendor List
   * @param {StateContext<ApprovedVendorListModel>} { setState }
   * @memberof ApprovedVendorListState
   */
  @Action(ResetAVL)
  resetAVL({ setState }: StateContext<ApprovedVendorListModel>) {
    setState({ list: [], detail: undefined });
  }
}
