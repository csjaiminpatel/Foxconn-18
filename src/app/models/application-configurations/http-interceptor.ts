import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../modules/auth/interceptors/jwt.interceptor';

export const jwtInterceptors = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
}