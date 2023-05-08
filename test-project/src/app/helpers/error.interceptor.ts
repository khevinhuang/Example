import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EmployeeService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private service: EmployeeService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.service.value) {
                this.service.logout();
            }

            const error = err.error?.message || err.statusText;
            console.error(err);
            return throwError(() => error);
        }))
    }
}