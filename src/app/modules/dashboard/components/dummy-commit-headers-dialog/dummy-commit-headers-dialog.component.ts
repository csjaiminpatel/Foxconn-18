import { Component, Inject, OnInit } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Helper } from '../../../shared/helper';
import { SupplyVisibilityState } from '../../stores/supply-visibility/supply-visibility.state';

@Component({
  selector: 'orion-platform-dummy-commit-headers-dialog',
  standalone: true,
  imports: [DialogComponent,CommonModule,MatFormFieldModule,MatCheckboxModule,TranslateModule,MatDialogModule,MatSelectModule,ReactiveFormsModule   ],
  templateUrl: './dummy-commit-headers-dialog.component.html',
  styleUrl: './dummy-commit-headers-dialog.component.scss'
})
export class DummyCommitHeadersDialogComponent implements OnInit {
  actionType = '';
  title = '';
  private readonly SELECTED_DUMMY_COMMIT_HEADER_KEY: string = 'selected_dummy_commmit_header';

  enumSimulationSet: any = [
    {name: 'Personal', value: 1},
    {name: 'Shared', value: 0},
  ];

  selectedProfile: any;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<DummyCommitHeadersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionType = data.actionType;
  }

  editDummyCommitHeaderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    forPrecalculate: new FormControl(false, Validators.required),
    enumSimulationSet: new FormControl(1, Validators.required)
  });

  ngOnInit() {
    if (this.actionType === 'edit') {
      this.setDummyCommitHeaderInputs();
    }
    this.setDialogTitle(this.actionType);
    
  }

  /**
   * Set Dialog Title
   * @param {string} actionType
   * @memberof CommitDialogFormComponent
   */
  setDialogTitle(actionType: string) {
    if (actionType === 'new') {
      this.title = 'New simulation set';
    } else if (actionType === 'edit') {
      this.title = 'Edit simulation set';
    }
  }

  /**
   * Set Date Range inputs
   * @memberof HistoryCommitComponent
   */
  setDummyCommitHeaderInputs() {
    const selectedDummyCommitHeader = this.store.selectSnapshot(
      SupplyVisibilityState.getSelectedDummyCommitsHeader
    );
    if(selectedDummyCommitHeader){
    this.editDummyCommitHeaderForm.controls['name'].setValue(selectedDummyCommitHeader.name);
    this.editDummyCommitHeaderForm.controls['forPrecalculate'].setValue(selectedDummyCommitHeader.forPrecalculate);
    this.editDummyCommitHeaderForm.controls['enumSimulationSet'].setValue(selectedDummyCommitHeader.enumSimulationSet);
    this.selectedProfile = selectedDummyCommitHeader.enumSimulationSet;
  }
  }

  /**
   * Send Date Range data
   * @memberof DateRangeComponent
   */
  sendForm() {
    let editedDummyCommitHeader = null;
    const {name, forPrecalculate, enumSimulationSet} = this.editDummyCommitHeaderForm.value;
    if (this.actionType === 'new') {
      const {name, forPrecalculate, enumSimulationSet} = this.editDummyCommitHeaderForm.value;

      editedDummyCommitHeader = {
        name: name,
        forPrecalculate: forPrecalculate,
        enumSimulationSet: enumSimulationSet
      };
    } else {
      const selectedDummyCommitHeader = this.store.selectSnapshot(
        SupplyVisibilityState.getSelectedDummyCommitsHeader
      );
      editedDummyCommitHeader = Object.assign({}, selectedDummyCommitHeader);
      editedDummyCommitHeader.name = <string>name;


      editedDummyCommitHeader.enumSimulationSet = <number>enumSimulationSet;
      this.selectedProfile =  editedDummyCommitHeader.enumSimulationSet;

      if (editedDummyCommitHeader.enumSimulationSet == 0)
      {
        editedDummyCommitHeader.forPrecalculate = <boolean>forPrecalculate;
      } 
      else
      {
        editedDummyCommitHeader.forPrecalculate = false;
      }

      this.saveSimulationSet(false, editedDummyCommitHeader);
    }

    this.dialogRef.close({editedDummyCommitHeader});
  }

  saveSimulationSet(isNew = false, dummyCommitHeader: any) {
    const payload = {
      key: this.SELECTED_DUMMY_COMMIT_HEADER_KEY,
      data: dummyCommitHeader
    }
    Helper.saveSettings(this.store, payload, isNew, false, false);
  }
  /**
   * Dialog close by cancel
   * @memberof CommitDialogFormComponent
   */
  onCancel() {
    this.dialogRef.close();
  }
}
