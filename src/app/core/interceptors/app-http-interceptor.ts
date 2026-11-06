import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, takeUntil } from 'rxjs';
import { LoaderService } from '../services/loader-service';
import { HttpCancelService } from '../services/http-cancel-service';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const cancel = inject(HttpCancelService);
  const loader = inject(LoaderService);

  loader.start();

  return next(req).pipe(
    takeUntil(cancel.pendingHTTPRequests$),
    finalize(() => loader.complete())
  );
};
