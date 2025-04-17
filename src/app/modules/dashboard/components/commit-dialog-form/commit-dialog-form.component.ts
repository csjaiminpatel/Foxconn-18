import { ChangeDetectorRef, Component, ElementRef, inject, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { ArrayStore } from 'devextreme/common/data';
import moment from 'moment';
import { Observable, Subscription, Subject, takeUntil, distinctUntilChanged, merge, combineLatest, startWith, map } from 'rxjs';
import { ConfigService } from '../../../../services/config.service';
import { SupplyVisibilityRights, CommitsModuleRights } from '../../../auth/models/auth.model';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { AuthenticationState } from '../../../auth/store/authentication.state';
import { LanguageState } from '../../../auth/store/language/language.state';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Helper } from '../../../shared/helper';
import { Reason, Carriers, Countries, TransportType, VendorName, CommitHistory, CommitOperationType, EnumCustomEdit } from '../../models/commits.model';
import { PurchaseOrders, DummyCommitHeader, ManufacturerDetailsDto, Commit, BasicParameters, purchaseOrderItem, DialogResult, EnumCommitFieldStructure } from '../../models/supply-visibility.model';
import { VendorCode } from '../../models/vendor-code.model';
import { CommitsService } from '../../services/Commits/commits.service';
import { SupplyVisibilityService } from '../../services/Supply-Visibility/supply-visibility.service';
import { CacheDefaultFields } from '../../stores/common/common.action';
import { CommonState } from '../../stores/common/common.state';
import { SetVendorCodes, CacheCommitsCarriers, CacheCommitsCountries, CacheCommitsTransportType, CacheCommitsReasons, CacheReadOnlyFields, SetPlantMandatoryDates, SetCommitVendorCode, AddCommit, AddDummyCommit, EditDummyCommit, DeleteDummyCommit, EditCommit, SetPurchaseOrdersForCM, SetBasicParameters, SetCommitVendorCodeSuccess, CacheCommitsCarriersSuccess, CacheCommitsCarriersError, CacheCommitsCountriesSuccess, CacheCommitsCountriesError, CacheCommitsTransportTypeSuccess, CacheCommitsTransportTypeError, CacheCommitsReasonsSuccess, CacheCommitsReasonsError, CacheReadOnlyFieldsSuccess, CacheReadOnlyFieldsError, SetPlantMandatoryDatesSuccess, SetPurchaseOrdersSuccess, SetVendorCodesSuccess } from '../../stores/supply-visibility/supply-visibility.actions';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ReplaceTextPipe } from '../../../shared/pipe/replace-text.pipe';
import { GetFieldsVisibility, SaveFieldsVisibility } from '../../../shared/DTOs/helperDto';
import { DX_IMPORTS, MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../shared-imports';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field.component';
import { CommitDocumentsComponent } from '../commit-documents/commit-documents.component';
import { CommitHistoryComponent } from '../commit-history/commit-history.component';



export enum CommitDialogDisplayType {
  FORM = 0,
  HISTORY = 1
}

export const MY_DATE_FORMATS_CS = {
  parse: {
    dateInput: Helper.getInputDateFormats(),
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    locale: 'cs_CZ'
  },
};

@Component({
  selector: 'orion-platform-commit-dialog-form',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...MAT_IMPORTS, ...DX_IMPORTS, ProgressSpinnerComponent, ReactiveFormsModule, CommitDocumentsComponent, CommitHistoryComponent],
  templateUrl: './commit-dialog-form.component.html',
  styleUrl: './commit-dialog-form.component.scss',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'cs_CZ' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS_CS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    DatePipe
  ],
})
export class CommitDialogFormComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly configService = inject(ConfigService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);
  private supplyVisibilityService = inject(SupplyVisibilityService);




  purchaseOrders$: Observable<PurchaseOrders[]> = this.store.select(SupplyVisibilityState.getPurchaseOrders);
  selectedDummyCommitHeader$: Observable<DummyCommitHeader> = this.store.select(SupplyVisibilityState.getSelectedDummyCommitsHeader);
  vendorCodes$: Observable<VendorCode[]> = this.store.select(SupplyVisibilityState.getVendorCodes);
  reasons$: Observable<Reason[]> = this.store.select(SupplyVisibilityState.getCommitsReasons);
  carriers$: Observable<Carriers[]> = this.store.select(SupplyVisibilityState.getCommitsCarriers);
  countries$: Observable<Countries[]> = this.store.select(SupplyVisibilityState.getCommitsCountries);
  transportTypes$: Observable<TransportType[]> = this.store.select(SupplyVisibilityState.getCommitsTransportType);
  vendorsNames$: Observable<VendorName[]> = this.store.select(SupplyVisibilityState.getVendorsName);


  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);
  readOnlyFields$: Observable<any> = this.store.select(SupplyVisibilityState.getReadOnlyFields);
  activePlant$: Observable<any> = this.store.select(AuthenticationState.activePlant);

  @ViewChild('search', { static: false }) searchTextBox?: ElementRef;
  @ViewChild('stockTypePanel', { read: MatAutocompleteTrigger, static: false }) stockTypePanel?: MatAutocompleteTrigger;
  countries: any = [];
  countriesNames: any = [];
  searchDropdown = new FormControl();
  disableCommitManagement = false;

  userRights?: SupplyVisibilityRights;
  commitModuleRights?: CommitsModuleRights;

  enableDummyHeader = true;
  enableDraft = true;
  private readonly DEFAULT_FIELDS_KEY: string = "COMMIT_DETAIL_FORMKEY";
  currentLang: any;
  columns: any;
  manufacturerDataSource?: ArrayStore;
  subscription: Subscription = new Subscription();
  private ngUnsubscribe = new Subject();
  selectedManufacturerIndex: number = -1;
  manufacturerDetails: ManufacturerDetailsDto[] = [];
  isMpnDxOpen: boolean;
  commit?: Commit;
  actionType: string = '';
  showPartNumber = false;
  editDummyCommit: boolean;
  title: string = '';
  draftButtonTitle: string = '';
  loading: boolean = false;
  isCommitModule = false;
  purchaseOrders: PurchaseOrders[] = [];
  purchaseOrdersEdit: PurchaseOrders[] = [];
  selectedPOItems: any;
  remainingPOQty: any;
  selectedPurchaseOrder: any;
  selectedPurchaseOrderLine: any;
  filteredPurchaseOrderItem: any;
  minDate = moment().format('YYYY-MM-DD');
  selectedDummyCommitHeader: any;
  vendorCodes: any = [];
  commitForm: FormGroup = new FormGroup({});
  selectedVendorCode?: string = undefined;
  selectedPartNumber?: string = undefined;
  activePlant: any;
  initialBasicParameters?: BasicParameters;
  isCreateDraftShown: boolean = false;
  isBatchEdit: boolean = false;
  batchEditIndex: number = 0;
  commits: any[] = [];
  /*add common dropdown values*/
  commonDropdownList: any;
  isFormLoaded: boolean = false;
  isCommitHistoryEnabled = false;
  isDocumentsEnabled = false;
  commitHistories: CommitHistory[] = [];
  commitOperationType = CommitOperationType;
  prevPOVal = { poNumber: '', poLine: '' };
  readOnlyFields: string[] = [];
  carriers: any = [];
  carriersNames: any = [];
  vendors: any = [];
  vendorCodesWithPn: any = [];
  filteredOptions?: Observable<string[]>;
  stockType: any = [];
  mpnLabel: string = "MPN";

  isOptionloader: boolean = false;

  commitConfig: any;
  readonly submitBtnLabels = { submit: "form.submit", save: "form.save", saveAndContinue: "form.save&continue" };
  batchSubmitLabel?: string;
  singleSubmitLabel?: string;
  // invalidDates:string[] = Helper.invalidDates;
  // invalidInvoiceNo:string[] = Helper.invalidInvoiceNo;
  public readonly FIELD_LIST_VISIBILITY_KEY = "commit_field_list";
  baseModule: string = Helper.COMMIT_MODULE;
  columnAlreadySaved = false;
  /**
   *Creates an instance of CommitFormComponent.
   * @param {Store} store
   * @memberof CommitFormComponent
   */


  constructor(
    public dialogRef: MatDialogRef<CommitDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _adapter: DateAdapter<any>,
    private actions$: Actions,
    private dialog: MatDialog,
    private commitsService: CommitsService,
    public datePipe: DatePipe,
    private ref: ChangeDetectorRef,
  ) {

    // this.manufacturerDataSource = new ArrayStore({
    //   key: 'mfgName',
    //   data: this.manufacturerDetails,
    // })

    this.isMpnDxOpen = false;
    this.actionType = data.actionType;
    this.editDummyCommit = data.editDummyCommit;
    this.showPartNumber = data.showPartNumber;
    if (data.isCommitModule) {
      this.isCommitModule = data.isCommitModule;
    }
    this.isBatchEdit = data.isBatchEdit;
    if (this.isBatchEdit || data.isLinkEvent) {
      if (this.isBatchEdit) {
        this.commits = data.commits;
      }
      // this.store.dispatch(new CacheCommitsReasons());
      // this.store.dispatch(new CacheCommitsCountries());
      // this.store.dispatch(new CacheCommitsCarriers());
      // this.store.dispatch(new CacheCommitsTransportType());
      // this.store.dispatch(new CacheReadOnlyFields());
    }
  }

  ngOnInit() {
    if (this.data && this.data.commit)
      this.store.dispatch(new SetVendorCodes(this.actionType == 'new' ? [''] : [this.data.commit.partNumber]));

    this.userRights = this.store.selectSnapshot(AuthenticationState.supplyVisibilityRights);
    this.commitModuleRights = this.store.selectSnapshot(AuthenticationState.commitModuleRights);

    this.currentLang$.subscribe(
      (language: string) => (this.currentLang = language)
    );

    this.activePlant$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (activePlant: any) => {
        this.activePlant = activePlant;
      }
    );

    this.readOnlyFields$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (res) => {
        this.readOnlyFields = (res && res.length) ? res : [];
      }
    )

    this.countries$.subscribe((country) => {
      if (country) {
        this.countries = country;
        this.countriesNames = this.countries;
      }
    })

    this.vendorsNames$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((vendorsName) => {
      this.vendors = vendorsName
      this.vendorCodes = this.vendors;
    });

    this.vendorModeCheck();
    this.isBatchEdit ? undefined : this.setDialogTitle(this.actionType);
    this.catchDependenciesStates();
    this.catchSetCommitVendorCodeSuccess();
    this.catchSetPurchaseOrdersSuccess();


    this.store.dispatch([new CacheCommitsCarriers(), new CacheCommitsCountries(), new CacheCommitsTransportType(), new CacheCommitsReasons(), new CacheReadOnlyFields(), new SetPlantMandatoryDates()
    ]);

    this.fillFieldVisibility();

    this.disableCommitManagement = this.configService.getSettings('disableCommitManagement');

    this.setDraftButtonTitle(this.editDummyCommit);
    this.setCalendarLanguage(this.currentLang.language);

    //TODO CHECK IT
    // if (this.showPartNumber) {
    //   this.loading = false;
    // }

    this.enableDraft = this.data.enableDraft;
    this.enableDummyHeader = this.data.enableDummyHeader;

    this.getCarriers();
  }

  onDataLoaded(isLoaded: Event) {
    this.loading = false;
  }



  async getCarriers() {
    await this.carriers$.subscribe((carrier) => {
      if (carrier) {
        this.carriers = carrier;
        this.carriers.forEach((obj: any) => {
          this.carriersNames.push(obj.name);
        });
      }
    });
  }

  get selectedManufacturerIndexArray(): number[] {
    return this.selectedManufacturerIndex !== -1 ? [this.selectedManufacturerIndex] : [];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.carriersNames) {
      return [];
    }
    return this.carriersNames.filter((option: string) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }
  private filterVendorCode(value: string): string[] {
    const filterValue = value.toLowerCase().replace(/\s+/g, ''); // Remove spaces from the filter value

    try {
      const vendorsToFilter = !this.commitForm?.controls['partNumber'].value ? this.vendors : this.vendorCodesWithPn;
      return vendorsToFilter.filter((option: any) => {
        const vendorName = option.vendorName.toLowerCase().replace(/\s+/g, '');
        const vendorCode = option.vendorCode.toLowerCase().replace(/\s+/g, '');
        return vendorName.includes(filterValue) || vendorCode.includes(filterValue);
      });
    } catch (error) {
      return [];
    }
  }

  isFieldReadOnly(field: string): boolean {

    switch (field) {

      case 'chooseVendor':
        return (this.data.moduleName == Helper.SV_MODULE && this.data.actionType == 'new') ? this.selectedVendorCode != undefined : false

      case 'partNumber':
        return (this.data.moduleName == Helper.SV_MODULE && this.actionType == 'new') ? ((this.data.actionType == "edit" || this.data.moduleName == Helper.SV_MODULE) && this.selectedVendorCode != undefined) : (this.data.actionType == "edit" || this.data.moduleName == Helper.SV_MODULE)

      case 'creator':
        return this.data.actionType == "edit" ? true : false;

      default:
        field = field ? field.toLowerCase() : field;
        if (-1 != this.readOnlyFields.findIndex(_field => _field.toLowerCase() == field)) {
          return true;
        } else {
          return false;
        }
    }
  }

  createForm() {
    this.commitForm = new FormGroup({
      chooseVendor: new FormControl({ value: this.selectedVendorCode, disabled: this.isFieldReadOnly('default') }, Validators.required),
      partNumber: new FormControl({ value: this.selectedPartNumber, disabled: this.isFieldReadOnly('partNumber') }, Validators.required),
      inboundDeliveryNumber: new FormControl({ value: '', disabled: true }),
      inboundDeliveryDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('inboundDeliveryDate') }),

      //TODO review qty disable logic
      // quantity: new FormControl({ value: '', disabled: this.isFieldReadOnly('quantity') }, [Validators.required, Validators.min(0)]),
      quantity: new FormControl({ value: '', disabled: false }, [Validators.required]),
      etaDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('etaDate') }),
      etdDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('etdDate') }),
      deliveryDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('deliveryDate') }),
      actualETADate: new FormControl({ value: '', disabled: this.isFieldReadOnly('actualETADate') }),
      expirationDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('expirationDate') }),
      slotDate: new FormControl({ value: undefined, disabled: this.isFieldReadOnly('slotDate') }),
      etaPortDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('etaPortDate') }),
      purchaseOrderNumber: new FormControl(
        { value: 'n/a', disabled: this.isFieldReadOnly('purchaseOrderNumber') },
        Validators.compose([Validators.required, Validators.maxLength(10)])
      ),
      purchaseOrderLine: new FormControl(
        { value: '', disabled: this.isFieldReadOnly('purchaseOrderLine') }),
      invoiceNumber: new FormControl({ value: '', disabled: this.isFieldReadOnly('invoiceNumber') }),
      trackNumber: new FormControl({ value: '', disabled: this.isFieldReadOnly('trackNumber') }),
      containerNumber: new FormControl({ value: '', disabled: this.isFieldReadOnly('containerNumber') }),
      recomitRequestDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('recomitRequestDate') }),
      shipped: new FormControl(false),
      unitWeight: new FormControl(''),
      isUsedInETA: new FormControl(false),
      withMerge: new FormControl(false),
      invalidEta: new FormControl(false),
      receiveDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('receiveDate') }),
      asn: new FormControl({ value: '', disabled: this.isFieldReadOnly('asn') }),
      manufacturer: new FormControl({ value: '', disabled: this.isFieldReadOnly('manufacturer') }),
      countryOfOrigin: new FormControl({ value: '', disabled: this.isFieldReadOnly('countryOfOrigin') }),
      requestDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('requestDate') }),
      triggerDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('triggerDate') }),
      mfgPartner: new FormControl({ value: undefined, disabled: this.isFieldReadOnly('mfgPartner') }),
      mpn: new FormControl({ value: '', disabled: this.isFieldReadOnly('mpn') }),
      batchNo: new FormControl({ value: '', disabled: this.isFieldReadOnly('batchNo') }),
      forwarder: new FormControl({ value: '', disabled: this.isFieldReadOnly('forwarder') }),
      remark: new FormControl({ value: '', disabled: this.isFieldReadOnly('remark') }),
      expressFlag: new FormControl({ value: '', disabled: this.isFieldReadOnly('expressFlag') }),
      thirdPartyPaid: new FormControl({ value: '', disabled: this.isFieldReadOnly('thirdPartyPaid') }),
      typeOfTransportation: new FormControl({ value: '', disabled: this.isFieldReadOnly('typeOfTransportation') }),
      msrRemarks: new FormControl({ value: '', disabled: this.isFieldReadOnly('msrRemarks') }),
      shortageComment: new FormControl({ value: '', disabled: this.isFieldReadOnly('shortageComment') }),
      reason: new FormControl({ value: 0, disabled: this.isFieldReadOnly('reason') }),
      reasonDetail: new FormControl({ value: '', disabled: this.isFieldReadOnly('reasonDetail') }),
      eddDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('eddDate') }),
      apsRelevant: new FormControl({ value: 'Y', disabled: this.isFieldReadOnly('apsRelevant') }),
      scheduleLine: new FormControl({ value: '', disabled: this.isFieldReadOnly('scheduleLine') }),
      scheduleLineDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('scheduleLineDate') }),
      status: new FormControl({ value: '', disabled: this.isFieldReadOnly('status') }),
      order: new FormControl({ value: '', disabled: this.isFieldReadOnly('order') }),
      parentID: new FormControl({ value: '', disabled: this.isFieldReadOnly('parentID') }),
      revision: new FormControl({ value: '', disabled: this.isFieldReadOnly('revision') }),
      carrier: new FormControl({ value: '', disabled: this.isFieldReadOnly('carrier') }),
      instructionEtaDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('instructionEtaDate') }),
      otmReceivedDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('otmReceivedDate') }),
      otmReceiptType: new FormControl({ value: '', disabled: this.isFieldReadOnly('otmReceiptType') }),
      otmTransactionID: new FormControl({ value: '', disabled: this.isFieldReadOnly('otmTransactionID') }),
      mergedInboundDeliveryNumber: new FormControl({ value: '', disabled: this.isFieldReadOnly('mergedInboundDeliveryNumber') }),
      mergedQuantity: new FormControl({ value: '', disabled: this.isFieldReadOnly('mergedQuantity') }),
      rq: new FormControl({ value: '', disabled: this.isFieldReadOnly('rq') }),
      sapDeliveryDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('sapDeliveryDate') }),
      purchasingDocumentDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('purchasingDocumentDate') }),
      lastUpdateDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('lastUpdateDate') }),
      requestQuantity: new FormControl({ value: '', disabled: this.isFieldReadOnly('requestQuantity') }),
      transportID: new FormControl({ value: '', disabled: this.isFieldReadOnly('transportID') }),
      responsibleEmail: new FormControl({ value: '', disabled: this.isFieldReadOnly('responsibleEmail') }),
      WithMergeModifyQuantity: new FormControl(undefined),
      remainingQuantity: new FormControl({ value: '', disabled: this.isFieldReadOnly('remainingQuantity') }),
      codeDate: new FormControl({ value: '', disabled: this.isFieldReadOnly('codeDate') }),
      arrivalDate: new FormControl({ value: undefined, disabled: this.isFieldReadOnly('arrivalDate') }),
      creator: new FormControl({ value: '', disabled: this.isFieldReadOnly('creator') }),
      stockType: new FormControl({ value: '', disabled: this.isFieldReadOnly('stockType') })
    });
    this.isFormLoaded = true;
    this.isCreateDraftShown = this.isBatchEdit ? false : this.getDraftButtonVisibility();
    this.resetRequiredFieldsForDummyCommit();

  }

  isControlRequiredAndUntouched(controlName: string): boolean {
    const control = this.commitForm?.get(controlName);

    if (control) {
      if (controlName == 'mpn') {
        return (this.mpnLabel == "MPN *" ? true : false);
      }

      const isRequired = control && control.validator
        ? control.validator({} as AbstractControl) && control.validator({} as AbstractControl)?.['required']
        : false;
      return isRequired && !control.touched;
    }
    return false;
  }

  /**
   * Commit data for edit
   * @param {Commit} commit
   * @memberof CommitFormComponent
   */
  setFormData(commit: Commit, emitChanges: boolean = true) {
    const replaceText = new ReplaceTextPipe();

    if (commit) {
      this.commit = commit;
      this.selectedPartNumber = commit.partNumber;

      //Handle Invalids/Dummy Data
      const mInvoiceNumber = replaceText.transform(commit.invoiceNumber, '', Helper.invalidInvoiceNo);
      let mEtdDate = null;
      if (replaceText.transform(
        this.datePipe.transform(commit.etdDate, 'M/d/yyyy'), '', Helper.invalidDates
      )) {
        mEtdDate = commit.etdDate;
      }
      let mSlotDate = this.slotFormatFix(commit.slotDate);
      let mArrivalDate = this.slotFormatFix(commit.arrivalDate);


      this.commitForm?.patchValue({
        chooseVendor: commit.vendorCode ? Helper.trimLeadingZeros(commit.vendorCode) : undefined,
        partNumber: commit.partNumber || null,
        quantity: commit.quantity,
        etaDate: commit.etaDate,
        etdDate: mEtdDate,
        deliveryDate: commit.deliveryDate,
        purchaseOrderNumber: commit.purchaseOrderNumber == '' ? 'n/a' : commit.purchaseOrderNumber,
        purchaseOrderLine: commit.purchaseOrderLine,
        invoiceNumber: mInvoiceNumber,
        trackNumber: commit.trackNumber,
        inboundDeliveryNumber: commit.inboundDeliveryNumber,
        actualETADate: commit.actualETADate,
        expirationDate: commit.expirationDate,
        slotDate: mSlotDate,
        etaPortDate: commit.etaPortDate,
        recomitRequestDate: commit.recomitRequestDate,
        unitWeight: commit.unitWeight,
        isUsedInETA: commit.isUsedInETA,
        shipped: commit.shipped,
        invalidEta: commit.invalidEta,
        receiveDate: commit.receiveDate,
        asn: commit.asn == 1 ? true : false,
        manufacturer: commit.manufacturer,
        countryOfOrigin: commit.countryOfOrigin,
        requestDate: commit.requestDate,
        triggerDate: commit.triggerDate,
        mfgPartner: commit.mfgPartner,
        mpn: commit.mpn,
        batchNo: commit.batchNo,
        forwarder: commit.forwarder,
        remark: commit.remark,
        expressFlag: commit.expressFlag,
        thirdPartyPaid: commit.thirdPartyPaid,
        typeOfTransportation: commit.typeOfTransportation,
        msrRemarks: commit.msrRemarks,
        shortageComment: commit.shortageComment,
        reason: commit.reason,
        reasonDetail: commit.reasonDetail,
        eddDate: commit.eddDate,
        apsRelevant: commit.apsRelevant,
        scheduleLine: commit.scheduleLine,
        scheduleLineDate: commit.scheduleLineDate,
        inboundDeliveryDate: commit.inboundDeliveryDate,
        containerNumber: commit.containerNumber,
        order: commit.order ? commit.order : '',
        status: commit.status ? commit.status : '',
        parentID: commit.parentID ? commit.parentID : '',
        revision: commit.revision ? commit.revision : '',
        carrier: commit.carrier ? commit.carrier : '',
        instructionEtaDate: commit.instructionEtaDate,
        otmReceivedDate: commit.otmReceivedDate,
        otmReceiptType: commit.otmReceiptType,
        otmTransactionID: commit.otmTransactionID,
        mergedInboundDeliveryNumber: commit.mergedInboundDeliveryNumber,
        mergedQuantity: commit.mergedQuantity,
        rq: commit.rq,
        sapDeliveryDate: commit.sapDeliveryDate,
        purchasingDocumentDate: commit.purchasingDocumentDate,
        lastUpdateDate: commit.lastUpdateDate,
        requestQuantity: commit.requestQuantity,
        transportID: commit.transportID,
        WithMergeModifyQuantity: commit['WithMergeModifyQuantity'],
        remainingQuantity: commit.remainingQuantity,
        codeDate: commit.codeDate,
        creator: commit.creator,
        arrivalDate: mArrivalDate,
        stockType: commit.stockType

      }, { emitEvent: emitChanges });

      //console.log("Line: 483", "MPN: ",this.commitForm.value.mpn, "\nMFG Partner: ", this.commitForm.value.mfgPartner);
      //console.log("Line: 484", "MPN: ", this.data.commit.mpn, "\nMFG Partner: ", this.data.commit.mfgPartner )
      if (this.isCommitModule && commit['canMergeModifyQuantity'] === false) {
        //TODO review qty disable logic
        //  this.quantity.disable();
      }

      this.store.dispatch(new SetCommitVendorCode(this.commitForm?.value.chooseVendor));

      /* Extend Purchase Order Line list */
      this.setPurchaseOrderEdit(commit);

    }
  }
  getDraftButtonVisibility(): boolean {
    let visibility: boolean;
    switch (this.data.actionType) {
      case "new":
        visibility = this.userRights?.manageDummyCommits ?? false;
        break;
      case "edit":
        visibility = (this.data.commit.inboundDeliveryNumber == "*" && this.userRights?.manageDummyCommits) ?? false;
        break;
      default:
        visibility = this.userRights?.manageDummyCommits ?? false;
        break;
    }

    return visibility;
  }

  onPartNumberChangeHandler: any = null;
  onVendorCodeChangeHandler: any = null;

  setControlValueChangesSub() {

    const self = this;

    this.chooseVendor?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe(selectedValue => {

      this.setErrorPoNumber(true);
      this.setErrorPoLine(true);

      self.purchaseOrders = [];
      self.selectedPOItems = [];

      if (this.onVendorCodeChangeHandler) {
        clearTimeout(this.onVendorCodeChangeHandler);
      }

      this.onVendorCodeChangeHandler = setTimeout(function () {
        self.onVendorCodeChange(selectedValue)
      }, 1000);

    });
    this.partNumber?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe(selectedValue => {

      this.setErrorPoNumber(true);
      this.setErrorPoLine(true);
      self.purchaseOrders = [];
      self.selectedPOItems = [];


      if (this.onPartNumberChangeHandler) {
        clearTimeout(this.onPartNumberChangeHandler);
      }

      this.onPartNumberChangeHandler = setTimeout(function () {
        self.onPartNumberChange(selectedValue)
      }, 1000);

    });

    this.prevPOVal = { poNumber: this.purchaseOrderNumber?.value, poLine: this.purchaseOrderLine?.value }
    this.purchaseOrderLine?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (selectedVal) => {
        if (this.actionType == 'edit' && this.commit?.['status'] !== 'N') {
          this.openConfirmDialog(false);
          // prevPOLine = selectedVal
        }
        // else {
        //Handle for other cases
        //  }
      }
    )

    // https://stackoverflow.com/questions/44898010/form-control-valuechanges-gives-the-previous-value
    this.purchaseOrderNumber?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (selectedVal) => {
        if (this.actionType == 'edit' && this.commit?.['status'] !== 'N') {
          this.openConfirmDialog(true);
          // prevPONumber = selectedVal
        }
        else {
          this.onPONumberChange(selectedVal)
        }
      }
    )
  }

  setFormForBatchCommits() {

    if (this.commits.length > this.batchEditIndex) {
      if (this.commits[this.batchEditIndex]) {
        this.setFormData(this.commits[this.batchEditIndex]);
      }
    }
  }

  onSkip() {
    this.loading = true;
    this.setFinishedResults({ status: true }, 'skip');
  }

  onBack() {
    this.loading = true;
    this.setFinishedResults({ status: true }, 'back');
  }

  setFinishedResults(results: any, navigateTo?: string) {
    try {
      if (this.isBatchEdit) {
        if ((navigateTo == 'skip') && this.commits.length > this.batchEditIndex) {
          this.batchEditIndex += 1;
          this.setFormData(this.commits[this.batchEditIndex], false);
          this.loading = false;
          this.setDialogTitle(this.actionType);
        }
        else if ((navigateTo == 'back') && this.batchEditIndex > 0) {
          this.batchEditIndex -= 1;
          this.setFormData(this.commits[this.batchEditIndex], false);
          this.loading = false;
          this.setDialogTitle(this.actionType);
        }
        else {
          if ((this.batchEditIndex + 1) == this.commits.length) {
            this.dialogRef.close(results);
          }
          else {
            this.batchEditIndex += 1;
            this.setFormData(this.commits[this.batchEditIndex], false);
            this.loading = false;
            this.setDialogTitle(this.actionType);
          }
        }
        if ((this.batchEditIndex + 1) === this.commits.length) {
          this.batchSubmitLabel = this.submitBtnLabels.save;
        } else {
          this.batchSubmitLabel = this.submitBtnLabels.saveAndContinue;
        }
      } else {
        results.status = true;
        this.dialogRef.close(results);
      }
    } catch (e) {
      this.dialogRef.close(results);
    }

  }



  private resetRequiredFieldsForDummyCommit() {
    if (this.selectedDummyCommitHeader && this.isCreateDraftShown) {
      //make po and poline non mandatory
      this.purchaseOrderLine?.clearValidators();
      this.purchaseOrderNumber?.clearValidators();
    }
    else {
      //this.purchaseOrderLine.setValidators([Validators.required]);
      this.purchaseOrderNumber?.setValidators([Validators.required]);

    }
  }

  setCalendarLanguage(language: any) {
    this._adapter.setLocale(language);
    this._adapter.getFirstDayOfWeek = () => { return 1; }
  }

  // get invoiceNumber() { return this.commitForm.controls['purchaseOrderNumber']; }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  /**
   * Set Dialog Title
   * @param {string} actionType
   * @memberof CommitDialogFormComponent
   */
  setDialogTitle(actionType: string) {
    if (actionType === 'new') {
      this.title = 'New Commit';
    } else if (actionType === 'edit') {
      this.title = 'Edit Commit';
      this.title += this.isBatchEdit ? `  ${this.batchEditIndex + 1}/${this.commits.length}` : "";
    }

    if (this.data.customEdit === EnumCustomEdit.REMERGE) {
      this.title = 'Remerge Commit';
    }
    //ADD other custom types here
  }

  /**
   * Set draft button title
   * @param {boolean} editDummyCommit
   * @memberof CommitDialogFormComponent
   */
  setDraftButtonTitle(editDummyCommit: boolean) {
    if (editDummyCommit) {
      this.draftButtonTitle = this.translate.instant('commitDialogForm.saveDraft');
    } else if (!editDummyCommit) {
      this.draftButtonTitle = this.translate.instant('commitDialogForm.createDraft');
    }
  }



  /**
   * Set Edited Purchase Order
   * @param {Commit} commit
   * @memberof CommitFormComponent
   */
  setPurchaseOrderEdit(commit: Commit) {
    this.purchaseOrdersEdit = [
      {
        purchaseOrderNumber: commit.purchaseOrderNumber,
        purchaseOrderItems: [<purchaseOrderItem>{ purchaseOrder_Item: commit.purchaseOrderLine }]//[commit.purchaseOrderLine]
      }
    ];

    this.selectedPOItems = [commit.purchaseOrderLine];
    // this.setFirstPOLine(this.selectedPOItems[0]);
  }
  openModifiedQtyTrigger(isAddition?: boolean) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant(`style.${isAddition ? 'increaseAmountTriggerTitle' : 'lowerAmountTriggerTitle'}`),
        content: this.translate.instant(`style.${isAddition ? 'increaseAmountTriggerContent' : 'lowerAmountTriggerContent'}`),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
        positiveBtnColor: "primary",
        hasBackdrop: true,
        disableClose: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      result = result ? true : false;
      this.withMergeModifyQuantity?.setValue(result);
      this.sendForm();
    });
  }

  openConfirmDialog(isPONumberChange: boolean) {
    this.remainingPOQty = undefined;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '550px',
      data: {
        title: this.translate.instant(`style.${isPONumberChange ? 'confirmPOChangeTitle' : 'confirmPOLineChangeTitle'}`),
        content: this.translate.instant(`style.${isPONumberChange ? 'confirmPOChangeContent' : 'confirmPOLineChangeContent'}`),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
        positiveBtnColor: "primary",
        hasBackdrop: true,
        disableClose: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isPONumberChange) {
          //On PONumber Change
          this.onPONumberChange(this.purchaseOrderNumber?.value);
          this.prevPOVal.poNumber = this.purchaseOrderNumber?.value;
          this.setRemainingPOQty();

        }
        else {
          //On POLine Change
          this.prevPOVal.poLine = this.purchaseOrderLine?.value;
          this.setRemainingPOQty();
        }
      } else {
        if (isPONumberChange) {
          //On PONumber Change
          this.purchaseOrderNumber?.setValue(this.prevPOVal.poNumber, { emitEvent: false })
        } else {
          //On POLine Change

          this.setPOLine(this.prevPOVal.poLine, false);
          this.setRemainingPOQty();
        }
      }
      this.setRemainingPOQty();
    });

  }

  onPolineChange() {
    this.setRemainingPOQty();
  }


  setOnPOChangeParams(): boolean {

    let withChangePurchaseOrderNumber: boolean = false;
    let initialPurchaseOrderNumber, initialPurchaseOrderLine;

    if (this.isBatchEdit) {
      initialPurchaseOrderNumber = this.commits[this.batchEditIndex].purchaseOrderNumber;
      initialPurchaseOrderLine = this.commits[this.batchEditIndex].purchaseOrderLine;
    }
    else {
      initialPurchaseOrderNumber = this.data.commit.purchaseOrderNumber;
      initialPurchaseOrderLine = this.data.commit.purchaseOrderLine;
    }

    if (this.purchaseOrderNumber?.value != initialPurchaseOrderNumber || this.purchaseOrderLine?.value != initialPurchaseOrderLine) {
      withChangePurchaseOrderNumber = true
    }
    return withChangePurchaseOrderNumber;
  }

  onSubmit() {

    if (this.actionType == "new") {
      this.sendForm();
    }
    else {
      let quantity, isMergeModifyQuantity, parentID;
      if (this.isBatchEdit) {

        const index = this.batchEditIndex;
        if (this.commits[index]) {
          quantity = this.commits[index].quantity;
          isMergeModifyQuantity = this.commits[index].canMergeModifyQuantity;
          parentID = this.commits[index].parentID;
        }

      } else {
        if (this.commit) {
          quantity = this.commit['quantity'];
          isMergeModifyQuantity = this.commit['canMergeModifyQuantity'];
          parentID = this.commit['parentID'];

        }
      }

      parentID = (parentID && parentID != "") ? parentID : null

      if (quantity
        && parentID
        && isMergeModifyQuantity
        && quantity != this.quantity?.value
        && this.data.customEdit != EnumCustomEdit.REMERGE) {
        this.openModifiedQtyTrigger(this.quantity?.value > quantity);
      } else {
        this.sendForm();
      }
    }
  }
  /**
   * Send Edit Commit form
   * @memberof CommitFormComponent
   */
  sendForm() {
    if (this.commitForm?.valid) {

      if (!this.purchaseOrderLine?.value || !this.purchaseOrderNumber?.value || this.purchaseOrderNumber.value == 'n/a') {

        let errorMessage = '';
        if (!this.purchaseOrderLine?.value && !this.purchaseOrderNumber?.value) {
          errorMessage = `PurchaseOrderLine and PurchaseOrderNumber fields are required`
        }
        else if (!this.purchaseOrderNumber?.value || this.purchaseOrderNumber?.value == 'n/a') {
          errorMessage = `PurchaseOrderNumber field is required, n/a can be used only for draft`
        }
        else if (!this.purchaseOrderLine?.value) {
          errorMessage = `PurchaseOrderLine field is required`
        }

        this.notificationService.showError(errorMessage);
        return;
      }

      this.invalidDataHandling();


      var commitData: any = undefined;
      if (this.actionType === 'new') {
        const { inboundDeliveryNumber, ...commit } = this.commitForm.getRawValue();
        commitData = { type: 'commit', editDummyCommit: this.editDummyCommit, commit: commit };
      } else {
        commitData = { type: 'commit', editDummyCommit: this.editDummyCommit, commit: this.commitForm.getRawValue() };
      }
      commitData.commit.invoiceNumber = commitData.commit.invoiceNumber ? commitData.commit.invoiceNumber.toUpperCase() : commitData.commit.invoiceNumber;
      commitData.commit.chooseVendor = commitData.commit.chooseVendor ? Helper.virtualVCReplace(commitData.commit.chooseVendor.toUpperCase()) : "";
      commitData.commit.asn = commitData.commit.asn ? 1 : 0;
      if (this.data.customEdit === EnumCustomEdit.REMERGE) {
        commitData.commit.withRemerge = true;
      }
      //ADD other fields formatting
      commitData.commit.slotDate = this.slotFormatFix(commitData.commit.slotDate);
      commitData.commit.arrivalDate = this.slotFormatFix(commitData.commit.arrivalDate);
      //Result
      const dialogResult: DialogResult = { status: false };
      if (this.manufacturerDetails && this.manufacturerDetails[this.selectedManufacturerIndex]) {
        commitData.commit.mfgPartner = this.manufacturerDetails[this.selectedManufacturerIndex].mfgpn == 'Other' ? 'Other' : this.manufacturerDetails[this.selectedManufacturerIndex].mfgName;
        commitData.commit.mpn = this.manufacturerDetails[this.selectedManufacturerIndex].mfgpn;
      }
      if (this.actionType === 'new') {
        delete commitData.commit.WithChangePurchaseOrderNumber
        this.loading = true;
        if (commitData.type === 'commit') {
          this.store.dispatch(new AddCommit(commitData.commit)).subscribe(() => {
            dialogResult.status = true;
            this.setFinishedResults(dialogResult);
          },
            error => {
              console.log(error);
              this.showError(error, "Error while adding commit");
              this.setFieldsInvalid(error);

              this.loading = false;
            });
        } else {
          this.store.dispatch(new AddDummyCommit(commitData.commit)).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            dialogResult.status = true;
            this.setFinishedResults(dialogResult);
          },
            error => {
              console.log(error);
              this.showError(error, "Error while adding commit");
              this.setFieldsInvalid(error);
              this.loading = false;
            });
        }
      } else if (this.actionType === 'edit') {
        commitData.commit.WithChangePurchaseOrderNumber = this.setOnPOChangeParams();
        this.loading = true;
        if (commitData.type === 'dummy') {
          console.log('dummy');
          const selectedDummyCommitsHeader = this.store.selectSnapshot(
            SupplyVisibilityState.getSelectedDummyCommitsHeader
          );
          const commit = { dummyCommitHeaderID: selectedDummyCommitsHeader.id, ...commitData.commit }
          if (commitData.editDummyCommit) {
            let re = /\*/gi;
            commit.inboundDeliveryNumber = commit.inboundDeliveryNumber.replace(re, "");
            this.store.dispatch(new EditDummyCommit(commit)).subscribe(() => {
              dialogResult.status = true;
              this.setFinishedResults(dialogResult);
            },
              error => {
                console.log(error);
                this.showError(error, "Error while editing commit");
                this.setFieldsInvalid(error);
                this.loading = false;
              });
          } else {
            this.store.dispatch(new AddDummyCommit(commit)).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
              dialogResult.status = true;
              this.setFinishedResults(dialogResult);
            },
              error => {
                this.showError(error, "Error while new dummy commit creation");
                this.setFieldsInvalid(error);
                console.log(error);
                this.loading = false;
              });
          }
        } else {
          commitData.commit.editBy = "";
          if (commitData.editDummyCommit) {
            commitData.commit.inboundDeliveryNumber = "";
            this.store.dispatch(new AddCommit(commitData.commit)).subscribe(() => {
              // after creating commit form dummy commit delete source dummy commit
              const dummyCommitToDelete = { id: this.commit?.id, ...commitData.commit }
              this.store.dispatch(new DeleteDummyCommit(dummyCommitToDelete));
              dialogResult.status = true;
              this.setFinishedResults(dialogResult);
            },
              error => {
                console.log(error);
                this.showError(error, "Error while editing dummy commit");
                this.setFieldsInvalid(error);
                this.loading = false;
              });
          } else {

            this.store.dispatch(new EditCommit(commitData.commit)).subscribe(() => {
              commitData.commit.vendorCode = commitData.commit.chooseVendor;
              delete commitData.commit.chooseVendor;
              dialogResult.data = commitData.commit;
              dialogResult.status = true;
              this.setFinishedResults(dialogResult);
            },
              error => {
                console.log(error);
                this.showError(error, "Error while editing commit");
                this.setFieldsInvalid(error);
                this.loading = false;
              });
          }
        }
      }
    }


  }

  invalidDataHandling() {
    if (this.actionType === 'edit') {

      if (this.isBatchEdit) {
        this.batchInvalidDataHandling();
      }
      else {
        this.singleInvalidDataHandling();
      }

    }
  }
  batchInvalidDataHandling() {
    if (this.commitForm) {
      if (this.invoiceNumber?.value === "" && !this.invoiceNumber?.dirty) {
        this.commitForm.value.invoiceNumber = this.data.commits[this.batchEditIndex].invoiceNumber || "NULL INVOICE";
      }
      if (!this.etdDate?.value && !this.etdDate?.dirty && !this.etdDate?.touched) {
        this.commitForm.value.etdDate = this.data.commits[this.batchEditIndex].etdDate;
      }
    }
  }
  singleInvalidDataHandling() {
    if (this.commitForm) {

      if (this.invoiceNumber?.value === "" && !this.invoiceNumber?.dirty) {
        this.commitForm.value.invoiceNumber = this.data.commit.invoiceNumber || "NULL INVOICE";
      }
      if (!this.etdDate?.value && !this.etdDate?.dirty && !this.etdDate?.touched) {
        this.commitForm.value.etdDate = this.data.commit.etdDate;
      }
    }
  }

  /**
   * Send Edit Commit form
   * @memberof CommitFormComponent
   */
  sendDraftForm() {
    if (this.commitForm?.valid) {
      this.loading = true;
      var commitData = undefined;
      const dialogResult = { status: false };

      if (!this.selectedDummyCommitHeader) {
        this.notificationService.showError(`Simulation set is not selected`);
        this.loading = false;
        return;
      }


      if (this.actionType === 'new') {
        commitData = { dummyCommitHeaderID: this.selectedDummyCommitHeader.id, ...this.commitForm.value }
        if (commitData) {

          if (commitData.purchaseOrderNumber == "n/a") {
            commitData.purchaseOrderNumber = "";
            commitData.purchaseOrderLine = "";
          }
          this.store.dispatch(new AddDummyCommit(commitData)).subscribe(() => {
            dialogResult.status = true;
            this.setFinishedResults(dialogResult);
          },
            error => {
              this.loading = false;
              this.showError(error, "Error while save draft commit");
              this.setFieldsInvalid(error);
            });
        }
      } else {
        commitData = { dummyCommitHeaderID: this.selectedDummyCommitHeader.id, id: this.commit?.id, ...this.commitForm.value }

        if (commitData.purchaseOrderNumber == "n/a") {
          commitData.purchaseOrderNumber = "";
          commitData.purchaseOrderLine = "";
        }
        if (this.commit?.id !== undefined) {
          let re = /\*/gi;

          if (commitData.inboundDeliveryNumber) {
            commitData.inboundDeliveryNumber = commitData.inboundDeliveryNumber.replace(re, "");
          }

          commitData.vendorCode = commitData.chooseVendor;

          this.store.dispatch(new EditDummyCommit(commitData)).subscribe(() => {
            dialogResult.status = true;
            this.setFinishedResults(dialogResult);
          },
            error => {
              this.showError(error, "Error while save dummy commit");
              this.setFieldsInvalid(error);
              this.loading = false;
            });
        } else {
          this.store.dispatch(new AddDummyCommit(commitData)).subscribe(() => {
            dialogResult.status = true;
            this.setFinishedResults(dialogResult);
          },
            error => {
              this.showError(error, "Error while save new commit");
              this.setFieldsInvalid(error);
              this.loading = false;
            });
        }
      }
    }
    this.dialogClose();
  }

  /**
   * Add options for PO Line select, depends on PO Number selection
   * @param {*} purchaseNumber
   * @memberof CommitFormComponent
   */
  onPONumberChange(purchaseNumber: any) {
    this.setSelectedPO(purchaseNumber);

    if (this.commit && this.actionType == 'edit' && +purchaseNumber === +this.commit.purchaseOrderNumber) {

      if (this.commit.purchaseOrderLine && this.selectedPOItems && !(this.selectedPOItems.find((e: any) => e == this.commit?.purchaseOrderLine))) {
        this.selectedPOItems.push(this.commit.purchaseOrderLine);

      }

      this.setPOLine(this.commit.purchaseOrderLine, false);
      this.prevPOVal.poLine = this.commit.purchaseOrderLine;
      this.setErrorPoLine(!(this.commit.purchaseOrderLine && this.commit.purchaseOrderLine != ''));
    }

    else {
      if (this.selectedPOItems) {
        this.setPOLine(this.selectedPOItems[0], false);
        this.prevPOVal.poLine = this.selectedPOItems[0];
      }
      else if (!this.isCreateDraftShown)
        this.setErrorPoLine(!(this.selectedPOItems[0] && this.selectedPOItems[0] != ''));
    }
    this.setRemainingPOQty();
  }
  setSelectedPO(purchaseNumber: any) {
    this.selectedPOItems = this.store.selectSnapshot(
      SupplyVisibilityState.getPurchaseOrder(purchaseNumber)
    );
    return this.selectedPOItems;
  }

  /**
   * Set selected vendor code for commit
   * @param {*} vendorCode
   * @memberof CommitFormComponent
   */
  onVendorCodeChange(vendorCode: any) {
    this.store.dispatch(new SetCommitVendorCode(vendorCode));
    this.getManufacturerDetails();
  }
  onPartNumberChange(pn: any) {
    this.isOptionloader = true;
    this.store.dispatch(new SetVendorCodes([this.partNumber?.value]));
    this.dispatchSetPO();
    this.getManufacturerDetails();
  }

  //#region  Dx-Manufacturer
  onMpnChange(data: any) {
    // if (data.name == 'opened') {
    //   if (this.mfgPartner.value != null || (data.value && this.mfgPartner.value == null)) {
    //     document.getElementById('mpnLabel').classList.add('date-label-focus-out')
    //   }
    //   else if (!data.value && this.mfgPartner.value == null) {
    //     if (document.getElementById('mpnLabel').classList.contains('date-label-focus-out')) {
    //       document.getElementById('mpn').classList.remove('date-label-focus-out')
    //     }
    //   }
    // }

    if (data.name == 'value') {
      let selectedManufacturer: ManufacturerDetailsDto | undefined;
      if (data.value && (data.value[0] || data.value[0] == 0)) {
        selectedManufacturer = this.manufacturerDetails.find(element => element.primaryKey == data.value[0]);
      }
      if (selectedManufacturer) {

        if (selectedManufacturer.mfgpn && selectedManufacturer.mfgpn == "Other") {
          this.revision?.setValue("");
          this.mfgPartner?.setValue("Other")
        }
        else {
          // this.selectedManufacturer.mfgName ? this.manufacturer.setValue(this.selectedManufacturer.mfgName) : null
          selectedManufacturer.productRevision ? this.revision?.setValue(selectedManufacturer.productRevision) : null
          selectedManufacturer.mfgName ? this.mfgPartner?.setValue(selectedManufacturer.mfgName) : null;
        }

        this.isMpnDxOpen = false
      }
      this.ref.detectChanges();
    }
  }

  displayMpn = (item: any) => {
    console.log("Line: 1188\n", item);
    if (item) {
      console.log("Line: 1190", "MPN: ", item.mfgpn);
      return item.mfgpn;
    }
    return this.mpn?.value;
  }

  //#endregion

  getManufacturerDetails() {
    let chooseVendor = this.chooseVendor?.value ? this.chooseVendor.value.toUpperCase() : this.chooseVendor?.value
    this.supplyVisibilityService.getManufacturerDetails(this.partNumber?.value, chooseVendor).subscribe((manufacturerDetails: ManufacturerDetailsDto[]) => {

      //Added others option in manufacturer details
      let otherOption: ManufacturerDetailsDto = {
        partNumber: (manufacturerDetails && manufacturerDetails.length && manufacturerDetails[0].partNumber) ? manufacturerDetails[0].partNumber : this.partNumber?.value,
        vendorCode: (manufacturerDetails && manufacturerDetails.length && manufacturerDetails[0].vendorCode) ? manufacturerDetails[0].vendorCode : this.chooseVendor?.value,
        mfgName: "",
        mfgpn: "Other",
        cpnStatusCode: "",
        productRevision: ""
      }

      if (manufacturerDetails && manufacturerDetails.length) {
        manufacturerDetails.push(otherOption)
      }
      else {
        manufacturerDetails = [otherOption];
      }


      this.manufacturerDetails = manufacturerDetails;
      this.manufacturerDetails.forEach((mfg, index) => {
        mfg.primaryKey = index;
      })
      this.manufacturerDataSource = new ArrayStore({
        key: 'primaryKey',
        data: this.manufacturerDetails,
      })

      if (this.actionType == 'edit') {
        let selectedManufacturerIndex = this.manufacturerDetails.findIndex((element) => element.mfgpn == this.mpn?.value);
        if (selectedManufacturerIndex != -1) {
          const mfgPartner = this.manufacturerDetails[selectedManufacturerIndex].mfgpn == 'Other' ? 'Other' : this.manufacturerDetails[selectedManufacturerIndex].mfgName;
          this.mfgPartner?.setValue(mfgPartner, { emitEvent: false });
          this.selectedManufacturerIndex = selectedManufacturerIndex;
        }
        this.ref.detectChanges();
      }
    })
  }

  private dispatchSetPO() {
    if (this.partNumber?.value && this.activePlant && this.chooseVendor?.value) {
      this.store.dispatch(new SetPurchaseOrdersForCM({ partNumber: this.partNumber.value, plant: this.activePlant, vendorCode: this.chooseVendor.value }));
      const basicParameters: BasicParameters = {
        plant: this.activePlant,
        partNumber: this.initialBasicParameters ? this.initialBasicParameters.partNumber : this.partNumber.value,
        vendorCode: this.initialBasicParameters ? this.initialBasicParameters.vendorCode : this.chooseVendor.value,
        records: this.initialBasicParameters ? this.initialBasicParameters.records : undefined,
        variant: this.initialBasicParameters ? this.initialBasicParameters.variant : undefined,
        mmViewID: this.initialBasicParameters ? this.initialBasicParameters.mmViewID : undefined
      };

      this.store.dispatch(new SetBasicParameters(basicParameters));
    } else {
      this.loading = false;
      this.isOptionloader = false;
      this.setErrorPoNumber(false);
      this.setErrorPoLine(false);
    }
  }

  /**
   * Catch Set Commits with Dummy commits Error
   * @memberof CommitHistoryComponent
   */
  catchSetCommitVendorCodeSuccess() {
    this.actions$.pipe(ofActionDispatched(SetCommitVendorCodeSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.isOptionloader = true;
        this.dispatchSetPO();

      });
  }

  catchDependenciesStates() {

    //Observables will handle when API Succeed or Fails
    let cacheCommitsCarriers = merge(
      this.actions$.pipe(ofActionDispatched(CacheCommitsCarriersSuccess)),
      this.actions$.pipe(ofActionDispatched(CacheCommitsCarriersError)))

    let cacheCommitsCountries = merge(
      this.actions$.pipe(ofActionDispatched(CacheCommitsCountriesSuccess)),
      this.actions$.pipe(ofActionDispatched(CacheCommitsCountriesError)))

    let cacheCommitsTransportType = merge(
      this.actions$.pipe(ofActionDispatched(CacheCommitsTransportTypeSuccess)),
      this.actions$.pipe(ofActionDispatched(CacheCommitsTransportTypeError)))

    let cacheCommitsReasons = merge(
      this.actions$.pipe(ofActionDispatched(CacheCommitsReasonsSuccess)),
      this.actions$.pipe(ofActionDispatched(CacheCommitsReasonsError)))

    let cacheReadOnlyFields = merge(
      this.actions$.pipe(ofActionDispatched(CacheReadOnlyFieldsSuccess)),
      this.actions$.pipe(ofActionDispatched(CacheReadOnlyFieldsError)))

    //It will always return default value if API fails.
    let cacheSetPlantMandatory = merge(
      this.actions$.pipe(ofActionDispatched(SetPlantMandatoryDatesSuccess)))

    try {
      combineLatest([cacheCommitsCarriers, cacheCommitsCountries, cacheCommitsTransportType, cacheCommitsReasons, cacheReadOnlyFields, cacheSetPlantMandatory]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (res) => {
          this.initializeForm();
        }
      )
    } catch (error) {
      this.notificationService.showError("Cannot Display the Commits Form");
      console.log(error);
    }
  }

  compareFn = (option1: string, option2: string) => {
    return option1.toLowerCase() === option2.toLowerCase();
  };

  initializeForm() {
    this.createForm();

    this.filteredOptions = this.commitForm?.controls['forwarder'].valueChanges.pipe(takeUntil(this.ngUnsubscribe),
      startWith(''),
      map(value => this._filter(''))
    );

    this.commitForm?.controls['chooseVendor'].valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((vendorCode) => {
      this.vendorCodes = this.filterVendorCode(vendorCode);
    });

    if (this.isBatchEdit) {
      this.batchSubmitLabel = this.submitBtnLabels.saveAndContinue;
      this.setFormForBatchCommits();
      this.setDialogTitle(this.actionType);

    } else {
      this.singleSubmitLabel = this.submitBtnLabels.submit;
      this.setFormData(this.data.commit);
    }
    if (this.actionType == 'edit' || !this.data.isCommitModule) {
      this.getManufacturerDetails();
    }

    this.setControlValueChangesSub();

    //NOTE History is now independent of form -- uncomment to undo
    // if (this.data.displayType == CommitDialogDisplayType.HISTORY) {
    //   this.showCommitHistory();
    // }

    this.subscription.add(
      this.purchaseOrders$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: PurchaseOrders[]) => {

        if (response && response.length) {
          if (this.actionType === 'edit' && this.purchaseOrdersEdit) {
            this.purchaseOrders.length = 0;
            let list: PurchaseOrders[] = [];
            list.push(...response);
            this.purchaseOrders = list;
          } else {
            this.purchaseOrders = response;
            this.fillPurchaseOrder();
          }

          if (!this.purchaseOrders.length) {
            this.setErrorPoNumber(true);
          } else if (!this.purchaseOrders.find(e => e.purchaseOrderNumber == this.purchaseOrderNumber?.value)) {
            this.setErrorPoNumber(true);
          } else {
            this.setErrorPoNumber(false);
          }
          if (this.purchaseOrderNumber?.value && this.purchaseOrderNumber?.value != '') {
            if (this.purchaseOrderLine?.value && this.selectedPOItems) {
              this.setErrorPoLine(false);
            }
          }
          this.setRemainingPOQty();
        }
      })
    );
    this.subscription.add(
      this.vendorCodes$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: VendorCode[]) => {
        if (response[0] !== undefined) {
          this.vendorCodes = response[0].vendorCodes;
          if (this.vendors && this.vendors.length > 0) {
            this.vendorCodesWithPn = this.vendors.filter((item: any) => this.vendorCodes.includes(item.vendorCode));
            this.vendorCodes = this.vendorCodesWithPn;
          }
        }
        else {
          this.vendorCodes = this.vendors;
        }
        this.loading = false;
      })
    );

    this.subscription.add(
      this.selectedDummyCommitHeader$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: DummyCommitHeader) => {
        this.selectedDummyCommitHeader = response;
        this.resetRequiredFieldsForDummyCommit();
      })
    );




    //commit history handling - make sure form is set
    this.commitConfig = {
      "inboundDeliveryNumber": this.inboundDeliveryNumber?.value
    }
    this.setRemainingPOQty();
  }

  /*Count purchaseOrder open PO qty*/
  setRemainingPOQty() {
    if (this.purchaseOrders.length > 0) {
      this.selectedPurchaseOrderLine = this.commitForm?.get('purchaseOrderLine')?.value;
      this.selectedPurchaseOrder = this.purchaseOrders.filter(x => x.purchaseOrderNumber === this.commitForm?.get('purchaseOrderNumber')?.value)[0];
      if (this.selectedPurchaseOrder && this.selectedPurchaseOrder.purchaseOrderItems && this.selectedPurchaseOrder.purchaseOrderItems.length > 0) {
        this.filteredPurchaseOrderItem = this.selectedPurchaseOrder.purchaseOrderItems.filter((y: any) => y.purchaseOrder_Item === this.selectedPurchaseOrderLine);
        if (this.filteredPurchaseOrderItem && this.filteredPurchaseOrderItem.length) {
          this.remainingPOQty = this.filteredPurchaseOrderItem[0].openCommitQuantity;
        }
      }
      if (this.commitForm?.get('purchaseOrderNumber')?.value && this.commitForm?.get('purchaseOrderNumber')?.value.toLowerCase() === 'n/a') {
        this.remainingPOQty = undefined;
      }
    }

  }

  fillPurchaseOrder() {
    if (!this.commitForm?.get('purchaseOrderNumber')?.value) {
      this.loading = true
    }
    if (this.purchaseOrders.length != 0 && this.commitForm?.get('partNumber')?.value) {
      this.loading = false
      this.commitForm.get('purchaseOrderNumber')?.setValue(this.purchaseOrders[0].purchaseOrderNumber);
      this.commitForm.get('purchaseOrderLine')?.setValue(this.purchaseOrders[0].purchaseOrderItems[0].purchaseOrder_Item);
    }
  }

  /**
   * Catch Set Purchase Orders Success
   * @memberof CommitHistoryComponent
   */
  catchSetPurchaseOrdersSuccess() {
    this.actions$.pipe(ofActionDispatched(SetPurchaseOrdersSuccess), takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.setSelectedPO(this.purchaseOrderNumber?.value);
      this.isOptionloader = false;
    });
  }
  catchSetVendorCodesSuccess() {
    this.actions$.pipe(ofActionDispatched(SetVendorCodesSuccess), takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.isOptionloader = false;
    });
  }
  /**
   * Set First PO line
   * @memberof CommitFormComponent
   */
  setPOLine(item: any, emitEvent: boolean = true) {
    /* Set value */
    this.commitForm?.controls['purchaseOrderLine'].setValue(item, { emitEvent: emitEvent });
  }
  get partNumber() {
    return this.commitForm?.controls['partNumber'];
  }
  get chooseVendor() {
    return this.commitForm?.controls['chooseVendor'];
  }
  get invoiceNumber() {
    return this.commitForm?.controls['invoiceNumber'];
  }
  get etdDate() {
    return this.commitForm?.controls['etdDate'];
  }
  get inboundDeliveryNumber() {
    return this.commitForm?.controls['inboundDeliveryNumber'];
  }
  get purchaseOrderLine() {
    return this.commitForm?.controls['purchaseOrderLine'];
  }
  get purchaseOrderNumber() {
    return this.commitForm?.controls['purchaseOrderNumber'];
  }
  get quantity() {
    return this.commitForm?.controls['quantity'];
  }
  get withMergeModifyQuantity() {
    return this.commitForm?.controls['WithMergeModifyQuantity'];
  }
  get manufacturer() {
    return this.commitForm?.controls['manufacturer'];
  }
  get revision() {
    return this.commitForm?.controls['revision'];
  }
  get mpn() {
    return this.commitForm?.controls['mpn'];
  }
  get withChangePurchaseOrderNumber() {
    return this.commitForm?.controls['WithChangePurchaseOrderNumber'];
  }
  get mfgPartner() {
    return this.commitForm?.controls['mfgPartner'];
  }
  get mfgName() {
    return this.commitForm?.controls['mfgName'];
  }
  /**
   * Dialog close by cancel
   * @memberof CommitDialogFormComponent
   */
  dialogClose() {

    if (this.isBatchEdit && this.batchEditIndex > 1) {
      this.dialogRef.close({ status: true });
    } else {
      this.dialogRef.close();
    }
  }
  setFieldsInvalid(error: any) {

    if (!(error && error.error && error.error.errors)) {
      return
    }
    Object.keys(error.error.errors).forEach(errorField => {
      this.commitForm?.markAllAsTouched();
      let errorMessage = error.error.errors[errorField];

      if (this.commitForm?.controls[errorField]) {
        this.commitForm.controls[errorField].setErrors({ serverError: errorMessage });
      }

    });
  }
  showError(error: any, msg: string) {
    const extractedErrorObj = error.error;
    if (extractedErrorObj.errors && Object.keys(extractedErrorObj.errors).length > 0) {
      let fieldsMessage = Object.keys(extractedErrorObj.errors).map(function (x) {
        return extractedErrorObj.errors[x];
      }).join("<br>");
      this.notificationService.showError(fieldsMessage);
      return;
    }

    let message = error.message ? error.message : msg;
    if (error.detail) {
      message = error.detail;
    }
    if (error.error && error.error.detail) {
      message = error.error.detail;
    }
    if (message) {
      this.notificationService.showError(message);
    }
    else {
      this.notificationService.showError(this.translate.instant('supply-visibility.addDummyCommitHeaderError'));
    }

  }

  /**
  * Open Commit Selection Dialog
  *
  */
  openColumnSelectField() {
    const dialogRef = this.dialog.open(SelectFieldComponent, {
      width: '30%',
      data: {
        fieldList: JSON.stringify(this.columns), //Sending Copy
        title: "commitDialogForm.selectCommitField",
        structureType: EnumCommitFieldStructure.CommitForm,
        hideFieldKey: this.actionType == "new" ? "edit" : "new",
        baseModule: this.baseModule
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.columns = result;
        let data: SaveFieldsVisibility = {
          store: this.store,
          key: this.FIELD_LIST_VISIBILITY_KEY,
          columns: this.columns,
          columnAlreadySaved: this.columnAlreadySaved,
          type: EnumCommitFieldStructure.CommitForm
        };
        Helper.saveFieldsVisibility(data);
      } else {
        //do nothing
      }
    });
  }

  /**
  * Load Column Visibility
  *
  */
  private async fillFieldVisibility() {
    try {

      let defaultFields;
      let cachedDefaultFields = this.store.selectSnapshot(CommonState.getDefaultFields);

      // if(cachedDefaultFields[this.DEFAULT_FIELDS_KEY]) {
      //   defaultFields = cachedDefaultFields[this.DEFAULT_FIELDS_KEY];
      // }
      // else {
      let tDefaultFields = await this.supplyVisibilityService
        .getDefaultFormSettingFields(this.DEFAULT_FIELDS_KEY)
        .toPromise()
        .catch(() => {
          defaultFields = undefined;
        });

      let mandatoryDates = this.store.selectSnapshot(SupplyVisibilityState.getPlantSpecificLeadDate);

      let mandatoryFields: any = await this.supplyVisibilityService.getMandatoryFields();

      defaultFields = this.supplyVisibilityService.setFieldsVisibility(tDefaultFields, this.readOnlyFields, mandatoryDates, mandatoryFields);

      if (defaultFields) {
        this.store.dispatch(new CacheDefaultFields(this.supplyVisibilityService, this.baseModule, this.DEFAULT_FIELDS_KEY, defaultFields));
      }
      // }
      let data: GetFieldsVisibility = {
        service: this.supplyVisibilityService,
        key: this.FIELD_LIST_VISIBILITY_KEY,
        type: EnumCommitFieldStructure.CommitForm,
        defaultFields: defaultFields,
        baseModule: this.baseModule
      }
      const visibility = await Helper.getFieldsVisibility(data, this.commitModuleRights);
      this.columns = visibility.columns;
      this.columnAlreadySaved = visibility.columnAlreadySaved;

      this.columns.forEach((column: any) => {
        mandatoryFields.forEach((field: any) => {
          if (field.toLowerCase() == column.field.toLowerCase()) {
            column.isRequired = true;
          }
        });
        if (column.controlType == 'd-mpn' && column.isRequired) {
          this.mpnLabel = "MPN *";
        }
      });

    } catch (error) {

    }
    this.commonDropdownList = this.getCommonDropdownList();
  }
  private async deleteFieldsVisibility() {
    try {
      console.log('delete started for ' + this.FIELD_LIST_VISIBILITY_KEY);
      await Helper.deleteFieldsVisibility(this.store, this.FIELD_LIST_VISIBILITY_KEY);
      console.log(this.FIELD_LIST_VISIBILITY_KEY + ' is deleted');
    } catch (error) {

    }

  }
  /**
   * Add Controls For Sub values
   */
  /**
   * set Manual PoNumber Error
   */
  setErrorPoNumber(state: any) {
    if (this.selectedDummyCommitHeader === undefined || !this.selectedDummyCommitHeader) {
      this.commitForm?.controls['purchaseOrderNumber'].setErrors(state ? { 'incorrect': true } : null);
    }
  }
  /**
  * set Manual PoNumber Error
  */
  setErrorPoLine(state: any) {
    if (this.selectedDummyCommitHeader === undefined || !this.selectedDummyCommitHeader) {
      this.commitForm?.controls['purchaseOrderLine'].setErrors(state ? { 'incorrect': true } : null);
    }
  }
  /**
   * set Manual PoNumber Value
   */
  setValuePoNumber(value: any) {
    this.commitForm?.controls['purchaseOrderNumber'].setValue(value);
  }

  showDocuments() {
    this.loading = true;
    this.title = "Documents";
    this.isDocumentsEnabled = true;
    this.isCommitHistoryEnabled = false;
  }

  hideDocuments() {
    this.setDialogTitle(this.actionType);
    this.isDocumentsEnabled = false;
  }

  showCommitHistory() {
    this.loading = true;
    this.title = "History";
    this.isCommitHistoryEnabled = true;
    this.isDocumentsEnabled = false;
    // this.getCommitsHistory();
  }
  hideCommitHistory() {
    this.setDialogTitle(this.actionType);
    this.isCommitHistoryEnabled = false;
  }

  getCommonDropdownList(): any {
    const commitDropdownFields: any = {
      "apsRelevant": [
        { name: "Yes", value: "Y" },
        { name: "No", value: "N" },
      ],

      "expressFlag": [
        { name: "n/a", value: "" },
        { name: "Express", value: "E" },
        { name: "Normal", value: "N" },
        { name: "Deferred", value: "D" }
      ],
      "thirdPartyPaid": [
        { name: "n/a", value: "" },
        { name: "Yes", value: "Y" },
        { name: "No", value: "N" },
      ],
      "stockType": [
        { name: "Available Stock", value: "" }, // n/a
        { name: "Stock in Quality Control", value: "X" }, // Quality
        { name: "Blocked Stock", value: "S" }  // Blocked
      ]
      //ADD other static dropdown list here.
    }
    return commitDropdownFields;
  }

  private slotFormatFix(value: any): any {
    let mSlotDate = undefined;
    if (value && value !== undefined && (value.substring(0, 10) === '2000-01-01' || value.substring(0, 10) === '1900-01-01')) {
      mSlotDate = undefined;
    }
    else {
      mSlotDate = value;
    }
    return mSlotDate;
  }


  private vendorModeCheck(): void {
    this.initialBasicParameters = this.store.selectSnapshot(
      SupplyVisibilityState.getBasicParameters
    );
    // Vendor mode check
    if (this.initialBasicParameters && !(this.actionType == "new" && this.isCommitModule)) {

      console.log('VendorMode Commits')
      console.log('2')

      this.selectedVendorCode = this.initialBasicParameters.vendorCode ? this.initialBasicParameters.vendorCode : undefined;
      this.selectedPartNumber = this.initialBasicParameters.partNumber ? this.initialBasicParameters.partNumber : undefined;

      if (!this.initialBasicParameters.vendorCode && this.vendorCodes) {
        this.vendorCodes.length === 0 ? (this.loading = true) : null;
      }
    }
    else {
      console.log('NonVendorMode Commits')
    }
  }

  openedChange(e: boolean) {
    this.resetSearchField(e);
  }

  clearSearch(event: MouseEvent) {
    this.resetSearchField(true);
  }

  resetSearchField(e: boolean) {
    this.countriesNames = this.search('');
    this.searchDropdown.patchValue('');
    if (e == true) {
      this.searchTextBox?.nativeElement.focus();
    }
  }

  onKey(value: EventTarget | null) {
    this.countriesNames = this.search(value?.toString() || '');
  }

  search(value: string) {
    let filter = value.toLowerCase();
    // use replace method for search name to ignore space
    return this.countries.filter((option: any) => option.name ? option.name.replace(/ /g, '').toLowerCase().includes(filter) : '');
  }


  getServerError(field: string): string | undefined {
    return this.commitForm?.controls[field]?.errors?.['serverError'] ?? undefined;
  }


}


//NOTE - Test Cases
/*------------------- Cases -----------------
1. Batch Edit
2. Commit dialog form from notifications
3. SV and Commit modules
4. Show history section
5. Create/Edit commit
*/

/*------------------- issues to be handled -----------------
1. partnumber - auto fill and disabled
2. vendor code - auto fill and disabled
3. check for dropdowns
4. enable disable dummy header--done
5. enable disable draft--done
6. ui changes
*/
