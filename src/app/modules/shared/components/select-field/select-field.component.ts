import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { DX_IMPORTS, SHARED_IMPORTS } from '../../../../../shared-imports';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import { EnumCarriersFieldStructure } from '../../../dashboard/models/carriers-list.model';
import { EnumGoodsReceiptsFieldStructure } from '../../../dashboard/models/goods-receipts.model';
import { EnumInvoicingFieldStructure } from '../../../dashboard/models/invoicing.model';
import { EnumPartNumbersFieldStructure } from '../../../dashboard/models/partnumbers-list.model';
import { EnumPortfolioFieldStructure } from '../../../dashboard/models/portfolio.model';
import { EnumQuotationsFieldStructure } from '../../../dashboard/models/quotations.model';
import { EnumShipmentFieldStructure } from '../../../dashboard/models/shipments.model';
import { EnumCommitFieldStructure } from '../../../dashboard/models/supply-visibility.model';
import { EnumVendorsFieldStructure } from '../../../dashboard/models/vendors-list.model';
import { Helper } from '../../helper';
import { EnumStocksFieldStructure } from '../../../dashboard/models/stocks-list.model';

@Component({
  selector: 'orion-platform-select-field',
  standalone: true,
  imports: [...SHARED_IMPORTS,...DX_IMPORTS,DialogComponent,MatDialogModule ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})
export class SelectFieldComponent implements OnInit {
  title: string = '';
  fieldList: any = [];
  structureType?: EnumCommitFieldStructure | EnumGoodsReceiptsFieldStructure | EnumInvoicingFieldStructure | EnumQuotationsFieldStructure | EnumVendorsFieldStructure | EnumCarriersFieldStructure | EnumPortfolioFieldStructure | EnumPartNumbersFieldStructure | EnumShipmentFieldStructure | EnumStocksFieldStructure;
  fieldKeysList: string[]=[];
  selectOptions = {type: 'Single'};
  hideFieldKey: any;
  baseModule?: string;
  currentFilter: any;
  showFilterRow: any;
  showHeaderFilter: any;
  @ViewChild('grid', {static: true}) dataGrid?: DxDataGridComponent;

  constructor(
    public dialogRef: MatDialogRef<SelectFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.onReorder = this.onReorder.bind(this);
  }

  ngOnInit() {
    this.structureType = this.data.structureType; // set data structure type
    this.fieldList = JSON.parse(this.data.fieldList);
    this.title = this.data.title;
    this.hideFieldKey = this.data.hideFieldKey;
    this.baseModule = this.data.baseModule;
  }

  ngAfterViewInit() {
    //ALTERNATIVE:- https://supportcenter.devexpress.com/ticket/details/t667623/dxdatagrid-hide-rows-without-removing-elements-from-grid-datasource
    //TODO Bug
    let isExclusive = true;
    if (isExclusive && this.data.hideFieldKey) {
      this.dataGrid?.instance.filter((data:any) => {
        return data.exclusive != this.hideFieldKey;
      });
      isExclusive = false;
    }
  }

  onReorder(args:any) {
    const visibleRows = args.component.getVisibleRows();
    const toIndex = this.fieldList.findIndex(
      (data:any) => data.field === visibleRows[args.toIndex].data.field
    );
    const fromIndex = this.fieldList.findIndex((data:any) => data.field === args.itemData.field);

    this.fieldList.splice(fromIndex, 1);
    this.fieldList.splice(toIndex, 0, args.itemData);
  }

  // rowDataBound(args) {
  //   if (args.rowType == 'data' && this.hideFieldKey && args.data.exclusive === this.hideFieldKey) {
  //     args.cellElement.visible = false;
  //   }
  // }
  /**
   * Send Date Range data
   *
   */
  sendForm() {
    this.dialogRef.close(this.fieldList);
  }
  /**
   * Dialog close by cancel
   *
   */
  onCancel() {
    this.dialogRef.close();
  }
  dialogClose() {
    this.dialogRef.close();
  }
  public get enumCommitFieldStructure(): typeof EnumCommitFieldStructure {
    return EnumCommitFieldStructure;
  }
  public get enumGoodsReceiptsFieldStructure(): typeof EnumGoodsReceiptsFieldStructure {
    return EnumGoodsReceiptsFieldStructure;
  }
  public get enumInvoicingFieldStructure(): typeof EnumInvoicingFieldStructure {
    return EnumInvoicingFieldStructure;
  }
  public get enumQuotationsFieldStructure(): typeof EnumQuotationsFieldStructure {
    return EnumQuotationsFieldStructure;
  }
  public get enumVendorsFieldStructure(): typeof EnumVendorsFieldStructure {
    return EnumVendorsFieldStructure;
  }
  public get enumCarriersFieldStructure(): typeof EnumCarriersFieldStructure {
    return EnumCarriersFieldStructure;
  }
  public get enumPortfolioFieldStructure(): typeof EnumPortfolioFieldStructure {
    return EnumPortfolioFieldStructure;
  }
  public get enumPartNumbersFieldStructure(): typeof EnumPartNumbersFieldStructure {
    return EnumPartNumbersFieldStructure;
  }
  public get enumShipmentFieldStructure(): typeof EnumShipmentFieldStructure {
    return EnumShipmentFieldStructure;
  }
  public get enumStocksFieldStructure(): typeof EnumStocksFieldStructure {
    return EnumStocksFieldStructure;
  }
  public get getCommitBaseModule(): string {
    return Helper.COMMIT_MODULE;
  }
  public get getGoodReceiptsBaseModule(): string {
    return Helper.GOODRECEIPTS_MODULE;
  }
  public get getInvoicingBaseModule(): string {
    return Helper.INVOICING_MODULE;
  }
  public get getQuotationsBaseModule(): string {
    return Helper.QUOTATIONS_MODULE;
  }
  public get getVendorsBaseModule(): string {
    return Helper.VENDORS_MODULE;
  }
  public get getCarriersBaseModule(): string {
    return Helper.CARRIERS_MODULE;
  }
  public get getPortfolioBaseModule(): string {
    return Helper.PORTFOLIO_MODULE;
  }
  public get getPartNumbersBaseModule(): string {
    return Helper.PARTNUMBERS_MODULE;
  } 
  public get getShipmentsBaseModule(): string {
    return Helper.SHIPMENTS_MODULE;
  }
  public get getStocksBaseModule(): string {
    return Helper.STOCKS_MODULE;
  }
  checkboxChange(args: any, key: string) {
    this.fieldList.forEach((element:any) => {
      if (element.headerText === key) {
        element.visible = args.value;
      }
    });
  }
}
