import { Component} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { User } from './user/user';
import { Users } from './users/users';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';  


interface Role {
    role: string;
}

@Component({
    selector: 'search-all',
    templateUrl: './table-search-all.component.html',  
    standalone: true,
    imports: [TableModule, CommonModule, DropdownModule, FormsModule],
    providers: [Users],
})
export class TableAll  {
    Users!: User[];
    availableRoles: Role[] = [
        { role: 'admin' },
        { role: 'user' },
    ];

    constructor(private users: Users) {}

    ngOnInit() {
        this.users.getUsers().then((data) => {
            // เพิ่ม selectedRole ให้กับ user แต่ละคน
            this.Users = data.map(user => ({
                ...user,
                selectedRole: { role: user.role } // กำหนดค่าเริ่มต้นจาก role ปัจจุบัน
            }));
        });
    }

    // เพิ่มฟังก์ชันสำหรับจัดการการเปลี่ยนแปลง role
    onRoleChange(user: any, newRole: Role) {
        user.selectedRole = newRole;
        // ทำการอัพเดท role ใน backend ที่นี่ถ้าต้องการ
        console.log(`Updated role for user ${user.username} to ${newRole.role}`);
    }

    showModal = false;
    toggleModal(){
      this.showModal = !this.showModal;
    }
}