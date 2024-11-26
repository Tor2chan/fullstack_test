import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { UserService, User } from '../../services/user.service';

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
  users: User[] = [];
  newUser: Partial<User> = {};

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
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

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  home_redirect(){
    this.router.navigate(['home']);
  }

  addUser(): void {
    if (this.newUser.name && this.newUser.email && this.newUser.username && this.newUser.password) {
  
      if (!this.newUser.role) {
        this.newUser.role = "user";
      }
  
      this.userService.addUser(this.newUser as User).subscribe({
        next: (user) => {
          this.users.push(user);
          this.newUser = {};
          this.home_redirect();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
    }
  }


}