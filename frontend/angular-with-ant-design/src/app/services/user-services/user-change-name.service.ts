import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id?: number; 
    name: string;
    phone: string;
    b_date: string;
    gender: string;
}
    
@Injectable({
    providedIn: 'root'
})
export class UserChangeNameService {
    private apiUrl = 'http://localhost:8080/api/users';
    constructor(private http: HttpClient) {}

    
    updateName(userId: number, name: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/name`, { name });
}

    updatePhone(userId: number, phone: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/phone`, { phone });
    }

    updateB_date(userId: number, b_date: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/b_date`, { b_date });
    }

    updateGender(userId: number, gender: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/gender`, { gender});
    }    
}