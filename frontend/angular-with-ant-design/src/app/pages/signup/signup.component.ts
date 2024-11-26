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
    this.router.navigate(['/']);
  }

addUser(): void {
  if (this.loginForm.valid) {
    const formValue = this.loginForm.value;
    const newUser: Partial<User> = {
      email: formValue.email,
      username: formValue.username,
      name: formValue.name,
      password: formValue.password,
      role: "user", 
    };

    this.userService.addUser(newUser as User).subscribe({
      next: (user) => {
        this.users.push(user);
        this.loginForm.reset(); 
        this.home_redirect();
      },
      error: (error) => {
        console.error('Error adding user:', error);
      },
    });
  }
}



}