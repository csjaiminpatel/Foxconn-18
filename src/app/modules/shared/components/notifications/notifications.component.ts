import { ChangeDetectorRef, Component, ElementRef, Inject, inject, Renderer2 } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { GetNotificationDetails, GetNotificationDetailsError, GetNotificationDetailsSuccess, GetNotificationsSuccess, SetAllNotificationsAsRead } from '../../../dashboard/stores/supply-visibility/supply-visibility.actions';
import { SVNotification } from '../../../dashboard/models/sv-notification.model';
import { SupplyVisibilityState } from '../../../dashboard/stores/supply-visibility/supply-visibility.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Helper } from '../../helper';
import { CommonModule, DatePipe } from '@angular/common';
import { SanitizedHtmlPipe } from '../../pipe/sanitized-html.pipe';

@Component({
  selector: 'orion-platform-notifications',
  standalone: true,
  imports: [DialogComponent, MatIconModule, ProgressSpinnerComponent, TranslateModule, DatePipe, CommonModule, SanitizedHtmlPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  private ngUnsubscribe = new Subject();

  private translate = inject(TranslateService);
  private store = inject(Store);
  private actions$ = inject(Actions);


  notificationId?: string;
  notificationDetail?: SVNotification;
  notifications: SVNotification[] = [];
  loadingPosition: 'MIDDLE' | 'RIGHT' | 'NONE' = 'NONE';
  isInitiated = false;
  customClasses = 'custom-notification-class';
  rendererListeners?: any[] = [];

  notifications$: Observable<SVNotification[]> = this.store.select(SupplyVisibilityState.getNotificationsList);
  constructor(
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.notifications$.subscribe((notifications: SVNotification[]) => {
      this.notifications = notifications;
    });

    this.catchGetNotificationDetailsSuccess();
    this.catchGetNotificationDetailsError();
    this.catchGetNotificationsSuccess();
    // Helper.detachChangeDetection(this.ref);
    this.setNotificationDetails();
  }
  ngAfterViewInit() {
    this.isInitiated = true;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
    this.destroyRendererListeners();
  }
  /**
 * Catch Get Notification Details Success
 * @memberof NotificationsComponent
 */
  catchGetNotificationDetailsSuccess() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationDetailsSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(({ details }) => {
        const that = this;
        that.loadingPosition = 'NONE';
        that.notificationDetail = details;
        if (this.notificationDetail && !this.notificationDetail.isFormatted && this.notificationDetail.message) {
          this.notificationDetail.message = Helper.addLinkEventsOnHtmlString(this.notificationDetail.message);
          this.notificationDetail.isFormatted = true;
        }
        setTimeout(
          () => {
            this.destroyRendererListeners();
            this.rendererListeners = Helper.setClickEventsOnInnerTemplate(
              that.store,
              document,
              that.elRef,
              that.renderer
            );
            that.loadingPosition = 'NONE';
            that.ref.detectChanges();
          },
          that.isInitiated ? 0 : 200
        );
        // }
      });
  }

  destroyRendererListeners() {
    if (this.rendererListeners) {
      Helper.destroyRendererListener(this.rendererListeners);
    }
  }

  catchGetNotificationDetailsError() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationDetailsError), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadingPosition = 'NONE';
        this.notificationDetail = undefined;
      });
  }

  catchGetNotificationsSuccess() {
    this.actions$
      .pipe(ofActionDispatched(GetNotificationsSuccess), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadingPosition = 'NONE';
      });
  }

  setNotificationDetails(id?: string) {
    this.loadingPosition = 'RIGHT';
    if (!id) {
      /*Invoke From Page Header */
      id = this.data.id;
      if (!id) {
        this.loadingPosition = 'NONE';
        return;
      }
    }
    this.notificationId = id;
    this.store.dispatch(new GetNotificationDetails(this.notificationId));
    // this.ref.detectChanges();
  }

  onMarkAllAsRead() {
    this.store.dispatch(new SetAllNotificationsAsRead());
    this.loadingPosition = 'MIDDLE';
  }
}
