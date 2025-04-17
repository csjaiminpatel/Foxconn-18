import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'orion-platform-status-message',
  standalone: true,
  imports: [TranslateModule,CommonModule,MatIconModule,MatListModule,MatFormFieldModule],
  templateUrl: './status-message.component.html',
  styleUrl: './status-message.component.scss'
})
export class StatusMessageComponent {
  /**
   * Message type - error | info
   * @type {string}
   * @memberof StatusMessageComponent
   */
  @Input() type?: string;

  /**
   * Message content
   * @type {string}
   * @memberof StatusMessageComponent
   */
  @Input() message?: string;

  constructor() {}
}

