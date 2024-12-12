import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private SHEET_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService
  ) {}

  exportDataToGoogleSheets(users: User[]): Observable<any> {
    // ตรวจสอบ Token ก่อนใช้
    if (!this.tokenService.currentAccessToken) {
      // หากไม่มี Token ให้ Refresh ก่อน
      return this.tokenService.refreshAccessToken().pipe(
        switchMap(token => this.sendRequest(users, token))
      );
    }

    // หากมี Token อยู่แล้ว
    return this.sendRequest(users, this.tokenService.currentAccessToken);
  }

  private sendRequest(users: User[], token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.SHEET_API_URL, {
      properties: { title: 'Angular Exported Users' },
      sheets: [{
        data: [{
          rowData: [
            // Header row
            {
              values: [
                { userEnteredValue: { stringValue: '#' }},
                { userEnteredValue: { stringValue: 'Email' }},
                { userEnteredValue: { stringValue: 'Username' }},
                { userEnteredValue: { stringValue: 'Name' }},
                { userEnteredValue: { stringValue: 'Role' }}
              ]
            },
            // User data rows
            ...users.map((user, index) => ({
              values: [
                { userEnteredValue: { stringValue: `${index + 1}` }},
                { userEnteredValue: { stringValue: user.email }},
                { userEnteredValue: { stringValue: user.username }},
                { userEnteredValue: { stringValue: user.name }},
                { userEnteredValue: { stringValue: user.role }}
              ]    
            }))
          ]
        }]
      }]
    }, { headers }).pipe(
      catchError(error => {
        // หากเกิด Error จาก Token expired
        if (error.status === 401) {
          // Refresh Token อัตโนมัติ
          return this.tokenService.refreshAccessToken().pipe(
            switchMap(newToken => this.sendRequest(users, newToken))
          );
        }
        throw error;
      })
    );
  }
}