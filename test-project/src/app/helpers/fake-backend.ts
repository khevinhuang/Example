import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

const employeeKey = 'employee-list';
let employees: any[] = JSON.parse(localStorage.getItem(employeeKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/login') && method === 'POST':
                    return authenticate();
                case url.endsWith('/register') && method === 'POST':
                    return register();
                case url.endsWith('/employee-list') && method === 'GET':
                    return getUsers();
                case url.match(/\/employee\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/employee\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/employee\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    return next.handle(request);
            }    
        }

        function authenticate() {
            const { username, password } = body;
            const employee = employees.find(x => x.username === username && x.password === password);
            if (!employee) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(employee),
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (employees.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }
            user.id = employees.length ? Math.max(...employees.map(x => x.id)) + 1 : 1;
            employees.push(user);
            localStorage.setItem(employeeKey, JSON.stringify(employees));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(employees.map(x => basicDetails(x)));
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = employees.find(x => x.id === idFromUrl());
            return ok(basicDetails(user));
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = employees.find(x => x.id === idFromUrl());

            if (!params.password) {
                delete params.password;
            }
            Object.assign(user, params);
            localStorage.setItem(employeeKey, JSON.stringify(employees));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            employees = employees.filter(x => x.id !== idFromUrl());
            localStorage.setItem(employeeKey, JSON.stringify(employees));
            return ok();
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500));
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user: any) {
            const {
                id, username, firstName, lastName, email, birthDate, basicSalary, group, description, status
            } = user;
            return {
                id, username, firstName, lastName, email, birthDate, basicSalary, group, description, status
            };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};