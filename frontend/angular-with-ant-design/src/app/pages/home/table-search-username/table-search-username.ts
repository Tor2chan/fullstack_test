import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { User } from '../table-search-all/user/user';
import { Users } from '../table-search-all/users/users';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';  

interface Role {
  role: string;
}

interface User_Role extends User {
  selectedRole: Role;  
}

@Component({
  selector: 'app-table-username',
  templateUrl: './table-search-username.html',
  standalone: true,
  imports: [TableModule, CommonModule, DropdownModule, FormsModule],
  providers: [Users],
})
export class TableUsername implements OnChanges {
  @Input() filterUsername: string = '';
  Users: User[] = [];
  filteredUsers: User[] = [];

  availableRoles: Role[] = [
    { role: 'admin' },
    { role: 'user' },
  ];

  constructor(private users: Users) {}

  ngOnInit() {
    this.users.getUsers().then((data) => {
      this.Users = data.map(user => {
        console.log('Setting up user:', user.username, 'with role:', user.role);
        return {
          ...user,
          selectedRole: { 
            role: user.role || 'user' 
          }
        };
      });
      this.applyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterUsername']) {
      this.applyFilter(); 
    }
  }

  applyFilter() {
    if (this.filterUsername.trim()) {
      this.filteredUsers = this.Users.filter(user =>
        user.username?.toLowerCase() === this.filterUsername.toLowerCase()
      );
    } else {
      this.filteredUsers = [];
    }
  }
  
  onRoleChange(user: User_Role, newRole: Role) {
    user.selectedRole = newRole;
    console.log(`Updated role for user ${user.username} to ${newRole.role}`);
  }

  showModal = false;
  toggleModal(){
    this.showModal = !this.showModal;
  }
}
