import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DialogData } from '../../../shared/DTOs/dialog-data.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { takeUntil } from 'rxjs';
import { HandleLinkEventsError, HandleLinkEventsSuccess } from '../../stores/supply-visibility/supply-visibility.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'orion-platform-link-events-dialog',
  standalone: true,
  imports: [ProgressSpinnerComponent, DialogComponent],
  templateUrl: './link-events-dialog.component.html',
  styleUrl: './link-events-dialog.component.scss'
})
export class LinkEventsDialogComponent implements OnInit {
  private action$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private dialogRef: MatDialogRef<LinkEventsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.setInitialVars();
  }

  ngOnInit() {
    this.catchHandleLinkEventsError();
    this.catchHandleLinkEventsSuccess();
  }

  setInitialVars() {
    if (this.data) {
      this.data.title = this.data.title === undefined ? '' : this.data.title;
      this.data.hideHeader =
        this.data.hideHeader === undefined && this.data.title == '' ? true : this.data.hideHeader;
      this.data.hideFooter = this.data.hideFooter === undefined ? true : this.data.hideFooter;
      this.data.hideActions = this.data.hideActions === undefined ? true : this.data.hideActions;
      this.data.hideClose = this.data.hideClose === undefined ? true : this.data.hideClose;
      this.data.disableClose =
        this.data.disableClose === undefined ? false : this.data.disableClose;
    }
  }

  catchHandleLinkEventsError() {
    this.action$
      .pipe(ofActionDispatched(HandleLinkEventsError), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
  catchHandleLinkEventsSuccess() {
    this.action$
      .pipe(ofActionDispatched(HandleLinkEventsSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
