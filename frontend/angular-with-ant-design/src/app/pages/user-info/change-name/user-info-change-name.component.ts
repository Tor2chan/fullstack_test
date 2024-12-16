import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ValidatorFn, AbstractControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserChangeNameService, User } from '../../../services/user-services/user-change-name.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    RadioButtonModule
  ],       
  templateUrl: './user-info-change-name.component.html',
  styleUrl: './user-info-change-name.component.css'
})
export class UserInfoChangeNameComponent implements OnInit {
  loginForm: FormGroup;
  user: User | null = null;
  items: MenuItem[] | undefined;
  currentProfilePicture: string | null = null;
  isNameChanged: boolean = false;
  visible: boolean = false;
  dialogMessage: string = '';
  formattedDate: string | null = null; 
  selectedGender: any = null;

  gender: any[] = [
    { name: 'male', key: 'M' },
    { name: 'female', key: 'F' },
    { name: 'other', key: 'O' },
];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private userService: UserChangeNameService
  ) {
    this.loginForm = this.fb.group({
      name: ['', [
        Validators.required, 
        this.nameValidator()
      ]]
    });
  }

  ngOnInit() {
    
      this.items = [
      { label: 'info', routerLink: 'user-info'},
      { label: 'change general info'}
    ];

    // session
    if (typeof sessionStorage !== 'undefined') {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        this.user = JSON.parse(sessionUser);
        if (this.user?.id === undefined) {
          console.error('User ID is undefined in session storage');
          alert('User session is corrupted. Please log in again.');
          this.router.navigate(['signin']);
        } else {
          console.log('User is logged in:', this.user);
        }
      } else {
        console.log('No user logged in. Redirecting to signin page.');
        this.router.navigate(['signin']);
      }
    }

    // set gender
    this.selectedGender = this.gender.find(g => g.name.toLowerCase() === this.user?.gender?.toLowerCase()) ?? null;  
  }

  onDateSelect(event: Date): void {
    this.formattedDate = this.formatDate(event);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  
  // check name
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nameRegex = /^[ก-๏a-zA-Z\s]+$/; 
      const valid = nameRegex.test(control.value) && 
                    control.value.trim().length >= 2 && 
                    control.value.trim().length <= 50; 
      return valid ? null : {'invalidName': {value: control.value}};
    };
  }

  showDialog() {
    this.visible = true;
  }

  onDialogClose(){
    this.visible = false;
  }

  updateAll() {
    const updateResults = {
      name: false,
      phone: false,
      b_date: false
    };
  
    // Callback function to check all updates
    const checkAllUpdates = () => {
      if (updateResults.name && updateResults.phone && updateResults.b_date) {
        console.log("All updates successful");
        this.router.navigate(['user-info']);
      }
    };
  
    // Call updateName
    this.updateNameWithCallback((success) => {
      updateResults.name = success;
      checkAllUpdates();
    });
  
    // Call updatePhone
    this.updatePhoneWithCallback((success) => {
      updateResults.phone = success;
      checkAllUpdates();
    });
  
    // Call updateB_date
    this.updateB_dateWithCallback((success) => {
      updateResults.b_date = success;
      checkAllUpdates();
    });
  }
  
  // Wrappers to handle callback-based results
  updateNameWithCallback(callback: (success: boolean) => void) {
    if (!this.user?.name.trim()) {
      this.dialogMessage = 'please enter new name';
      this.showDialog();
      callback(false);
      return;
    }
  
    const nameRegex = /^[ก-๏a-zA-Z\s]+$/;
    const isValidName = nameRegex.test(this.user.name) && 
                        this.user.name.trim().length >= 2 && 
                        this.user.name.trim().length <= 50;
  
    if (!isValidName) {
      this.dialogMessage = 'please enter correct name (only character)';
      this.showDialog();
      callback(false);
      return;
    }
  
    if (this.user && this.user.id !== undefined) {
      this.userService.updateName(this.user.id, this.user.name).subscribe({
        next: (updatedUser: User) => {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('sessionUser', JSON.stringify(updatedUser));
            this.user = updatedUser; 
          }
          console.log("change name success");
          callback(true);
        },
        error: (error) => {
          console.error('have some error cant update name', error);
          alert('have some error cant update name');
          callback(false);
        }
      });
    } else {
      console.error('User Not Found');
      alert('User Not Found please login again');
      callback(false);
    }
  }
  
  updatePhoneWithCallback(callback: (success: boolean) => void) {
    if (!this.user?.phone.trim()) {
      this.dialogMessage = 'please enter new phone';
      this.showDialog();
      callback(false);
      return;
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    const isValidPhone = phoneRegex.test(this.user.phone.trim());
  
    if (!isValidPhone) {
      this.dialogMessage = 'please enter number (10)';
      this.showDialog();
      callback(false);
      return;
    }
  
    if (this.user && this.user.id !== undefined) {
      this.userService.updatePhone(this.user.id, this.user.phone).subscribe({
        next: (updatedUser: User) => {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('sessionUser', JSON.stringify(updatedUser));
            this.user = updatedUser;
          }
          console.log("change phone success");
          callback(true);
        },
        error: (error) => {
          console.error('have some error cant update phone', error);
          alert('have some error cant update phone');
          callback(false);
        }
      });
    } else {
      console.error('User Not Found');
      alert('User Not Found please login again');
      callback(false);
    }
  }
  
  updateB_dateWithCallback(callback: (success: boolean) => void) {
    if (this.user && this.user.id !== undefined) {
      if (this.formattedDate) {
        this.user.b_date = this.formattedDate; 
      }
  
      this.userService.updateB_date(this.user.id, this.user.b_date).subscribe({
        next: (updatedUser: User) => {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('sessionUser', JSON.stringify(updatedUser));
            this.user = updatedUser;
          }
          console.log("Change birthday success");
          callback(true);
        },
        error: (error) => {
          console.error('Unable to update birthday', error);
          callback(false);
        }
      });
    } else {
      console.error('User Not Found');
      alert('User Not Found. Please log in again.');
      callback(false);
    }
  }
  
  
  reload() {
    window.location.reload();
  }
}