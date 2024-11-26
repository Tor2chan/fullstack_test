import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,  
  FormsModule          
} from '@angular/forms';

@Component({
  selector: 'app-login  ',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  
    FormsModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  loginForm: FormGroup;
  submitted = false;  

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;  
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}