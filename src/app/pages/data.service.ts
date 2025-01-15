import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class DataService {
  [x: string]: any;
  constructor(private router: Router,http: HttpClient) {}


  private baseUrl = 'http://localhost:3000/person/api/personData';


  // Fetch data by unique ID
  getPersonData(uniqueId: string): Observable<any> {
    return this['http'].get(`${this.baseUrl}/${uniqueId}`);
  }


  private jwtHelper = new JwtHelperService(); // Initialize JwtHelperService

  saveUserData(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  clearUserData(): void {
    localStorage.removeItem('userData');
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
}

  getToken(): string | null {
    return localStorage.getItem('token');
}

}

