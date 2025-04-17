import { InvoiceReviewed } from '../../models/invoicing.model';

export class SetInvoiceReviewed {
    static readonly type = '[FinancialModule] Set Invoice Reviewed';
    constructor(public readonly invoiceReviewed: InvoiceReviewed) { }
}
export class SetInvoiceReviewedSuccess {
    static readonly type = '[FinancialModule] Set Invoice Reviewed Success';
    constructor(public readonly invoiceReviewed?: any) { }
}
export class SetInvoiceReviewedError {
    static readonly type = '[FinancialModule] Set Invoice Reviewed Error';
    constructor(public readonly error?: any, public readonly invoiceNumber?: any) { }
}
export class DeleteInvoiceFlags {
    static readonly type = '[FinancialModule] Delete Invoice Flags';
    constructor(public readonly invoiceNumber: string, public readonly flag: string) { }
}
export class DeleteInvoiceFlagsSuccess {
    static readonly type = '[FinancialModule] Delete Invoice Flags Success';
    constructor(public readonly invoiceNumber?: any) { }
}
export class DeleteInvoiceFlagsError {
    static readonly type = '[FinancialModule] Delete Invoice Flags Error';
    constructor(public readonly error?: any, public readonly invoiceNumber?: any) { }
}
