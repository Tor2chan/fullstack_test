import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

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
  selectedFile: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  currentProfilePicture: string | null = null;

  // Dialog properties
  dialogVisible = false;
  dialogHeader = '';
  dialogMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Assuming you have a method to get current user's ID
    const currentUserId = this.getCurrentUserId();
    this.loadCurrentProfilePicture(currentUserId);
  }

  // Mock method - replace with actual user ID retrieval logic
  getCurrentUserId(): number {
    // This should be replaced with actual authentication/user service method
    return 1; // Example user ID
  }

  loadCurrentProfilePicture(userId: number): void {
    this.userService.getProfilePictureUrl(userId).subscribe({
      next: (pictureUrl) => {
        this.currentProfilePicture = pictureUrl || 'assets/default-profile.png';
      },
      error: (err) => {
        console.error('Error loading profile picture', err);
        this.currentProfilePicture = 'assets/default-profile.png';
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        this.showDialog('Error', 'Invalid file type. Please upload JPEG or PNG.');
        return;
      }

      if (file.size > maxSize) {
        this.showDialog('Error', 'File is too large. Maximum size is 5MB.');
        return;
      }

      this.selectedFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      this.showDialog('Error', 'No file selected');
      return;
    }
  
    const currentUserId = this.getCurrentUserId();
  
    this.userService.uploadProfilePicture(currentUserId, this.selectedFile).subscribe({
      next: (response) => {
        this.showDialog('Success', 'Profile picture uploaded successfully');
        this.loadCurrentProfilePicture(currentUserId);
        this.selectedFile = null;
        this.selectedImagePreview = null;
      },
      error: (err) => {
        console.error('Full Error Object:', err);
        console.error('Error Status:', err.status);
        console.error('Error Message:', err.message);
        console.error('Error Body:', err.error);
        
        this.showDialog('Error', `Failed to upload profile picture: ${err.message}`);
      }
    });
  }

  showDialog(header: string, message: string): void {
    this.dialogHeader = header;
    this.dialogMessage = message;
    this.dialogVisible = true;
  }
}