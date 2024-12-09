import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { UserService, User } from '../../services/user-services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  
    FormsModule,
    DialogModule,PasswordModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  loginForm: FormGroup;
  submitted = false;  
  users: User[] = [];
  visible: boolean = false;
  dialogMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        this.emailValidator()
      ]],
      username: ['', Validators.required],
      name: ['', [
        Validators.required, 
        this.nameValidator()
      ]],
      password: ['', [
        Validators.required, 
        this.passwordValidator()
      ]]
    });
  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  // Email Validator
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : {'invalidEmail': {value: control.value}};
    };
  }

  // Name Validator
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nameRegex = /^[ก-๏a-zA-Z\s]+$/;
      const valid = nameRegex.test(control.value);
      return valid ? null : {'invalidName': {value: control.value}};
    };
  }

  // Password Validator
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value;
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const valid = hasLetter && hasNumber;
      return valid ? null : {'invalidPassword': {value: control.value}};
    };
  }

  onSubmit() {
    this.submitted = true;
  }


  addUser(): void {
    this.submitted = true;
    const username = this.loginForm.get('username')?.value;

    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.invalid) {
        this.dialogMessage = 'please enter correct email';
        this.showDialog();
        return;
      }

      if (!username || username.trim() === '') {
        this.dialogMessage = 'please enter username';
        this.showDialog();
        return;
      }

      if (username.length < 6) {
        this.dialogMessage = 'username must be at least 6 characters';
        this.showDialog();
        return;
      }
      
      if (this.loginForm.get('name')?.invalid) {
        this.dialogMessage = 'please enter correct name (only character)';
        this.showDialog();
        return;
      }
      
      if (this.loginForm.get('password')?.invalid) {
        this.dialogMessage = 'password must have 6 character (number and character)';
        this.showDialog();
        return;
      }
    }

    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const newUser: Partial<User> = {
        email: formValue.email,
        username: formValue.username,
        name: formValue.name,
        password: formValue.password,
        role: "user", 
      };

      const isDuplicateUsername = this.users.some(user => user.username === formValue.username);
      if (isDuplicateUsername) {
        this.dialogMessage = "have this username already";
        this.showDialog();
        return;
      }

      const isDuplicateEmail = this.users.some(user => user.email === formValue.email);
      if (isDuplicateEmail) {
        this.dialogMessage = "have this email already";
        this.showDialog();
        return;
      }

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

  showDialog(){
    this.visible = true;
  }

  home_redirect(){
    this.router.navigate(['signin']);
  }

    onDialogClose(){
    this.visible = false;
  }
}