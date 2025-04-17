import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { NotificationService } from '../../../../auth/services/Notification/notification.service';
import { VirtualPnGroupsService } from '../../../services/Virtual-pn-group/virtual-pn-groups.service';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InsertVirtualPartNumber } from '../../../stores/pn-groups/pn-groups.action';

@Component({
  selector: 'orion-platform-add-group',
  standalone: true,
  imports: [...SHARED_IMPORTS,MatDialogModule,MatFormFieldModule,FormsModule  ],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent implements OnInit {
  postedData:any;
  form?: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private vpnsService: VirtualPnGroupsService,
    private store: Store,
    public dialogRef: MatDialogRef<AddGroupComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  ngOnInit() {
    this.postedData = this.data;
  }

  async addOrUpdateGroup() {
    let payload = {
      virtualPartnumber: this.postedData.name,
      virtualVendorCode: 'VirtualVC',
    }
    this.store.dispatch(new InsertVirtualPartNumber(payload));
    this.dialogRef.close(this.postedData);
  }

}

