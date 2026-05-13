import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './enroller-cources.html',
  styleUrl: './enroller-cources.scss',
})
export class EnrollerCourcesComponent implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  enrolledCourses: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.isLoading = true;

    this.courseService.getStudentEnrollments().subscribe({
      next: (res: any[]) => {
        console.log('Enrollments received:', res);

        this.enrolledCourses = Array.isArray(res) ? res : [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading enrollments', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return 'accent';
    if (progress === 0 || !progress) return 'warn';
    return 'primary';
  }
}
