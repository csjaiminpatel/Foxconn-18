import { Store } from "@ngxs/store";
import { EnumCommitFieldStructure } from "../../dashboard/models/supply-visibility.model";
import { SupplyVisibilityService } from "../../dashboard/services/Supply-Visibility/supply-visibility.service";
import { EnumCarriersFieldStructure } from "../../dashboard/models/carriers-list.model";
import { EnumGoodsReceiptsFieldStructure } from "../../dashboard/models/goods-receipts.model";
import { EnumInvoicingFieldStructure } from "../../dashboard/models/invoicing.model";
import { EnumPartNumbersFieldStructure } from "../../dashboard/models/partnumbers-list.model";
import { EnumPortfolioFieldStructure } from "../../dashboard/models/portfolio.model";
import { EnumQuotationsFieldStructure } from "../../dashboard/models/quotations.model";
import { EnumShipmentFieldStructure } from "../../dashboard/models/shipments.model";
import { EnumVendorsFieldStructure } from "../../dashboard/models/vendors-list.model";

export interface LoadOptionsDTO {
    filter: any;
    groupSummary: any;
    parentIds: any[];
    searchExpr: string | string[];
    searchOperation?: string;
    searchValue: any;
    select?: string | string[];
    sort: any;
    skip?: number;
    top?: number;
    totalSummary: any;
    userData: any;
}

export interface GetFieldsVisibility {
    service: SupplyVisibilityService,
    key: string,
    type: EnumCommitFieldStructure,
    defaultFields: any,
    store?: Store,
    baseModule: string
}
export interface SaveFieldsVisibility {
    store: Store,
    key: string,
    columns: any,
    columnAlreadySaved :boolean,
    type : EnumCommitFieldStructure | EnumGoodsReceiptsFieldStructure | EnumInvoicingFieldStructure | EnumQuotationsFieldStructure | EnumVendorsFieldStructure | EnumCarriersFieldStructure | EnumPortfolioFieldStructure | EnumPartNumbersFieldStructure | EnumShipmentFieldStructure,
}