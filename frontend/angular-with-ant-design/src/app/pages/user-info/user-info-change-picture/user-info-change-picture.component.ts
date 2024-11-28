import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

  /// <reference lib="dom" />

@Component({
  selector: 'app-user-info-change-picture',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule
  ],
  templateUrl: './user-info-change-picture.component.html',
  styleUrl: './user-info-change-picture.component.css'
})
export class UserInfoChangePictureComponent implements OnInit {

  user: any = null;

  selectedFile: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  currentProfilePicture: string | null = null;

  // Dialog properties
  dialogVisible = false;
  dialogHeader = '';
  dialogMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        this.user = JSON.parse(sessionUser);
        console.log('User is logged in:', this.user);
  
        this.loadCurrentProfilePicture(this.user.id);
      } else {
        console.log('No user logged in. Redirecting to signin page.');
        this.router.navigate(['signin']);
      }
    }
  }
  



  loadCurrentProfilePicture(userId: any): void {
    this.userService.getProfilePictureUrl(userId).subscribe({
      next: (response) => {
        this.currentProfilePicture = response.profilePicture || 'http://localhost:8080/profile-pictures/default-profile.png';
      },
      error: (err) => {
        console.error('Error loading profile picture', err);
        this.currentProfilePicture = 'http://localhost:8080/profile-pictures/default-profile.png';
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedImagePreview = URL.createObjectURL(file);  
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      this.showDialog('Error', 'No file selected');
      return;
    }
  
  
    // สร้าง FormData และเพิ่มไฟล์เข้าไป
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
  
    // ตรวจสอบค่าของ FormData ก่อนที่จะส่ง
    for (let pair of formData.entries()) {  // `entries()` จะทำงานได้หาก `lib` ถูกตั้งค่าเป็น "dom"
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    // ส่งข้อมูลไปยัง backend
    this.userService.uploadProfilePicture(this.user.id, formData).subscribe(
      response => {
        console.log('Upload success:', response);
      },
      error => {
        console.error('Upload error:', error);
        if (error.error && error.error.message) {
          alert('Backend error: ' + error.error.message);
        } else {
          alert('An unknown error occurred.');
        }
      }
    );
  }
  
  
  
  showDialog(header: string, message: string): void {
    this.dialogHeader = header;
    this.dialogMessage = message;
    this.dialogVisible = true;
  }
}
