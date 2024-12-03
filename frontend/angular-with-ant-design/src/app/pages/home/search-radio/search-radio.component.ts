import { Component,Output, EventEmitter, OnInit }from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

interface Roles {
  role: string;
}

@Component({
  selector: 'app-search-radio',
  standalone: true,
  imports: [FormsModule, RadioButtonModule, InputTextModule, ButtonModule, DropdownModule],
  templateUrl: './search-radio.component.html',
  styleUrl: './search-radio.component.css'
})


export class SearchRadioComponent {
  roles: Roles[] | undefined;
  selectedRoles: Roles | undefined;
  email_value: string = '';  
  username_value: string = '';


  ngOnInit() {
    this.roles = [
        { role: 'user'},
        { role: 'admin'},];
}


  @Output() searchAll = new EventEmitter<void>();
  @Output() searchByEmail = new EventEmitter<string>();
  @Output() searchByUsername = new EventEmitter<string>();

  click_search_all() {
      this.searchAll.emit();
      this.email_value = "";
      this.username_value = "";
  }

  click_search_email() {
    this.username_value = "";
    console.log("Email Value:", this.email_value);

   if (!this.email_value || this.email_value.trim() === '') {
      alert("fill email!");
      return;
    }
    this.searchByEmail.emit(this.email_value);
}


  click_search_username() {
    this.email_value = "";
    console.log("Username Value:", this.username_value);

    if (!this.username_value || this.username_value.trim() === '') {
       alert("fill username!");
       return;
     }

      this.searchByUsername.emit(this.username_value);
  }
}
