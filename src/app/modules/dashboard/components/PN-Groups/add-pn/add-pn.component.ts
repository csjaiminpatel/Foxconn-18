import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../../../../shared-imports';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'orion-platform-add-pn',
  standalone: true,
  imports: [...SHARED_IMPORTS,MatDialogModule,MatFormFieldModule,ReactiveFormsModule  ],
  templateUrl: './add-pn.component.html',
  styleUrl: './add-pn.component.scss'
})
export class AddPnComponent implements OnInit {
  form?: FormGroup;
  partData: any;
  actionType: any;
  constructor(
    public dialogRef: MatDialogRef<AddPnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.actionType = this.data.actionType;
    if (this.actionType == 'edit') {
      this.partData = this.data.partData;
      this.setFormValue(this.partData);
    } else {
      //do nothing
    }
  }
  createForm() {
    this.form = this.fb.group({
      partNumber: [],
      vendorCode: [],
      pnList: [],
    });
  }
  setFormValue(value:any) {
    this.form?.controls['partNumber'].setValue(value.partNumber);
    this.form?.controls['vendorCode'].setValue(value.vendorCode);
  }
  sendForm(value:any) {
    if (this.actionType == 'edit') {
      this.partData.partNumber = value.partNumber;
      this.partData.vendorCode = value.vendorCode;
      this.dialogRef.close(this.partData);
    } else {
      this.dialogRef.close(value);
    }
  }
}
