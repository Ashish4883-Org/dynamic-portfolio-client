import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { registerUser } from '../../store/user/user.actions';
import { RegisterUser, User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  private store = inject(Store);

  validateForm = this.fb.group(
    {
      fullName: this.fb.control('', [Validators.max(25)]),
      email: this.fb.control('', [Validators.email, Validators.required]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      checkPassword: this.fb.control('', [Validators.required]),
      phoneNumberPrefix: this.fb.control<'+91'>('+91'),
      phoneNumber: this.fb.control('', [Validators.required]),
      role: this.fb.control('user'),
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.checkPassword.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }
    // Generate mstrid: name + random number (1-100)
    const fullName = this.validateForm.value.fullName || '';
    const randomNum = Math.floor(1000 + Math.random() * 9000); // example 4-digit random number

    // Remove spaces, take first 5 chars, and append random number
    const mstrid = `${fullName
      .replace(/\s+/g, '')
      .substring(0, 5)}${randomNum}`;

    // Create RegisterUser object
    const user: RegisterUser = {
      name: this.validateForm.value.fullName!,
      email: this.validateForm.value.email!,
      password: this.validateForm.value.password!,
      number: this.validateForm.value.phoneNumber!,
      prefix: this.validateForm.value.phoneNumberPrefix!,
      role: this.validateForm.value.role!,
      mstrid,
      isPortfolioActive: false,
    };
    console.log('Registering User', user);
    this.store.dispatch(registerUser({ user }));
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('checkPassword')?.value;
    if (!confirm) {
      return { required: true };
    }
    return password === confirm ? null : { passwordMismatch: true };
  }
}
