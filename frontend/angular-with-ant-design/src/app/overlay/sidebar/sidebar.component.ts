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

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        this.isLoggedIn = true;
      }
    }

    this.items = [
      {
        label: 'Admin',
        icon: 'pi pi-home',
        command: () => { this.router.navigate(['admin']) }
      },
      {
        label: 'Info',
        icon: 'pi pi-star',
        command: () => { this.router.navigate(['user-info']) }
      }
    ];
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
    this.router.navigate(['signin']);
  }
}
