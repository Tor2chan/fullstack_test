import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  addUser(): void {
    if (this.newUser.name && this.newUser.email && this.newUser.username && this.newUser.password) {
      this.userService.addUser(this.newUser as User).subscribe((user) => {
        this.users.push(user);
        this.newUser = {};
      });
    }
  }

}