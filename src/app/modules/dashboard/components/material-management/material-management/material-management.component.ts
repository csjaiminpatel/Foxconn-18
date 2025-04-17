import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LanguageState } from '../../../../auth/store/language/language.state';
import { ResetSupplyVisibilityAndCommits, SetBasicParameters, TriggerLinkEventCommitDialog } from '../../../stores/supply-visibility/supply-visibility.actions';
import { ResetBufferRules } from '../../../stores/buffer-rule/buffer-rules.actions';
import { ResetAVL } from '../../../stores/approved-vendor-list/approved-vendor-list.actions';
import { CommitDialogFormComponent } from '../../commit-dialog-form/commit-dialog-form.component';

@Component({
  selector: 'orion-platform-material-management',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './material-management.component.html',
  styleUrl: './material-management.component.scss'
})
export class MaterialManagementComponent implements OnInit, OnDestroy {

  private translate = inject(TranslateService);
  private store = inject(Store);
  private ngUnsubscribe = new Subject();

  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);


  constructor(
    private dialog: MatDialog,
    private actions$: Actions) {

      console.log('MaterialManagementComponent'); 
    this.currentLang$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(({ code }: any) => {
      // this.translate.use(code);
    })
  }

  ngOnInit() {
    this.catchTriggerLinkEventCommitDialog();
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetBufferRules());
    this.store.dispatch(new ResetSupplyVisibilityAndCommits());
    this.store.dispatch(new ResetAVL());
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }


  /**
   * Handles notification's link click event (TriggerLinkEventCommitDialog dispatched in sv state)
   */
  catchTriggerLinkEventCommitDialog() {
      this.actions$
        .pipe(ofActionDispatched(TriggerLinkEventCommitDialog), takeUntil(this.ngUnsubscribe))
        .subscribe(({ event }) => {
          const dialogRef = this.dialog.open(CommitDialogFormComponent, {
            width: '80%',
            data: {
              new: false,
              commit: event.eventValue,
              enableDraft: false,
              enableDummyHeader: false,
              actionType: 'edit',
              showPartNumber: true,
              isCommitModule: true,
              isLinkEvent: true,
            },
          });
          dialogRef.afterClosed().subscribe((response) => {
            if (response) {
              this.store.dispatch(
                new SetBasicParameters({
                  plant: '',
                  partNumber: '',
                  vendorCode: '',
                })
              );
            }
          });
        });
  }
}
