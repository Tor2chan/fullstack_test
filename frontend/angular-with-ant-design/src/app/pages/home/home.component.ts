import { Component, OnInit } from '@angular/core';
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
  template: `
      <div class="flex justify-end">
        <button type="button" (click)="toggleModal()" class="text-gray-900 hover:text-white border mt-4 mr-12 px-2 py-2 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm  text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
          Add User
        </button>
        <div *ngIf="showModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-sm">
              <!--content-->
              <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <!--header-->
                <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 class="text-xl font-semibold">
                    Add user
                  </h3>
                </div>
                <!--body-->
                <div>                                    
                <div class="p-6 grid grid-cols-[1fr_2fr] gap-4">
                    <!-- Row 1: Email -->
                    <label for="email" class="text-gray-700 font-medium self-center">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      [(ngModel)] = "newUser.email"
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email"
                    />

                    <!-- Row 2: Username -->
                    <label for="username" class="text-gray-700 font-medium self-center">Username</label>
                    <input 
                      type="text" 
                      id="username"
                      name="username"
                      [(ngModel)] = "newUser.username"
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                    />
                    
                    <!-- Row 3: Name  -->
                    <label for="name" class="text-gray-700 font-medium self-center">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      [(ngModel)] = "newUser.name"
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />

                    <!-- Row 4: Password -->
                    <label for="password" class="text-gray-700 font-medium self-center">Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password"
                      [(ngModel)] = "newUser.password"
                      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <!--footer-->
                <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button type="button"  (click)="toggleModal()" class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                        close
                    </button>
                    <button type="button"  (click)="addUser()" class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
                        save
                    </button>
                </div>
              </div>
            </div>
          </div>
      </div>
          
      <div>
        <app-search-radio 
          (searchAll)="onSearchAll()"
          (searchByEmail)="onSearchByEmail($event)"
          (searchByUsername)="onSearchByUsername($event)">
        </app-search-radio>
      </div>
      
 
      <div *ngIf="showAll">
        <search-all></search-all>
      </div>
      
 <!-- {{email_value}} {{email_value}} -->
      <div *ngIf="showEmail">
        <app-table-email [filterEmail]="email_value"></app-table-email>
      </div>
      
    
      <div *ngIf="showUsername">
      <app-table-username [filterUsername]="username_value"></app-table-username>
      </div>
            `,
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
      this.userService.addUser(this.newUser as User).subscribe(
        (user) => {
          this.users.push(user);
          this.newUser = {};
          this.toggleModal();
          this.reload()
        },
        (error) => {
          console.error('Error adding user:', error);
        }
      );
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
