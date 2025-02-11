import { Router } from "@angular/router";
import { UserRights, SupplyVisibilityRights, CommitsModuleRights, DashboardsRights, VendorListRights, ConfigurationRights, FinancialModuleRights, DateTypeRights } from "../auth/models/auth.model";

export class Helper {
  //#region UserRightsModels
  public static openInNewTab(url: string, router: Router) {
    const serializedUrl = router.serializeUrl(router.createUrlTree([url]));
    window.open(serializedUrl, '_blank');
  }
  //#endregion

  //#region UserRightsModels
  public static getUserRightByRole(role: string): UserRights | undefined {
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
          statusRightList: statusAdministratorRightList
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
          selectCommitFields: true,
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
          selectFields: true,
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
          //mergeCommits: true,
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
          //mergeCommits: true,
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
          statusRightList: statusLogisticsRightList
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
          statusRightList: statusFinanceRightList
        };

    }
    return userRights;
  }
  //#endregion

  //#region Security Level Data
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
  ];
  //#endregion


  public static getUrlPaths() {
    const parsedUrl = new URL(window.location.href);
    const path = parsedUrl.pathname + parsedUrl.search;
    return path;
  }

  public static printError(error: any, title?: string): any {
    console.warn('**********Attention**************');
    title ? console.warn(`***********${title}***********`) : null;
    error ? console.error(error) : null;
  }
}