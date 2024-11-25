import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';

interface Role {
    role: string;
}

@Component({
    selector: 'search-all',
    templateUrl: './table-search-all.component.html',
    standalone: true,
    imports: [
        TableModule, 
        CommonModule, 
        DropdownModule, 
        FormsModule, 
        ReactiveFormsModule
    ],
})
export class TableAll implements OnInit {
    Users: User[] = [];
    selectedUser!: User;
    availableRoles: Role[] = [
        { role: 'admin' },
        { role: 'user' },
    ];

    showModal = false;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => {
                // ทำให้แน่ใจว่า selectedRole มีค่าเสมอ
                this.Users = data.map(user => ({
                    ...user,
                    selectedRole: { role: user.role }
                }));
            },
            error: (error) => {
                console.error('Error fetching users:', error);
            }
        });
    }

    toggleModal(user?: User) {
        if (user) {
            this.selectedUser = {
                ...user,
                selectedRole: { role: user.role } // กำหนดค่า selectedRole เสมอ
            };
        }
        this.showModal = !this.showModal;
    }

    onRoleChange(user: User, newRole: Role) {
        if (!user.id || !newRole) return;

        this.userService.updateUserRole(user.id, newRole.role).subscribe({
            next: (updatedUser) => {
                console.log(`Updated role for user ${user.username} to ${newRole.role}`);
                user.role = newRole.role;
                user.selectedRole = newRole;
            },
            error: (error) => {
                console.error('Error updating user role:', error);
                user.selectedRole = { role: user.role };
            }
        });
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
        // Here you can add any additional save logic if needed
        this.toggleModal();
    }
}