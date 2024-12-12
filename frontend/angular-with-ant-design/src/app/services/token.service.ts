import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private clientId = environment.CLIENT_ID;
  private clientSecret = environment.CLIENT_SECRET;
  private refreshToken = environment.REFRESH_TOKEN;
  public currentAccessToken = ''; // เก็บ Access Token ที่ได้มา

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึง Access Token ใหม่
  refreshAccessToken(): Observable<string> {
    const refreshUrl = 'https://oauth2.googleapis.com/token';
    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('refresh_token', this.refreshToken)
      .set('grant_type', 'refresh_token');

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post<any>(refreshUrl, body.toString(), { headers }).pipe(
      map((response) => {
        // พิมพ์ Access Token ใหม่ใน console
        console.log('New Access Token:', response.access_token);
        this.currentAccessToken = response.access_token; // เก็บ Access Token ใหม่
        return response.access_token;
      }),
      catchError((error) => {
        console.error('Token Refresh Error Details:', error.error);
        return throwError(() => error);
      })
    );
  }

  // ฟังก์ชันสำหรับดูค่า Access Token ปัจจุบัน
  getCurrentAccessToken(): string {
    console.log('Current Access Token:', this.currentAccessToken);
    return this.currentAccessToken;
  }

  // ฟังก์ชันสำหรับดู Client ID และ Client Secret
  getClientCredentials(): { clientId: string; clientSecret: string } {
    console.log('Client ID:', this.clientId);
    console.log('Client Secret:', this.clientSecret);
    return {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    };
  }
}
