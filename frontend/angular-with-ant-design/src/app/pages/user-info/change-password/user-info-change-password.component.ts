import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info-change-password',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './user-info-change-password.component.html',
  styleUrl: './user-info-change-password.component.css'
})
export class UserInfoChangePasswordComponent implements OnInit{
  items: MenuItem[] | undefined;

  constructor(private router: Router){

  }

  ngOnInit() {
      this.items = [
        {label: 'info', routerLink: 'user-info'},
        {label: 'change-password'}
      ]
  }

}
