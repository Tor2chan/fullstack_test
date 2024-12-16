import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

interface SpreadsheetResponse {
  spreadsheetId: string;
  spreadsheetUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private SHEET_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
  private DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService
  ) {}

  exportDataToGoogleSheets(users: User[]): Observable<SpreadsheetResponse> {
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

  private sendRequest(users: User[], token: string): Observable<SpreadsheetResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // sum
    const totalUsers = users.length;
    const totalAdmin = users.filter(user => user.role === 'admin').length;
    const totalUser = users.filter(user => user.role === 'user').length;
  
    return this.http.post<SpreadsheetResponse>(this.SHEET_API_URL, {
      properties: { title: 'Exported Users' },
      sheets: [{
        data: [{
          rowData: [
            // Summary rows
            {
              values: [
                { userEnteredValue: { stringValue: 'Total Users' }},
                { userEnteredValue: { stringValue: `${totalUsers}` }}
              ]
            },
            {
              values: [
                { userEnteredValue: { stringValue: 'Role Admin' }},
                { userEnteredValue: { stringValue: `${totalAdmin}` }}
              ]
            },
            {
              values: [
                { userEnteredValue: { stringValue: 'Role User' }},
                { userEnteredValue: { stringValue: `${totalUser}` }}
              ]
            },
            // empty
            {
              values: [
                { userEnteredValue: { stringValue: '' }},
                { userEnteredValue: { stringValue: '' }}
              ]
            },
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
            })),
          ]
        }]
      }]
    }, { headers }).pipe(
      catchError(error => {
        // Handle Token expiration error
        if (error.status === 401) {
          return this.tokenService.refreshAccessToken().pipe(
            switchMap(newToken => this.sendRequest(users, newToken))
          );
        }
        throw error;
      }),
      switchMap(response => this.updateSheetPermissions(response.spreadsheetId, token)
        .pipe(map(() => ({
          spreadsheetId: response.spreadsheetId,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${response.spreadsheetId}/edit`
        })))
      )
    );
  }
  
  private updateSheetPermissions(spreadsheetId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // permission
    const permissionBody = {
      role: 'reader',
      type: 'anyone'
    };

    return this.http.post(`${this.DRIVE_API_URL}/${spreadsheetId}/permissions`, permissionBody, { headers }).pipe(
      catchError(error => {
        // Handle Token expiration error
        if (error.status === 401) {
          return this.tokenService.refreshAccessToken().pipe(
            switchMap(newToken => {
              const refreshedHeaders = new HttpHeaders({
                Authorization: `Bearer ${newToken}`,
                'Content-Type': 'application/json'
              });
              return this.http.post(`${this.DRIVE_API_URL}/${spreadsheetId}/permissions`, permissionBody, { headers: refreshedHeaders });
            })
          );
        }
        throw error;
      })
    );
  }
  
  private maskEmail(email: string): string {
    if (!email || email.length < 4) {
      return email;
    }
    const firstPart = email.slice(0, 2);
    const lastPart = email.slice(-2);
    const maskedPart = '*'.repeat(email.length - 4);
    return `${firstPart}${maskedPart}${lastPart}`;
  }
}