import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
import { User, UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule,]
})
export class AppComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = {};

  tests: any[] = [];

  constructor(private userService: UserService) {}

 
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  addUser(): void {
    if (this.newUser.name && this.newUser.email) {
      this.userService.addUser(this.newUser as User).subscribe((user) => {
        this.users.push(user);
        this.newUser = {};
      });
    }
  }

}