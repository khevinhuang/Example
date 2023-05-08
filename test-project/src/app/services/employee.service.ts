import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Employee } from '../models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private subject: BehaviorSubject<Employee | null>;
    public employeeData: Observable<Employee | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.subject = new BehaviorSubject(JSON.parse(localStorage.getItem('employee-list')!));
        this.employeeData = this.subject.asObservable();
    }

    public get value() {
        return this.subject.value;
    }

    login(username: string, password: string) {
        return this.http.post<Employee>(`${environment.apiUrl}/login`, { username, password })
            .pipe(map(employee => {
                localStorage.setItem('user', JSON.stringify(employee));
                this.subject.next(employee);
                return employee;
            }));
    }

    logout() {
        localStorage.removeItem('user');
        this.subject.next(null);
        this.router.navigate(['/login']);
    }

    register(employee: Employee) {
        return this.http.post(`${environment.apiUrl}/register`, employee);
    }

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employee-list`);
    }

    getById(id: string) {
        return this.http.get<Employee>(`${environment.apiUrl}/employee/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/employee/${id}`, params)
            .pipe(map(x => {
                if (id == this.value?.id) {
                    const employee = { ...this.value, ...params };
                    localStorage.setItem('user', JSON.stringify(employee));
                    this.subject.next(employee);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/employee/${id}`)
            .pipe(map(x => {
                if (id == this.value?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}