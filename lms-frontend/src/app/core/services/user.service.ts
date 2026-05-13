import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/user';

  private http = inject(HttpClient);
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  sendOtp(): Observable<any> {
    console.log('OTP sent to email');
    return of({ success: true });
  }

  changePassword(otp: string, newPassword: string): Observable<any> {
    console.log('Changing Password with OTP:', otp);
    return of({ success: true });
  }

  changeEmail(otp: string, newEmail: string): Observable<any> {
    console.log('Changing Email to:', newEmail);
    return of({ success: true });
  }

  requestEmailChange(newEmail: string, reason: string): Observable<any> {
    console.log('Manual Email Change Request:', { newEmail, reason });
    return of({ success: true });
  }

  requestInstructorRole(reason: string): Observable<any> {
    console.log('Instructor Role Request:', reason);
    return of({ success: true });
  }

  getBillingHistory(): Observable<any[]> {
    const studentId = sessionStorage.getItem('userId');
    const token = localStorage.getItem('token');

    console.log('📡 Fetching Billing for Student ID:', studentId);

    if (!studentId) {
      console.error(' User ID not found in session storage!');
      return of([]);
    }

    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(`http://localhost:8080/api/enroll/billing/${studentId}`, {
      headers,
    });
  }
}
