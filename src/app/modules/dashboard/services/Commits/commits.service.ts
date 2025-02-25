import { HttpParams, HttpHeaders, HttpRequest, HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Subject, Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ConfigService } from "../../../../services/config.service";
import { AuthenticationState } from "../../../auth/store/authentication.state";
import { Helper } from "../../../shared/helper";
import { CommitProperty, RequestStatus, Carriers, VendorName, TransportType, Countries, FilePayload } from "../../models/commits.model";
import { CommitsFilterUIModel, Commit, BatchEditCommits, CommitsFilterDownloadDTO } from "../../models/supply-visibility.model";
import { SetDateRangeParameters } from "../../stores/supply-visibility/supply-visibility.actions";


@Injectable({
  providedIn: 'root',
})
export class CommitsService {
  private store = inject(Store);
  private configService = inject(ConfigService);


  filterAvailable = new Subject<number>();
  filteredData: any;
  apiUrl;

  $upn: any = this.store.select(AuthenticationState.upn);

  emailId?: string;

  constructor(
    private http: HttpClient,
  ) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
  }

  getApiUrlCommits(action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commits}/${action}`;
  }

  getCommitStatusList() {
    const list = [
      { id: 'D', name: 'Delivered' },
      { id: 'N', name: 'New' },
      { id: 'M', name: 'Initial triggers' },
      { id: 'W', name: 'Waiting' },
      { id: 'P', name: 'Partial' },
    ];
    return list;
  }

  getCommitPropertyList() {
    const list: CommitProperty[] = [
      { id: 'VendorCode', name: 'VendorCode', type: 'string' },
      { id: 'PartNumber', name: 'PartNumber', type: 'string' },
      { id: 'Quantity', name: 'Quantity', type: 'number' },
      { id: 'ETADate', name: 'ETADate', type: 'date' },
      { id: 'ETDDate', name: 'ETDDate', type: 'date' },
      {
        id: 'PurchaseOrderNumber',
        name: 'PurchaseOrderNumber',
        type: 'string',
      },
      { id: 'PurchaseOrderLine', name: 'PurchaseOrderLine', type: 'string' },
      {
        id: 'InboundDeliveryNumber',
        name: 'InboundDeliveryNumber',
        type: 'string',
      },
      { id: 'InboundDeliveryDate', name: 'InboundDeliveryDate', type: 'date' },
      { id: 'InvoiceNumber', name: 'InvoiceNumber', type: 'string' },
      { id: 'ActualETADate', name: 'ActualETADate', type: 'date' },
      { id: 'ExpirationDate', name: 'ExpirationDate', type: 'date' },
      { id: 'SlotDate', name: 'SlotDate', type: 'date' },
      { id: 'ETAPortDate', name: 'ETAPortDate', type: 'string' },
      { id: 'EditBy', name: 'EditBy', type: 'string' },
      { id: 'DeliveryDate', name: 'DeliveryDate', type: 'date' },
      { id: 'TrackNumber', name: 'TrackNumber', type: 'string' },
      { id: 'ContainerNumber', name: 'ContainerNumber', type: 'string' },
      { id: 'ReceiveDate', name: 'ReceiveDate', type: 'date' },
      { id: 'ASN', name: 'ASN', type: 'string' },
      { id: 'Manufacturer', name: 'Manufacturer', type: 'string' },
      { id: 'CountryOfOrigin', name: 'CountryOfOrigin', type: 'string' },
      { id: 'RequestDate', name: 'RequestDate', type: 'date' },
      { id: 'TriggerDate', name: 'TriggerDate', type: 'date' },
      { id: 'RecomitRequestDate', name: 'RecomitRequestDate', type: 'date' },
      { id: 'MFGPartner', name: 'MFGPartner', type: 'string' },
      { id: 'MPN', name: 'MPN', type: 'string' },
      { id: 'BatchNo', name: 'BatchNo', type: 'string' },
      { id: 'Forwarder', name: 'Forwarder', type: 'string' },
      { id: 'Remark', name: 'Remark', type: 'string' },
      { id: 'Shipped', name: 'Shipped', type: 'boolean' },
      { id: 'ExpressFlag', name: 'ExpressFlag', type: 'string' },
      { id: 'ThirdPartyPaid', name: 'ThirdPartyPaid', type: 'string' },
      {
        id: 'TypeOfTransportation',
        name: 'TypeOfTransportation',
        type: 'string',
      },
      { id: 'MSRRemarks', name: 'MSRRemarks', type: 'string' },
      { id: 'ShortageComment', name: 'ShortageComment', type: 'string' },
      { id: 'Reason', name: 'Reason', type: 'string' },
      { id: 'reasonDetail', name: 'reasonDetail', type: 'string' },
      { id: 'UnitWeight', name: 'UnitWeight', type: 'number' },
      { id: 'EDDDate', name: 'EDDDate', type: 'date' },
      { id: 'APSRelevant', name: 'APSRelevant', type: 'string' },
      { id: 'IsUsedInETA', name: 'IsUsedInETA', type: 'boolean' },
      { id: 'ProcessDate', name: 'ProcessDate', type: 'date' },
      { id: 'UpdateFlag', name: 'UpdateFlag', type: 'string' },
    ];
    return list;
  }

  getFilterParams(filter: any) {
    const filterParams: { [key: string]: any } = {};
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (typeof filter[keys[i]] != 'undefined' && filter[keys[i]] != '') {
          if (typeof filter[keys[i]] == 'object') {
            filter[keys[i]] = new Date(filter[keys[i]]).toString();
          }
          filterParams[keys[i]] = filter[keys[i]];
        }
      }
    }
    return filterParams;
  }

  // getCommits(filter) {
  //   // const params = this.getFilterParams(filter);
  //   return this.commits;
  // }

  // Split data with coma, space or (coma and space) and returns array
  splitWith(data: string | undefined, symbol: any = /,/) {
    if (data && !Array.isArray(data)) {
      return data
        .split(symbol)
        .filter((c) => c)
        .map((c) => c.trim());
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  }

  vendorsToUpper(vendorCodes?: string[]) {
    if (vendorCodes && vendorCodes.length > 0) {
      for (let i = 0; i < vendorCodes.length; i++) {
        vendorCodes[i] = vendorCodes[i] ? Helper.virtualVCReplace(vendorCodes[i]) : '';
      }
    }
    return vendorCodes;
  }

  getUTCDateStr(filter: Date | string) {
    filter = new Date(filter);
    return `${filter.getFullYear()}-${filter.getMonth() + 1}-${filter.getDate()}T00:00:00.000Z`;
  }

  getCommitsForBatchEdit(filter: CommitsFilterUIModel): Observable<Commit[]> {
    this.$upn.subscribe((email: string) => {
      this.emailId = email;
    })
    const dtoFilter: any = {

      partNumbers: this.splitWith(filter.partNumbers ? filter.partNumbers.toString().toUpperCase() : filter.partNumbers),
      vendorCodes: this.vendorsToUpper(
        this.splitWith(filter.vendorCodes ? filter.vendorCodes.toString().toUpperCase() : filter.vendorCodes)
      ),
      status: filter.status,
      inboundDeliveryNumbers: this.splitWith(filter.inboundDeliveryNumbers, /[,\s]+/),
      purchaseOrderNumbers: this.splitWith(filter.purchaseOrderNumbers),
      purchaseOrderLines: this.splitWith(filter.purchaseOrderLines),
      invoiceNumbers: this.splitWith(
        filter.invoiceNumbers ? filter.invoiceNumbers.toString().toUpperCase() : filter.invoiceNumbers
      ),
      trackNumbers: this.splitWith(filter.trackNumbers),
      ContainerNumber: this.splitWith(filter.ContainerNumber),
      Forwarder: filter.Forwarder,
      Remark: this.splitWith(filter.Remark),
      buyers: this.splitWith(filter.buyers),
      requestNumbers: this.splitWith(filter.rqs),
      creators: this.splitWith(filter.creators),
      contacts: filter.contacts ? this.splitWith(this.emailId) : [],
      includeParentIDs: filter.includeParentIDs,
    };

    const dateFrom = this.getUTCDateStr(filter.dateFrom);
    const dateTo = this.getUTCDateStr(filter.dateTo);

    if (filter.CheckLargeData === false) {
      dtoFilter['CheckLargeData'] = false;
    }
    if (filter.dateType === 'plannedOrderStatus') {
      dtoFilter['plannedOrderStatus'] = ["OPEN"];
    } else {
      dtoFilter[filter.dateType + 'From'] = dateFrom;
      dtoFilter[filter.dateType + 'To'] = dateTo;
    }

    let dateParams = {
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo
    };

    this.store.dispatch(new SetDateRangeParameters(dateParams));
    return <Observable<Commit[]>>(
      this.http.post(`${this.getApiUrlCommits('GetCommitsForBatchEdit')}`, dtoFilter)
    );

  }

  getDefaultFormSettings(filter: string | undefined): Observable<any> {
    const url = `${this.getApiUrlCommits('getdefaultformsettings')}`;
    return <Observable<any>>(
      this.http.get(url + '?formKey=' + filter)
    );
  }
  getDefaultFormSettingFormKeys(): Observable<any> {
    return <Observable<any>>(
      this.http.get(`${this.getApiUrlCommits('getdefaultformsettingformkeys')}`)
    );
  }
  updateDefaultFormSettings(formKey: any, payload: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('formKey', formKey);
    return <Observable<any>>(
      this.http.post(`${this.getApiUrlCommits('UpdateDefaultFormSettings')}`, payload, {
        params: params
      })
    )
  }

  getCommitsByFilter(filter: any): Observable<any> {
    return <Observable<Commit[]>>(
      this.http.post(`${this.getApiUrlCommits('GetCommitsByFilter')}`, filter)
    );
  }

  getCommits(filter: any): Observable<any> {
    let params = new HttpParams();
    for (let i = 0; i < filter.length; i++) {
      params = params.append(filter[i].key, filter[i].value);
    }
    return <Observable<Commit[]>>this.http.get(`${this.getApiUrlCommits('GetCommits')}`, {
      params: params,
    });
  }

  editCommit(record: Commit): Observable<Commit> {
    record = Helper.formatCommitDate(record);
    return <Observable<Commit>>this.http.post(`${this.getApiUrlCommits('EditCommit')}`, record);
  }

  batchEditCommit(filter: BatchEditCommits): Observable<RequestStatus> {
    filter = Helper.formatBatchCommitDate(filter);
    return <Observable<RequestStatus>>(
      this.http.post(`${this.getApiUrlCommits('BatchEditCommit')}`, filter)
    );
  }

  batchEditCommitRequestStatus(requestHash: string): Observable<RequestStatus> {
    return <Observable<RequestStatus>>(
      this.http.get(`${this.getApiUrlCommits('-/RequestStatus/' + requestHash)}`)
    );
  }

  // {{host}}/api/v1/MaterialManagement/Commits/DeleteCommit?InboundDeliveryNumber=4006710239
  deleteCommit(commit: Commit, lowerTriggerUrl = '') {
    commit = Helper.formatCommitDate(commit);
    const url = `${this.getApiUrlCommits('DeleteCommit')}?InboundDeliveryNumber=${commit.inboundDeliveryNumber
      }${lowerTriggerUrl}`;
    return <Observable<Commit>>this.http.post(url, {
      inboundDeliveryNumber: commit.inboundDeliveryNumber,
      parentID: commit['parentID'] && commit['parentID'] != "" ? commit['parentID'] : undefined,
      withMergeModifyQuantity: commit['withMergeModifyQuantity'] || undefined,
    });
  }

  manualSplitCommit(commits: any) {
    const url = `${this.getApiUrlCommits('ManualSplitCommits')}`;
    return <Observable<Commit[]>>this.http.post(url, commits);
  }

  manualMergeCommit(commits: any) {
    const url = `${this.getApiUrlCommits('ManualMergeCommits')}`;
    return <Observable<Commit>>this.http.post(url, commits);
  }

  getMergedCommitHistory(InboundDeliveryNumbers: string[]) {
    const url = `${this.getApiUrlCommits('GetMergedCommitHistory')}`;
    return <Observable<any>>this.http.post(url, { InboundDeliveryNumbers: InboundDeliveryNumbers });
  }

  getCommitHistory(InboundDeliveryNumber: string) {
    const url = `${this.getApiUrlCommits('GetCommitHistory')}`;
    return <Observable<any>>this.http.get(url + '?InboundDeliveryNumber=' + InboundDeliveryNumber);
  }

  getCommitHistoryTable(inboundDeliveryNumber: string) {
    const url = `${this.getApiUrlCommits('GetCommitHistoryTable')}`;
    return <Observable<any>>this.http.get(url + '?inboundDeliveryNumber=' + inboundDeliveryNumber);
  }

  getReasonsList() {
    const url = `${this.getApiUrlCommits('GetReasons')}`;
    return <Observable<any>>this.http.get(url);
  }

  getCommitsCarriers() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.carriers}`;
    return <Observable<Carriers[]>>this.http.get(url);
  }

  getVendorsWithNames() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.getVendorsWithNames}`;
    return <Observable<VendorName[]>>this.http.get(url);
  }

  getCommitsTransportType() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.transportType}`;
    return <Observable<TransportType[]>>this.http.get(url);
  }

  getCommitsCountries() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.countries}`;
    return <Observable<Countries[]>>this.http.get(url);
  }

  getReadOnlyFields() {
    const url = `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commitsReadOnlyFields}`;
    return <Observable<any>>this.http.get(url);
  }

  getMandatoryDates() {
    const url = `${this.getApiUrlCommits('getmandatorydates')}`;
    return <Observable<any>>this.http.get(url);
  }

  // deleteCommit(commit:Commit) {
  //   const url=`${this.getApiUrlCommits('DeleteCommit')}`;
  //   console.log(url);
  //   return <Observable<Commit>>this.http.post(url,{inboundDeliveryNumber:commit.inboundDeliveryNumber});
  // }

  download(filter: CommitsFilterUIModel, columns: any[]) {

    if (filter && filter.inboundDeliveryNumbers) {
      filter.inboundDeliveryNumbers = filter.inboundDeliveryNumbers.split(' ').join(',');
    }

    this.$upn.subscribe((email: any) => {
      this.emailId = email;
    })

    const dtoFilter: CommitsFilterDownloadDTO = {
      status: filter.status,
      partNumbers: this.splitWith(filter.partNumbers),
      vendorCodes: this.splitWith(filter.vendorCodes),
      contacts: filter.contacts ? this.splitWith(this.emailId) : [],
      inboundDeliveryNumbers: this.splitWith(filter.inboundDeliveryNumbers),
      purchaseOrderNumbers: this.splitWith(filter.purchaseOrderNumbers),
      purchaseOrderLines: this.splitWith(filter.purchaseOrderLines),
      invoiceNumbers: this.splitWith(filter.invoiceNumbers),
      trackNumbers: this.splitWith(filter.trackNumbers),
      ContainerNumber: this.splitWith(filter.ContainerNumber),
      Forwarder: filter.Forwarder,
      Remark: this.splitWith(filter.Remark),
      Fields: columns,
      type: "XLSX"
    };

    if (filter.sorts) {
      dtoFilter.sorts = filter.sorts;
    }
    if (filter.dateType === 'plannedOrderStatus') {
      dtoFilter['plannedOrderStatus'] = ["OPEN"];
    } else {
      dtoFilter[filter.dateType + 'From'] = this.getUTCDateStr(filter.dateFrom);
      dtoFilter[filter.dateType + 'To'] = this.getUTCDateStr(filter.dateTo);
    }
    // input GetUploadCommitDTOOutput
    return this.getUploadCommits(dtoFilter);
  }

  getUploadCommits(payload: any) {
    return this.http.post(`${this.getApiUrlCommits('GetUploadCommits')}`, payload, {
      responseType: 'blob',
    });
  }

  downloadOld(filter: any) {
    const params = this.getFilterParams(filter);
    //url muze byt asi stejna, jako pro ziskani commitu
    //v odpovedi by mel byt json
    return this.http.get<any>('https://test.localhost/csvdata.php', {
      params: params,
    });
    //return this.http.get('https://test.localhost/csvdata.php', {
    //  params: params,
    //  responseType: 'blob'
    //});
  }

  upload(event: any, email: string): Observable<RequestStatus> { //TODO: add event type Jaimin
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    const url = `${this.getApiUrlCommits('PostUploadCommits')}?Email=${email}`;
    formData.append('file', selectedFile, selectedFile.name);
    return <Observable<RequestStatus>>this.http.post(url, formData);
  }

  uploadFile(fileName: string, file: File, email: string, checkRowCount = true): Observable<any> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials,content-type=multipart/*',
    });

    const url = `${this.getApiUrlCommits('PostUploadCommits')}?Email=${email}&checkrowcount=${checkRowCount}`;
    const formData: FormData = new FormData();

    formData.append('fileName', fileName);
    formData.append('file', file);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  setFilteredData(data: any) {
    this.filteredData = data;
  }

  getFilteredData() {
    return this.filteredData;
  }

  getApiUrlCommitDocuments(id: string, action: string) {
    return `${this.apiUrl}${environment.modulesBaseUrl.materialManagement.commits}/${id}/${action}`
  }

  getCommitDocuments(InboundDeliveryNumber: string) {
    return <Observable<any>>this.http.get(`${this.getApiUrlCommitDocuments(InboundDeliveryNumber, 'commitdocuments')}`);
  }

  updateCommitDocuments(InboundDeliveryNumber: any, data: any) {
    return <Observable<any>>this.http.put(`${this.getApiUrlCommitDocuments(InboundDeliveryNumber, 'commitdocuments')}`, data);
  }

  uploadCommitDocuments(InboundDeliveryNumber: string, data: FilePayload) {
    const formData = new FormData();
    formData.append('Content', data.file);
    formData.append('Description', data.description);
    return <Observable<any>>this.http.post(`${this.getApiUrlCommitDocuments(InboundDeliveryNumber, 'uploadcommitdocuments')}`, formData, {
      responseType: 'text',
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadCommitDocuments(InboundDeliveryNumber: any, docName: any): Observable<any> {
    return <Observable<any>>this.http.get(`${this.getApiUrlCommitDocuments(InboundDeliveryNumber, 'downloadcommitdocuments')}/${docName}`, {
      responseType: 'blob'
    });
  }

  deleteCommitDocuments(InboundDeliveryNumber: any, docName: any) {
    return <Observable<any>>this.http.delete(`${this.getApiUrlCommitDocuments(InboundDeliveryNumber, 'commitdocuments')}/${docName}`);
  }
  // MaterialManagement/Commits/PostUploadCommits?Email=rnovotny3@cz.foxconn.com
}
