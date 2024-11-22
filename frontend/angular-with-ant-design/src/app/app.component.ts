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
  tests: any[] = [];

  constructor(private testService: TestService) {}

 
  ngOnInit() {
    this.testService.getTests().subscribe(
      data => {
        this.tests = data;
        console.log(data); // ดูข้อมูลที่ได้จาก API
      },
      error => {
        console.error('Error fetching data from API', error);
      }
    );
  }

}