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
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/user/user.selectors';
import { Router } from '@angular/router';

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
  portfolioExists = false;
  isEditing = false;
  api = inject(ApiService);
  store = inject(Store);
  router = inject(Router);

  mstrid = '';
  portfolioId: string | null = null; // backend portfolio id

  professions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'DevOps Engineer',
    'Other',
  ];

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.store.select(selectCurrentUser).subscribe((user) => {
      if (user && user.mstrid) {
        this.mstrid = user.mstrid;
        this.checkExistingPortfolio();
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.portfolioForm = this.fb.group({
      mstrid: [''],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profession: ['', [Validators.required]],
      otherProfession: [''],
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

  /** Check if a portfolio exists for the current user */
  checkExistingPortfolio(): void {
    this.api.get(`portfolios/mstrid/${this.mstrid}`).subscribe({
      next: (res: any) => {
        if (res && Object.keys(res).length) {
          this.portfolioExists = true;
          this.portfolioId = res._id; // assuming API returns portfolio id
          this.populateForm(res);
          this.portfolioForm.disable(); // make readonly
        }
      },
      error: () => {
        console.log('No existing portfolio found for this user.');
      },
    });
  }

  /** Populate form with existing portfolio data */
  populateForm(data: any): void {
    this.portfolioForm.patchValue({
      ...data,
      portfolioDate: data.portfolioDate ? new Date(data.portfolioDate) : null,
      otherProfession: this.professions.includes(data.profession)
        ? ''
        : data.profession,
    });
  }

  /** Enable edit mode */
  enableEdit(): void {
    this.isEditing = true;
    this.portfolioForm.enable();
  }

  /** Cancel edit mode */
  cancelEdit(): void {
    this.isEditing = false;
    this.portfolioForm.disable();
  }

  /** Open portfolio view in new tab */
  openPortfolioView(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/user/portfolio/${this.mstrid}`])
    );
    window.open(url, '_blank');
  }

  /** Handle save or create */
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

    const formValue = { ...this.portfolioForm.value };
    if (formValue.profession === 'Other') {
      formValue.profession = formValue.otherProfession || 'Other';
    }
    delete formValue.otherProfession;

    formValue.mstrid = this.mstrid;
    formValue.portfolioDate = formValue.portfolioDate
      ? this.portfolioForm.value.portfolioDate.toISOString().split('T')[0]
      : null;

    this.isSubmitting = true;

    if (this.isEditing && this.mstrid) {
      // Update existing portfolio
      this.api.put(`portfolios/edit/${this.mstrid}`, formValue).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.message.success('Portfolio updated successfully!');
          this.isEditing = false;
          this.portfolioForm.disable();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message.error(
            'Failed to update portfolio. ' + (err.error?.message || '')
          );
        },
      });
    } else {
      // Create new portfolio
      this.api.post('create-portfolio', formValue).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.message.success('Portfolio created successfully!');
          this.portfolioExists = true;
          this.portfolioId = res.id;
          this.portfolioForm.disable();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.message.error(
            'Failed to create portfolio. ' + (err.error?.message || '')
          );
        },
      });
    }
  }

  resetForm(): void {
    this.portfolioForm.reset();
  }
}
