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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule,RadioButtonModule,TableEmail,TableAll,TableUsername,SearchRadioComponent,InputTextModule],
  templateUrl: `./home.component.html`,
  styleUrl: './home.component.css'
})

export class HomeComponent {
  users: User[] = [];
  newUser: Partial<User> = {};

  constructor(private userService: UserService){}

  showAll = false;
  showEmail = false;
  showUsername = false;
  email_value: string = '';
  username_value: string = '';
  showModal = false;

  // add_user
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  addUser(): void {
    if (this.newUser.name && this.newUser.email && this.newUser.username && this.newUser.password) {
  
      if (!this.newUser.role) {
        this.newUser.role = "user";
      }
  
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
  }
  
  
  reload(){
    window.location.reload()
  }

  toggleModal(){
    this.showModal = !this.showModal;
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
