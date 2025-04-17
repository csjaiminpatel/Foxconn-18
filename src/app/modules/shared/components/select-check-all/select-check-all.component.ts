import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Helper } from '../../helper';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-check-all',
  standalone: true,
  imports: [MatCheckboxModule,CommonModule],
  templateUrl: './select-check-all.component.html',
  styleUrl: './select-check-all.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SelectCheckAllComponent {
  @Input() model?: FormControl;
  @Input() values:any[] = [];
  @Input() text = 'Select All';
  @Input() baseModule?:string;

  isChecked(): boolean {
    return this.model?.value && this.values.length && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return (
      this.model &&
      this.model.value &&
      this.values.length &&
      this.model.value.length &&
      this.model.value.length < this.values.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      if (this.baseModule == Helper.GLOBALNOTIFICATIONS_MODULE) {
        this.model?.setValue(this.values.map((e) => e.role));
      } else if (this.baseModule && this.baseModule == Helper.INVOICING_MODULE) {
        this.model?.setValue(this.values);
      }
      else {
        this.model?.setValue(
          this.values.map((e) => {
            return e.id;
          })
        );
      }
    } else {
      this.model?.setValue([]);
    }
  }
}

