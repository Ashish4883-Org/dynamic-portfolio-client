import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ApiService } from '../../services/api.service';
import { Store } from '@ngrx/store';
import { login, setUser } from '../../store/user/user.actions';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  private store = inject(Store);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true),
  });

  // submitForm(): void {
  //   if (this.validateForm.valid) {
  //     console.log('submit', this.validateForm.value);
  //     this.api.post('login', this.validateForm.value).subscribe(
  //       (res: any) => {
  //         console.log('Login successful', res);
  //         // Dispatch setUser action with user details
  //         this.store.dispatch(setUser({ user: res.user || res }));
  //         this.router.navigate(['/portfolio']);
  //       },
  //       (err) => {
  //         console.error('Login failed', err);
  //       }
  //     );
  //   } else {
  //     Object.values(this.validateForm.controls).forEach((control) => {
  //       if (control.invalid) {
  //         control.markAsDirty();
  //         control.updateValueAndValidity({ onlySelf: true });
  //       }
  //     });
  //   }
  // }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { email, password, remember } = this.validateForm.value;
      this.store.dispatch(
        login({
          email: email!, // non-null assertion
          password: password!,
        })
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
