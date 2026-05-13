import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseListComponent implements OnInit {

  private courseService = inject(CourseService);

  courses: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadAllCourses();
  }

  loadAllCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        console.log('Public Courses Loaded:', res);
        this.courses = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading courses', err);
        this.isLoading = false;
      }
    });
  }
}
