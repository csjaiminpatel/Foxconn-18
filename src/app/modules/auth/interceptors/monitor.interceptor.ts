import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MonitorInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const begin = performance.now();
    return next.handle(request).pipe(
      finalize(() => {
        this.logRequestTime(begin, request.url, request.method);
      })
    );
  }
  private logRequestTime(startTime: number, url: string, method: string) {
    const requestDuration = `${performance.now() - startTime}`;
    if (parseFloat(requestDuration) > 2000) {
      console.log(`HTTP ${method} %c${url} - %c${requestDuration} %c milliseconds`, "color: blue", "color:red", "color: black");
    }
  }
}
