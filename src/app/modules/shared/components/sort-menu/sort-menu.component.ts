import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import _ from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'orion-platform-sort-menu',
  standalone: true,
  imports: [ CommonModule, MatIconModule, TranslateModule,MatMenuModule],
  templateUrl: './sort-menu.component.html',
  styleUrl: './sort-menu.component.scss'
})
export class SortMenuComponent implements OnInit {
  @ViewChild('mainMenu', {static: true}) mainMenu?: MatMenu;
  refresh$ = new Subject<any>();
  @Input() currentSelection?: string;
  @Input() childMenu: string[] = ['partNumber', 'vendorCode'];
  constructor() {}

  ngOnInit() {}
  setSort(data : any) {
    this.currentSelection = data ? data : null;
    this.refresh$.next(data);
  }
  isSelected(comparand : any) {
    return _.isEqual(this.currentSelection, comparand);
  }
}
