import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';  


@Component({
  selector: 'app-sidebar',
  imports: [MenubarModule ],
  standalone: true, 
  templateUrl: './sidebar.component.html',  
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  items: MenuItem[] | undefined;
  constructor(private router: Router){
    
  }

  ngOnInit() {
      this.items = [
          {
              label: 'Admin',
              icon: 'pi pi-home',
              command: () => {this.router.navigate(['admin'])}
          },
          {
              label: 'Info',
              icon: 'pi pi-star',
              command: () => {this.router.navigate(['user-info'])}
          }
      ]
  }

  signup_redirect() {
    this.router.navigate(['signup']);  
  }

  signin_redirect() {
    this.router.navigate(['signin']);  
  }

}  

