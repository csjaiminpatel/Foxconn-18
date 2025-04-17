import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { Helper } from '../../helper';
import { ReceiveNotificationMessage } from '../../services/signal-r.service';
import { SignalrNotificationService } from '../../services/signalr-notification.service';
import { SanitizedHtmlPipe } from '../../pipe/sanitized-html.pipe';

@Component({
  selector: 'orion-platform-signalr-notification',
  standalone: true,
  imports: [MatIconModule, CommonModule,SanitizedHtmlPipe],
  templateUrl: './signalr-notification.component.html',
  styleUrl: './signalr-notification.component.scss'
})
export class SignalrNotificationComponent implements OnInit {
  private store = inject(Store);
  private _notificationService = inject(SignalrNotificationService);


  notifications: ReceiveNotificationMessage[] = [];
  rendererListenersHandler: { key: string; rendererListeners: any[] }[] = [];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._notificationService.getAlert().subscribe((alert: ReceiveNotificationMessage) => {
      this.notifications = [];
      if (!alert) {
        this.notifications = [];
        return;
      }

      //Destroy all renderer listeners
      this.destroyRendererListeners();
      this.rendererListenersHandler = [];
      console.log(alert.ShortMessage);
      alert.ShortMessage = Helper.addLinkEventsOnHtmlString(alert.ShortMessage);
      setTimeout(() => {
        const currentRendererListeners = Helper.setClickEventsOnInnerTemplate(
          this.store,
          document,
          this.elRef,
          this.renderer
        );
        this.rendererListenersHandler.push({
          key: alert.Id,
          rendererListeners: currentRendererListeners,
        });
        Helper.detectChanges(this.ref);
      }, 200);

      this.notifications.push(alert);
      setTimeout(() => {
        const currentRendererListeners = this.rendererListenersHandler.find(
          (rendererListener) => rendererListener.key == alert.Id
        );
        if (currentRendererListeners) {
          Helper.destroyRendererListener(currentRendererListeners.rendererListeners);
        }
        this.notifications = this.notifications.filter((x) => x !== alert);
      }, 4000);
    });
  }

  ngOnDestroy() {
    this.destroyRendererListeners();
  }

  destroyRendererListeners() {
    for (let i = 0; i < this.rendererListenersHandler.length; i++) {
      Helper.destroyRendererListener(this.rendererListenersHandler[i].rendererListeners);
    }
  }

  removeNotification(notification: ReceiveNotificationMessage) {
    this.notifications = this.notifications.filter((x) => x !== notification);
  }
}
