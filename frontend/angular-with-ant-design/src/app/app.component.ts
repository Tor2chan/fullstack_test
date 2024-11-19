import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, CommonModule]
})
export class AppComponent implements OnInit {
  message = '';

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testService.test().subscribe({
      next: (response) => {
        this.message = response.message; // ใช้ key `message` จาก JSON
      },
      error: (err) => {
        console.error('Error fetching API:', err);
        this.message = 'Error fetching data';
      },
    });
  }
    
}