import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    password: string;
    selectedRole: { role: string }; 
    profilePicture?: string; 
}
    
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';
    private baseUrl = 'http://localhost:8080';
    private profilePicturesUrl = 'http://localhost:8080/profile-pictures';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUserRole(userId: number, role: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/role`, { role });
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`);
    }

    authenticateUser(username: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
            map(users => {
                const user = users.find(u => 
                    u.username === username && u.password === password
                );
                return user || null;
            })
        );
    }

    uploadProfilePicture(userId: number, formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/users/${userId}/profile-picture`, formData);
      }

    getProfilePictureUrl(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/${userId}/profile-picture`);
    }

    updateUserName(userId: number, name: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/name`, { name });
}
    
}