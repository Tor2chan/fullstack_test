import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-user-info-change-picture',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './user-info-change-picture.component.html',
  styleUrl: './user-info-change-picture.component.css'
})
export class UserInfoChangePictureComponent implements OnInit{
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
        { label: 'info', routerLink: 'info' }, 
        { label: 'change picture' }, 
    ];
}

}
