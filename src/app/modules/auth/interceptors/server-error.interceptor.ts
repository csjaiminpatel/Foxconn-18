import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { LanguageState } from '../store/language/language.state';
import { ERROR } from '../../Enums/error.enum';
import { NotificationService } from '../services/Notification/notification.service';


@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  /*
   * When backend return 401 HTTP status (user is unauthorized) don't show other error messages
   * for example error about insufficient rights 403 status
   */
  static unauthorizedErrorOccurred = false;
  private router = inject(Router);
  private store = inject(Store);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService)

  constructor(
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const languageSnapshot = <{ code: string; language: string; description: string }>(
      this.store.selectSnapshot(LanguageState.getCurrentLang)
    );
    let clonedRequest = req;
    if (languageSnapshot) {
      clonedRequest = req.clone({
        headers: req.headers.append('Accept-Language', languageSnapshot.language),
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: any) => {
        //this.logError(error, clonedRequest.url);
        if (!this.isLoginPage(error) && (!this.isHomePage && !this.isNotifications(error))) {
          const { status } = error;

          switch (status) {
            case ERROR.BAD_REQUEST:
              this.displayForbiddenMessage(false, this.getExtractedErrorMessage(error, req.url));
              break;
            case ERROR.UNAUTHORIZED:
              ServerErrorInterceptor.unauthorizedErrorOccurred = true;
              this.displayForbiddenMessage(true);
              break;
            case ERROR.FORBIDDEN:
              if (ServerErrorInterceptor.unauthorizedErrorOccurred === false) {
                this.displayForbiddenMessage(false, this.getExtractedErrorMessage(error));
              }
              break;
            case ERROR.LARGE_REQUEST:
              // Handle the request which is larger than the server could handle.
              break;
          }
        }

        return throwError(error);
      })
    );
  }

  getExtractedErrorMessage(error: any, url?: string) {

    if (url && url.includes('token')) {
      return;
    }

    const defaultErrorMessage = 'Error occurred, please contact administrator!';

    if (error && error.error) {
      let extractedErrorObj;

      try {
        extractedErrorObj = JSON.parse(error.error);
      } catch (e) {
        extractedErrorObj = error.error;
      }

      // Check for errors object with keys
      if (extractedErrorObj.errors && Object.keys(extractedErrorObj.errors).length > 0) {
        return Object.keys(extractedErrorObj.errors)
          .map(function (x) {
            return extractedErrorObj.errors[x];
          })
          .join('<br>');
      } else if (extractedErrorObj.detail) {
        // Check for the detail message
        return extractedErrorObj.detail;
      }
    }

    // Return the default error message if no other message is found
    return defaultErrorMessage;
  }

  /**
   * Checks if activated route is login
   */
  private isLoginPage = ({ url }: HttpErrorResponse) => url?.includes('/login');

  /*home indication*/
  private isHomePage: boolean = this.router.url.includes('/home');

  private isNotifications = ({ url }: HttpErrorResponse) => url?.includes('/Notifications');

  /**
   * Displays snackbar with message that user access was forbidden
   */
  private displayForbiddenMessage(redirectToHome: boolean, message?: string) {
    const msg = message ? message : this.translate.instant('error.forbidden');
    const snackBarRef = this.notificationService.showError(msg, 5000);

    if (redirectToHome) {
      snackBarRef.afterDismissed().subscribe((info) => {
        this.router.navigate(['/home']);
      });
    }
  }
  /*
  logError(error, reqUrl) {
    const errorDetails = {
      type: 'Unhandled Promise Rejection',
      message: error.message || 'No error message',
      stack: 'No stack trace',
    };

    if (!reqUrl.includes('LogError')) {
      return this.loggingService.logErrorToApi(errorDetails).toPromise();
    }
  }
    */

}
