import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationState } from '../store/authentication.state';
import { ConfigService } from '../../../services/config.service';

@Injectable()
export class VisualizatorInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store, private readonly injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const plantSnapshot = this.store.selectSnapshot(AuthenticationState.activePlant) as { value: number; viewValue: string };
    let plantId = plantSnapshot && plantSnapshot.value ? plantSnapshot.value : '';
    plantId = plantId.toString();

    return Observable.create((observer: any) => {
      const item = this.injector.get(ConfigService);
      observer.next(item);
      observer.complete();
    }).pipe(
      mergeMap((res: ConfigService) => {
        const clonedReq = req.clone({
          params: req.params.set('plantId', plantId)
        });
        return next.handle(clonedReq);
      })
    );
  }
}


