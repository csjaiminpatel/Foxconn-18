import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Moment } from 'moment';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'orion-platform-date-range-dialog',
  standalone: true,
  imports: [DialogComponent,TranslateModule,MatFormFieldModule ,MatDatepickerModule,MatDialogModule,CommonModule,ReactiveFormsModule],
  templateUrl: './date-range-dialog.component.html',
  styleUrl: './date-range-dialog.component.scss'
})
export class DateRangeDialogComponent implements OnInit {
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DateRangeDialogComponent>,
    private dateAdapter: DateAdapter<Moment>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  dateRangeForm = new FormGroup({
    dateFrom: new FormControl('', Validators.required),
    dateTo: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    this.setDateRangeInputs();
  }

  /**
   * Set Date Range inputs
   * @memberof HistoryCommitComponent
   */
  setDateRangeInputs() {
    const daterangeParams = this.store.selectSnapshot(SupplyVisibilityState.getDaterangeParameters);
    this.dateRangeForm.controls['dateFrom'].setValue(daterangeParams.dateFrom);
    this.dateRangeForm.controls['dateTo'].setValue(daterangeParams.dateTo);
  }

  /**
   * Send Date Range data
   * @memberof DateRangeComponent
   */
  sendForm() {
    const {dateFrom, dateTo} = this.dateRangeForm.value;
    this.dialogRef.close({dateFrom, dateTo});
  }

  /**
   * Dialog close by cancel
   * @memberof CommitDialogFormComponent
   */
  onCancel() {
    this.dialogRef.close();
  }
}
