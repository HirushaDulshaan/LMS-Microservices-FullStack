import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/courses';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  addLesson(courseId: number, lessonData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${courseId}/lessons/add`, lessonData, {
      headers: this.getHeaders(),
    });
  }

  getLessons(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${courseId}/lessons/all`, {
      headers: this.getHeaders(),
    });
  }

  updateLesson(courseId: number, lessonId: number, lessonData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${courseId}/lessons/update/${lessonId}`, lessonData, {
      headers: this.getHeaders(),
    });
  }


  completeLesson(courseId: number, lessonId: number, totalLessons: number): Observable<any> {
    const userId = sessionStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      userId: Number(userId),
      courseId: Number(courseId),
      lessonId: Number(lessonId),
      totalLessons: Number(totalLessons),
    };

    console.log('📡 Sending to Node.js:', body);

    return this.http.post(`http://localhost:8080/api/enroll/complete-lesson`, body, { headers });
  }
}
