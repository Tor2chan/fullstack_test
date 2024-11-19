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
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})

export class WelcomeComponent {
  loginForm: FormGroup;
  submitted = false;  

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signup_redirect() {
    this.router.navigate(['signup']);  
  }

  onSubmit() {
    this.submitted = true;  
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}