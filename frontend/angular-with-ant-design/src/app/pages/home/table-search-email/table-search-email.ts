import { Component, effect, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Added import for Confirm Dialog
import { ConfirmationService } from 'primeng/api';
import { UserService, User } from '../../../services/user-services/user.service';
import * as XLSX from 'xlsx';
import { GoogleSheetsService } from '../../../services/google-sheets.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface Role {
  role: string;
}

@Component({
  selector: 'app-table-email',
  templateUrl: './table-search-email.html',
  standalone: true,
  imports: [TableModule,ProgressSpinnerModule, CommonModule, DropdownModule, FormsModule, ConfirmDialogModule],
  providers: [ConfirmationService] 
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

  showModal = false;
  currentUsername: string = '';
  currentUserId: number = 0;
  loading = false;

  constructor(private userService: UserService, private confirmationService: ConfirmationService 
              ,private googleSheetsService: GoogleSheetsService
  ) {
    effect(() => {
      console.log('Filter Email:', this.filterEmail());
      this.applyFilter();
    });
  }

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

  shouldShowEditButton(username: string, userId: number): boolean {
    return username !== this.currentUsername && userId !== this.currentUserId;
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

  applyFilter() {
    if (!this.Users.length) {
      console.warn('No users to filter');
      return; 
    }
  
    const emailFilter = this.filterEmail();
    console.log('Applying filter:', emailFilter);

    if (emailFilter.trim()) {
      this.filteredUsers = this.Users.filter(user =>
        user.email?.toLowerCase().includes(emailFilter.toLowerCase()) || user.username?.toLowerCase().includes(emailFilter.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.Users]; 
    }

    console.log('Filtered users:', this.filteredUsers);
  }

  // applyFilter() {
  //   if (this.filterEmail().trim()) {
  //     this.filteredUsers = this.Users.filter(user =>
  //       user.email?.toLowerCase() === this.filterEmail().toLowerCase()
  //     );
  //   } else {
  //     this.filteredUsers = [];
  //   }
  // }

  onRoleChange(user: User, event: any) {
    if (!user.id) return;

    const newRole = event.value;

    this.selectedUser = {
      ...user,
      role: newRole.role, 
      selectedRole: newRole
    };

    console.log(`Updated role for user ${user.username} to ${newRole.role}`);
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

    // Modified deleteUser method to use PrimeNG Confirmation Dialog
    deleteUser(userId: number) {
      this.confirmationService.confirm({
          message: 'Are you sure about that?',
          header: 'CONFIRM DELETE',
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
                      console.error('เกิดข้อผิดพลาดในการลบผู้ใช้:', error);
                  }
              });
          }
      });
  }

  reload(){ 
    window.location.reload();
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

  maskEmail(email: string): string {
    const firstPart = email.slice(0, 2);
    const lastPart = email.slice(-2);
    const maskedPart = '*'.repeat(email.length - 4);
    return `${firstPart}${maskedPart}${lastPart}`;
  }

// export  Excel
exportToExcel() {
    // data prep
    const exportData = this.filteredUsers.map((user, index) => ({
        '#': index + 1,
        'email': this.maskEmail(user.email),
        'username': user.username,
        'name': user.name,
        'role': user.role
    }));

    // Worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllUsers');

    // download Excel
    const fileName = `AllUsers_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

exportToWebSpreadsheet() {
  const spreadsheetHtml = `
  <html>
  <head>
      <title>Preview</title>
      <link href="styles.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100 p-5">
      <div class="bg-white border border-gray-300 shadow-md p-5 rounded-lg">
          <h1 class="text-xl font-bold text-center mb-5">email or username (${this.filterEmail()})</h1>
          <table class="table-auto w-full border-collapse border border-gray-300">
              <thead>
                  <tr class="bg-gray-200">
                      <th class="border border-gray-300 px-4 py-2 text-left">#</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Username</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Name</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Role</th>
                  </tr>
              </thead>
              <tbody>
                  ${this.filteredUsers.map((user, index) => `
                      <tr class="${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200">
                          <td class="border border-gray-300 px-4 py-2">${index + 1}</td>
                          <td class="border border-gray-300 px-4 py-2">${this.maskEmail(user.email)}</td>
                          <td class="border border-gray-300 px-4 py-2">${user.username}</td>
                          <td class="border border-gray-300 px-4 py-2">${user.name}</td>
                          <td class="border border-gray-300 px-4 py-2">${user.role}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
      </div>
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
      newWindow.document.write(spreadsheetHtml);
      newWindow.document.close();
  } else {
      alert('Cannot open new tab!');
  }
}

exportToGoogleSheets() {
  this.loading = true;
  const exportData: User[] = this.filteredUsers;

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