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
      // ถ้า Token ให้ Refresh ก่อน
      return this.tokenService.refreshAccessToken().pipe(
        switchMap(token => this.sendRequest(users, token))
      );
    }

    //ถ้าเจอ Token
    return this.sendRequest(users, this.tokenService.currentAccessToken);
  }

  private maskEmail(email: string): string {
    const firstPart = email.slice(0, 2);
    const lastPart = email.slice(-2);
    const maskedPart = '*'.repeat(email.length - 4);
    return `${firstPart}${maskedPart}${lastPart}`;
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
                { userEnteredValue: { stringValue: this.maskEmail(user.email) }}, 
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
        // Token expired
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