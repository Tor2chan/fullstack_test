import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = '/api/test';

  constructor(private http: HttpClient) {}

  test(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/test`);
  }
  
}
