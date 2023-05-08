import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { Employee } from 'src/app/models';
import { EmployeeService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  employee?: Employee | null;
  employees?: any;

  totalData?: number;
  
  dataSource: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: Array<string> = [
    "firstName",
    "lastName",
    "email",
    "birthDate",
    "basicSalary",
    "group",
    "description",
    "action"
  ];

  constructor(
    private router: Router,
    private service: EmployeeService
  ) {
    this.service.employeeData.subscribe(x => this.employee = x);
    
    this.employees = localStorage.getItem('employee-list');
    this.dataSource = new MatTableDataSource(JSON.parse(this.employees))
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource.sort = this.sort || null;
    this.dataSource._updateChangeSubscription();
  }

  ngOnInit(): void {
    this.service.getAll()
      .pipe(first())
      .subscribe((employees) => {
        this.employees = employees;
        this.totalData = employees.length;
      });
  }

  logout() {
    this.service.logout();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(id: number) {
    this.router.navigate([`edit-employee/${id}`])
  }

  goDetail(id: number) {
    this.router.navigate([`employee-detail/${id}`])
  }

  deleteUser(id: any) {
    const user: any = this.employees?.find((x: any) => x.id === id);
    user.status = true;
    this.service.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.employees = this.employees!.filter((x: any) => x.id !== id);
          this.totalData = this.employees?.length;
          this.dataSource.data = this.dataSource.data.filter((item) => item.id != id)
          this.dataSource._updateChangeSubscription();
        });
  }
}
