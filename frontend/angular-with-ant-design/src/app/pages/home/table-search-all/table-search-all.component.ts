import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UserService, User } from '../../../services/user-services/user.service';
import { GoogleSheetsService } from '../../../services/google-sheets.service';
import * as XLSX from 'xlsx';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface Role {
    role: string;
}

@Component({
    selector: 'search-all',
    templateUrl: './table-search-all.component.html',
    standalone: true,
    imports: [TableModule,
        CommonModule, ProgressSpinnerModule,
        DropdownModule, 
        FormsModule, 
        ReactiveFormsModule,
        ConfirmDialogModule,
        
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
    loading = false;

    constructor(
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private googleSheetsService: GoogleSheetsService,
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
                        console.error('failed to delete ', error);
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

    exportToExcel() {
        // Calculate summary statistics
        const totalUsers = this.Users.length;
        const totalAdmin = this.Users.filter(user => user.role === 'admin').length;
        const totalUser = this.Users.filter(user => user.role === 'user').length;
    
        // Prepare summary data
        const summaryData = [
            { col1: 'Total Users', col2: totalUsers },
            { col1: 'Role Admin', col2: totalAdmin },
            { col1: 'Role User', col2: totalUser },
            { col1: '', col2: '' } // Empty row for spacing
        ];
    
        // Prepare header row
        const headerRow = { 
            col1: '#', 
            col2: 'Email', 
            col3: 'Username', 
            col4: 'Name', 
            col5: 'Role' 
        };
    
        // Data preparation for user list
        const exportData = this.Users.map((user, index) => ({
            col1: index + 1,
            col2: this.maskEmail(user.email),
            col3: user.username,
            col4: user.name,
            col5: user.role
        }));
    
        // Combine summary, header, and user data
        const fullExportData = [
            ...summaryData,
            headerRow,
            ...exportData
        ];
    
        // Worksheet
        const worksheet = XLSX.utils.json_to_sheet(fullExportData, { 
            skipHeader: true // Skip default header to use our custom header
        });
    
        // Workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AllUsers');
    
        // Download Excel
        const fileName = `AllUsers_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }
    
    // Helper method to mask email (if not already defined)
    private maskEmail(email: string): string {
        if (!email || email.length < 4) {
            return email;
        }
        const firstPart = email.slice(0, 2);
        const lastPart = email.slice(-2);
        const maskedPart = '*'.repeat(email.length - 4);
        return `${firstPart}${maskedPart}${lastPart}`;
    }

    exportToGoogleSheets() {
        this.loading = true;
        const exportData: User[] = this.Users;
    
        this.googleSheetsService.exportDataToGoogleSheets(exportData).subscribe({
            next: (response: any) => {
                const url = `https://docs.google.com/spreadsheets/d/${response.spreadsheetId}`;
                window.open(url, '_blank');
                this.loading = false;
            },
            error: error => {
                console.error('Google Sheets export error:', error);
                this.loading = false;
            }
        });
    }
    
      
}    