import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';
import { StorageService } from '../services/storage.service';
import { noAuthList } from './noAuthList';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  isRefreshed = false;

  constructor(
    private authService: AuthService,
    private swalService: SwalService,
    private storageService: StorageService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //attach token to request
    const res = this.addHeaderToken(req, this.authService.getAccessToken());

    return next.handle(res).pipe(
      catchError((error: HttpErrorResponse) => {
        //if token is expired, refresh it and retry the request
        if (
          (error.status === 401 && !this.isRefreshed) ||
          (error.status === 500 && error.error.message === 'TOKEN_EXPIRED')
        ) {
          this.isRefreshed = true;
          //if logined user, logout
          if (this.authService.isLoggedIn()) {
            this.storageService.clean();
            this.swalService.showMessageToHandle(
              'Session Expired',
              'Your session has expired. Please login again.',
              'error',
              this.logout.bind(this)
            );
          }
          //TODO enable when backend implement refresh token
          //this.handleRefreshToken(req, next);
        }
        this.isRefreshed = false;
        return throwError(() => error);
      })
    );
  }

  addHeaderToken(
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

  handleRefreshToken(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.getRefreshToken().pipe(
      switchMap((data: unknown) => {
        //TODO - Check the response of refresh Api and apply it here
        this.authService.saveToken(data);
        const res = this.addHeaderToken(req, data as string);
        return next.handle(res);
      }),
      //if refresh token fails, logout
      catchError((error: HttpErrorResponse) => {
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.authService.logout();
  }
}
