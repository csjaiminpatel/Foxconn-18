import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, catchError, throwError } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { InvoicingModel, InvoiceReviewed } from '../../models/invoicing.model';
import { SetInvoiceReviewed, DeleteInvoiceFlags } from '../../stores/financial-module/financial-module.actions';

@Injectable({
  providedIn: 'root'
})
export class FinancialModuleService {

  private store = inject(Store);
  private configService = inject(ConfigService);
  private notificationService = inject(NotificationService);

  constructor(
    private readonly client: HttpClient,
  ) {
  }
  private filteredData: any;

  public getDetailFormKey : any;

  setDetailData(data: any) {
    this.getDetailFormKey = data;
  }

  getDetailData() {
    return this.getDetailFormKey;
  }
  /**
   * Get flag invoice identifier field for possible change to documentNumber
   */
  get flagInvoiceIdentifierField(): string {
    return 'invoiceNumber';
  }

  get invoiceDownloadIdentifierField(): any {
    return {label: 'DocumentNumber', value: 'documentNumber'};
  }

  /**
   * Get invoice fields for download
   */
  get invoiceFieldsForDownload(): string[] {
    return [
      "DocumentNumber", "Status", "InvoiceType", "Plant", "VendorCode", "InvoiceNumber",
      "InvoiceDate", "DueDate", "AmountIncludeVat", "Currency", "ClearingDate", "IssueDate",
      "PBk", "Text", "Received", "PurchasingOrganization", "PurchasingOrganizationName", "FXName",
      "FXStreet", "FXCity", "FXPostCode", "FXVATNo", "FXCountryCode", "VendorVATNumber",
      "VendorCountryCode", "VendorPostalCode", "VendorCity", "VendorStreet", "VendorName3",
      "VendorName2", "VendorName", "VATRate", "VATRateCode", "TaxAmount", "TaxAmountCzk",
      "ExchangeRate", "TotalAmount", "TotalAmountCzk", "TotalAmountNoVATDocCurr", "TotalVatCzk",
      "ReceiptDate", "TaxAmountInCountryCurrency", "TaxCountryCurrencyKey", "InboundDeliveryNumber",
      "DocumentDate", "Key", "DocumentNumber", "PartNumber", "PurchaseOrder", "PurchaseOrderItem",
      "Quantity", "Amount", "UnitPrice", "UnitQty", "VatCode", "Curr", "ReceiptDate", "DeliveryNote",
      "InvoiceItem", "LineNumber", "MaterialDescription"];
  }



  /**
   * Get invoice reconciliation fields
   */
  get invoiceReconciliationFields(): string[] {
    return [
      "VendorCode", "Year", "Month", "AmountIncludeVat", "Currency",
      "TaxAmountInCountryCurrency", "TaxCountryCurrencyKey", "Count"
    ];
  }

  /**
   * Get default invoice sorting for download
   * @constructor
   */
  get defaultInvoiceSortingForDownload(): any {
    return [
      {"Direction": "ascending", "Field": "IssueDate"}
    ];
  }


  /**
   * Get the base API URL for financial modules
   */
  get financialModulesApiUrl(): string {
    return `${this.configService.getSettings('apiBaseUrl')}api/v1/FinancialModules`;
  }

  /**
   * Get the invoicing API URL
   */
  get invoicingApiUrl(): string {
    return `${this.financialModulesApiUrl}/Invoicing`;
  }

  /**
   * Get the goods receipts API URL
   */
  get goodsReceiptsApiUrl(): string {
    return `${this.financialModulesApiUrl}/GoodsReceipts`;
  }

  /**
   * Get the goods receipts file API URL
   */
  get goodsReceiptsFileApiUrl(): string {
    return `${this.goodsReceiptsApiUrl}/GetXlsx`;
  }

  /**
   * Get the payment status file API URL
   */
  get paymentStatusFileApiUrl(): string {
    return `${this.invoicingApiUrl}/GetXlsx`;
  }

  /**
   * Get the default form setting API URL
   */
  get defaultFormSettingApiUrl(): string {
    return `${this.invoicingApiUrl}/getDefaultFormSettingFields`;
  }

  /**
   * Get the invoice reconciliation API URL
   */
  get invoiceReconciliationApiUrl() {
    return `${this.financialModulesApiUrl}/InvoiceReconciliation`;
  }

  /**
   * Get the invoice reconciliation xlsx API URL
   */
  get invoiceReconciliationXlsxApiUrl() {
    return `${this.invoiceReconciliationApiUrl}/GetXlsx`
  }

  /**
   * Get the invoice PDF API URL
   */
  get invoicePdfApiUrl(): string {
    return `${this.invoicingApiUrl}/getpdf`;
  }

  /**
   *
   * @constructor
   */
  get invoicePdfApiUrlMulti(): string {
    return `${this.invoicingApiUrl}/MultiInvoicePdf`;
  }

  /**
   * Get the invoice XML API URL
   */
  get invoiceXmlApiUrl(): string {
    return `${this.invoicingApiUrl}/invoicexml`;
  }

  /**
   * Get the invoice XML API URL (multiple invoices)
   */
  get invoiceXmlApiUrlMulti(): string {
    return this.invoiceXmlApiUrl;
  }

  /**
   * Get the invoice XLSX API URL
   */
  get invoiceXlsxApiUrl(): string {
    return `${this.invoicingApiUrl}/GetXlsx`;
  }

  /**
   * Get the invoice XLSX API URL (multiple invoices)
   */
  get invoiceXlsxApiUrlMulti(): string {
    return `${this.invoicingApiUrl}/MultiInvoiceXlsx`;
  }

  /**
   * Get invoice status API URL (requires inbound delivery number)
   */
  getInvoiceStatusApiUrl(inboundDeliveryNumber: string): string {
    return `${this.invoicingApiUrl}/${inboundDeliveryNumber}/Status`;
  }


  /**
   * Get invoicing data
   * @param body
   */
  getInvoicingData(body: { [key: string]: string } = {}): Observable<InvoicingModel[]> {
    return this.client.post<InvoicingModel[]>(this.invoicingApiUrl, body);
  }


  /**
   * Upload Invoice
   * @param payload
   */
  uploadInvoice(payload: any): Observable<any> {
    return this.client.post(this.paymentStatusFileApiUrl, payload, {responseType: 'blob'});
  }

  /**
   * Get goods receipts data
   * @param params
   */
  getGoodsReceiptsData(params: { [key: string]: string } = {}): Observable<InvoicingModel[]> {
    return this.client.post<InvoicingModel[]>(this.goodsReceiptsApiUrl, params);
  }


  /**
   * Get default form setting fields
   * @param key
   */
  getDefaultFormSettingFields(key : any): Observable<any> {
    let url = new URL(this.defaultFormSettingApiUrl);
    url.searchParams.append('formKey', key);
    return this.client.get(url.toString());
  }

  /**
   * Get goods receipts file
   * @param params
   */
  getGoodsReceiptsFile(params: { [key: string]: string }): Observable<any> {
    return this.client.post(this.goodsReceiptsFileApiUrl, {
      ...params,
      "Fields": ["Plant", "VendorCode", "PurchaseOrderNumber", "PurchaseOrderItem", "ReceivedQuantity", "ReceiveDate", "PartNumber", "ExternalId", "DeliveryNote", "GoodsReceiveNumber", "GoodsReceiveItem", "ProfitCenter"],
      "Sorts": this.defaultInvoiceSortingForDownload
    }, {responseType: 'blob'});
  }


  /**
   * Get invoice status
   * @param inboundDeliveryNumber
   */
  getInvoiceStatus(inboundDeliveryNumber: string): Observable<any> {
    return this.client.get(this.getInvoiceStatusApiUrl(inboundDeliveryNumber));
  }


  /**
   * Get invoice reconciliation
   * @param body
   */
  getInvoiceReconciliation(body: any): Observable<any> {
    return this.client.post(this.invoiceReconciliationApiUrl, body);
  }

  //INVOICE DOWNLOAD

  invoiceDownloadGet(url : string, type :any): Observable<any> {
    return this.client.get(url, {responseType: 'blob'}).pipe(
      catchError(error => {
        return this.handleInvoiceDownloadError(error, type);
      })
    );
  }

  invoiceDownloadPost(url : string, body:any, type : string): Observable<any> {
    return this.client.post(url, body, {responseType: 'blob'}).pipe(
      catchError(error => {
        return this.handleInvoiceDownloadError(error, type);
      })
    );
  }

  handleInvoiceDownloadError(error : any, type : string) {
    if (error.error instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          const errorMessage = json.detail || 'An error occurred';
          this.notificationService.showError(errorMessage);
          console.error(`Error occurred while downloading invoice ${type}:`, errorMessage);
        } catch (e) {
          console.error(`Error parsing error response for invoice ${type}:`, e);
        }
      };
      reader.onerror = () => {
        console.error(`Error reading error response for invoice ${type}:`, reader.error);
      };
      reader.readAsText(error.error);
    } else {
      console.error(`Error occurred while downloading invoice ${type}:`, error);
    }
    return throwError(error); // Re-throw the error if you want to propagate it further
  }



  /**
   * Single Invoice PDF download
   * @param invoiceIdentifier
   */
  invoicePdfDownload(invoiceIdentifier: string): Observable<any> {
    return this.invoiceDownloadPost(this.invoicePdfApiUrl, {
      [this.invoiceDownloadIdentifierField.label]: [invoiceIdentifier]
    }, 'PDF');
  }

  /**
   * Single Invoice XLSX download
   * @param invoiceIdentifier
   * @param additionalParams object data from filter
   */
  invoiceXlsxDownload(invoiceIdentifier: string | string[], additionalParams = {}, loadDeatils?: boolean): Observable<any> {
    return this.invoiceDownloadPost(this.invoiceXlsxApiUrl, {
      [this.invoiceDownloadIdentifierField.label]: Array.isArray(invoiceIdentifier) ? invoiceIdentifier : [invoiceIdentifier],
      Fields: this.getInvoiceFields([],[],true),
      Sorts: this.defaultInvoiceSortingForDownload,
      LoadDetails: loadDeatils,
      ...additionalParams
    }, 'XLSX');
  }

  /**
   * Single Invoice XML download
   * @param invoiceIdentifier
   */
  invoiceXmlDownload(invoiceIdentifier: string): Observable<any> {
    return this.invoiceDownloadPost(this.invoiceXmlApiUrl, {
      [this.invoiceDownloadIdentifierField.label]: [invoiceIdentifier],
      Fields: this.getInvoiceFields()
    }, 'XML');
  }

  /**
   * Multiple Invoice PDF download
   * @param invoiceIdentifiers
   */
  downloadInvoicesPdfMultiple(invoiceIdentifiers: string[]): Observable<any> {
    return this.invoiceDownloadPost(this.invoicePdfApiUrlMulti, {
      [this.invoiceDownloadIdentifierField.label]: invoiceIdentifiers
    }, 'PDF (multiple)');
  }

  /**
   * Multiple Invoice XML download
   * @param invoiceIdentifiers
   */
  downloadInvoicesXmlMultiple(invoiceIdentifiers: string[]): Observable<any> {
    return this.invoiceDownloadPost(this.invoiceXmlApiUrlMulti, {
      [this.invoiceDownloadIdentifierField.label]: invoiceIdentifiers,
      Fields: this.getInvoiceFields()
    }, 'XML (multiple)');
  }

  /**
   * Multiple Invoice XLSX download
   * @param invoiceIdentifiers string[]
   */
  downloadInvoicesXlsxMultiple(invoiceIdentifiers: any, loadDeatils?: boolean): Observable<any> {
    return this.invoiceDownloadPost(this.invoiceXlsxApiUrlMulti, {
      [this.invoiceDownloadIdentifierField.label]: invoiceIdentifiers,
      Fields: this.getInvoiceFields([], [],true),
      Sorts: this.defaultInvoiceSortingForDownload,
      LoadDetails: loadDeatils,
    }, 'XLSX (multiple)');
  }

  //INVOICE RECONCILIATION

  /**
   * Get invoice reconciliation xlsx
   * @param params
   */
  getInvoiceReconciliationXlsx(params: { [key: string]: string | string[] }): Observable<any> {
    return this.client.post(this.invoiceReconciliationXlsxApiUrl, {
      ...params,
      "Fields": this.invoiceReconciliationFields,
      "Sorts": this.defaultInvoiceSortingForDownload
    }, {responseType: 'blob'});
  }

  //FLAGS

  /**
   * Set invoice reviewed
   * @param invoiceReviewed
   */
  setInvoiceReviewed(invoiceReviewed: InvoiceReviewed): Observable<any> {
    return this.client.put(`${this.invoicingApiUrl}/${invoiceReviewed[this.flagInvoiceIdentifierField as keyof InvoiceReviewed]}/Flags/${invoiceReviewed.flag}`, undefined);
  }

  /**
   * Delete invoice flags
   * @param invoiceIdentifier string
   * @param flag
   */
  deleteInvoiceFlags(invoiceIdentifier: string, flag: any): Observable<any> {
    return this.client.delete(`${this.invoicingApiUrl}/${invoiceIdentifier}/Flags/${flag}`);
  }

  /**
   * Set mark invoice reviewed
   * @param reviewFlag
   * @param invoiceIdentifier
   * @param isFlagAvailable
   */
  setMarkInvoiceReviewed(reviewFlag: string, invoiceIdentifier: string, isFlagAvailable?: any) {
    //BlockGuards
    if (!reviewFlag) {
      return;
    }

    if (!isFlagAvailable) {
      let invoiceData = {
        [this.flagInvoiceIdentifierField]: invoiceIdentifier,
        flag: reviewFlag
      }
      this.store.dispatch(new SetInvoiceReviewed(invoiceData))
    } else {
      this.store.dispatch(new DeleteInvoiceFlags(invoiceIdentifier, reviewFlag));
    }
  }



  /**
   * Get invoice fields
   * @param fieldsToAdd
   * @param fieldsToRemove
   */
  getInvoiceFields(fieldsToAdd: string[] = [], fieldsToRemove: string[] = [],isXLSX : boolean = false): string[] {
    let fields = isXLSX ? this.getDetailData() : this.invoiceFieldsForDownload.map(item => item);
    if (fieldsToAdd && fieldsToAdd.length > 0) {
      fieldsToAdd.forEach(field => {
        if (!fields.includes(field)) {
          fields.push(field);
        }
      });
    }
    if (fieldsToRemove) {
      fieldsToRemove.forEach(field => {
        const index = fields.indexOf(field);
        if (index > -1) {
          fields.splice(index, 1);
        }
      });
    }
    return fields;
  }


  /**
   * Get invoice status list
   */
  getInvoiceStatusList(): string[] {
    return [
      'Open(booked)',
      'Cleared',
      'Cleared - paid',
      'Parked',
      'Deleted'
    ];
  }

    /**
   * Get reviewed list
   */
    getFlagsList() {
      return [
        { name: 'All', id: ''},
        { name: 'Reviewed', id: 'reviewed'},
        { name: 'Not Reviewed', id: '!reviewed'},
      ];
    }

  /**
   * Get invoice by filter
   * @param filter
   */
  getInvoiceByFilter(filter : any): Observable<any> {
    const url = `${this.invoicingApiUrl}/GetInvoiceByFilter`;
    return this.client.post(url, filter);
  }

  /**
   * Get filter additions for invoice
   */
  getFilterAdditionsForInvoice(): Observable<any> {
    const url = `${this.invoicingApiUrl}/GetInvoiceByFilterAdditions`;
    return this.client.get(url);
  }


  /**
   * Set filtered data
   * @param data
   */
  setFilteredData(data: any) {
    this.filteredData = data;
  }

  /**
   * Get filtered data
   */
  getFilteredData() {
    return this.filteredData;
  }

  /**
   * Get default form setting form keys
   */
  getDefaultFormSettingFormKeys(): Observable<any> {
    return <Observable<any>>(this.client.get(`${this.invoicingApiUrl}/GetDefaultFormSettingFormKeys`));
  }

  /**
   * Get default form settings
   * @param formKey
   */
  getDefaultFormSettings(formKey :  string | number | boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('formKey', formKey);
    return <Observable<any>>(
      this.client.get(`${this.invoicingApiUrl}/GetDefaultFormSettings`, {
        params: params
      })
    );
  }

  /**
   * Update default form settings
   * @param formKey
   * @param payload
   */
  updateDefaultFormSettings(formKey : any, payload : any): Observable<any> {
    let params = new HttpParams();
    params = params.append('formKey', formKey);
    return <Observable<any>>(
      this.client.post(`${this.invoicingApiUrl}/UpdateDefaultFormSettings`, payload, {
        params: params
      })
    )
  }
}
