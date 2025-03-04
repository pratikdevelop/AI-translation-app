


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],

  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  selectedRole: string = '';
  profileImage: File | null = null;
  resume: File | null = null;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      phone: [''],
      username: [''],
      status: ['offline'],
      description: [''],
      portfolioUrl: [''],
      dateOfBirth: [''],
      location: [''],
      gender: ['Male'],
      skills: [''],
      experience: [''],
      education: [''],
      linkedinUrl: [''],
      companyName: [''],
      companyWebsite: [''],
      companyDescription: ['']
    });
  }

  onFileChange(event: Event, field: 'profileImage' | 'resume') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      field === 'profileImage'
        ? this.profileImage = input.files[0]
        : this.resume = input.files[0];
    }
  }

  validateForm(): boolean {
    if (!this.signupForm.get('role')?.value) {
      alert('Please select a role.');
      return false;
    }
    if (!this.signupForm.get('email')?.value || !this.signupForm.get('name')?.value) {
      alert('Please fill in all required personal information.');
      return false;
    }
    if (this.signupForm.get('role')?.value === 'job_seeker') {
      if (!this.signupForm.get('skills')?.value || !this.signupForm.get('experience')?.value) {
        alert('Please fill in all required job seeker fields.');
        return false;
      }
    } else if (this.signupForm.get('role')?.value === 'employer') {
      if (!this.signupForm.get('companyName')?.value || !this.signupForm.get('companyWebsite')?.value) {
        alert('Please fill in all required employer fields.');
        return false;
      }
    }
    return true;
  }

  onSubmit() {
    if (this.validateForm()) {
      const formData = new FormData();
      Object.entries(this.signupForm.value).forEach(([key, value]: any) => {
        if (value) formData.append(key, value);
      });
      if (this.profileImage) formData.append('profileImage', this.profileImage);
      if (this.resume) formData.append('resume', this.resume);

      console.log('Form submitted:', Object.fromEntries(formData));
      alert('Form submitted successfully!');
    }
  }
}