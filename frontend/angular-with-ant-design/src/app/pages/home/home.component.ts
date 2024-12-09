import { Component} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchRadioComponent } from "./search-radio/search-radio.component";
import { TableAll } from './table-search-all/table-search-all.component';
import { TableEmail } from './table-search-email/table-search-email';
import { TableRole } from './table-search-role/table-search-role';
// import { TableUsername } from './table-search-username/table-search-username';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user-services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RadioButtonModule, TableEmail, TableAll, SearchRadioComponent, InputTextModule, DialogModule, TableRole, ReactiveFormsModule],
  templateUrl: `./home.component.html`,
  styleUrl: './home.component.css'
})

export class HomeComponent {
  users: User[] = [];
  newUser: Partial<User> = {};
  loginForm: FormGroup;
  showAll = true;
  submitted = false;  
  showEmail = false;
  showRole = false;
  email_value: string = '';
  username_value: string = '';
  roles = '';
  showModal = false;
  visible: boolean = false;
  dialogMessage: string = '';

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, ){
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

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));

    if(typeof sessionStorage !== 'undefined'){
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        if (user.role == 'admin') {
          console.log('access admin')
        }
        if (user.role == 'user'){
          this.router.navigate(['user-info']);
        }
      } else {
        this.router.navigate(['signin']); 
      }
    }
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
        this.dialogMessage = 'please enter correct name (only text)';
        this.showDialog();
        return;
      }
      
      if (this.loginForm.get('password')?.invalid) {
        this.dialogMessage = 'password must be at least 6 characters (number and text)';
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
          window.location.reload();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        },
      });
    }
  }

  
  
  reload(){
    window.location.reload()
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }


  showDialog() {
    this.visible = true;
}

  onDialogClose(){
    this.visible = false;
  }

  onSearchAll() {
    this.showAll = true;
    this.showEmail = false;
    this.showRole = false;
  }

  onSearchByEmail(email: string) {
    this.showAll = false;
    this.showEmail = true;
    this.showRole = false;
    this.email_value = email;
  }

  onSearchByRole(roles: string) {
    this.showAll = false;
    this.showEmail = false;
    this.showRole = true;
    this.roles = roles;
  }

  // onSearchByUsername(username: string) {
  //   this.showAll = false;
  //   this.showEmail = false;
  //   this.showUsername = true;
  //   this.username_value = username;
  // }
}

