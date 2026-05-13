import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  latestCourses: any[] = [];
  popularCourses: any[] = [];
  isLoading = true;

  stats = [
    { icon: 'school', value: '150+', label: 'Courses' },
    { icon: 'people', value: '10K+', label: 'Students' },
    { icon: 'workspace_premium', value: '50+', label: 'Instructors' },
    { icon: 'star', value: '4.8', label: 'Rating' },
  ];

  ngOnInit() {
    this.loadLatestCourses();
    this.loadPopularCourses();
  }

  loadLatestCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses: any[]) => {
        if (courses && courses.length > 0) {
          this.latestCourses = [...courses].reverse().slice(0, 3);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadPopularCourses() {
    console.log('📡 Fetching popular course IDs...');

    this.http.get<number[]>('http://localhost:8080/api/enroll/popular-ids').subscribe({
      next: (ids: number[]) => {
        if (ids && ids.length > 0) {
          this.http.post<any[]>('http://localhost:8080/courses/by-ids', ids).subscribe({
            next: (courses: any[]) => {
              this.popularCourses = courses;
              this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Java Error:', err),
          });
        }
      },
      error: (err: any) => console.error('Node.js Error:', err),
    });
  }

  handleEnroll(courseId: number) {
    this.router.navigate(['/courses', courseId]);
  }
}
