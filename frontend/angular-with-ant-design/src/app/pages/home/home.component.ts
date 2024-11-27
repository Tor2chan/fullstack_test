import { Component} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchRadioComponent } from "./search-radio/search-radio.component";
import { TableAll } from './table-search-all/table-search-all.component';
import { TableEmail } from './table-search-email/table-search-email';
import { TableUsername } from './table-search-username/table-search-username';
import { InputTextModule } from 'primeng/inputtext';
import { UserService, User } from '../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule,RadioButtonModule,TableEmail,TableAll,TableUsername,SearchRadioComponent,InputTextModule,DialogModule],
  templateUrl: `./home.component.html`,
  styleUrl: './home.component.css'
})

export class HomeComponent {
  users: User[] = [];
  newUser: Partial<User> = {};

  constructor(private userService: UserService, private router: Router){}

  showAll = false;
  showEmail = false;
  showUsername = false;
  email_value: string = '';
  username_value: string = '';
  showModal = false;
  visible: boolean = false;
  dialogMessage: string = '';

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));

    if(typeof sessionStorage !== 'undefined'){
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        if (user.role == 'admin') {
          console.log('access admin')
        }
        if (user.role == 'user'){
          this.router.navigate(['user-info']);
        }
      } else {
        this.router.navigate(['signin']); 
      }
    }
  }

  addUser(): void {
    // check input
    if (!this.newUser.name || 
        !this.newUser.email || 
        !this.newUser.username || 
        !this.newUser.password) {

      this.dialogMessage = "Complete account info";
      this.showDialog();
      return;
    }
  
    // check username
    const isDuplicateUsername = this.users.some(user => user.username === this.newUser.username);
    if (isDuplicateUsername) {
      this.dialogMessage = "Already have this username";
      this.showDialog();
      return;
    }

    // check email
    const isDuplicateEmail = this.users.some(user => user.email === this.newUser.email);
    if (isDuplicateEmail) {
      this.dialogMessage = "Already have this email";
      this.showDialog();
      return;
    }
  
    // Set default role 
    if (!this.newUser.role) {
      this.newUser.role = "user";
    }
  
    // PUSH
    this.userService.addUser(this.newUser as User).subscribe({
      next: (user) => {
        this.users.push(user);
        this.newUser = {};
        this.toggleModal();
        this.reload();
      },
      error: (error) => {
        console.error('Error adding user:', error);
      }
    });
  }
  
  
  reload(){
    window.location.reload()
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }


  showDialog() {
    this.visible = true;
}

  onDialogClose(){
    this.visible = false;
  }

  onSearchAll() {
    this.showAll = true;
    this.showEmail = false;
    this.showUsername = false;
  }

  onSearchByEmail(email: string) {
    this.showAll = false;
    this.showEmail = true;
    this.showUsername = false;
    this.email_value = email;
  }

  onSearchByUsername(username: string) {
    this.showAll = false;
    this.showEmail = false;
    this.showUsername = true;
    this.username_value = username;
  }
}
