import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  user: any = null;
  items: MenuItem[] | undefined;
  currentProfilePicture: string | null = null;


  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.items = [
      { label: 'info' }, 
  ];

    if (typeof sessionStorage !== 'undefined') {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        this.user = JSON.parse(sessionUser);
        console.log('User is logged in:', this.user);
        this.loadCurrentProfilePicture(this.user.id);

      } else {
        console.log('No user logged in. Redirecting to signin page.');
        this.router.navigate(['signin']);
      }
    }
  }

  loadCurrentProfilePicture(userId: number): void {
    this.userService.getProfilePictureUrl(userId).subscribe({
      next: (response) => {
        if (response.profilePicture) {
          this.currentProfilePicture = `http://localhost:8080/profile-pictures/${response.profilePicture}`;
        } else {
          this.currentProfilePicture = 'assets/default-profile.png'; 
        }
      },
      error: (err) => {
        console.error('Error loading profile picture', err);
        this.currentProfilePicture = 'assets/default-profile.png';
      }
    });
  }

  changePicture(){
    this.router.navigate(['user-info/change-picture'])
  }
}

