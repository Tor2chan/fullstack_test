import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface User {
    id?: number;
    username?: string;  
    name: string;
    email?: string;
    role?: string;
    password?: string;
    selectedRole?: { role: string };
    profilePicture?: string;
}

    
@Injectable({
    providedIn: 'root'
})
export class UserChangeNameService {
    private apiUrl = 'http://localhost:8080/api/users';
    constructor(private http: HttpClient) {}

    
    updateUserName(userId: number, name: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/name`, { name });
}
    
}