import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'orion-platform-progress-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss'
})
export class ProgressSpinnerComponent {
  @Input() diameter = 35;
  @Input() value: number = 0;
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() color: ThemePalette = 'primary';
}
