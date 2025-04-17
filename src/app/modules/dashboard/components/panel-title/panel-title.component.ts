import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'orion-platform-panel-title',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './panel-title.component.html',
  styleUrl: './panel-title.component.scss'
})
export class PanelTitleComponent {
  /**
   * Icon name
   * @type {string}
   * @memberof PanelTitleComponent
   */
  @Input() icon?: string;

  /**
   * Module name
   * @type {string}
   * @memberof PanelTitleComponent
   */
  @Input() module?: string;

  /**
   * Title text
   * @type {string}
   * @memberof PanelTitleComponent
   */
  @Input() title?: string;

  /**
   * Title Strip width
   * @type {string}
   * @memberof PanelTitleComponent
   */
  @Input() width?: string;

  @Input() titleClass?: string;

  constructor() {}
}

