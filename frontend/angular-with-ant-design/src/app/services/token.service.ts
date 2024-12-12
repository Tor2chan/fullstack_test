import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private clientId = '407356628967-rqphqhh2h3gcsomk7r2l4cetn55lnj2o.apps.googleusercontent.com';
  private clientSecret = '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';
  private refreshToken = '1//04HzOQY6ibxOdCgYIARAAGAQSNgF-L9Ir9u-vee6w1C1Fszds2LHSx5XaNUlw48Hxxcvbn2d5yc_7JaIp3ezbsFntU0pgYSYCZg';
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
