import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DialogData } from '../../../shared/DTOs/dialog-data.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'orion-platform-token-expire',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './token-expire.component.html',
  styleUrl: './token-expire.component.scss'
})
export class TokenExpireComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData

  ) { }

  ngOnInit() {
  } 

  ok() {
    this.dialogRef.close(true);
  }
}