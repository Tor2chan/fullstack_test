import { Component, effect, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';  
import { UserService, User } from '../../../services/user.service';

interface Role {
  role: string;
}

@Component({
  selector: 'app-table-email',
  templateUrl: './table-search-email.html',
  standalone: true,
  imports: [TableModule, CommonModule, DropdownModule, FormsModule],
})
export class TableEmail {
  filterEmail = input<string>('');

  Users: User[] = [];
  selectedUser!: User;
  filteredUsers: User[] = [];

  availableRoles: Role[] = [
    { role: 'admin' },
    { role: 'user' },
  ];

  constructor(private userService: UserService) {
    effect(() => {
      console.log('Filter Email:', this.filterEmail());
      this.applyFilter();
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('API Response:', data); 
        this.Users = data.map(user => ({
          ...user,
          selectedRole: { role: user.role }
        }));
        console.log('Users loaded:', this.Users); 
        this.applyFilter(); 
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // applyFilter() {
  //   if (!this.Users.length) {
  //     console.warn('No users to filter');
  //     return; 
  //   }
  
  //   const emailFilter = this.filterEmail();
  //   console.log('Applying filter:', emailFilter);

  //   if (emailFilter.trim()) {
  //     this.filteredUsers = this.Users.filter(user =>
  //       user.email?.toLowerCase().includes(emailFilter.toLowerCase())
  //     );
  //   } else {
  //     this.filteredUsers = [...this.Users]; 
  //   }

  //   console.log('Filtered users:', this.filteredUsers);
  // }

  applyFilter() {
    if (this.filterEmail().trim()) {
      this.filteredUsers = this.Users.filter(user =>
        user.email?.toLowerCase() === this.filterEmail().toLowerCase()
      );
    } else {
      this.filteredUsers = [];
    }
  }

  onRoleChange(user: User, event: any) {
    if (!user.id) return;

    const newRole = event.value;

    this.selectedUser = {
      ...user,
      role: newRole.role, 
      selectedRole: newRole
    };

    console.log(`Changed role for user ${user.username} to ${newRole.role}`);
  }

  showModal = false;
  toggleModal(user?: User) {
    if (user) {
      this.selectedUser = {
        ...user,
        selectedRole: { role: user.role }
      };
    }
    this.showModal = !this.showModal;
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.Users = this.Users.filter(user => user.id !== userId);
          this.toggleModal();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  saveUserChanges() {
    if (this.selectedUser && this.selectedUser.id) {
      const newRole = this.selectedUser.selectedRole.role;
      
      this.userService.updateUserRole(this.selectedUser.id, newRole).subscribe({
        next: (updatedUser) => {
          const index = this.Users.findIndex(u => u.id === this.selectedUser.id);
          if (index !== -1) {
            this.Users[index] = {
              ...this.Users[index],
              role: newRole,
              selectedRole: { role: newRole }
            };
          }
          console.log(`Successfully updated role for user ${this.selectedUser.username}`);
          this.toggleModal();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          alert('Failed to update user role. Please try again.');
        }
      });
    } else {
      this.toggleModal();
    }
  }
}