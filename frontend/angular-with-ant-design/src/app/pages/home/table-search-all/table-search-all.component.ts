import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UserService, User } from '../../../services/user-services/user.service';
import * as XLSX from 'xlsx';

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
        ReactiveFormsModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService]
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

    constructor(
        private userService: UserService,
        private confirmationService: ConfirmationService
    ) {}


    ngOnInit() {
        //  sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            const sessionUser = sessionStorage.getItem('sessionUser');
            if (sessionUser) {
                const user = JSON.parse(sessionUser);
                this.currentUsername = user.username;
                this.currentUserId = user.id;
            }
        }

        // 
        this.loadUsers();
    }

    // show edit button
    shouldShowEditButton(username: string, userId: number): boolean {
        return username !== this.currentUsername && userId !== this.currentUserId;
    }

    // load Service
    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => {
                this.Users = data.map(user => ({
                    ...user,
                    selectedRole: { role: user.role }
                }));
            },
            error: (error) => {
                console.error('fetch user data error:', error);
            }
        });
    }

    // Modal
    toggleModal(user?: User) {
        if (user) {
            this.selectedUser = {
                ...user,
                selectedRole: { role: user.role }
            };
        }
        this.showModal = !this.showModal;
    }

    // rolechange
    onRoleChange(user: User, event: any) {
        if (!user.id) return;
    
        const newRole = event.value;
    
        this.selectedUser = {
            ...user,
            role: newRole.role, 
            selectedRole: newRole
        };
    
        console.log(`change role ${user.username} to ${newRole.role}`);
    }
    
    // delete
    deleteUser(userId: number) {
        this.confirmationService.confirm({
            message: 'are you sure to delete this user?',
            header: 'Delete Confirm',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900',
            rejectButtonStyleClass: 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900',
            acceptIcon: 'none',
            rejectIcon: 'none',
            accept: () => {
                this.userService.deleteUser(userId).subscribe({
                    next: () => {
                        this.Users = this.Users.filter(user => user.id !== userId);
                        this.toggleModal();
                        window.location.reload();
                    },
                    error: (error) => {
                        console.error('delete user error:', error);
                    }
                });
            }
        });
    }

    // save
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
                    console.log(`update role ${this.selectedUser.username} success`);
                    this.toggleModal();
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('failed to update role:', error);
                    alert('cant update role please try again');
                }
            });
        } else {
            this.toggleModal();
        }
    }

    // export  Excel
    exportToExcel() {
        // เตรียมข้อมูลสำหรับส่งออก
        const exportData = this.Users.map((user, index) => ({
            '#': index + 1,
            'email': user.email,
            'username': user.username,
            'name': user.name,
            'role': user.role
        }));

        // สร้าง Worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // สร้าง Workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        // สร้างและดาวน์โหลดไฟล์ Excel
        const fileName = `Users_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }


    // Preview
    exportToWebSpreadsheet() {
        const spreadsheetHtml = `
    <!DOCTYPE html>
    <html lang="th">
        <meta charset="UTF-8">
        <title>Preview</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f4f4f4;
            }
            .spreadsheet-container {
                background-color: white;
                border: 1px solid #ddd;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                padding: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="spreadsheet-container">
        
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.Users.map((user, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>
                            <td>${user.name}</td>
                            <td>${user.role}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </body>
    </html>
        `;
        
        // open window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(spreadsheetHtml);
            newWindow.document.close();
        } else {
            alert('cant open new tab!');
        }
    }
}