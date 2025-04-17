import { Component, Inject } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DialogData } from '../../DTOs/dialog-data.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'orion-platform-confirmation-dialog',
  standalone: true,
  imports: [DialogComponent , MatDialogModule , CommonModule,MatButtonModule ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
