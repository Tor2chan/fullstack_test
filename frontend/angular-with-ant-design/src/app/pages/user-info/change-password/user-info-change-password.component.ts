import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { UserChangePasswordService, User } from '../../../services/user-services/user-change-password.service';
@Component({
  selector: 'app-user-info-change-password',
  standalone: true,
  templateUrl: './user-info-change-password.component.html',
  styleUrls: ['./user-info-change-password.component.css'],
  imports: [FormsModule,CommonModule,BreadcrumbModule]
})
export class UserInfoChangePasswordComponent implements OnInit{
  user: User | null = null;
  items: MenuItem[] | undefined;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private userService: UserChangePasswordService, private router: Router) {}

  ngOnInit() {
    this.items = [
      { label: 'info', routerLink: 'user-info'},
      { label: 'change-password'}
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

  changePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    const sessionUser = sessionStorage.getItem('sessionUser');
    if (!sessionUser) {
      this.errorMessage = 'No user is logged in.';
      this.router.navigate(['signin']);
      return;
    }

    const user = JSON.parse(sessionUser);
    this.userService.changePassword(user.id, this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.router.navigate(['user-info']);
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = 'Failed to update password. Please try again.';
      },
    });
  }

  reload(){
    window.location.reload();
  }
}
