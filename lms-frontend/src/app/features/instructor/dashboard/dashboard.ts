import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CourseService } from '../../../core/services/course.service';
import {AuthService} from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Stats
  stats = [
    { label: 'Total Courses', value: 0, icon: 'library_books', color: 'primary' },
    { label: 'Total Students', value: 120, icon: 'group', color: 'accent' },
    { label: 'Total Earnings', value: '$1,250', icon: 'attach_money', color: 'warn' },
    { label: 'Course Rating', value: '4.8', icon: 'star', color: 'primary' },
  ];

  recentCourses: any[] = [];
  displayedColumns: string[] = ['title', 'price', 'category', 'level', 'actions'];

  quickActions = [
    {
      label: 'Create New Course',
      icon: 'add_circle',
      link: '/instructor/create-course',
      color: 'primary',
    },
    { label: 'My Courses', icon: 'list', link: '/instructor/my-courses', color: 'accent' },
    { label: 'View Reports', icon: 'assessment', link: '/instructor/reports', color: 'warn' },
  ];

  ngOnInit() {
    this.loadMyCourses();
  }

  loadMyCourses() {
    this.courseService.getMyCourses().subscribe({
      next: (res: any[]) => {
        console.log('✅ Dashboard Data Received:', res);

        if (res && res.length > 0) {
          this.recentCourses = [...res].reverse().slice(0, 5);

          this.stats = [
            { label: 'Total Courses', value: res.length, icon: 'library_books', color: 'primary' },
            { label: 'Total Students', value: 120, icon: 'group', color: 'accent' },
            { label: 'Total Earnings', value: '$1,250', icon: 'attach_money', color: 'warn' },
            { label: 'Course Rating', value: '4.8', icon: 'star', color: 'primary' },
          ];


          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error(' Dashboard error:', err);
      }
    });
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
