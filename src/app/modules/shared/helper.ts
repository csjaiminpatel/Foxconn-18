import { ElementRef, Renderer2, ChangeDetectorRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import moment from "moment";
import { CommitsModuleRights, UserRights, SupplyVisibilityRights, DashboardsRights, VendorListRights, ConfigurationRights, FinancialModuleRights, DateTypeRights, CarriersModuleRights } from "../auth/models/auth.model";
import { NotificationService } from "../auth/services/Notification/notification.service";
import { CommitProperty, CommonCommitFields } from "../dashboard/models/commits.model";
import { EnumInvoicingFieldStructure, InvoicingList } from "../dashboard/models/invoicing.model";
import { EnumPartNumbersFieldStructure, PartNumbersListField } from "../dashboard/models/partnumbers-list.model";
import { EnumQuotationsFieldStructure, QuotationsListField } from "../dashboard/models/quotations.model";
import { DateRangeParameters, BatchEditCommits, CommitVisualization, CommonSvVisualization, EnumSvSidebarSection, EnumCommitFieldStructure, FieldVisibilitySetting, UserSettingsCls, PnVendorCode } from "../dashboard/models/supply-visibility.model";
import { EnumVendorsFieldStructure, VendorsListField } from "../dashboard/models/vendors-list.model";
import { HandleLinkEvents, AddUserSettings, EditUserSettings, GetDefaultFieldsSuccess, DeleteUserSettings } from "../dashboard/stores/supply-visibility/supply-visibility.actions";
import { GetFieldsVisibility, LoadOptionsDTO, SaveFieldsVisibility } from "./DTOs/helperDto";
import { EnumGoodsReceiptsFieldStructure, GoodsReceiptsList } from "../dashboard/models/goods-receipts.model";
import { Exclude, plainToClass, plainToInstance } from 'class-transformer';
import { CarriersListField, EnumCarriersFieldStructure } from "../dashboard/models/carriers-list.model";
import { EnumPortfolioFieldStructure, PortfolioListField } from "../dashboard/models/portfolio.model";
import { EnumShipmentFieldStructure, ShipmentListField } from "../dashboard/models/shipments.model";


export class Helper {
  static router: Router;
  static trimLeadingZeros(number: string): string {
    try {
      return number.replace(/^0+/, '');
    } catch (error) {
      return number;
    }
  }
  public static getCommitHistoryDateRange(): DateRangeParameters {
    const dateFrom = moment().subtract(14, 'days');
    const dateTo = moment().add(6, 'months');

    const dateRange: DateRangeParameters = {
      dateFrom: dateFrom,
      dateTo: dateTo,
    };
    return dateRange;
  }
  public static getCommitFilterDateRange(): DateRangeParameters {
    const dateFrom = moment().subtract(1, 'month');
    const dateTo = moment().add(1, 'month');

    const dateRange: DateRangeParameters = {
      dateFrom: dateFrom.toDate(),
      dateTo: dateTo.toDate(),
    };
    return dateRange;
  }
  public static showError(notificationService: NotificationService, error: any, msg: string) {
    let message = error.message ? error.message : msg;
    if (error.detail) {
      message = error.detail;
    }
    if (error.error && error.error.detail) {
      message = error.error.detail;
    }
    if (message) {
      notificationService.showError(message);
    } else {
      notificationService.showError(msg);
    }
  }

  static readonly dateFields = [
    'actualETADate',
    'deliveryDate',
    'eddDate',
    'etaDate',
    'etdDate',
    'etaPortDate',
    'expirationDate',
    'inboundDeliveryDate',
    'receiveDate',
    'recomitRequestDate',
    'requestDate',
    'scheduleLineDate',
    'slotDate',
    'sapDeliveryDate',
    'triggerDate',
    'instructionEtaDate',
    'purchasingDocumentDate',
    'lastUpdateDate',
    'otmReceivedDate',
    'codeDate',
    'arrivalDate',
    'plannedOrderStatus'
  ];

  public static formatFontsize(fontSize?: string): number {
    let fontSizeInt;

    switch (fontSize) {
      case 'small':
        fontSizeInt = 9;
        break;

      case 'medium':
        fontSizeInt = 10;
        break;

      case 'large':
        fontSizeInt = 11;
        break;

      default:
        fontSizeInt = 10;
        break;
    }
    return fontSizeInt;
  }

  //#region PN-FLAGS (for Form field)
  public static pnVcFlags() {
    return [
      {
        field: 'partNumber',
        headerText: 'PartNumber',
        controlType: 'simple',
        visible: true,
      },
      {
        field: 'vendorCode',
        headerText: 'VendorCode',
        controlType: 'simple',
        visible: true,
      },
      {
        field: 'flag',
        headerText: 'Flag',
        controlType: 'simple',
        visible: true,
      }
    ]
  }
  //#endregion PN-FLAGS

  //#region SHIPMENT-FLAGS (for Form field)
  public static shipmentFlags() {
    return [
      {
        field: 'id',
        headerText: 'ID',
        controlType: 'simple',
        visible: true,
      },
      {
        field: 'flag',
        headerText: 'Flag',
        controlType: 'simple',
        visible: true,
      }
    ]
  }
  //#endregion SHIPMENT-FLAGS

  public static getNotesToolbarItems() {
    return [
      {
        name: 'bold',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'italic',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'strike',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'underline',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'clear',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'size',
        type: 'acceptedValuess',
        acceptedValues: ['7pt', '8pt', '9pt', '11pt', '11pt', '12pt', '13pt', '14pt', '15pt'],
        options: null,
      },
      {
        name: 'color',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'background',
        type: 'options',
        acceptedValues: [],
        options: { icon: 'fill' },
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'header',
        type: 'acceptedValuess',
        acceptedValues: [false, 1, 2, 3, 4, 5],
        options: null,
      },
      {
        name: 'codeBlock',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'blockquote',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'align',
        type: 'acceptedValuess',
        acceptedValues: ['left', 'center', 'right', 'justify'],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'orderedList',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'bulletList',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'link',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'undo',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'redo',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
      {
        name: 'separator',
        type: 'simple',
        acceptedValues: [],
        options: null,
      },
    ];
  }

  public static formatCommitDate(commit: any) {
    const dateTimePickerFields: string[] = ['slotDate', 'arrivalDate']; //NOTE For fields having dateTimePicker
    const dateFields = this.dateFields.filter((field) => {
      return !dateTimePickerFields.includes(field);
    });

    for (let index = 0; index < dateFields.length; index++) {
      const element = dateFields[index];
      if (commit[element]) {
        commit[element] = this.formatDate(commit[element]);
      }
    }
    return commit;
  }

  /// formating for input and prepare data for calling api as array param
  static formatPasteList(origintext: string, clipboardtext: string): string {

    const testFor = ['\t', '\n\r', '\n'];
    let originText = origintext ? origintext : '';
    let modifiedText = clipboardtext ? clipboardtext : '';

    // Replace specified whitespace characters with a comma
    for (let i = 0; i < testFor.length; i++) {
      const reg = new RegExp(testFor[i], 'g');
      modifiedText = modifiedText.replace(reg, ',');
    }

    // Replace consecutive commas with a single comma
    modifiedText = modifiedText.replace(';', ',');

    // Remove empty lines
    modifiedText = modifiedText.replace(/^\s*[\r\n]/gm, '');

    // Remove leading and trailing commas
    modifiedText = modifiedText.replace(/(^,)|(,$)/g, '');

    // Remove leading and trailing ;
    modifiedText = modifiedText.replace(/(^;)|(;$)/g, '');

    // Replace consecutive commas with a single comma
    modifiedText = modifiedText.replace(/\t/g, ',');
    modifiedText = modifiedText.replace(/,+/g, ',');
    modifiedText = modifiedText.replace(/;+/g, ',');

    //origin text + new modified from clipboard ended with comma
    if (modifiedText != '')
      return originText + modifiedText + ',';
    else  // if empty clipboard nothing changed
      return originText
  }

  //#region Link Events

  public static getLinkEventRegex(isHandleLink?: boolean): RegExp {
    return new RegExp(isHandleLink ? 'hdl-[a-z]+:[0-9]+' : '#[a-z]+:[0-9]+', 'g');
  }
  public static getNumberRegex(isEmpty?: boolean): RegExp {
    return new RegExp(`[0-9]${isEmpty ? '' : '+'}`, 'g');
  }
  public static addLinkEventsOnHtmlString(message: string): string {
    //Pattern #commit:{00000000}
    const eventRegex: RegExp = this.getLinkEventRegex();
    const eventValueRegex: RegExp = this.getNumberRegex();
    const unformattedEvent = message.match(eventRegex) || [];
    for (let i = 0; i < unformattedEvent.length; i++) {
      const eventValue = unformattedEvent[i].match(eventValueRegex) || [];
      if (eventValue.length > 0) {
        //const hrefUrl =`${this.PATH_COMMITS}?Event=${encodeURIComponent(unformattedCommitId[i])}`;
        if (eventValue[0]) {
          const anchor = this.generateAnchorTagString(
            eventValue[0],
            unformattedEvent[i].replace('#', 'hdl-'),
            i.toString()
          );
          message = message.replace(unformattedEvent[i], anchor);
        }
      }
    }

    message = this.addErrorToMesage(message);

    return `<span id='linkEvents' style='display:none;'>${message}</span>`;
  }

  public static addErrorToMesage(message: string): string {

    const replaceWithError = ((messagePart: string) => {
      const regex = new RegExp(`\\*error`, 'g');
      messagePart = messagePart.replace(regex, '');
      return `<span class="error-notification" style="color:red;">${messagePart}</span>`;
    });

    const messageParts = message.split("<br>");

    messageParts.forEach((part, index) => {
      if (this.notificationHasError(part)) {
        messageParts[index] = replaceWithError(part);
      }
    });

    message = messageParts.join("<br>");

    return message;


  }




  public static notificationHasError(message: string): boolean {
    return message !== message.replace("*error", "");
  }

  public static setClickEventsOnInnerTemplate(
    store: Store,
    document: any,
    elRef: ElementRef,
    renderer: Renderer2
  ) {
    if (document.getElementById('parentLinkEvents')) {
      const rendererListeners: any[] = [];
      const allContent = elRef.nativeElement.querySelector('#linkEvents');
      const parentContainer = elRef.nativeElement.querySelector('#parentLinkEvents');
      renderer.appendChild(parentContainer, allContent);
      renderer.removeStyle(allContent, 'display');
      const clickButtons = elRef.nativeElement.querySelectorAll('.clickHandleAnchor');
      for (let i = 0; i < clickButtons.length; i++) {
        let disableClick = false;
        const rendererListener = renderer.listen(clickButtons[i], 'click', ($event) => {
          if (disableClick) {
            return;
          }
          disableClick = true;

          const eventData: string = $event.target.dataset ? $event.target.dataset.value : null;
          store.dispatch(new HandleLinkEvents(eventData));
          setTimeout(() => {
            disableClick = false;
          }, 3000);
        });
        rendererListeners.push(rendererListener);
      }
      return rendererListeners;
    }
    return [];
  }

  /**
   * For destroying/unlisten any elements in renderer
   * @returns void
   */
  public static destroyRendererListener(rendererListeners: any[]): void {
    for (let i = 0; i < rendererListeners.length; i++) {
      rendererListeners[i]();
    }
  }
  //#endregion Link Events

  //#region Generate Dynamic Html Elements

  public static generateAnchorTagString(
    text: string,
    value: string,
    id: string,
    hrefLink?: string
  ): string {
    //RND For Normal Tag With Style
    return ` <a class="clickHandleAnchor" id="${id}" href="${hrefLink ? hrefLink : 'javascript:void(0)'
      }" target="_self" data-value='${value}'>${text}</a> `; // do not remove space
  }

  //#endregion Generate Dynamic Html Elements

  public static vendorToUppercase(vendor: string): string {
    return vendor ? vendor.toUpperCase() : '';
  }
  /**
   * @param store pass store reference variable
   * @param payload set payload for user settings
   * @param isNew settings
   * @param isNotificationRequired
   * @param updateIdInData  If true add Plant ID (eg. -LS51) to ID of object in data field, check supply-visibility.service.ts for details
   */

  public static saveSettings(
    store: Store,
    payload: SettingPlayload,
    isNew = false,
    isNotificationRequired = false,
    updateIdInData = true
  ) {
    const changedData = {
      key: payload.key,
      data: JSON.stringify(payload.data),
    };
    if (isNew) {
      store.dispatch(new AddUserSettings(changedData, updateIdInData));
    } else {
      store.dispatch(new EditUserSettings(changedData, isNotificationRequired));
    }
  }

  public static modifiedPaginationSorting(params: LoadOptionsDTO) {
    let sortingData: any = params.sort;

    if (sortingData) {
      const resultString = sortingData.map((item: any) => {
        return `${item.selector} ${item.desc ? 'desc' : 'asc'}`;
      }).join(',');

      params.sort = resultString;
    }

    return params;
  }

  public static formatBatchCommitDate(filter: BatchEditCommits) {
    const dateTimePickerDates: string[] = ['slotDate', 'arrivalDate'];

    const keys = this.dateFields
      .filter((date) => !dateTimePickerDates.includes(date))
      .map((v) => v.toLowerCase());
    filter.fields.forEach((element) => {
      if (keys.indexOf(element.key.toLowerCase()) >= 0) {
        element.value = element.value ? this.formatDate(element.value) : null;
      }
    });
    return filter;
  }

  public static getInputDateFormats(): string[] {
    return ['YYYY-MM-DD', 'YYYY.MM.DD', 'YYYY/MM/DD', 'DD.MM.YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY'];
  }

  public static formatDate(value: any) {
    if (value && value != 'Invalid date')
      try {
        return moment(value).format('YYYY-MM-DD');
      } catch (e) {
        return value;
      }
  }

  public static formatDateWithTime(value: any) {
    if (value) {
      try {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        return value;
      }
    }
    return value;
  }

  public static formatDateToDDMMYYYY(value: any) {
    if (value && value != "Invalid date") {
      try {
        return moment(value).format('DD.MM.YYYY');
      } catch (e) {
        return value;
      }
    }
  }
  public static getSortedByPnVc(sort: any, data: any) {
    if (data) {
      data = [...data]; // Clone data array to avoid mutating the original array

      if (sort) {
        // Check if the sorting key is "virtualPN" to apply custom sorting logic
        if (sort.key === 'virtualPN') {
          // Custom sorting logic for "virtualPN"
          data = data.sort((a: any, b: any) => {
            if (sort.type === 'ascending') {
              // Ascending VirtualPN: SubItems ASC, VendorCode ASC
              if (a.subItems === b.subItems) {
                return a.vendorCode.localeCompare(b.vendorCode); // VendorCode ASC
              }
              return a.subItems.localeCompare(b.subItems); // SubItems ASC
            } else if (sort.type === 'descending') {
              // Descending VirtualPN: SubItems DESC, VendorCode DESC
              if (a.subItems === b.subItems) {
                return b.vendorCode.localeCompare(a.vendorCode); // VendorCode DESC
              }
              return b.subItems.localeCompare(a.subItems); // SubItems DESC
            }
            return 0;
          });
        } else {
          // Default sorting logic for other keys: partNumber, vendorCode
          data = data.sort((a: any, b: any) => {
            if (sort.type === 'ascending') {
              return a[sort.key] > b[sort.key] ? 1 : -1;
            } else {
              return a[sort.key] < b[sort.key] ? 1 : -1;
            }
          });
        }
      } else {
        data = data.sort((a: any, b: any) => (a.index < b.index ? -1 : a.index > b.index ? 1 : 0));
      }
    }
    return data;
  }

  public static splitVendorCodes(vendorCodes: string) {
    return vendorCodes
      ? Helper.virtualVCReplace(vendorCodes)
        .split(/,|;|\s+/gm)
        .map((c) => (c ? c.trim() : ''))
        .filter((c) => c)
      : [];
  }

  private static readonly virtualVCRegex = new RegExp('VIRTUALVC', 'g');
  public static virtualVCReplace(pnVC: string) {
    let pnVCItems = pnVC.split(';');
    pnVCItems = pnVCItems.map((pnVCItem) => {
      const pnVCSplit = pnVCItem.split('|');
      return pnVCSplit.length < 2
        ? pnVCItem
        : pnVCItem
          .replace(pnVCSplit[1], pnVCSplit[1].toUpperCase())
          .replace(this.virtualVCRegex, 'VirtualVC');
    });
    return pnVCItems.join(';');
  }

  public static readonly defaultCommitVisualization: CommitVisualization = {
    pageSettings: { pageSize: 10, pageIndex: 0 },
    columnSort: [],
  };

  public static getDefaultCommonSvVisualization(): CommonSvVisualization {
    const defaultCommonSvVisualization: CommonSvVisualization = {
      svSplitAreaSize: { mainView: 80, sidebar: 20 },
      svSidebarOpened: false,
      svSidebarOpenedSection: EnumSvSidebarSection.None,
    };
    return defaultCommonSvVisualization;
  }

  //#region Keys
  // public static readonly REVIEW_FLAG_KEY: string = 'Review';
  public static readonly REVIEW_BUYER_FLAG: string = 'ReviewByBuyer';
  public static readonly REVIEW_SUPPLIER_FLAG: string = 'ReviewBySupplier';
  public static readonly REVIEW_CUSTOMER_FLAG: string = 'ReviewByCustomer';
  public static readonly SV_MODULE: string = 'sv-module';
  public static readonly COMMIT_MODULE: string = 'commits-module';
  public static readonly VENDORS_MODULE: string = 'vendors-module';
  public static readonly MYPORTFOLIO_MODULE: string = 'myPortFolio-module';
  public static readonly MMVIEWS_MODULE: string = 'MMViews-module';
  public static readonly CONTACTS_MODULE: string = 'contacts-module';
  public static readonly PNGROUP_MODULE: string = 'pn-groups-module';
  public static readonly QUOTATIONS_MODULE: string = 'quotations-module';
  public static readonly CARRIERS_MODULE: string = 'carriers-module';
  public static readonly GOODRECEIPTS_MODULE: string = 'goodReceipts-module';
  public static readonly INVOICING_MODULE: string = 'invoicing-module';
  public static readonly FINANCIAL_MODULE: string = 'financial-module';
  public static readonly ACTIVITY_MODULE: string = 'activity-module';
  public static readonly PARTNUMBERS_MODULE: string = 'partnumbers-module';
  public static readonly QAP_MODULE: string = 'qap-module';
  public static readonly PORTFOLIO_MODULE: string = 'portfolio-module';
  public static readonly GLOBALNOTIFICATIONS_MODULE: string = 'globalNotifications-module';
  public static readonly SHIPMENTS_MODULE: string = 'shipments-module';
  public static readonly STOCKS_MODULE: string = 'stocks-module';
  public static readonly VENDORCODE_RIGHTS_MODULE: string = 'vendorcodes-rights-module';

  //#endregion Keys
  //----------Load/Save Fields Visibility Start

  //TODO Merge Into Commit.model.ts
  public static readonly commitFilterDates: CommitProperty[] = [
    { id: 'sapDeliveryDate', name: 'Final ETA Date', type: 'date' }, // Changed as per skype request
    { id: 'etaDate', name: 'ETA Date', type: 'date' },
    { id: 'deliveryDate', name: 'Delivery Date', type: 'date' },
    { id: 'etdDate', name: 'ETD Date', type: 'date' },
    { id: 'slotDate', name: 'Slot Date', type: 'date' },
    { id: 'requestDate', name: 'Request Date', type: 'date' },
    { id: 'triggerDate', name: 'Trigger Date', type: 'date' },
    { id: 'recomitRequestDate', name: 'Recomit Request Date', type: 'date' },
    { id: 'eddDate', name: 'EDD Date', type: 'date' },
    // { id: "currentAGEDDate", name: "Current AGED Date", type: "date" }, //Removed as per skype request
    { id: 'instructionEtaDate', name: 'Instruction ETA Date', type: 'date' },
    { id: 'otmReceivedDate', name: 'Otm Received Date', type: 'date' },
    { id: 'actualETADate', name: 'Actual ETA Date', type: 'date' },
    { id: 'receiveDate', name: 'Receipt Date', type: 'date' },
    { id: 'plannedOrderStatus', name: 'Open Orders Date', type: 'date' }
  ];

  public static getCommitFilterDates(defaultFields: any) {
    if (defaultFields) {
      const dateFields = this.commitFilterDates.filter((obj) =>
        defaultFields.includes(obj.id)
      );
      return dateFields;
    }
    return [];
  }

  /**
   * @param settings set saved settings from server
   * @param type set field type
   * @param customFields set use custom fields
   */
  public static async getFieldsVisibility(fieldsData: GetFieldsVisibility, commitModuleRights?: CommitsModuleRights) {
    let columns: any[] = [];

    let columnAlreadySaved = false;
    try {
      //set default model
      //load settings from server

      //TODO GET DEFAULT LIST
      if (fieldsData.defaultFields) {

        fieldsData.store ? fieldsData.store.dispatch(new GetDefaultFieldsSuccess(fieldsData.defaultFields)) : undefined;
        if (fieldsData.defaultFields && fieldsData.baseModule == Helper.COMMIT_MODULE && fieldsData.type == EnumCommitFieldStructure.CommitForm) {
          for (let i = 0; i < fieldsData.defaultFields.length; i++) {
            if (fieldsData.defaultFields[i] == 'vendorcode') {
              fieldsData.defaultFields[i] = 'chooseVendor';
            } else if (fieldsData.defaultFields[i] == 'purchaseordernumber') {
              fieldsData.defaultFields[i] = 'poNumber';
            }
          }
          if (commitModuleRights == undefined || commitModuleRights && commitModuleRights.lockCommit)
            fieldsData.defaultFields.push('withMerge'); //2571 comment
          //ADD more customization to commit form
        }
      }
      columns = this.setDefaultColumns(fieldsData.defaultFields, columns, fieldsData.type, fieldsData.baseModule);

      let settings: any[] = [];
      if (fieldsData.key && fieldsData.key != null) {
        settings = await fieldsData.service
          .getUserSettings(fieldsData.key)
          .toPromise()
          .catch((error) => {
            //TODO - temporary solution remove after few days
            if (error && error.status == 404) {
              const fieldVisibilitySettings: FieldVisibilitySetting[] = [];
              for (let i = 0; i < columns.length; i++) {
                const setting = {
                  field: columns[i].field,
                  visible: columns[i].visible,
                  index: i,
                };
                fieldVisibilitySettings.push(setting);
              }
              fieldsData.store ? fieldsData.store.dispatch(new AddUserSettings({ key: fieldsData.key, data: "[]" })) : undefined;
              columnAlreadySaved = true;
            } else {
              settings = [];
            }
          });
      }
      if ((fieldsData.baseModule == this.COMMIT_MODULE ? fieldsData.type !== EnumCommitFieldStructure.CommitTable : true) || (commitModuleRights && commitModuleRights.selectFields)) {
        const formatColumn = this.formatColumns(
          settings,
          columns,
          columnAlreadySaved,
          fieldsData.type,
          fieldsData.defaultFields,
          fieldsData.baseModule
        );
        columns = formatColumn.columns;
        columnAlreadySaved = formatColumn.columnAlreadySaved;
      }
    } catch (error) {
      //something has error go with default settings
      console.error(error);
      //columns = Helper.setDefaultColumns(null, columns, fieldsData.type, fieldsData.baseModule);
    }

    return { columns, columnAlreadySaved };
  }

  public static formatColumns(settings: any, columns: any[], columnAlreadySaved: boolean,
    type: EnumCommitFieldStructure | EnumGoodsReceiptsFieldStructure | EnumInvoicingFieldStructure | EnumQuotationsFieldStructure | EnumVendorsFieldStructure | EnumCarriersFieldStructure | EnumPartNumbersFieldStructure | EnumPortfolioFieldStructure,
    defaultFields: any, baseModule?: string,
  ): any {
    columns = [...columns];
    if (settings && settings.key) {
      settings = plainToClass(UserSettingsCls, settings);
      columnAlreadySaved = true;
      let data = plainToInstance(
        FieldVisibilitySetting,
        JSON.parse(settings.data) as FieldVisibilitySetting[]
      );
      let selectedList = [];
      // data Mapping For Model
      if (data) {
        if (
          type == EnumCommitFieldStructure.CommitTable ||
          type == EnumGoodsReceiptsFieldStructure.GoodsReceiptsTable ||
          type == EnumInvoicingFieldStructure.InvoicingTable ||
          type == EnumQuotationsFieldStructure.QuotationsTable ||
          type == EnumVendorsFieldStructure.VendorTable ||
          type == EnumCarriersFieldStructure.CarriersTable ||
          type == EnumPartNumbersFieldStructure.PartNumberTable ||
          type == EnumPortfolioFieldStructure.PortfolioTable
        ) {

          for (let i = 0; i < columns.length; i++) {
            const temp = data.find((d) => d.field == columns[i].field);
            if (temp) {
              columns[i].visible = temp.visible;
              columns[i].index = temp.index;
            }
          }

          columns = Helper.setColumnOrder(columns);
        } else if (type == EnumCommitFieldStructure.CommitForm || type == EnumQuotationsFieldStructure.QuotationCreateForm || type == EnumVendorsFieldStructure.VendorCreateForm || type == EnumCarriersFieldStructure.CarriersCreateForm || type == EnumQuotationsFieldStructure.QVEditForm || type == EnumPortfolioFieldStructure.PortfolioCreateForm) {
          for (let i = 0; i < columns.length; i++) {
            const temp = data.find((d) => d.field == columns[i].field);
            if (temp) {
              columns[i].visible = temp.visible;
              columns[i].index = temp.index;
            }
          }
          columns = Helper.setColumnOrder(columns);
        } else {
          //Fix for old style of data saved as an array of just column names broken batch edit
          if (!data[0].field) {
            data = data.map((field, index) => {
              return { field: field, visible: true, index: index } as unknown as FieldVisibilitySetting;
            });
          }


          for (let i = 0; i < columns.length; i++) {

            const temp = data.find((d) => d.field?.toLowerCase() == columns[i].id.toLowerCase());
            if (temp && temp.visible) {
              selectedList.push(columns[i]);
            }
          }

          if (type === EnumCommitFieldStructure.BulkEditForm) {
            /* specific remove for bulk fields*/
            const bulkRemoveList = ["partnumber", "purchaseorderline", "purchaseordernumber", "vendorcode", "responsibleemail"];
            selectedList = selectedList.filter((val) => !bulkRemoveList.includes(val.id.toLowerCase()));

          }


          if (type === EnumPortfolioFieldStructure.BulkEditForm) {
            /* specific remove for bulk fields*/
            const bulkRemoveList = ["partnumber", "vendorcode", "firstname", "lastname", "validfrom", "validto"];
            selectedList = selectedList.filter((val) => !bulkRemoveList.includes(val.id.toLowerCase()));
          }

          // //Add Required Fields
          // const requiredFields = [
          //   //{ id: "PartNumber", name: "PartNumber", type: "string" },
          //   //{ id: "VendorCode", name: "VendorCode", type: "string" },
          //   { id: 'quantity', name: 'Delivery Qty', type: 'number' },
          //   //{ id: "PurchaseOrderNumber", name: "PurchaseOrderNumber", type: "string" },
          //   //{ id: "PurchaseOrderLine", name: "PurchaseOrderLine", type: "string" },
          //   // { id: 'ETADate', name: 'ETADate', type: 'date' }
          // ];

          // selectedList = (type !== EnumPortfolioFieldStructure.BulkEditForm ? [...requiredFields, ...selectedList] : selectedList);

          selectedList = this.removeDuplicateObjects(selectedList, 'name');
          //sorting Fields
          selectedList = Helper.setColumnOrderByAlpha(selectedList);
          columns = selectedList;
        }
      } else {
        columns = Helper.setDefaultColumns(defaultFields, columns, type, baseModule);
      }
    }
    else { // when the user doesn't have a user settings

      const actionsColumnId = 'actions';

      // First, filter columns based on defaultFields case-insensitively
      const filteredColumns = columns
        .map((col, index) => {
          if (defaultFields.some((field:string) => field.toLowerCase() === col.field.toLowerCase())) {
            return { ...col, index };
          }
          return null;
        })
        .filter(col => col !== null); // Remove any nulls from non-matching fields

      // Find the Actions column in the original columns array
      const actionsColumn = columns.find(
        col => col.field.toLowerCase() === actionsColumnId
      );

      // If the Actions column exists, add it to the beginning of filteredColumns
      if (actionsColumn) {
        filteredColumns.unshift({ ...actionsColumn, index: columns.indexOf(actionsColumn) });
      }
      columns = filteredColumns;
    }

    return { columns, columnAlreadySaved };
  }

  private static removeDuplicateObjects(array:any, property : string) {
    array = [...array];
    const uniqueIds:any[] = [];

    const unique = array.filter((element:any) => {
      const isDuplicate = uniqueIds.includes(element[property]);

      if (!isDuplicate) {
        uniqueIds.push(element[property]);

        return true;
      }

      return false;
    });

    return unique;
  }


  public static getVisibleColumns(columns: any[]) {
    columns = [...columns];
    const visibleColumns = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].visible === true) {
        visibleColumns.push(columns[i].field);
      }
    }

    return visibleColumns;
  }

  private static setDefaultColumns(
    customFields: any[],
    columns: any,
    type: EnumCommitFieldStructure | EnumGoodsReceiptsFieldStructure | EnumInvoicingFieldStructure | EnumQuotationsFieldStructure | EnumVendorsFieldStructure | EnumCarriersFieldStructure | EnumPartNumbersFieldStructure | EnumPortfolioFieldStructure | EnumShipmentFieldStructure,
    baseModule?: string,
  ) {
    columns = [...columns];
    if (baseModule == Helper.COMMIT_MODULE) {
      switch (type) {
        case EnumCommitFieldStructure.CommitTable:
          // columns = [...this.columnsSettings]; @deprecated
          columns = new CommonCommitFields(EnumCommitFieldStructure.CommitTable, customFields).fields;
          break;
        case EnumCommitFieldStructure.CommitForm:
          // columns = [...this.fieldsSettings];
          columns = new CommonCommitFields(EnumCommitFieldStructure.CommitForm, customFields).fields;
          break;
        case EnumCommitFieldStructure.BulkEditForm:
          // columns = [...this.bulkEditFieldsSettings];
          columns = new CommonCommitFields(EnumCommitFieldStructure.BulkEditForm, customFields)
            .fields;
          break;
      }
    }
    else if (baseModule == Helper.GOODRECEIPTS_MODULE) {
      switch (type) {
        case EnumGoodsReceiptsFieldStructure.GoodsReceiptsTable:
          columns = new GoodsReceiptsList(EnumGoodsReceiptsFieldStructure.GoodsReceiptsTable, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.INVOICING_MODULE) {
      switch (type) {
        case EnumInvoicingFieldStructure.InvoicingTable:
          columns = new InvoicingList(EnumInvoicingFieldStructure.InvoicingTable, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.QUOTATIONS_MODULE) {
      switch (type) {
        case EnumQuotationsFieldStructure.QuotationsTable:
          columns = new QuotationsListField(EnumQuotationsFieldStructure.QuotationsTable, customFields).fields;
          break;
        case EnumQuotationsFieldStructure.QuotationCreateForm:
          columns = new QuotationsListField(EnumQuotationsFieldStructure.QuotationCreateForm, customFields).fields;
          break;
        case EnumQuotationsFieldStructure.QVEditForm:
          columns = new QuotationsListField(EnumQuotationsFieldStructure.QVEditForm, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.VENDORS_MODULE) {
      switch (type) {
        case EnumVendorsFieldStructure.VendorTable:
          columns = new VendorsListField(EnumVendorsFieldStructure.VendorTable, customFields).fields;
          break;
        case EnumVendorsFieldStructure.VendorCreateForm:
          columns = new VendorsListField(EnumVendorsFieldStructure.VendorCreateForm, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.CARRIERS_MODULE) {
      switch (type) {
        case EnumCarriersFieldStructure.CarriersTable:
          columns = new CarriersListField(EnumCarriersFieldStructure.CarriersTable, customFields).fields;
          break;
        case EnumCarriersFieldStructure.CarriersCreateForm:
          columns = new CarriersListField(EnumCarriersFieldStructure.CarriersCreateForm, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.PARTNUMBERS_MODULE) {
      switch (type) {
        case EnumPartNumbersFieldStructure.PartNumberTable:
          columns = new PartNumbersListField(EnumPartNumbersFieldStructure.PartNumberTable, customFields).fields;
          break;
        case EnumPartNumbersFieldStructure.PartNumberCreateForm:
          columns = new PartNumbersListField(EnumPartNumbersFieldStructure.PartNumberCreateForm, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.PORTFOLIO_MODULE) {
      switch (type) {
        case EnumPortfolioFieldStructure.PortfolioTable:
          columns = new PortfolioListField(EnumPortfolioFieldStructure.PortfolioTable, customFields).fields;
          break;
        case EnumPortfolioFieldStructure.PortfolioCreateForm:
          columns = new PortfolioListField(EnumPortfolioFieldStructure.PortfolioCreateForm, customFields).fields;
          break;
        case EnumPortfolioFieldStructure.BulkEditForm:
          columns = new PortfolioListField(EnumPortfolioFieldStructure.BulkEditForm, customFields).fields;
          break;
      }
    }
    else if (baseModule == Helper.SHIPMENTS_MODULE) {
      switch (type) {
        case EnumShipmentFieldStructure.ShipmentTable:
          columns = new ShipmentListField(EnumShipmentFieldStructure.ShipmentTable, customFields).fields;
          break;
        case EnumShipmentFieldStructure.ShipmentCreateForm:
          columns = new ShipmentListField(EnumShipmentFieldStructure.ShipmentCreateForm, customFields).fields;
          break;
      }
    }
    return columns;
  }
  /**
   *  set table/column view order
   */
  public static setColumnOrder(columns : any[]) {
    columns = [...columns];
    return columns.sort((a, b) => (a.index < b.index ? -1 : a.index > b.index ? 1 : 0));
  }
  private static setColumnOrderByAlpha(columns : any[]) {
    columns = [...columns];
    return columns.sort(function (a, b) {
      const textA = a.name.toLowerCase();
      const textB = b.name.toLowerCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }
  public static setOrderByAlpha(key: string, columns : any[]) {
    columns = [...columns];
    return columns.sort(function (a, b) {
      const textA = a[key].toLowerCase();
      const textB = b[key].toLowerCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  public static setCheckColumn(columns: any[]) {
    columns = [...columns];
    if (columns.find((column) => column.field === 'isChecked')) {
      return columns;
    }
    const check = {
      field: 'isChecked',
      headerText: '',
      type: 'checkbox',
      visible: true,
    };
    columns.unshift(check);
    this.setIndexFieldToArray(columns);
    return columns;
  }
  public static setIndexFieldToArray(array:any) {
    array = [...array];
    for (const index in array) {
      array[index] = { ...array[index], index };
    }
    return array;
  }
  public static removeCheckColumn(columns:any) {
    columns = [...columns];
    if (columns) {
      const index = columns.findIndex((column:any) => column.field == 'isChecked');
      if (index > -1) {
        columns.splice(index, 1);
      }
    }
    return columns;
  }
  public static saveFieldsVisibility(
fieldDetails : SaveFieldsVisibility
  ) {
    console.log(fieldDetails.key);
    const fieldVisibilitySettings: FieldVisibilitySetting[] = [];
    if (
      fieldDetails.type == EnumCommitFieldStructure.CommitTable ||
      fieldDetails.type == EnumGoodsReceiptsFieldStructure.GoodsReceiptsTable ||
      fieldDetails.type == EnumInvoicingFieldStructure.InvoicingTable ||
      fieldDetails.type == EnumQuotationsFieldStructure.QuotationsTable ||
      fieldDetails.type == EnumVendorsFieldStructure.VendorTable ||
      fieldDetails.type == EnumCarriersFieldStructure.CarriersTable ||
      fieldDetails.type == EnumPortfolioFieldStructure.PortfolioTable ||
      fieldDetails.type == EnumPartNumbersFieldStructure.PartNumberTable ||
      fieldDetails.type == EnumShipmentFieldStructure.ShipmentTable
    ) {
      for (let i = 0; i < fieldDetails.columns.length; i++) {
        const setting = {
          field: fieldDetails.columns[i].field,
          visible: fieldDetails.columns[i].visible,
          index: i,
        };
        fieldVisibilitySettings.push(setting);
      }
    } else if (fieldDetails.type == EnumCommitFieldStructure.CommitForm || fieldDetails.type == EnumQuotationsFieldStructure.QuotationCreateForm || fieldDetails.type == EnumVendorsFieldStructure.VendorCreateForm || fieldDetails.type == EnumCarriersFieldStructure.CarriersCreateForm || fieldDetails.type == EnumPortfolioFieldStructure.PortfolioCreateForm || fieldDetails.type == EnumQuotationsFieldStructure.QVEditForm || fieldDetails.type == EnumShipmentFieldStructure.ShipmentCreateForm) {
      for (let i = 0; i < fieldDetails.columns.length; i++) {
        const setting = {
          field: fieldDetails.columns[i].field,
          visible: fieldDetails.columns[i].visible,
          index: i,
        };
        fieldVisibilitySettings.push(setting);
      }
    } else {
      const columnsKeys = Object.keys(fieldDetails.columns);
      for (let i = 0; i < columnsKeys.length; i++) {
        const setting = {
          field: columnsKeys[i],
          visible: fieldDetails.columns[columnsKeys[i]] ? fieldDetails.columns[columnsKeys[i]].visible : false,
        };
        fieldVisibilitySettings.push(setting);
      }
    }

    const settings = {
      key: fieldDetails.key,
      data: JSON.stringify(fieldVisibilitySettings),
    };
    if (!fieldDetails.columnAlreadySaved) {
      fieldDetails.store.dispatch(new AddUserSettings(settings));
    } else {
      fieldDetails.store.dispatch(new EditUserSettings(settings));
    }
  }

  public static deleteFieldsVisibility(store : Store, key : string) {
    store.dispatch(new DeleteUserSettings(key));
  }

  //----------Load/Save Fields Visibility End

  //----------Invalid/Hidden Data Sample Start
  public static readonly invalidDates: string[] = ['1/1/1990', '1/1/1900', '1/1/2001', '1/1/0001'];
  public static readonly invalidInvoiceNo: string[] = ['NULL INVOICE'];

  //----------Invalid/Hidden Data Sample End

  /**
   * @param url
   * @param event
   * @param router
   */
  public static openInNewTab(url: string, router: Router) {
    const serializedUrl = router.serializeUrl(router.createUrlTree([url]));
    window.open(serializedUrl, '_blank');
  }

  public static getUrlPaths() {
    const parsedUrl = new URL(window.location.href);
    const path = parsedUrl.pathname + parsedUrl.search;
    return path;
  }

  public static keyValueToUrlParam(keyValue: any[]) {
    let queryParams = '?';
    for (let i = 0; i < keyValue.length; i++) {
      queryParams = `${queryParams}`;
    }
  }

  /**
   *
   * @param objectToCopy
   * @returns gives object deepCopy
   */
  public static createCopy(objectToCopy: any): any {
    return JSON.parse(JSON.stringify(objectToCopy));
  }

  // do not use this method for larger arrays
  public static compareArrayObjects(arrObj1: any[], arrObj2: any[], ignoreKeys?: any[]): boolean {
    if ((!arrObj1 && arrObj2) || (arrObj1 && !arrObj2)) {
      return false;
    }
    if (!arrObj1 && !arrObj2) {
      return true;
    }
    if (arrObj1.length != arrObj2.length) {
      return false;
    }

    arrObj1 = this.createCopy(arrObj1);
    arrObj2 = this.createCopy(arrObj2);

    for (let i = 0; i < arrObj1.length; i++) {
      if (ignoreKeys) {
        for (let j = 0; j < ignoreKeys.length; j++) {
          delete arrObj1[i][ignoreKeys[j]];
          delete arrObj2[i][ignoreKeys[j]];
        }
      }
      const index = arrObj2.findIndex((element) => this.compareObjects(element, arrObj1[i]));
      if (index == -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param Objects
   * @returns compares objects based on keys and values
   */
  public static compareObjects(obj1 : any, obj2 : any) {
    if ((!obj1 && obj2) || (obj1 && !obj2)) {
      return false;
    }

    if (!obj1 && !obj2) {
      return true;
    }

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length != obj2Keys.length || !this.compareArray(obj1Keys, obj2Keys)) {
      return false;
    }

    for (let i = 0; i < obj1Keys.length; i++) {
      if (obj1[obj1Keys[i]] != obj2[obj1Keys[i]]) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param data
   * @param nullCheck default true
   * @returns remove duplicate data
   */
  public static removeDuplicate(data: string[], nullCheck = true): string[] {
    return Array.from(new Set(nullCheck ? data.filter((e) => e) : data));
  }

  /**
   * do not use for large arrays
   * @param compareArray
   * @returns array has same elements or not
   */
  public static compareArray(array1: string[] | number[], array2: string[] | number[]): boolean {
    let result = true;

    if (!(array1 && array2)) {
      return array1 == array2 ? true : false;
    }

    if (array1.length != array2.length || typeof array1 != typeof array2) {
      result = false;
      return result;
    }
    for (let i = 0; i < array1.length; i++) {
      const index = array2.findIndex((element) => element == array1[i]);
      if (index == -1) {
        result = false;
        break;
      }
    }
    return result;
  }
  /**
   * do not use for large arrays
   * @param array1
   * @param array2
   * @returns true if any elements match
   */
  public static checkIfArrayElementMatch(
    array1: string[] | number[],
    array2: string[] | number[]
  ): boolean {
    const array: any[] = [...array1, ...array2];
    const cleanarray: any[] = array.filter((e): e is Exclude<typeof e, null> => e !== null)
    return this.removeDuplicate(cleanarray).length != cleanarray.length;
  }

  //#region Error Handling

  /**
   *
   * @param error
   * @returns prints deep error info
   */
  public static printError(error: any, title?: string): any {
    console.warn('**********Attention**************');
    title ? console.warn(`***********${title}***********`) : null;
    error ? console.error(error) : null;
  }

  //#endregion Error Handling

  public static securityLevelData = [
    { id: 0, label: 'mmViews.protected' },
    { id: 1, label: 'mmViews.internal' },
    { id: 2, label: 'mmViews.customer' },
    { id: 3, label: 'mmViews.supplier' },
    { id: 4, label: 'Orion_SCM_Analyst' },
    { id: 5, label: 'Orion_SCM_Buyer' },
    { id: 6, label: 'Orion_SCM_Supplier_Commit' },
    { id: 7, label: 'Orion_SCM_Supplier_No_Commit' },
    { id: 8, label: 'Orion_SCM_Supplier_ROP' },
    { id: 9, label: 'Orion_SCM_Customer' },
    { id: 10, label: 'Orion_SCM_ReadOnly' },
    { id: 11, label: 'Orion_Logistics_Logistic' },
    { id: 12, label: 'Orion_SCM_Engineering' },
    { id: 13, label: 'Orion_SCM_Customer_Commit' },
    { id: 14, label: 'Orion_SCM_Sourcing' },
    //{ id: 15, label: 'Orion_Administrator' },
    { id: 16, label: 'Orion_SCM_Master_Buyer' },
  ];

  public static getUserRightByRole(role: string) {
    let userRights: UserRights | undefined = undefined;
    switch (role) {
      case 'Orion_SCM_Analyst':
        const supplyVisibilityAnalystRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          commitsLayout: true,
          dummyCommits: true,
          forecastView: true,
          graphsView: true,
          graphsEdit: true,
          manageCommits: true,
          massChanges: true,
          manageDummyCommits: true,
          masterDataView: true,
          notesEdit: true,
          notesView: true,
          reviewFlags: true,
          reviewFlagsEdit: true,
          reviewFlagsForBuyer: true,
          reviewFlagsForBuyerEdit: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForSupplierEdit: true,
          reviewFlagsForCustomer: true,
          reviewFlagsForCustomerEdit: true,
          cancelCommits: true,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeAnalystRightList: string[] = [
          'sapDeliveryDate',
          'etaDate',
          'deliveryDate',
          'etdDate',
          'slotDate',
          'requestDate',
          'triggerDate',
          'recomitRequestDate',
          'eddDate',
          'instructionEtaDate',
          'otmReceivedDate',
          'actualETADate',
          'receiveDate',
          'plannedOrderStatus'
        ];
        /*Status visibility*/
        const statusAnalystRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleAnalystRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          layoutChanges: true,
          massChanges: true,
          searchCommits: true,
          cancelCommits: true,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          lockCommit: true,
          remergeCommits: true,
          deletePLO: true,
          selectFields: true,
          defaultFieldsSetup: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsAnalystRights: DashboardsRights = {
          sharedDashboards: true,
        };

        const vendorListAnalystRights: VendorListRights = {
          notificationsSetupView: true,
          notificationsSetupEdit: true,
          flagEdit: true,
          vendorCreate: true,
          vendorView: true,
          vendorEdit: true,
          vendorDelete: true,
          partNumbersView: true,
          partNumbersEdit: true,
          partNumbersDelete: true,
          buyersView: true,
          buyersManage: true,
        }

        const configurationAnalystRights: ConfigurationRights = {
          virtualGroupsChange: true,
          virtualGroupsView: true,
          vendorCodesView: true,
          vendorCodesChange: true,
          materialManagementViewsView: true,
          reviewVisibility: true,
          searchConfiguration: true,
          qapSettings: true,
          portfolioDelete: true,
        }

        const finantialModuleAnalystRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: true
        };
        const dateTypeAnalystRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
          etaDate: true,
          deliveryDate: true,
          etdDate: true,
          slotDate: true,
          requestDate: true,
          triggerDate: true,
          recomitRequestDate: true,
          eddDate: true,
          instructionEtaDate: true,
          otmReceivedDate: true,
          actualETADate: true,
          receiveDate: true /*GR Date*/,
          plannedOrderStatus: true
        };


        /*Menu visibility*/
        const menuAccessAnalystRightList: string[] = [
          'Commits', 'PN Groups', 'Vendor Codes Rights', 'My Portfolio', 'Vendors', 'Carriers',
          'Contacts', 'PartNumbers', 'QAP', 'RFQ', 'Portfolio', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Shipments', 'Audit Log', 'Default Fields'];

        /*Widget visibility*/
        const widgetAccessAnalystRightList: string[] =
          ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'mypnlist',
            'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];


        userRights = {
          supplyVisibilityRights: supplyVisibilityAnalystRights,
          commitsModuleRights: commitsModuleAnalystRights,
          dashboardRights: dashboardsAnalystRights,
          vendorListRights: vendorListAnalystRights,
          configurationRights: configurationAnalystRights,
          finantialModuleRights: finantialModuleAnalystRights,
          dateTypeRights: dateTypeAnalystRights,
          dateTypeRightList: dateTypeAnalystRightList,
          menuAccessRightList: menuAccessAnalystRightList,
          widgetAccessRightList: widgetAccessAnalystRightList,
          statusRightList: statusAnalystRightList
        };

        break;

      case 'Orion_Administrator':
        const supplyVisibilityAdministratorRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          commitsLayout: true,
          dummyCommits: true,
          forecastView: true,
          graphsView: true,
          graphsEdit: true,
          manageCommits: true,
          massChanges: true,
          manageDummyCommits: true,
          masterDataView: true,
          notesEdit: true,
          notesView: true,
          reviewFlags: true,
          reviewFlagsEdit: true,
          reviewFlagsForBuyer: true,
          reviewFlagsForBuyerEdit: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForSupplierEdit: true,
          reviewFlagsForCustomer: true,
          reviewFlagsForCustomerEdit: true,
          cancelCommits: true,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeAdministratorRightList: string[] = [
          'sapDeliveryDate',
          'etaDate',
          'deliveryDate',
          'etdDate',
          'slotDate',
          'requestDate',
          'triggerDate',
          'recomitRequestDate',
          'eddDate',
          'instructionEtaDate',
          'otmReceivedDate',
          'actualETADate',
          'receiveDate',
          'plannedOrderStatus'
        ];
        /*Status visibility*/
        const statusAdministratorRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleAdministratorRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          layoutChanges: true,
          massChanges: true,
          searchCommits: true,
          cancelCommits: true,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          lockCommit: true,
          remergeCommits: true,
          deletePLO: true,
          selectFields: true,
          defaultFieldsSetup: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsAdministratorRights: DashboardsRights = {
          sharedDashboards: true,
        };

        const vendorListAdministratorRights: VendorListRights = {
          notificationsSetupView: true,
          notificationsSetupEdit: true,
          flagEdit: true,
          vendorCreate: true,
          vendorView: true,
          vendorEdit: true,
          vendorDelete: true,
          partNumbersView: true,
          partNumbersEdit: true,
          partNumbersDelete: true,
          buyersView: true,
          buyersManage: true,
        }

        const configurationAdministratorRights: ConfigurationRights = {
          virtualGroupsChange: true,
          virtualGroupsView: true,
          vendorCodesView: true,
          vendorCodesChange: true,
          materialManagementViewsView: true,
          reviewVisibility: true,
          searchConfiguration: true,
          qapSettings: true,
          portfolioDelete: true,
        }

        const finantialModuleAdministratorRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: true
        };
        const dateTypeAdministratorRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
          etaDate: true,
          deliveryDate: true,
          etdDate: true,
          slotDate: true,
          requestDate: true,
          triggerDate: true,
          recomitRequestDate: true,
          eddDate: true,
          instructionEtaDate: true,
          otmReceivedDate: true,
          actualETADate: true,
          receiveDate: true /*GR Date*/,
          plannedOrderStatus: true
        };

        const carriersModuleAdministratorRights: CarriersModuleRights = {
          carriersView: true,
          carriersEdit: true,
          carriersDelete: true,
          carriersCreate: true,
          carriersContactsCreate: true,
          carriersContactsDelete: true,
          carriersTransportsCreate: true,
          carriersTransportsDelete: true,
          carriersNotificationsCreate: true,
          carriersNotificationsDelete: true,
        };

        /*Menu visibility*/
        const menuAccessAdministratorRightList: string[] = [
          'Commits', 'PN Groups', 'Vendor Codes Rights', 'My Portfolio', 'Vendors', 'Carriers',
          'Contacts', 'PartNumbers', 'QAP', 'RFQ', 'Portfolio', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Shipments', 'Audit Log', 'Default Fields'];

        /*Widget visibility*/
        const widgetAccessAdministratorRightList: string[] =
          ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'mypnlist',
            'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList', 'aiLink'];


        userRights = {
          supplyVisibilityRights: supplyVisibilityAdministratorRights,
          commitsModuleRights: commitsModuleAdministratorRights,
          dashboardRights: dashboardsAdministratorRights,
          vendorListRights: vendorListAdministratorRights,
          configurationRights: configurationAdministratorRights,
          finantialModuleRights: finantialModuleAdministratorRights,
          dateTypeRights: dateTypeAdministratorRights,
          dateTypeRightList: dateTypeAdministratorRightList,
          menuAccessRightList: menuAccessAdministratorRightList,
          widgetAccessRightList: widgetAccessAdministratorRightList,
          statusRightList: statusAdministratorRightList,
          carriersModuleRights: carriersModuleAdministratorRights
        };

        break;

      case 'Orion_SCM_Buyer':
        const supplyVisibilityBuyerRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          commitsLayout: true,
          dummyCommits: true,
          forecastView: true,
          graphsView: true,
          manageCommits: true,
          massChanges: true,
          manageDummyCommits: true,
          masterDataView: true,
          notesEdit: true,
          notesView: true,
          reviewFlags: true,
          reviewFlagsEdit: true,
          reviewFlagsForBuyer: true,
          reviewFlagsForBuyerEdit: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForCustomer: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeBuyerRightList: string[] = [
          'sapDeliveryDate',
          'etdDate',
          'receiveDate', //grdate
          'triggerDate',
          'plannedOrderStatus'
        ];

        /*Status visibility*/
        const statusBuyerRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleBuyerRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          layoutChanges: true,
          massChanges: true,
          searchCommits: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          lockCommit: true,
          remergeCommits: true,
          deletePLO: true,
          selectFields: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsBuyerRights: DashboardsRights = {
          //sharedDashboards : false,
        };

        const vendorListBuyerRights: VendorListRights = {
          notificationsSetupView: true,
          //notificationsSetupEdit : false,
          flagEdit: true,
          vendorCreate: true,
          vendorView: true,
          vendorEdit: true,
          vendorDelete: true,
          partNumbersView: true,
          partNumbersEdit: true,
          partNumbersDelete: true,
          buyersView: true,
          buyersManage: true,
        }

        const configurationBuyerRights: ConfigurationRights = {
          virtualGroupsView: true,
          virtualGroupsChange: true,
          vendorCodesView: true,
          reviewVisibilityForBuyer: true,
          searchConfiguration: true
          //vendorCodesChange: false,
          //materialManagementViewsView : false,
        }

        const finantialModuleBuyerRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: true
        };

        const dateTypeBuyerRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
          etdDate: true,
          receiveDate: true, /*GR Date*/
          triggerDate: true,
          plannedOrderStatus: true
        };

        /*Menu visibility*/
        const menuAccessBuyerRightList: string[] = [
          'Commits', 'PN Groups', 'Vendor Codes Rights', 'My Portfolio', 'Vendors', 'Carriers',
          'Contacts', 'PartNumbers', 'QAP', 'RFQ', 'Portfolio', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'];

        /*Widget visibility*/
        const widgetAccessBuyerRightList: string[] =
          ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'mypnlist',
            'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilityBuyerRights,
          commitsModuleRights: commitsModuleBuyerRights,
          dashboardRights: dashboardsBuyerRights,
          vendorListRights: vendorListBuyerRights,
          configurationRights: configurationBuyerRights,
          finantialModuleRights: finantialModuleBuyerRights,
          dateTypeRights: dateTypeBuyerRights,
          dateTypeRightList: dateTypeBuyerRightList,
          menuAccessRightList: menuAccessBuyerRightList,
          widgetAccessRightList: widgetAccessBuyerRightList,
          statusRightList: statusBuyerRightList
        };

        break;

      case 'Orion_SCM_Supplier_Commit':
        const supplyVisibilitySupplierRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          //commitsLayout: false,
          dummyCommits: true,
          forecastView: true,
          //graphsView: false,
          manageCommits: true,
          massChanges: true,
          manageDummyCommits: true,
          //masterDataView: false,
          //notesEdit: false,
          //notesView: false,
          //reviewFlags: false,
          reviewFlags: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForSupplierEdit: true,
          splitCommits: true,
          mergeCommits: true,
          //cancelCommits: false,
          deleteCommits: true,
          manageSimulationSets: true,
          //selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeSupplierRightList: string[] = [
          'sapDeliveryDate'
        ];

        /*Status visibility*/
        const statusSupplierRightList: string[] = [
          'Delivered',
          'Waiting',
        ];

        const commitsModuleSupplierRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          //layoutChanges: false,
          massChanges: true,
          searchCommits: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          //deletePLO: false,
          //remergeCommits: false,
          //selectFields: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsSupplierRights: DashboardsRights = {
          //dashboardEdit : false,
          dashboardView: true,
          //sharedDashboards : false,
        };

        const vendorListSupplierRights: VendorListRights = {
          /*notificationsSetupView : false,
          notificationsSetupEdit : false,
          flagEdit : false,
          vendorCreate: false,
          vendorView: false,
          vendorEdit: false,
          vendorDelete: false,
          partNumbersView: false,
          partNumbersEdit: false,
          partNumbersDelete: false,
          buyersView: false,
          buyersManage: false,*/
        }

        const configurationSupplierRights: ConfigurationRights = {
          reviewVisibilityForSupplier: true
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleSupplierRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          /*quotations: false*/
        };

        const dateTypeSupplierRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };

        /*Menu visibility*/
        const menuAccessSupplierRightList: string[] = [
          'Commits',
          'Invoicing',
          'Goods Receipts', 'Invoice Reconciliation'
        ];

        /*Widget visibility*/
        const widgetAccessSupplierRightList: string[] =
          ['statusMonitor', 'qapLink',
            'searchV2', 'waterfall', 'commitList', 'commitsLink', 'mypnlist',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilitySupplierRights,
          commitsModuleRights: commitsModuleSupplierRights,
          dashboardRights: dashboardsSupplierRights,
          vendorListRights: vendorListSupplierRights,
          configurationRights: configurationSupplierRights,
          finantialModuleRights: finantialModuleSupplierRights,
          dateTypeRights: dateTypeSupplierRights,
          dateTypeRightList: dateTypeSupplierRightList,
          menuAccessRightList: menuAccessSupplierRightList,
          widgetAccessRightList: widgetAccessSupplierRightList,
          statusRightList: statusSupplierRightList
        };

        break;
      case 'Orion_SCM_ReadOnly':
      case 'Orion_SCM_Supplier_No_Commit':
      case 'Orion_SCM_Supplier_ROP':
        const supplyVisibilitySupplierROPRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          //commitsLayout: false,
          dummyCommits: true,
          forecastView: true,
          //graphsView: false,
          //manageCommits: false,
          //manageDummyCommits: false,
          //masterDataView: false,
          //notesEdit: false,
          //notesView: false,
          reviewFlags: true,
          //cancelCommits: false,
          //deleteCommits: false,
          splitCommits: true,
          mergeCommits: true,
          //manageSimulationSets: true,
          //selectCommitFields: false,
        };

        /*Dates types visibility*/
        const dateTypeSupplierROPRightList: string[] = [
          'receiveDate',
          'plannedOrderStatus'
        ];

        /*Status visibility*/
        const statusSupplierROPRightList: string[] = [
          'Delivered',
          'New',
          'Waiting',
        ];

        const commitsModuleSupplierROPRights: CommitsModuleRights = {
          //createCommits: false,
          editCommits: true,
          downloadExcel: true,
          //layoutChanges: false,
          massChanges: true,
          searchCommits: true,
          //cancelCommits: false,
          //deleteCommits: false,
          //deletePLO: false,
          splitCommits: true,
          mergeCommits: true,
          //remergeCommits: false,
          //selectFields: false,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsSupplierROPRights: DashboardsRights = {
          //dashboardEdit : false,
          dashboardView: true,
          //sharedDashboards : false,
        };

        const vendorListSupplierROPRights: VendorListRights = {
          /*notificationsSetupView : false,
          notificationsSetupEdit : false,
          flagEdit:false,
          vendorCreate: false,
          vendorView: false,
          vendorEdit: false,
          vendorDelete: false,
          partNumbersView: false,
          partNumbersEdit: false,
          partNumbersDelete: false,
          buyersView: false,
          buyersManage: false,*/
        }

        const configurationSupplierROPRights: ConfigurationRights = {
          /*searchConfiguration: false
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleSupplierROPRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: false
        };

        const dateTypeSupplierROPRights: DateTypeRights = {
          receiveDate: true /*GR Date*/,
          plannedOrderStatus: true
        };

        /*Menu visibility*/
        const menuAccessSupplierROPRightList: string[] = [
          'Commits',
          'Invoicing',
          'Goods Receipts', 'Invoice Reconciliation'
        ];

        /*Widget visibility*/
        const widgetAccessSupplierROPRightList: string[] =
          ['statusMonitor', 'qapLink',
            'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilitySupplierROPRights,
          commitsModuleRights: commitsModuleSupplierROPRights,
          dashboardRights: dashboardsSupplierROPRights,
          vendorListRights: vendorListSupplierROPRights,
          configurationRights: configurationSupplierROPRights,
          finantialModuleRights: finantialModuleSupplierROPRights,
          dateTypeRights: dateTypeSupplierROPRights,
          dateTypeRightList: dateTypeSupplierROPRightList,
          menuAccessRightList: menuAccessSupplierROPRightList,
          widgetAccessRightList: widgetAccessSupplierROPRightList,
          statusRightList: statusSupplierROPRightList
        };


        break;
      case 'Orion_SCM_Customer':
        const supplyVisibilityCustomerRights: SupplyVisibilityRights = {
          //commentsEdit: false,
          commentsView: true,
          commitsLayout: true,
          //dummyCommits: false,
          forecastView: true,
          graphsView: true,
          manageCommits: true,
          manageDummyCommits: true,
          disableCommitManagement: true,
          masterDataView: true,
          /*notesEdit: false,
          notesView: false,*/
          reviewFlags: true,
          reviewFlagsForCustomer: true,
          reviewFlagsForCustomerEdit: true,
          /*cancelCommits: false,
          deleteCommits: false,*/
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeCustomerRightList: string[] = [
          'sapDeliveryDate'
        ];

        const commitsModuleCustomerRights: CommitsModuleRights = {
          //createCommits: false,
          //editCommits: false,
          downloadExcel: true,
          layoutChanges: true,
          //massChanges: false,
          searchCommits: true,
          //cancelCommits: false,
          //deleteCommits: false,
          //deletePLO: false,
          //remergeCommits: false,
          selectFields: true,
          documentsView: true,
        };

        const dashboardsCustomerRights: DashboardsRights = {
          //dashboardEdit : false,
          dashboardView: true,
          //sharedDashboards : false,
        };

        const vendorListCustomerRights: VendorListRights = {
          /*notificationsSetupView : false,
          notificationsSetupEdit : false,
          flagEdit:false,
          vendorCreate: false,
          vendorView: false,
          vendorEdit: false,
          vendorDelete: false,
          partNumbersView: false,
          partNumbersEdit: false,
          partNumbersDelete: false,
          buyersView: false,
          buyersManage: false,*/
        }

        const configurationCustomerRights: ConfigurationRights = {
          reviewVisibilityForCustomer: true,
          //searchConfiguration: true
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleCustomerRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true
        };

        const dateTypeCustomerRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };

        /*Status visibility*/
        const statusCustomerRightList: string[] = [
          'Delivered',
          'Waiting',
        ];

        /*Menu visibility*/
        const menuAccessCustomerRightList: string[] = [
          'Commits', 'My Portfolio', /*'Contacts',*/
          'Invoicing', 'Goods Receipts', 'Invoice Reconciliation'
        ];

        /*Widget visibility*/
        const widgetAccessCustomerRightList: string[] =
          ['statusMonitor', 'qapLink',
            'searchV2', 'waterfall', 'commitList', 'commitsLink', 'mypnlist',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilityCustomerRights,
          commitsModuleRights: commitsModuleCustomerRights,
          dashboardRights: dashboardsCustomerRights,
          vendorListRights: vendorListCustomerRights,
          configurationRights: configurationCustomerRights,
          finantialModuleRights: finantialModuleCustomerRights,
          dateTypeRights: dateTypeCustomerRights,
          dateTypeRightList: dateTypeCustomerRightList,
          menuAccessRightList: menuAccessCustomerRightList,
          widgetAccessRightList: widgetAccessCustomerRightList,
          statusRightList: statusCustomerRightList
        };

        break;

      case 'Orion_SCM_Engineering':
        const supplyVisibilityEngineeringRights: SupplyVisibilityRights = {
          commentsView: true,
          commitsLayout: true,
          forecastView: true,
          graphsView: true,
          masterDataView: true,
          manageSimulationSets: true,
          selectCommitFields: true,
          reviewFlags: true,
        };

        /*Dates types visibility*/
        const dateTypeEngineeringRightList: string[] = [
          'sapDeliveryDate'
        ];

        /*Status visibility*/
        const statusEngineeringRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleEngineeringRights: CommitsModuleRights = {
          downloadExcel: true,
          layoutChanges: true,
          searchCommits: true,
          selectFields: true,
          documentsView: true,
        };

        const dashboardsEngineeringRights: DashboardsRights = {
          //dashboardEdit : false,
          dashboardView: true,
          //sharedDashboards : false,
        };

        const vendorListEngineeringRights: VendorListRights = {
          notificationsSetupView: true,
          vendorView: true,
          partNumbersView: true,
        }

        const configurationEngineeringRights: ConfigurationRights = {
          //searchConfiguration: true
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleEngineeringRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true
        };

        const dateTypeEngineeringRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };

        /*Menu visibility*/
        const menuAccessEngineeringRightList: string[] = [
          'Commits', 'My Portfolio', /*'Vendors',  'Carriers',*/
          /*'Contacts', 'PartNumbers', */'QAP', 'RFQ', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'
        ];

        /*Widget visibility*/
        const widgetAccessEngineeringRightList: string[] =
          ['statusMonitor',
            'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilityEngineeringRights,
          commitsModuleRights: commitsModuleEngineeringRights,
          dashboardRights: dashboardsEngineeringRights,
          vendorListRights: vendorListEngineeringRights,
          configurationRights: configurationEngineeringRights,
          finantialModuleRights: finantialModuleEngineeringRights,
          dateTypeRights: dateTypeEngineeringRights,
          dateTypeRightList: dateTypeEngineeringRightList,
          menuAccessRightList: menuAccessEngineeringRightList,
          widgetAccessRightList: widgetAccessEngineeringRightList,
          statusRightList: statusEngineeringRightList
        };

        break;


      case 'Orion_SCM_Customer_Commit':
        const supplyVisibilityCustomerCommitRights: SupplyVisibilityRights = {
          manageCommits: true,
          massChanges: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          disableCommitManagement: false,
          reviewFlags: true,

        };

        /*Dates types visibility*/
        const dateTypeCustomerCommitRightList: string[] = [
          'sapDeliveryDate'
        ];

        /*Status visibility*/
        const statusCustomerCommitRightList: string[] = [
          'Delivered',
          'Waiting',
        ];

        const commitsModuleCustomerCommitRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          splitCommits: true,
          mergeCommits: true,
          massChanges: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsCustomerCommitRights: DashboardsRights = {
          //dashboardEdit : false,
          //dashboardView : true,
          //sharedDashboards : false,
        };

        const vendorListCustomerCommitRights: VendorListRights = {
          /*notificationsSetupView : false,
          notificationsSetupEdit : false,
          flagEdit:false,
          vendorCreate: false,
          vendorView: false,
          vendorEdit: false,
          vendorDelete: false,
          partNumbersView: false,
          partNumbersEdit: false,
          partNumbersDelete: false,
          buyersView: false,
          buyersManage: false,*/
        }

        const configurationCustomerCommitRights: ConfigurationRights = {
          //searchConfiguration: true
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleCustomerCommitRights: FinancialModuleRights = {
          //invoicesView: true,
          //invoicesExport: true,
          //invoiceReconcilation: true,
          //goodReceipts : true
        };

        const dateTypeCustomerCommitRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };

        /*Menu visibility*/
        const menuAccessCustomerCommitRightList: string[] = [
          'Commits', 'My Portfolio',
          'Invoicing', 'Goods Receipts', 'Invoice Reconciliation'
        ];


        /*Widget visibility*/
        const widgetAccessCustomerCommitRightList: string[] =
          [
            'statusMonitor', 'qapLink',
            'searchV2', 'waterfall', 'commitList', 'commitsLink', 'mypnlist',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'
          ];

        userRights = {
          supplyVisibilityRights: supplyVisibilityCustomerCommitRights,
          commitsModuleRights: commitsModuleCustomerCommitRights,
          dashboardRights: dashboardsCustomerCommitRights,
          vendorListRights: vendorListCustomerCommitRights,
          configurationRights: configurationCustomerCommitRights,
          finantialModuleRights: finantialModuleCustomerCommitRights,
          dateTypeRights: dateTypeCustomerCommitRights,
          dateTypeRightList: dateTypeCustomerCommitRightList,
          menuAccessRightList: menuAccessCustomerCommitRightList,
          widgetAccessRightList: widgetAccessCustomerCommitRightList,
          statusRightList: statusCustomerCommitRightList
        };

        break;

      case 'Orion_Logistics_Logistic':
        const supplyVisibilityLogistics_LogisticRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          commitsLayout: true,
          dummyCommits: true,
          forecastView: true,
          graphsView: true,
          manageCommits: true,
          manageDummyCommits: true,
          masterDataView: true,
          notesEdit: true,
          notesView: true,
          reviewFlags: true,
          reviewFlagsForBuyer: true,
          reviewFlagsForBuyerEdit: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForCustomer: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeLogistics_LogisticRightList: string[] = [
          'sapDeliveryDate',
          'etdDate',
          'slotDate',
          'instructionEtaDate',
          'actualETADate',
          'receiveDate'
        ];

        /*Status visibility*/
        const statusLogisticsRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleLogistics_LogisticRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          layoutChanges: true,
          massChanges: true,
          searchCommits: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          deletePLO: true,
          selectFields: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsLogistics_LogisticRights: DashboardsRights = {
          //sharedDashboards : false,
        };

        const vendorListLogistics_LogisticRights: VendorListRights = {
          notificationsSetupView: true,
          //notificationsSetupEdit : false,
          flagEdit: true,
          vendorCreate: true,
          vendorView: true,
          vendorEdit: true,
          vendorDelete: true,
          partNumbersView: true,
          partNumbersEdit: true,
          partNumbersDelete: true,
          buyersView: true,
          buyersManage: true,
        }

        const configurationLogistics_LogisticRights: ConfigurationRights = {
          virtualGroupsView: true,
          virtualGroupsChange: true,
          vendorCodesView: true,
          //searchConfiguration: true
          //vendorCodesChange: false,
          //materialManagementViewsView : false,
        }

        const finantialModuleLogistics_LogisticRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: true
        };

        const dateTypeLogistics_LogisticRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
          etdDate: true,
          slotDate: true, /*GR Date*/
          instructionEtaDate: true,
          actualETADate: true,
          receiveDate: true
        };

        const carriersModuleLogisticsRights: CarriersModuleRights = {
          carriersView: true,
          carriersCreate: true,
          carriersEdit: true,
          carriersDelete: true,
          carriersContactsCreate: true,
          carriersContactsDelete: true,
          carriersTransportsCreate: true,
          carriersTransportsDelete: true,
          carriersNotificationsCreate: true,
          carriersNotificationsDelete: true,
        }

        /*Menu visibility*/
        const menuAccessLogistics_LogisticRightList: string[] = [
          'Commits', 'PN Groups', /*'Vendor Codes Rights',*/ 'My Portfolio', /*'Vendors', */'Carriers',
          /*'Contacts', 'PartNumbers',*/ 'QAP', 'RFQ', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Shipments', 'Audit Log'];

        /*Widget visibility*/
        const widgetAccessLogistics_LogisticRightList: string[] =
          ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload',
            'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilityLogistics_LogisticRights,
          commitsModuleRights: commitsModuleLogistics_LogisticRights,
          dashboardRights: dashboardsLogistics_LogisticRights,
          vendorListRights: vendorListLogistics_LogisticRights,
          configurationRights: configurationLogistics_LogisticRights,
          finantialModuleRights: finantialModuleLogistics_LogisticRights,
          dateTypeRights: dateTypeLogistics_LogisticRights,
          dateTypeRightList: dateTypeLogistics_LogisticRightList,
          menuAccessRightList: menuAccessLogistics_LogisticRightList,
          widgetAccessRightList: widgetAccessLogistics_LogisticRightList,
          statusRightList: statusLogisticsRightList,
          carriersModuleRights: carriersModuleLogisticsRights
        };

        break;

      case 'Orion_Logistics_Anaylyst':

        const carriersModuleLogisticsAnalystRights: CarriersModuleRights = {
          carriersView: true,
          carriersCreate: false,
          carriersEdit: false,
          carriersDelete: false,
          carriersContactsCreate: true,
          carriersContactsDelete: true,
          carriersTransportsCreate: true,
          carriersTransportsDelete: true,
          carriersNotificationsCreate: true,
          carriersNotificationsDelete: true,
        }

        /*Menu visibility*/
        const menuAccessLogistics_Logistic_Analyst_RightList: string[] = ['Carriers'];

        userRights = {
          carriersModuleRights: carriersModuleLogisticsAnalystRights,
          menuAccessRightList: menuAccessLogistics_Logistic_Analyst_RightList
        };

        break;

      case 'Orion_SCM_Sourcing':
        const supplyVisibilitySourcingRights: SupplyVisibilityRights = {
          commentsView: true,
          commitsLayout: true,
          forecastView: true,
          graphsView: true,
          masterDataView: true,
          manageSimulationSets: true,
          selectCommitFields: true,
          reviewFlags: true,
        };

        /*Dates types visibility*/
        const dateTypeSourcingRightList: string[] = [
          'sapDeliveryDate'
        ];

        /*Status visibility*/
        const statusSourcingRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleSourcingRights: CommitsModuleRights = {
          downloadExcel: true,
          layoutChanges: true,
          searchCommits: true,
          selectFields: true,
          documentsView: true,
        };

        const dashboardsSourcingRights: DashboardsRights = {
          //dashboardEdit : false,
          dashboardView: true,
          //sharedDashboards : false,
        };

        const vendorListSourcingRights: VendorListRights = {
          notificationsSetupView: true,
          vendorView: true,
          partNumbersView: true,
        }

        const configurationSourcingRights: ConfigurationRights = {
          //searchConfiguration: true
          /*virtualGroupsView: false,
          virtualGroupsChange: false,
          vendorCodesView: false,
          vendorCodesChange: false,
          materialManagementViewsView : false,*/
        }

        const finantialModuleSourcingRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true
        };

        const dateTypeSourcingRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };

        /*Menu visibility*/
        const menuAccessSourcingRightList: string[] = [
          'Commits', 'My Portfolio', /*'Vendors', 'Carriers',*/
          /*'Contacts', 'PartNumbers',*/ 'QAP', 'RFQ', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'
        ];

        /*Widget visibility*/
        const widgetAccessSourcingRightList: string[] =
          ['statusMonitor',
            'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilitySourcingRights,
          commitsModuleRights: commitsModuleSourcingRights,
          dashboardRights: dashboardsSourcingRights,
          vendorListRights: vendorListSourcingRights,
          configurationRights: configurationSourcingRights,
          finantialModuleRights: finantialModuleSourcingRights,
          dateTypeRights: dateTypeSourcingRights,
          dateTypeRightList: dateTypeSourcingRightList,
          menuAccessRightList: menuAccessSourcingRightList,
          widgetAccessRightList: widgetAccessSourcingRightList,
          statusRightList: statusSourcingRightList
        };

        break;

      case 'Orion_SCM_Master_Buyer':
        const supplyVisibilityMasterBuyerRights: SupplyVisibilityRights = {
          commentsEdit: true,
          commentsView: true,
          managePredefinedComments: true,
          commitsLayout: true,
          dummyCommits: true,
          forecastView: true,
          graphsView: true,
          manageCommits: true,
          massChanges: true,
          manageDummyCommits: true,
          masterDataView: true,
          notesEdit: true,
          notesView: true,
          reviewFlags: true,
          reviewFlagsEdit: true,
          reviewFlagsForBuyer: true,
          reviewFlagsForBuyerEdit: true,
          reviewFlagsForSupplier: true,
          reviewFlagsForCustomer: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          remergeCommits: true,
          manageSimulationSets: true,
          selectCommitFields: true,
        };

        /*Dates types visibility*/
        const dateTypeMasterBuyerRightList: string[] = [
          'sapDeliveryDate',
          'etdDate',
          'receiveDate', //grdate
          'triggerDate',
          'plannedOrderStatus'
        ];

        /*Status visibility*/
        const statusMasterBuyerRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        const commitsModuleMasterBuyerRights: CommitsModuleRights = {
          createCommits: true,
          editCommits: true,
          downloadExcel: true,
          layoutChanges: true,
          massChanges: true,
          searchCommits: true,
          //cancelCommits: false,
          deleteCommits: true,
          splitCommits: true,
          mergeCommits: true,
          lockCommit: true,
          remergeCommits: true,
          deletePLO: true,
          selectFields: true,
          documentsView: true,
          documentsCreate: true,
          documentsDelete: true,
        };

        const dashboardsMasterBuyerRights: DashboardsRights = {
          //sharedDashboards : false,
        };

        const vendorListMasterBuyerRights: VendorListRights = {
          notificationsSetupView: true,
          //notificationsSetupEdit : false,
          flagEdit: true,
          vendorCreate: true,
          vendorView: true,
          vendorEdit: true,
          vendorDelete: true,
          partNumbersView: true,
          partNumbersEdit: true,
          partNumbersDelete: true,
          buyersView: true,
          buyersManage: true,
        }

        const configurationMasterBuyerRights: ConfigurationRights = {
          virtualGroupsView: true,
          virtualGroupsChange: true,
          vendorCodesView: true,
          reviewVisibilityForBuyer: true,
          searchConfiguration: true,
          portfolioDelete: true,
          //vendorCodesChange: false,
          //materialManagementViewsView : false,
        }

        const finantialModuleMasterBuyerRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true,
          quotations: true
        };

        const dateTypeMasterBuyerRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
          etdDate: true,
          receiveDate: true, /*GR Date*/
          triggerDate: true,
          plannedOrderStatus: true
        };

        /*Menu visibility*/
        const menuAccessMasterBuyerRightList: string[] = [
          'Commits', 'PN Groups', 'Vendor Codes Rights', 'My Portfolio', 'Vendors', 'Carriers',
          'Contacts', 'PartNumbers', 'QAP', 'RFQ', 'Portfolio', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'];

        /*Widget visibility*/
        const widgetAccessMasterBuyerRightList: string[] =
          ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'mypnlist',
            'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink',
            'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList', 'invoiceList'];

        userRights = {
          supplyVisibilityRights: supplyVisibilityMasterBuyerRights,
          commitsModuleRights: commitsModuleMasterBuyerRights,
          dashboardRights: dashboardsMasterBuyerRights,
          vendorListRights: vendorListMasterBuyerRights,
          configurationRights: configurationMasterBuyerRights,
          finantialModuleRights: finantialModuleMasterBuyerRights,
          dateTypeRights: dateTypeMasterBuyerRights,
          dateTypeRightList: dateTypeMasterBuyerRightList,
          menuAccessRightList: menuAccessMasterBuyerRightList,
          widgetAccessRightList: widgetAccessMasterBuyerRightList,
          statusRightList: statusMasterBuyerRightList
        };

        break;


      case 'Orion_AI':
        const supplyVisibilityAIRights: SupplyVisibilityRights = {
        };

        /*Dates types visibility*/
        const dateTypeAIRightList: string[] = [
        ];

        /*Status visibility*/
        const statusAIRightList: string[] = [
        ];

        const commitsModuleAIRights: CommitsModuleRights = {
        };

        const dashboardsAIRights: DashboardsRights = {
        };

        const vendorListAIRights: VendorListRights = {
        }

        const configurationAIRights: ConfigurationRights = {
        }

        const finantialModuleAIRights: FinancialModuleRights = {
        };

        const dateTypeAIRights: DateTypeRights = {
        };

        /*Menu visibility*/
        const menuAccessAIRightList: string[] = [
        ];


        /*Widget visibility*/
        const widgetAccessAIRightList: string[] =
          [
            'aiLink'
          ];

        userRights = {
          supplyVisibilityRights: supplyVisibilityAIRights,
          commitsModuleRights: commitsModuleAIRights,
          dashboardRights: dashboardsAIRights,
          vendorListRights: vendorListAIRights,
          configurationRights: configurationAIRights,
          finantialModuleRights: finantialModuleAIRights,
          dateTypeRights: dateTypeAIRights,
          dateTypeRightList: dateTypeAIRightList,
          menuAccessRightList: menuAccessAIRightList,
          widgetAccessRightList: widgetAccessAIRightList,
          statusRightList: statusAIRightList
        };

        break;

      case 'Orion_Finance_Accountant':
        const supplyVisibilityFinanceAccountantRights: SupplyVisibilityRights = {
        };

        const commitsModuleFinanceAccountantRights: CommitsModuleRights = {
          documentsView: true,
        };

        const dashboardsFinanceAccountantRights: DashboardsRights = {
        };

        const vendorListFinanceAccountantRights: VendorListRights = {
        }

        const configurationFinanceAccountantRights: ConfigurationRights = {
          //searchConfiguration: true
        }

        const finantialModuleFinanceAccountantRights: FinancialModuleRights = {
          invoicesView: true,
          invoicesExport: true,
          invoiceReconcilation: true,
          goodReceipts: true
        };

        const dateTypeFinanceRights: DateTypeRights = {
          sapDeliveryDate: true, /*Final ETA*/
        };
        /*Dates types visibility*/
        const dateTypeFinanceRightList: string[] = [
          'sapDeliveryDate'
        ];

        /*Status visibility*/
        const statusFinanceRightList: string[] = [
          'Delivered',
          'New',
          'Initial triggers',
          'Waiting',
          'Partial',
        ];

        /*Menu visibility*/
        const menuAccessFinanceRightList: string[] = [
          'Invoicing', 'Goods Receipts', 'Invoice Reconciliation'
        ];

        /*Widget visibility*/
        const widgetAccessFinanceRightList: string[] =
          [];

        userRights = {
          supplyVisibilityRights: supplyVisibilityFinanceAccountantRights,
          commitsModuleRights: commitsModuleFinanceAccountantRights,
          dashboardRights: dashboardsFinanceAccountantRights,
          vendorListRights: vendorListFinanceAccountantRights,
          configurationRights: configurationFinanceAccountantRights,
          finantialModuleRights: finantialModuleFinanceAccountantRights,
          dateTypeRights: dateTypeFinanceRights,
          dateTypeRightList: dateTypeFinanceRightList,
          menuAccessRightList: menuAccessFinanceRightList,
          widgetAccessRightList: widgetAccessFinanceRightList,
          statusRightList: statusFinanceRightList,
        };

    }
    return userRights;
  }

  public static readonly fullAccessRoles = ['Orion_SCM_Analyst', 'Orion_SCM_Buyer', 'Orion_Logistics_Logistic', 'Orion_Administrator', 'Orion_SCM_Master_Buyer']
  public static readonly limitedAccessRoles = ['Orion_SCM_Supplier_Commit', 'Orion_SCM_Supplier_No_Commit', 'Orion_SCM_Customer', 'Orion_SCM_ReadOnly', 'Orion_SCM_Supplier_ROP', 'Orion_SCM_Engineering', 'Orion_SCM_Customer_Commit', 'Orion_SCM_Sourcing', 'Orion_AI'];
  public static readonly finantialAccessRoles = ['Orion_Finance_Accountant']
  // public static readonly widgetToAccess = ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'ploSync', 'configurationLink'];

  // /*Menu access*/
  // public static readonly full_MenuItems =
  // ['Commits', 'PN Groups', 'Vendor Codes Rights', 'My Portfolio', 'Vendors', 'Carriers',
  // 'Contacts', 'PartNumbers', 'QAP', 'Quotations', 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'];

  // public static readonly limited_MenuItems =
  // ['Commits', 'My Portfolio', 'Contacts', 'Quotations', 'Invoicing',
  //  'Goods Receipts', 'Invoice Reconciliation', 'Audit Log'];

  // public static readonly finatial_MenuItems =
  // [ 'Invoicing', 'Goods Receipts', 'Invoice Reconciliation'];

  /*Widget access*/

  // public static readonly finantialwidgetToAccess = ['statusMonitor', 'qapLink', 'pnGroupsLink', 'vendorcodeRightsLink', 'fileUpload', 'ploSync', 'configurationLink', 'searchV2', 'waterfall', 'commitList', 'commitsLink', 'smartPNList', 'filterWidget', 'circularChart', 'reviewSupplyVisibility', 'simplePNList'];

  /*Dashboard access*/
  // public static readonly LimitedDashboard = ['Orion_SCM_Customer', 'Orion_SCM_Supplier_Commit', 'Orion_SCM_Supplier_No_Commit', 'Orion_SCM_ReadOnly', 'Orion_Finance_Accountant', 'Orion_SCM_Supplier_ROP']

  // public static getWidgetAddAccess(groupNames, data) {
  //   if (this.fullAccessRoles.some(value => groupNames.includes(value))) {
  //     return data;
  //   }
  //   if (this.limitedAccessRoles.some(value => groupNames.includes(value))) {
  //     let tData = data
  //     const filteredData = tData.filter(obj => !this.widgetToAccess.includes(obj.type));

  //     return filteredData
  //   }
  //   if (this.finantialAccessRoles.some(value => groupNames.includes(value))) {
  //     let tData = data
  //     const filteredData = tData.filter(obj => !this.finantialwidgetToAccess.includes(obj.type));

  //     return filteredData
  //   }
  //   else {
  //     return [];
  //   }
  // }

  public static getWidgetAccess(widgetList:any, data:any) {
    if (widgetList && data) {
      const filteredWidgetData = data.filter((item:any) => widgetList.includes(item.type));
      return filteredWidgetData
    }
    else {
      return [];
    }
  }
  //#region Change Detection
  public static detectChanges(ref: ChangeDetectorRef) {
    ref.detectChanges();
  }
  public static detachChangeDetection(ref: ChangeDetectorRef) {
    ref.detach();
  }
  public static reattachChangeDetection(ref: ChangeDetectorRef) {
    ref.reattach();
  }

  /**
   * @param partNumber
   * Separates pn and vc from list and splits them from '|' operator
   * @returns list of pn and vc
   */
  public static getModifiedPnVc(partNumber: string) {

    let pnVc: PnVendorCode[] = [];
    let partNumbersList = partNumber.split("\n");

    for (let i = 0; i < partNumbersList.length; i++) {
      let pnVendor: PnVendorCode = {};
      partNumbersList[i] = partNumbersList[i].trim();

      if (partNumbersList[i] != "") {
        let splitArr = partNumbersList[i].split("|");

        // checking if pn is present and handling only vc
        if (partNumbersList[i][0] == "|" && splitArr.length == 1) {
          pnVendor.partNumber = "";
          pnVendor.vendorCode = splitArr[0];
        }

        // checking if vc is present and handling only pn
        else if (partNumbersList[i][0] != "" && splitArr.length == 1) {
          pnVendor.partNumber = splitArr[0];
          pnVendor.vendorCode = "";
        }
        else {
          pnVendor.partNumber = splitArr[0];
          pnVendor.vendorCode = splitArr[1];
        }
        pnVc.push(pnVendor);
      }

    }
    return pnVc;
  }

  //#endregion Change Detection
  //#region Form Misc
  public static setValidation(
    control: FormControl,
    isInvalid: boolean,
    errorCode = 'incorrect'
  ) {
    control.setErrors(isInvalid ? { [errorCode]: true } : null);
  }

  public static handlePastedClipboardData(clipboardData: string) {
    const separatorsRegex = /[\n\r\t|,; :]+/;
    return clipboardData.trim().split(separatorsRegex);
  }


  //#endregion Form Misc
}
export interface LooseObject {
  [key: string]: any;
}

export interface SettingPlayload {
  key: string;
  data: any;
}

export enum EnumDataStatus {
  NONE = 0,
  AVAILABLE = 1,
  FETCHING = 2,
  ERROR = 3,
}
