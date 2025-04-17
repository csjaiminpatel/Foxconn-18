import { Action, State, StateContext } from "@ngxs/store";
import { DeleteInvoiceFlags, DeleteInvoiceFlagsError, DeleteInvoiceFlagsSuccess, SetInvoiceReviewed, SetInvoiceReviewedError, SetInvoiceReviewedSuccess } from "./financial-module.actions";
import { FinancialModuleService } from "../../services/Financial-Module/financial-module.service";

export interface FinancialModuleStateModel {
}

@State<FinancialModuleStateModel>({
  name: 'financialModule',
  defaults: {
  },
})


export class FinancialModuleState {

  constructor(
    private financialModuleService: FinancialModuleService
  ) { }

  @Action(SetInvoiceReviewed)
  async setInvoiceReviewed({
    dispatch
  }: StateContext<FinancialModuleStateModel>,
    { invoiceReviewed }: SetInvoiceReviewed) {
    if (invoiceReviewed) {
      return this.financialModuleService
        .setInvoiceReviewed(invoiceReviewed)
        .subscribe(
          (response: any) => {
            if (response) {
              dispatch(new SetInvoiceReviewedSuccess(invoiceReviewed));
            }
          },
          (error: any) => {
            dispatch(new SetInvoiceReviewedError(error));
          }
        );
    }
  }

  @Action(DeleteInvoiceFlags)
  async deletePnFlag({
    dispatch
  }: StateContext<FinancialModuleStateModel>,
    { invoiceNumber, flag }: DeleteInvoiceFlags) {
    if (invoiceNumber && flag) {
      return this.financialModuleService.deleteInvoiceFlags(invoiceNumber, flag).subscribe(e => {
        dispatch(new DeleteInvoiceFlagsSuccess(invoiceNumber))
      },
        (error: any) => {
          dispatch(new DeleteInvoiceFlagsError(error))
        }
      )
    }
  }


}