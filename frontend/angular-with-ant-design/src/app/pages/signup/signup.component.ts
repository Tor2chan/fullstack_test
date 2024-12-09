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
      username: ['', [
        Validators.required, 
        Validators.minLength(6),
      ]],      
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

    // Trim ค่า username
    const usernameControl = this.loginForm.get('username');
    if (usernameControl?.value) {
      usernameControl.setValue(usernameControl.value.trim());
    }

    if (this.loginForm.invalid) {
      if (usernameControl?.hasError('required')) {
        this.dialogMessage = 'Please enter username';
      } else if (usernameControl?.hasError('minlength')) {
        this.dialogMessage = 'Username must be at least 6 characters';
      } else if (usernameControl?.hasError('pattern')) {
        this.dialogMessage = 'Username must contain only letters';
      } else if (this.loginForm.get('email')?.hasError('invalidEmail')) {
        this.dialogMessage = 'Please enter a correct email';
      } else if (this.loginForm.get('name')?.hasError('invalidName')) {
        this.dialogMessage = 'Please enter a correct name (only text)';
      } else if (this.loginForm.get('password')?.hasError('invalidPassword')) {
        this.dialogMessage = 'Password must contain at least one letter and one number';
      }
      this.showDialog();
      return;
    }

    const formValue = this.loginForm.value;
    const newUser: Partial<User> = {
      email: formValue.email,
      username: formValue.username,
      name: formValue.name,
      password: formValue.password,
      role: 'user', 
    };

    const isDuplicateUsername = this.users.some(user => user.username === formValue.username);
    if (isDuplicateUsername) {
      this.dialogMessage = 'This username already exists';
      this.showDialog();
      return;
    }

    const isDuplicateEmail = this.users.some(user => user.email === formValue.email);
    if (isDuplicateEmail) {
      this.dialogMessage = 'This email already exists';
      this.showDialog();
      return;
    }

    this.userService.addUser(newUser as User).subscribe({
      next: (user) => {
        this.users.push(user);
        this.loginForm.reset(); 
        this.submitted = false;
        // this.dialogMessage = 'User added successfully';
        // this.showDialog();
        this.home_redirect();
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.dialogMessage = 'Error occurred while adding user';
        this.showDialog();
      },
    });
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