import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  template: ' <router-outlet></router-outlet> ',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class AppComponent {

}