import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/auth/login';
  private registerUrl = 'http://localhost:8080/auth/register';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<string> {
    return this.http.post(this.loginUrl, credentials, {
      responseType: 'text',
    });
  }
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token Content:', decoded);

      return decoded.role || decoded.roles || decoded.authorities || null;
    } catch (error) {
      console.error('Decoding failed', error);
      return null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(userData: any): Observable<any> {
    return this.http.post(this.registerUrl, userData, {
      responseType: 'text',
    });
  }
}
