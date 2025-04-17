import { Component, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PanelTitleComponent } from '../panel-title/panel-title.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PanelDescription } from '../../models/panelDto';

@Component({
  selector: 'orion-platform-panel',
  standalone: true,
  imports: [PanelTitleComponent,MatIconModule,CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnDestroy {
  @Input() icon?: string;
  @Input() module?: string;
  @Input() title?: string;
  @Input() panelTitle?: string;
  @Input() description?: PanelDescription;
  @Input() width?: string;
  @Input() titleClass: string = 'primary';
  @Input() class?: string;

  subscription: Subscription = new Subscription();

  collapsedPanel = false;
  screenWidth = '';
  panelId = 0;


  constructor() {
    this.panelId += Math.floor(Math.random() * 1000000);
    this.titleClass = this.titleClass ? this.titleClass : 'primary';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCollapsed(){
    this.collapsedPanel = false;
  }
}

