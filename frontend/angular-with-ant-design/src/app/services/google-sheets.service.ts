import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

  private ACCESS_TOKEN = 'ya29.a0AeDClZCdI82PAb_pUtQSxkBNzu-GsgTcVbtRAGCI5Dw8417SnjM4eDIbjnFmLMprhaUP9EIR8filxJtf4p9hcF45fu-rrbAanzi34sWB3tIYIJczMGaeX3v6deSMGAhEzYr9N0INMAAPlQ30lRkRImtjXpVFnaZnAW4LMDUuaCgYKAdUSARMSFQHGX2MiqrEN0dupBgJ8_ZI9cCX5Aw0175';
  private SHEET_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(private http: HttpClient) {}

  exportDataToGoogleSheets(users: User[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.SHEET_API_URL, {
      properties: { title: 'Angular Exported Users' },
      sheets: [{
        data: [{
          rowData: users.map(user => ({
            values: [
              { userEnteredValue: { stringValue: user.email }},
              { userEnteredValue: { stringValue: user.username }},
              { userEnteredValue: { stringValue: user.name }},
              { userEnteredValue: { stringValue: user.role }}
            ]
          }))
        }]
      }]
    }, { headers });
  }
}
