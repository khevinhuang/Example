import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { EmployeeService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private service: EmployeeService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const employee = this.service.value;
        if (employee) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}