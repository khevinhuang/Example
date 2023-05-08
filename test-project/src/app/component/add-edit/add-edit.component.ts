import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { EmployeeService } from 'src/app/services';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent {
  addForm!: FormGroup;
  id?: string;
  title!: string;
  isloading: boolean = false;
  submitting: boolean = false;
  submitted: boolean = false;
  errorMessage?: string;

  currentRoute?: string;
  status?: string;
  isHide: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeService,
  ) {  }

  ngOnInit(): void {
    this.route.url.subscribe((route) => {
      this.currentRoute = route[0].path;
    })
    this.id = this.route.snapshot.params['id'];
    this.addForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
    });

    if (this.id) {
      this.title = 'Edit Data';
      this.isloading = true;
      this.service.getById(this.id)
          .pipe(first())
          .subscribe(x => {
            this.addForm.patchValue(x);
            this.isloading = false;
            this.status = x.status === true ? 'Active' : 'Deactive'
          });
    }
    if(this.currentRoute === 'employee-detail') {
      this.title = 'Profile';
      this.isHide = true;
      this.addForm.controls['username']?.disable();
      this.addForm.controls['firstName']?.disable();
      this.addForm.controls['lastName']?.disable();
      this.addForm.controls['email']?.disable();
      this.addForm.controls['birthDate']?.disable();
      this.addForm.controls['basicSalary']?.disable();
      this.addForm.controls['group']?.disable();
      this.addForm.controls['description']?.disable();
      this.addForm.controls['status']?.disable();
      this.addForm.controls['password']?.disable();
      this.addForm.controls['password']?.disable();
    }else {
      this.title = 'Add New Employee';
    }
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    this.submitting = true;
    this.saveUser()
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigateByUrl('');
          },
          error: error => {
            this.submitting = false;
            this.errorMessage = error;
          }
      })
  }

  private saveUser() {
    return this.id
      ? this.service.update(this.id!, this.addForm.value)
      : this.service.register(this.addForm.value);
  }

  onCancel() {
    this.router.navigate([''], { relativeTo: this.route })
  }
}
