import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  SignupForm: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmpassword: FormControl<string | null>;
    email: FormControl<string | null>;
  }>;
  submitted = false;
  passwordMismatch = false;  

  constructor(private fb: FormBuilder) {
    this.SignupForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
  }

  passwordMatchValidator(): boolean {
    const password = this.SignupForm.get('password')?.value;
    const confirmPassword = this.SignupForm.get('confirmpassword')?.value;
    return password === confirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.passwordMismatch = !this.passwordMatchValidator();  
    if (this.SignupForm.valid && !this.passwordMismatch) {
      console.log('Form submitted:', this.SignupForm.value);
    }
  }
}
