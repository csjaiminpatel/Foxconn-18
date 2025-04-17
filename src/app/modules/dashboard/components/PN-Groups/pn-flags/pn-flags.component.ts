import { Component, Inject, OnInit } from '@angular/core';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { VendorListRights } from '../../../../auth/models/auth.model';
import { AuthenticationState } from '../../../../auth/store/authentication.state';
import { DialogData } from '../../../../shared/DTOs/dialog-data.model';
import { Helper } from '../../../../shared/helper';
import { VirtualPnGroupsService } from '../../../services/Virtual-pn-group/virtual-pn-groups.service';
import { createPnVcFlags, PnVcFlags } from '../../../models/virtual-pn-groups.model';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'orion-platform-pn-flags',
  standalone: true,
  imports: [DialogComponent,CommonModule,MatIcon,MatFormFieldModule,ProgressSpinnerComponent,ReactiveFormsModule,TranslateModule ],
  templateUrl: './pn-flags.component.html',
  styleUrl: './pn-flags.component.scss'
})
export class PnFlagsComponent implements OnInit {

  title: string = 'Flags';
  pnData: any = null;
  isLoading = false;
  showForm = false;
  flagForm?: FormGroup;
  customClasses = 'custom-notification-class custom-pn-flags-class';
  defaultFields: any = Helper.pnVcFlags();
  private ngUnsubscribe = new Subject();
  partNumberValue?: string;
  vendorCodeValue?: string;
  userRights?: VendorListRights;

  constructor(
    private virtualPnGroupsService: VirtualPnGroupsService,
    public dialogRef: MatDialogRef<PnFlagsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store,
  ) { }

  ngOnInit() {
    // NOTE - pn-group data updated automatically when pnData modified
    this.pnData = this.data;
    if (this.pnData.key == 'create') {
      this.title = 'New Flag'
      this.showForm = true;
    }
    this.userRights = this.store.selectSnapshot(AuthenticationState.vendorListRights);
    // Payload in case of Pn-Groups module for flags
    if (this.pnData.module == Helper.PNGROUP_MODULE) {
      this.partNumberValue = this.pnData.pnData.virtualPartnumber;
      this.vendorCodeValue = this.pnData.pnData.virtualVendorCode;
    }
    // Payload in case of PartNumbers module for flags
    else if (this.pnData.module == Helper.PARTNUMBERS_MODULE) {
      if (this.pnData.isVendorPN) {
        this.partNumberValue = this.pnData.pnData.partNumber;
        this.vendorCodeValue = this.pnData.pnData.vendorCode;
      }
      else {
        this.partNumberValue = this.pnData.pnData.name;
        this.vendorCodeValue = '*';
      }
    }
    // Payload in case of Vendors and My Portfolio module for flags
    else if (this.pnData.module == Helper.VENDORS_MODULE || this.pnData.module == Helper.MYPORTFOLIO_MODULE) {
      if (this.pnData.isVendorPN) {
        this.partNumberValue = this.pnData.pnData.partNumber;
        this.vendorCodeValue = this.pnData.pnData.vendorCode;
      }
      else {
        this.partNumberValue = '*';
        this.vendorCodeValue = this.pnData.pnData.name;
      }
    }

    else if (this.pnData.module == Helper.SV_MODULE) {
      this.partNumberValue = this.pnData.pnData.partNumber;
      this.vendorCodeValue = this.pnData.pnData.vendorCode;
    }

    else if (this.pnData.module == Helper.PORTFOLIO_MODULE) {
      this.partNumberValue = this.pnData.pnData.partNumber;
      this.vendorCodeValue = this.pnData.pnData.vendorCode;
    }

    this.createForm();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  get partNumber() {
    return this.flagForm?.controls['partNumber'];
  }
  get vendorCode() {
    return this.flagForm?.controls['vendorCode'];
  }
  get flag() {
    return this.flagForm?.controls['flag'];
  }

  createPnVcFlags() {
    this.isLoading = true;
    this.virtualPnGroupsService
      .createPartNumberVendorCodeFlags(this.flagForm?.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.showForm = false;
        this.flagForm?.reset({
          partNumber: this.partNumberValue,
          vendorCode: this.vendorCodeValue
        });
        if (response) {
          this.reloadData();
        }
      })
  }

  deletePnVcFlags(flag: string) {
    this.isLoading = true;
    let payload:createPnVcFlags = {
      partNumber: this.partNumberValue ?? '',
      vendorCode: this.vendorCodeValue ?? '',
      flag: flag
    }

    this.virtualPnGroupsService
      .deletePartNumberVendorCodeFlags(payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (res) {
          this.reloadData();
        }
      })
  }

  reloadData() {
    let data:PnVcFlags[] = [{
      partNumber: this.partNumberValue || '',
      vendorCode: this.vendorCodeValue || ''
    }]
    this.virtualPnGroupsService
      .getPartNumberVendorCodeFlags(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response) {
          //NOTE - use condition according to response of API.

          // if (this.pnData.isVendorPN) {
          //   this.pnData.pnData.flags = response[1].flags;
          // } else if (this.pnData.module == Helper.SV_MODULE) {

          if (this.pnData.module == Helper.SV_MODULE) {
            const foundObject = response.find((item:any) => item.partNumber === this.partNumberValue && item.vendorCode === this.vendorCodeValue);
            this.pnData.pnData.flags = this.filteredFlagForSV(foundObject);
          }
          else {
            this.pnData.pnData.flags = response[0].flags;
          }

          if (!this.pnData.pnData.flags || this.pnData.pnData.flags.length == 0) {
            this.title = 'New Flag'
            this.showForm = true;
          }
          else {
            this.title = 'Flags'
          }
        }
        this.isLoading = false;
      })
  }

  filteredFlagForSV(response : any){
    const reviewKeywords = ['ReviewByBuyer', 'ReviewByCustomer', 'ReviewBySupplier'];
    return response.flags.filter((flag:any) => !reviewKeywords.includes(flag));
  }

  createForm() {
    this.flagForm = new FormGroup({
      partNumber: new FormControl({ value: this.partNumberValue, disabled: true }),
      vendorCode: new FormControl({ value: this.vendorCodeValue, disabled: true }),
      flag: new FormControl('', Validators.required),
    })
  }

  onAddClick() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
  }

  // dialogClose() {
  //   this.dialogRef.close();
  // }
}
