import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  imports: [MenubarModule, CommonModule],
  standalone: true,
  templateUrl: './sidebar.component.html',  
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';
  userUsername: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'admin'; // ตรวจสอบ role ของผู้ใช้
        
        // Set user name and username
        this.userName = user.name || 'User';
        this.userUsername = user.username || '';
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