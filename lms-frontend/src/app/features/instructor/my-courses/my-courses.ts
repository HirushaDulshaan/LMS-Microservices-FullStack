import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-instructor-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class MyCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  courses: any[] = [];
  displayedColumns: string[] = ['title', 'price', 'Subject', 'level', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadMyCourses();
  }

  loadMyCourses() {
    this.isLoading = true;

    this.courseService.getMyCourses().subscribe({
      next: (res: any) => {
        console.log(' Real Courses Loaded:', res);

        this.courses = [...res];

        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error loading courses', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
