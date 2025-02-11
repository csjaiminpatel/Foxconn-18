import { inject, Injectable } from '@angular/core';
import { LoggingService } from '../Logging/logging.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as StackTrace from 'stacktrace-js';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {
  private loggingService= inject(LoggingService)
  constructor() { }

  handleError(error: any): void {

    console.error(error);

    if (error instanceof HttpErrorResponse) {
        return;
    }

    StackTrace.fromError(error, { offline: true }).then((stackFrames) => {
        const { fileName, lineNumber, columnNumber } = stackFrames[0];

        const errorDetails = {
            message: error.message || 'No message',
            source: fileName || 'Unknown source',
            lineno: lineNumber || 'Unknown line number',
            colno: columnNumber || 'Unknown column number',
            error: error.stack || 'No stack trace',
        };

        this.loggingService.logErrorToApi(errorDetails).toPromise();
    });
}
}
