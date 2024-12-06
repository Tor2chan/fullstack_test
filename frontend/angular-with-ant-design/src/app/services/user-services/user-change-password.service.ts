import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id?: number;
    password: string;
}
    
@Injectable({
    providedIn: 'root'
})
export class UserChangePasswordService {
    private apiUrl = 'http://localhost:8080/api/users';
    constructor(private http: HttpClient) {}


    changePassword(userId: number, currentPassword: string, newPassword: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${userId}/password`, {
          currentPassword,
          newPassword,
        });
      }
      
    
}