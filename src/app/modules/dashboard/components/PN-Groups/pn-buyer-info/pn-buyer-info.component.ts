import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { BuyersInfo, BasicParameters } from '../../../models/supply-visibility.model';
import { ApprovedVendorListService } from '../../../services/Approved-Vendor-List/approved-vendor-list.service';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'orion-platform-pn-buyer-info',
  standalone: true,
  imports: [...SHARED_IMPORTS,MatDialogModule,MatTableModule,MatProgressSpinnerModule,MatCardModule ],
  templateUrl: './pn-buyer-info.component.html',
  styleUrl: './pn-buyer-info.component.scss'
})
export class PnBuyerInfoComponent implements OnInit {
  // buyerInfo: {name: string; email: string; phone: string} = {
  //   name: 'n/a',
  //   email: 'n/a',
  //   phone: 'n/a',
  // };
  approvedVendorListService;
  loading = true;
  displayedColumns = ['name', 'email', 'phone', 'createDelete'];
  dataSource: BuyersInfo[] =[];
  constructor(
    approvedVendorListService: ApprovedVendorListService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<PnBuyerInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.approvedVendorListService = approvedVendorListService;
  }

  async ngOnInit() {
    this.loading = true;
    this.loadDetails(this.data);
  }

  async loadDetails(data:any) {
    if (data.partNumber) {
      const paramData: BasicParameters = {
        plant: data.plant,
        partNumber: data.partNumber,
        vendorCode: data.vendorCode,
      };
      try {
        const response = await this.approvedVendorListService
          .getApprovedVendorDetail(paramData)
          .toPromise();
        // this.property = arg
        if (response && response.contacts) {
          const contactsFiltered = response.contacts.filter(
            (contact) => contact.contactType == 'Buyer'
          );
          if (contactsFiltered && contactsFiltered.length > 0) {
            // OLD Implementation
            // this.buyerInfo = {
            //   name: `${contactsFiltered[0].firstName} ${contactsFiltered[0].lastName}`,
            //   email: contactsFiltered[0].email,
            //   phone: contactsFiltered[0].phone,
            // };

            // NEW Implementation
            this.dataSource = [];
            for (let i = 0; i < contactsFiltered.length; i++) {
              let buyerInfo: BuyersInfo = {
                active: contactsFiltered[i].active ?? false,
                additionalInfos: contactsFiltered[i].additionInfos ?? [], 
                addresses: contactsFiltered[i].addresses ?? [],
                contactType: contactsFiltered[i].contactType,
                email: contactsFiltered[i].email,
                firstName: contactsFiltered[i].firstName,
                lastName: contactsFiltered[i].lastName,
                partNumber: response.partNumber,
                vendorCode: response.vendorCode,
               };
              this.dataSource.push(buyerInfo);
            }
          } else {
            this.notificationService.showError('Buyer info not found');
          }
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.dialogClose();
        this.notificationService.showErrorOrMessage(error, 'Error while getting buyer info');
      }
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }

  deleteData(element: BuyersInfo) {
    this.loading = true;
    let deletedData: any = {
      id: element.id,
      partNumber: element.partNumber,
      vendorCode: element.vendorCode,
      identityKey: element.identityKey,
      contactType: element.contactType,
    };
    this.approvedVendorListService.deleteContact(deletedData).subscribe((res) => {
      if (res) {
        this.loadDetails(this.data);
      }
    },
      (error) => {
        this.notificationService.showError('Error while deleting Buyers');
      }
    )
  }

  createData(element: BuyersInfo) {
    this.loading = true;
    let createdData: any = {
      partNumber: element.partNumber,
      vendorCode: element.vendorCode,
      identityKey: element.identityKey,
      contactType: element.contactType,
    };
    this.approvedVendorListService.createContact(createdData).subscribe((res) => {
      this.loadDetails(this.data);
    },
      (error) => {
        this.notificationService.showError('Error while creating Buyer');
      }
    );
  }
}
