import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ValidatorFn, AbstractControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserChangeNameService, User } from '../../../services/user-services/user-change-name.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    ButtonModule
  ],       
  templateUrl: './user-info-change-name.component.html',
  styleUrl: './user-info-change-name.component.css'
})
export class UserInfoChangeNameComponent implements OnInit {
  loginForm: FormGroup;
  user: User | null = null;
  newName: string = '';
  items: MenuItem[] | undefined;
  currentProfilePicture: string | null = null;
  isNameChanged: boolean = false;
  visible: boolean = false;
  dialogMessage: string = '';

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
      { label: 'change-name'}
    ];

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
  }

  // ฟังก์ชันตรวจสอบชื่อ
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nameRegex = /^[ก-๏a-zA-Z\s]+$/; // รองรับภาษาไทยและอังกฤษ
      const valid = nameRegex.test(control.value) && 
                    control.value.trim().length >= 2 && // ชื่ออย่างน้อย 2 ตัวอักษร
                    control.value.trim().length <= 50; // จำกัดความยาวสูงสุด
      return valid ? null : {'invalidName': {value: control.value}};
    };
  }

  showDialog() {
    this.visible = true;
  }

  onDialogClose(){
    this.visible = false;
  }

  updateName() {
    // ตรวจสอบชื่อว่างเปล่า
    if (!this.newName.trim()) {
      this.dialogMessage = 'please enter new name';
      this.showDialog();
      return;
    }
  
    // ตรวจสอบความถูกต้องของชื่อโดยตรง
    const nameRegex = /^[ก-๏a-zA-Z\s]+$/;
    const isValidName = nameRegex.test(this.newName) && 
                        this.newName.trim().length >= 2 && 
                        this.newName.trim().length <= 50;
    
    if (!isValidName) {
      // ชื่อไม่ถูกต้อง
      this.dialogMessage = 'please enter correct name (only character)';
      this.showDialog();
      return;
    }

    // ตรวจสอบว่ามี User และ ID
    if (this.user && this.user.id !== undefined) {  
      this.userService.updateName(this.user.id, this.newName).subscribe({
        next: (updatedUser) => {
          // อัปเดต Session Storage
          if (typeof sessionStorage !== 'undefined') {
            const updatedSessionUser = { ...this.user, name: updatedUser.name };
            sessionStorage.setItem('sessionUser', JSON.stringify(updatedSessionUser));
            
            // อัปเดต Local User Object
            this.user = updatedSessionUser;
          } 
          
          console.log("change name success")
          this.router.navigate(['user-info']).then(() => window.location.reload());
        },
        error: (error) => {
          console.error('have some error cant update name', error);
          alert('have some error cant update name');
        }
      });
    } else {
      console.error('User Not Found');
      alert('User Not Found please login again');
    }
  }

  reload() {
    window.location.reload();
  }
}