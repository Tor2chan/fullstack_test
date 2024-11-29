import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id?: number; 
    name: string;

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
    
}