import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    password: string;
    selectedRole: { role: string }; 
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    // เพิ่มเมธอดสำหรับอัพเดท role
    updateUserRole(userId: number, role: string): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${userId}/role`, { role });
    }

    // เพิ่มเมธอดสำหรับลบ user (ถ้าจำเป็น)
    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`);
    }
}