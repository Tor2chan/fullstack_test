import { Component,Output, EventEmitter, OnInit }from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

interface Roles {
  role: string;
}

@Component({
  selector: 'app-search-radio',
  standalone: true,
  imports: [FormsModule, RadioButtonModule, InputTextModule, ButtonModule, DropdownModule, DialogModule],
  templateUrl: './search-radio.component.html',
  styleUrl: './search-radio.component.css'
})


export class SearchRadioComponent {
  roles: Roles[] | undefined;
  selectedRoles: Roles | undefined;
  email_value: string = '';  
  username_value: string = '';
  visible: boolean = false; 
  dialogMessage: string = '';

  ngOnInit() {
    this.roles = [
        { role: 'user'},
        { role: 'admin'},];
        this.selectedRoles = this.roles[0];
}


  @Output() searchAll = new EventEmitter<void>();
  @Output() searchByEmail = new EventEmitter<string>();
  @Output() searchByRole = new EventEmitter<string>();
  
  @Output() searchByUsername = new EventEmitter<string>();

  showDialog() {
    this.visible = true;
  }

  onDialogClose(){
    this.visible = false;
  }

  click_search_all() {
      this.searchAll.emit();
      this.email_value = "";
      // this.username_value = "";
  }

  click_search_email() {
    // this.username_value = "";
    console.log("Email Value:", this.email_value);

   if (!this.email_value || this.email_value.trim() === '') {
    this.dialogMessage = 'plase fill email'
    this.showDialog();
      return;
    }
    this.searchByEmail.emit(this.email_value);
}

  click_search_role() {
    this.email_value = "";
    console.log("Role Value:", this.selectedRoles);

    if (!this.selectedRoles) {
        alert("Please select a role!");
        return;
    }

    this.searchByRole.emit(this.selectedRoles.role);
  }



  // click_search_username() {
  //   this.email_value = "";
  //   console.log("Username Value:", this.username_value);

  //   if (!this.username_value || this.username_value.trim() === '') {
  //      alert("fill username!");
  //      return;
  //    }

  //     this.searchByUsername.emit(this.username_value);
  // }
}
