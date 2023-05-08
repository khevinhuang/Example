import { Component } from '@angular/core';

import { EmployeeService } from './services';
import { Employee, dummyData } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  employee?: Employee | null;

  constructor(private service: EmployeeService) {
    this.service.employeeData.subscribe(x => this.employee = x);
  }

  ngOnInit(): void {
    localStorage.setItem('employee-list', JSON.stringify(dummyData))
  }
}
