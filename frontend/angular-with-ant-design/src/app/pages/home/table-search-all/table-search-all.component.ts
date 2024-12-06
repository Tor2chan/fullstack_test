import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user-services/user.service';

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
    currentUsername: string = '';
    currentUserId: number = 0;

    constructor(private userService: UserService) {}

    ngOnInit() {
        if (typeof sessionStorage !== 'undefined') {
            const sessionUser = sessionStorage.getItem('sessionUser');
            if (sessionUser) {
                const user = JSON.parse(sessionUser);
                this.currentUsername = user.username;
                this.currentUserId = user.id;
            }
        }

        this.loadUsers();
    }

    //show edit 
    shouldShowEditButton(username: string, userId: number): boolean {
        return username !== this.currentUsername && userId !== this.currentUserId;
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => {
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
                selectedRole: { role: user.role }
            };
        }
        this.showModal = !this.showModal;
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
    
    deleteUser(userId: number) {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
            this.userService.deleteUser(userId).subscribe({
                next: () => {
                    this.Users = this.Users.filter(user => user.id !== userId);
                    this.toggleModal();
                    window.location.reload();
                },
                error: (error) => {
                    console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', error);
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
                    console.log(`อัปเดตบทบาทของผู้ใช้ ${this.selectedUser.username} สำเร็จ`);
                    this.toggleModal();
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('เกิดข้อผิดพลาดในการอัปเดตบทบาทผู้ใช้:', error);
                    alert('ไม่สามารถอัปเดตบทบาทผู้ใช้ได้ กรุณาลองอีกครั้ง');
                }
            });
        } else {
            this.toggleModal();
        }
    }
}