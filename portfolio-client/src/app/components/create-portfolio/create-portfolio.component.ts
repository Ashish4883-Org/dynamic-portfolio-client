import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-portfolio',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    CommonModule,
  ],
  providers: [NzMessageService],
  templateUrl: './create-portfolio.component.html',
  styleUrl: './create-portfolio.component.scss',
})
export class CreatePortfolioComponent {
  portfolioForm!: FormGroup;
  isSubmitting = false;
  api = inject(ApiService);

  professions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'DevOps Engineer',
    'Other',
  ];

  constructor(private fb: FormBuilder, private message: NzMessageService) {}

  ngOnInit(): void {
    this.portfolioForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profession: ['', [Validators.required]],
      otherProfession: [''], // for “Other” option
      about: ['', [Validators.required, Validators.maxLength(300)]],
      skills: [[], [Validators.required]],
      experience: ['', [Validators.required, Validators.min(0)]],
      experienceDescription: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],
      education: ['', [Validators.required, Validators.maxLength(300)]],
      achievements: ['', [Validators.maxLength(500)]],
      projectLink: ['', [Validators.pattern(/https?:\/\/.+/)]],
      github: ['', [Validators.pattern(/https?:\/\/github\.com\/.+/)]],
      portfolioDate: [null, [Validators.required]],
    });
  }

  get showOtherProfession(): boolean {
    return this.portfolioForm.get('profession')?.value === 'Other';
  }

  submitForm(): void {
    if (this.portfolioForm.invalid) {
      Object.keys(this.portfolioForm.controls).forEach((field) => {
        const control = this.portfolioForm.get(field);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
      this.message.error('Please fill all required fields correctly.');
      return;
    }

    // Merge “Other” profession if selected
    const formValue = { ...this.portfolioForm.value };
    if (formValue.profession === 'Other') {
      formValue.profession = formValue.otherProfession || 'Other';
    }
    delete formValue.otherProfession;

    // this.isSubmitting = true;
    // setTimeout(() => {
    //   this.isSubmitting = false;
    //   console.log('Portfolio Submitted:', formValue);
    //   this.message.success('Portfolio submitted successfully!');
    //   this.portfolioForm.reset();
    // }, 1000);
    formValue.portfolioDate = formValue.portfolioDate
      ? this.portfolioForm.value.portfolioDate.toISOString().split('T')[0]
      : null;

    this.api.post('create-portfolio', formValue).subscribe(
      (res: any) => {
        this.isSubmitting = false;
        this.message.success('Portfolio submitted successfully!');
        // this.portfolioForm.reset();
        // Keep form populated
        this.portfolioForm.setValue({
          ...formValue,
          otherProfession: this.showOtherProfession ? formValue.profession : '',
        });
        this.portfolioForm.markAsPristine();
        this.portfolioForm.markAsUntouched();
      },
      (err: any) => {
        this.isSubmitting = false;
        this.message.error(
          'Failed to submit portfolio.' + (err.error?.message || '')
        );
      }
    );
  }

  resetForm(): void {
    this.portfolioForm.reset();
  }
}
