import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get('http://localhost:8080/user/dashboard/stats');
  }

  getMonthlyRevenue(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/enroll/admin/monthly-revenue');
  }

  getPendingRequests(): Observable<any[]> {
    return of([
      {
        id: 101,
        user: { firstName: 'Kamal' },
        newEmail: 'kamal.new@gmail.com',
        reason: 'Personal',
      },
    ]);
  }

  approveRequest(id: number): Observable<any> {
    return of({ success: true });
  }

  rejectRequest(id: number): Observable<any> {
    return of({ success: true });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/user/all');
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/user/${userId}`);
  }
  deleteCourse(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`http://localhost:8080/courses/${id}`, { headers });
  }

  updateCourseByAdmin(id: number, courseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`http://localhost:8080/courses/update/${id}`, courseData, { headers });
  }
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/courses/all');
  }
  getAllCoursesWithStats(): Observable<any[]> {
    const courses$ = this.http.get<any[]>('http://localhost:8080/courses/all');
    const stats$ = this.http.get<any>('http://localhost:8080/api/enroll/admin/course-stats');

    return forkJoin([courses$, stats$]).pipe(
      map(([courses, stats]) => {
        return courses.map((course) => ({
          ...course,
          studentCount: stats[course.id]?.count || 0,
          totalEarnings: stats[course.id]?.revenue || 0,
        }));
      }),
    );
  }
  getInstructorRequests(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/user/instructor-requests');
  }

  approveInstructor(userId: number): Observable<any> {
    return this.http.put(
      `http://localhost:8080/user/users/${userId}/role?newRole=TEACHER`,
      {},
      { responseType: 'text' },
    );
  }
}
