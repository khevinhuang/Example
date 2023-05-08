import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { EmployeeService } from 'src/app/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  regisForm!: FormGroup;
  isloading = false;
  submitted = false;
  errorMessage?: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeService,
  ) { }
  
  ngOnInit(): void {
    this.regisForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [null],
      birthDate: [null],
      basicSalary: [null],
      status: [null],
      group: [null],
      description: [null],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.regisForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.regisForm.invalid) {
        return;
    }

    this.isloading = true;
    this.service.register(this.regisForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['../login'], { relativeTo: this.route });
          },
          error: error => {
            this.isloading = false;
            this.errorMessage = error;
          }
      });
  }

  onCancel() {
    this.router.navigate(['/login'], { relativeTo: this.route })
  }
}
