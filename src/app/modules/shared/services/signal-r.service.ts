import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { Store } from '@ngxs/store';
// import { LogLevel } from 'angular-auth-oidc-client';
import { Subject, Observable } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { SignalrNotificationService } from './signalr-notification.service';

@Injectable({
  providedIn: 'root'
})

class ApplicationHubEvents {
  public static readonly NotificationReceived: string = 'ReceiveNotification';
  //ADD Other Events
}

export interface ReceiveNotificationMessage {
  Id: string;
  Title: string;
  IsRead: boolean;
  DateCreated: Date;
  ShortMessage: string;
}

export class SignalRService {

  private appHubConnection?: HubConnection;
  public isAppHubConnected = false;
  private appHubConnectionStartRequest?: Promise<any>;
  private isTokenReady = new Subject<any>();
  tokenValue: any;

  constructor(
    private configService: ConfigService,
    private signalrNotificationService: SignalrNotificationService,
    protected store: Store
  ) { }

  getTokenReady(): Observable<any> {
    return this.isTokenReady.asObservable();
  }

  setTokenReady(data?: any) {
    this.tokenValue = data;
    this.isTokenReady.next(data);
  }
  /**
   * Init all signalR Hub related stuff
   * avoid changes
   */
  public initSignalRService(token: string): void {
    const that = this;
    if (that.isAppHubConnected) {
      return;
    }
    try {
      const url: string = that.getSignalREndpoint();
      const signalRConfig: IHttpConnectionOptions = that.getSignalRConfig(token);

      that.appHubConnection = new HubConnectionBuilder()
        .withUrl(url, signalRConfig)
        .configureLogging(LogLevel.None)
        .withAutomaticReconnect()
        .build();

      that.registerOnAppServerEvents();
      that.startAppHubConnection();
      that.onCloseAppHubConnection();
    } catch (error) {
      console.log('Error onInit signalR connection', error);
      console.dir(error);
    }
  }

  public reconnectSignalRService(token: string) {
    const that = this;
    if (this.appHubConnection) {
      this.appHubConnection
        .stop()
        .then(() => {
          that.isAppHubConnected = false;
          that.initSignalRService(token);
        })
        .catch((error) => {
          console.log('Error on reconnecting signalR', error);
        });
    }
  }

  /**
   * Register all signalR Hub server method callback here
   */
  private registerOnAppServerEvents(): void {
    const that = this;
    try {
      that.appHubConnection?.on(
        ApplicationHubEvents.NotificationReceived,
        (userId: string, message: string | ReceiveNotificationMessage) => {
          const tMessage: ReceiveNotificationMessage =
            typeof message == 'string' ? JSON.parse(message) : message;

          this.signalrNotificationService.showNotification(tMessage.Title, tMessage.ShortMessage);

          // this.store.dispatch(new GetNotifications());
          // this.store.dispatch(new GetNotificationsUnreadCount());
        }
      );
      //IMPLEMENT Other Events
    } catch (error) {
      console.log('Error on receiving notifications', error);
    }
  }

  /**
   * Start application Hub connection
   */
  private startAppHubConnection(): void {
    const that = this;
    if (that.appHubConnection && !that.isAppHubConnected) {
      that.appHubConnectionStartRequest = that.appHubConnection.start();
      that.appHubConnectionStartRequest
        .then((c) => {
          console.log('Connection to signalR has been established....');
          that.appHubConnectionStartRequest = undefined;
          that.isAppHubConnected = true;
        })
        .catch((e) => {
          console.log('signalR unable to establish a connection...');
          that.appHubConnectionStartRequest = undefined;
          that.isAppHubConnected = false;
        });
    }
  }

  /**
   * After Hub Connection Close Logic
   */
  private onCloseAppHubConnection(): void {
    const that = this;
    that.appHubConnection?.onclose(function (e?: Error) {
      if (e) {
        console.log('SignalR onClose Error', e);
      }
      //that.isAppHubConnected = false;
    });
  }

  private getSignalREndpoint(): string {
    return `${this.configService.getSettings('signalRHub')}`;
  }

  private getSignalRConfig(token: string): IHttpConnectionOptions {
    return {
      accessTokenFactory: () => {
        return token;
      },
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      //ADD other settings
    };
  }
}
