import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { VirtualPnGroupsService } from '../../../dashboard/services/Virtual-pn-group/virtual-pn-groups.service';
import { SetPnReviewedSuccess, SetPnReviewedError, DeletePnFlagsSuccess } from '../../../dashboard/stores/supply-visibility/supply-visibility.actions';
import { Helper } from '../../helper';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'orion-platform-base-header',
  standalone: true,
  imports: [],
  template: `<p>base-top-panels works!</p>`,
})
export class BaseHeaderComponent implements OnInit {
  childrenFlags: Map<string, boolean> = new Map<string, boolean>();
  loading: boolean = true;
  subscription: Subscription = new Subscription();
  
  constructor(
    public actions$: Actions,
    public notificationService: NotificationService,
    public dialog: MatDialog,
    public vpnsService: VirtualPnGroupsService,
    public translate: TranslateService
  ) {}

  ngOnInit() {}

  openConfirmationDialog(reviewFlag:any, partNumber:any, isFlagAvailable?:any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('style.changeFlagPnGroupsTitle'),
        content: this.translate.instant('style.changeFlagPnGroupsContent'),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
        positiveBtnColor: 'primary',
        hasBackdrop: true,
        disableClose: true,
      },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(async (result) => {
        result = result ? true : false;

        this.setMarkPnReviewed(reviewFlag, null, isFlagAvailable);
        if (result) {
          this.loading = true;
          //get children pnvc and mark them as reviewed
          const partNumberList = await this.vpnsService.getPartNumbersListForSV(partNumber);
          if (partNumberList) {
            partNumberList.forEach((pnVC:any) => {
              if (reviewFlag == Helper.REVIEW_BUYER_FLAG || reviewFlag == Helper.REVIEW_CUSTOMER_FLAG || reviewFlag == Helper.REVIEW_SUPPLIER_FLAG) {
                this.childrenFlags.set(pnVC.partNumber.trim() + pnVC.vendorCode.trim(), false);
              } else {
                this.childrenFlags.set(pnVC.partNumber.trim() + pnVC.vendorCode.trim(), true);
              }
              this.setMarkPnReviewed(reviewFlag, {
                partNumber: pnVC.partNumber,
                vendorCode: pnVC.vendorCode,
                totalPnList: partNumberList.length
              }, isFlagAvailable);
            });
            this.loading = false;
          } else {
            //No child. Only parent will be marked
          }
        }
      })
    )
  }

  setMarkPnReviewed(reviewFlag:any, pnVcChild?:any, isFlagAvailable?:any) {
    //Overridden in child
  }

  catchSetMarkedPnFlagsSuccess() {
    this.subscription.add(
      this.actions$.pipe(ofActionDispatched(SetPnReviewedSuccess)).subscribe(({pnReviewed}) => {
        if (pnReviewed && pnReviewed.vendorCode != 'VirtualVC' && this.childrenFlags.size) {
          this.childrenFlags.set(pnReviewed.partNumber.trim() + pnReviewed.vendorCode.trim(), true);
          let isAllFlagsMarked = true;
          this.childrenFlags.forEach((value) => {
            if (!value) {
              isAllFlagsMarked = false;
            }
          });
  
          if (isAllFlagsMarked) {
  
            this.notificationService.showMessage(this.translate.instant('style.markedChildrenFlags'));
          }
        }
        else {
          this.vpnsService.setFlagOperation(true);
        }
      })
    )
  }

  catchSetMarkedPnFlagsError() {
    this.subscription.add(
      this.actions$.pipe(ofActionDispatched(SetPnReviewedError)).subscribe(({error, pnReviewed}) => {
        if (pnReviewed && pnReviewed.vendorCode != 'VirtualVC' && this.childrenFlags.size) {
          this.childrenFlags.set(pnReviewed.partNumber.trim() + pnReviewed.vendorCode.trim(), false);
          this.notificationService.showError(
            this.translate.instant('style.markedChildrenFlagsFailed')
          );
        }
      }) 
    )
  }

  catchDeletePnFlagsSuccess() {
    this.subscription.add(
      this.actions$.pipe(ofActionDispatched(DeletePnFlagsSuccess)).subscribe(({pnReviewed}) => {
        if (pnReviewed && pnReviewed.vendorCode != 'VirtualVC' && this.childrenFlags.size) {
          this.childrenFlags.set(pnReviewed.partNumber.trim() + pnReviewed.vendorCode.trim(), false);
          let isAllFlagsMarked = true;
          this.childrenFlags.forEach((value) => {
            if (value) {
              isAllFlagsMarked = false;
            }
          });
          if (isAllFlagsMarked) {
            this.notificationService.showMessage(
              this.translate.instant('style.removedChildrenFlags')
            );
          }
        }
        else {
          this.vpnsService.setFlagOperation(true);
        }
      })
    )
  }
}
