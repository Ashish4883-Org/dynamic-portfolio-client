import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { tap } from 'rxjs';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NzNotificationService);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const res: any = event.body;
          if (res?.message) {
            notification.success('Success', res.message);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Something went wrong!';
        notification.error('Error', msg);
      },
    })
  );
};
