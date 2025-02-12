import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'orion-platform-dialog',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  @Input() title?: string;
  @Input() disableClose = false;
  @Input() hideClose = false;
  @Input() hideHeader = false;
  @Input() hideFooter = false;
  @Input() hideActions = false;
  @Input() customClasses?: string;

  
}
