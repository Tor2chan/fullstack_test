import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../services/user-services/user.service';


@Component({
  selector: 'app-sidebar',
  imports: [MenubarModule, CommonModule],
  standalone: true,
  templateUrl: './sidebar.component.html',  
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any = null;
  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';
  userUsername: string = '';
  currentProfilePicture: string | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        this.user = JSON.parse(sessionUser);
        this.loadCurrentProfilePicture(this.user.id);

        this.isLoggedIn = true;
        this.isAdmin = this.user.role === 'admin'; // ตรวจสอบ role ของผู้ใช้
        
        // Set user name and username
        this.userName = this.user.name || 'User';
        this.userUsername = this.user.username || '';

      }
    }

    this.items = [
      {
        label: 'Info',
        icon: 'pi pi-star',
        command: () => { this.router.navigate(['user-info']) }
      }
    ];

    if (this.isAdmin) {
      this.items.unshift({
        label: 'Admin',
        icon: 'pi pi-home',
        command: () => { this.router.navigate(['admin']) }
      });
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

  signup_redirect() {
    this.router.navigate(['signup']);
  }

  signin_redirect() {
    this.router.navigate(['signin']);
  }

  logout() {
    sessionStorage.removeItem('sessionUser');  
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
    this.userUsername = '';
    this.router.navigate(['signin']).then(() => window.location.reload());
  }
}