import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/instructor/courses';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/courses/subjects/all');
  }
  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/courses/subjects/all');
  }

  getMyCourses(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>('http://localhost:8080/courses/instructor/my', { headers });
  }

  getCourseById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`http://localhost:8080/courses/${id}`, { headers });
  }
  updateCourse(id: number, course: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`http://localhost:8080/courses/update/${id}`, course, { headers });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/courses/all');
  }

  checkEnrollment(courseId: number): Observable<{ enrolled: boolean }> {
    const studentId = sessionStorage.getItem('userId');
    if (!studentId) return of({ enrolled: false });

    return this.http.get<{ enrolled: boolean }>(
      `http://localhost:8080/api/enroll/check/${studentId}/${courseId}`,
    );
  }


  createCourse(course: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post('http://localhost:8080/courses/create', course, { headers });
  }


  enrollCourse(courseId: number): Observable<any> {
    console.log('Enrolling in course ID:', courseId);

    return of({
      success: true,
      message: 'Enrolled successfully',
    });

  }
  getStudentEnrollments(): Observable<any[]> {
    const studentId = sessionStorage.getItem('userId');
    const token = localStorage.getItem('token'); //

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any[]>(
      `http://localhost:8080/api/enroll/student/${studentId}`,
      { headers },
    );
  }
}
