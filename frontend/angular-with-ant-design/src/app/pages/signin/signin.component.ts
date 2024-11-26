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
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  
    FormsModule 
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})

export class SigninComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,  
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // logout() {
  //   sessionStorage.removeItem('sessionUser'); // clear session 
  //   localStorage.removeItem('currentUser');  // clear localstorage
  //   this.router.navigate(['signin']);        
  // }
  
  signup_redirect() {
    this.router.navigate(['signup']);  
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;
  
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.userService.authenticateUser(username, password).subscribe({
        next: (user) => {
          if (user) {
            // save localStorage 
            localStorage.setItem('currentUser', JSON.stringify(user));
  
            // save session
            sessionStorage.setItem('sessionUser', JSON.stringify({ 
              email: user.email,
              username: user.username, 
              name: user.name,
              role: user.role 
            }));
  
            // route and refresh
            if (user.role === 'admin') {
              this.router.navigate(['admin']).then(() => window.location.reload());
            } else {
              this.router.navigate(['user-info']).then(() => window.location.reload());
            } 
          } else {
            this.loginError = true; 
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loginError = true;
        }
      });
    }
  }
  
}