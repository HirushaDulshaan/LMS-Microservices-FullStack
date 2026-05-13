import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  getInstructorReports(): Observable<any> {
    return of({
      totalRevenue: 1250,
      totalEnrollments: 240,
      avgRating: 4.8,
      totalCourses: 5,
      coursePerformance: [
        { title: 'Java Expert', students: 150, revenue: 7500, rating: 4.9 },
        { title: 'Angular Pro', students: 90, revenue: 3600, rating: 4.7 },
      ],
    });
  }
}
