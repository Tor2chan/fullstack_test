import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { UserChangeNameService, User } from '../../../services/user-services/user-change-name.service';
@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    InputTextModule,
    FormsModule
  ],       
  templateUrl: './user-info-change-name.component.html',
  styleUrl: './user-info-change-name.component.css'
})
export class UserInfoChangeNameComponent implements OnInit {
  user: User | null = null;
  newName: string = '';
  items: MenuItem[] | undefined;
  currentProfilePicture: string | null = null;
  isNameChanged: boolean = false;

  constructor(
    private router: Router, 
    private userService: UserChangeNameService
  ) {}

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

  updateName() {
    // Validate name input
    if (!this.newName.trim()) {
      alert('Please enter a valid name');
      return;
    }

    // Ensure we have a user and a valid user ID
    if (this.user && this.user.id !== undefined) {  // Ensure that id is defined
      this.userService.updateUserName(this.user.id, this.newName).subscribe({
        next: (updatedUser) => {
          // Update the user in session storage
          if (typeof sessionStorage !== 'undefined') {
            // Create a new object that merges existing user data with the updated name
            const updatedSessionUser = { ...this.user, name: updatedUser.name };
            sessionStorage.setItem('sessionUser', JSON.stringify(updatedSessionUser));
            
            // Update the local user object
            this.user = updatedSessionUser;
          } 
          
          // Show success message 
          console.log("name changed")

          // Navigate back or reload
          this.router.navigate(['user-info']);
        },
        error: (error) => {
          console.error('Error updating name', error);
          alert('Failed to update name. Please try again.');
        }
      });
    } else {
      console.error('User ID is missing.');
      alert('User ID is not available. Please log in again.');
    }
  }

  reload() {
    window.location.reload();
  }
}
