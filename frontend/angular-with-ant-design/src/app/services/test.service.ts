import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(private http: HttpClient) {}
  

  getTests(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
