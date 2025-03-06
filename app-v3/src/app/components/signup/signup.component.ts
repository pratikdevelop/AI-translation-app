// signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-signup',
  standalone: true,
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
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  personalInfoGroup: FormGroup;
  roleSpecificGroup: FormGroup;
  skillAndLanguageGroup: FormGroup;

  // Chips and Autocomplete properties
  skillCtrl = new FormControl('');
  languageCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  availableSkills: string[] = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Python', 'Java'];
  availableLanguages: string[] = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  filteredSkills: Observable<string[]>;
  filteredLanguages: Observable<string[]>;

  constructor(private fb: FormBuilder) {
    // Main signup form with all controls
    this.signupForm = this.fb.group({
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      phone: ['', Validators.pattern('^[0-9+()-]*$')],
      username: [''],
      profileImage: [null],
      status: ['offline'],
      description: [''],
      dateOfBirth: [''],
      location: [''],
      gender: ['P'],
      resume: [null],
      linkedinUrl: ['', Validators.pattern('https?://.+')],
      companyName: [''],
      companyWebsite: ['', Validators.pattern('https?://.+')],
      companyDescription: [''],
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      portfolios: this.fb.array([]),
      addresses: this.fb.array([]),
      skills: [[]], // Initialize as empty array
      languages: [[]] // Initialize as empty array
    });

    // Step-specific form groups
    this.personalInfoGroup = this.fb.group({
      email: this.signupForm.get('email'),
      name: this.signupForm.get('name'),
      phone: this.signupForm.get('phone'),
      username: this.signupForm.get('username'),
      profileImage: this.signupForm.get('profileImage'),
      status: this.signupForm.get('status'),
      description: this.signupForm.get('description'),
      dateOfBirth: this.signupForm.get('dateOfBirth'),
      location: this.signupForm.get('location'),
      gender: this.signupForm.get('gender')
    });

    this.roleSpecificGroup = this.fb.group({
      resume: this.signupForm.get('resume'),
      linkedinUrl: this.signupForm.get('linkedinUrl'),
      companyName: this.signupForm.get('companyName'),
      companyWebsite: this.signupForm.get('companyWebsite'),
      companyDescription: this.signupForm.get('companyDescription')
    });

    this.skillAndLanguageGroup = this.fb.group({
      skills: this.signupForm.get('skills'),
      languages: this.signupForm.get('languages')
    });

    // Role-based validation
    this.signupForm.get('role')?.valueChanges.subscribe(role => {
      this.updateRoleValidators(role);
    });

    // Autocomplete filtering
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(''),
      map((skill: string | null) => (skill ? this._filterSkills(skill) : this.availableSkills.slice()))
    );

    this.filteredLanguages = this.languageCtrl.valueChanges.pipe(
      startWith(''),
      map((language: string | null) => (language ? this._filterLanguages(language) : this.availableLanguages.slice()))
    );
  }

  // FormArray getters
  get experiences() { return this.signupForm.get('experiences') as FormArray; }
  get educations() { return this.signupForm.get('educations') as FormArray; }
  get portfolios() { return this.signupForm.get('portfolios') as FormArray; }
  get addresses() { return this.signupForm.get('addresses') as FormArray; }

  // Role-specific validation
  updateRoleValidators(role: string) {
    if (role === 'job_seeker') {
      this.signupForm.get('resume')?.setValidators(Validators.required);
      this.signupForm.get('companyName')?.clearValidators();
      this.signupForm.get('companyWebsite')?.clearValidators();
      this.signupForm.get('companyDescription')?.clearValidators();
    } else if (role === 'employer') {
      this.signupForm.get('companyName')?.setValidators(Validators.required);
      this.signupForm.get('companyWebsite')?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      this.signupForm.get('companyDescription')?.clearValidators();
      this.signupForm.get('resume')?.clearValidators();
    } else {
      this.signupForm.get('resume')?.clearValidators();
      this.signupForm.get('companyName')?.clearValidators();
      this.signupForm.get('companyWebsite')?.clearValidators();
      this.signupForm.get('companyDescription')?.clearValidators();
    }
    this.signupForm.get('resume')?.updateValueAndValidity();
    this.signupForm.get('companyName')?.updateValueAndValidity();
    this.signupForm.get('companyWebsite')?.updateValueAndValidity();
    this.signupForm.get('companyDescription')?.updateValueAndValidity();
  }

  // File upload handler
  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.signupForm.patchValue({ [field]: file });
    }
  }

  // Experience methods
  addExperience() {
    const expGroup = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrent: [false],
      description: ['']
    });
    this.experiences.push(expGroup);
  }

  removeExperience(index: number) {
    this.experiences.removeAt(index);
  }

  // Education methods
  addEducation() {
    const eduGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrent: [false],
      description: ['']
    });
    this.educations.push(eduGroup);
  }

  removeEducation(index: number) {
    this.educations.removeAt(index);
  }

  // Portfolio methods
  addPortfolio() {
    const portGroup = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.portfolios.push(portGroup);
  }

  removePortfolio(index: number) {
    this.portfolios.removeAt(index);
  }

  // Address methods
  addAddress() {
    const addrGroup = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zipCode: [''],
      country: [''],
      addressType: ['home', Validators.required],
      isPrimary: [false]
    });
    this.addresses.push(addrGroup);
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  // Skill methods
  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const skills = this.signupForm.get('skills')?.value || [];
      skills.push(value);
      this.signupForm.get('skills')?.setValue(skills);
    }
    event.chipInput!.clear();
    this.skillCtrl.setValue(null);
  }

  removeSkill(skill: string): void {
    const skills = this.signupForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);
    if (index >= 0) {
      skills.splice(index, 1);
      this.signupForm.get('skills')?.setValue(skills);
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    const skills = this.signupForm.get('skills')?.value || [];
    skills.push(event.option.viewValue);
    this.signupForm.get('skills')?.setValue(skills);
    this.skillCtrl.setValue(null);
  }

  // Language methods
  addLanguage(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const languages = this.signupForm.get('languages')?.value || [];
      languages.push(value);
      this.signupForm.get('languages')?.setValue(languages);
    }
    event.chipInput!.clear();
    this.languageCtrl.setValue(null);
  }

  removeLanguage(language: string): void {
    const languages = this.signupForm.get('languages')?.value || [];
    const index = languages.indexOf(language);
    if (index >= 0) {
      languages.splice(index, 1);
      this.signupForm.get('languages')?.setValue(languages);
    }
  }

  selectedLanguage(event: MatAutocompleteSelectedEvent): void {
    const languages = this.signupForm.get('languages')?.value || [];
    languages.push(event.option.viewValue);
    this.signupForm.get('languages')?.setValue(languages);
    this.languageCtrl.setValue(null);
  }

  private _filterSkills(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableSkills.filter(skill => skill.toLowerCase().includes(filterValue));
  }

  private _filterLanguages(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableLanguages.filter(language => language.toLowerCase().includes(filterValue));
  }

  nextStep(): void {
    console.log('Form values:', this.signupForm.value);
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Complete Form Data:', this.signupForm.value);
      // Add your submission logic here
    } else {
      console.log('Form invalid');
    }
  }
}