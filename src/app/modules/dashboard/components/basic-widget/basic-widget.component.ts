import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'orion-platform-basic-widget',
  standalone: true,
  imports: [MatCardModule,MatIconModule,CommonModule],
  templateUrl: './basic-widget.component.html',
  styleUrl: './basic-widget.component.scss'
})
export class BasicWidgetComponent {
    private router = inject(Router);
  

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() link?: string;
  @Input() version?: string;
  @Input() widgetClass?: string;



  constructor() {
    console.log("🔥 BasicWidgetComponent constructor");
  }

  navigateTo(path?: string) {
    if (!path) {
      return;
    }
    this.router.navigate(['/' + path]);
  }
}
