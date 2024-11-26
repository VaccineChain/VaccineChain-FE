import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';
import { StorageService } from '../services/storage.service';
import { noAuthList } from './noAuthList';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  //attach token to request
  const res = addHeaderToken(req, inject(AuthService).getAccessToken());

  return next(res).pipe(
    catchError((error: HttpErrorResponse) => {
      //if token is expired, refresh it and retry the request
      if (
        error.status === 401 ||
        (error.status === 500 && error.error.message === 'TOKEN_EXPIRED')
      ) {
        //if logined user, logout
        if (inject(AuthService).isLoggedIn()) {
          inject(StorageService).clean();
          inject(SwalService).showMessageToHandle(
            'Session Expired',
            'Your session has expired. Please login again.',
            'error',
            () => inject(AuthService).logout()
          );
        }
      }
      return throwError(() => error);
    })
  );
}

function addHeaderToken(
  req: HttpRequest<unknown>,
  token: string | null
): HttpRequest<unknown> {
  //do not add header for api in noAuthList
  if (noAuthList.includes(req.url) || !token) return req;

  // Do not set 'Content-Type' header for FormData requests
  if (req.body instanceof FormData) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
