import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class AdminReportsComponent implements OnInit {
  private adminService = inject(AdminService);

  overviewStats = [
    { label: 'Total Revenue', value: 'LKR 0', change: '+12%', icon: 'payments', color: 'text-success' },
    { label: 'Total Enrollments', value: '0', change: '+5%', icon: 'school', color: 'text-primary' },
    { label: 'Total Students', value: '0', change: '+8%', icon: 'group', color: 'text-info' },
    { label: 'Active Courses', value: '0', change: '+2', icon: 'library_books', color: 'text-warning' },
  ];

  topCourses: any[] = [];
  userRoles: any[] = [];
  monthlyEarnings: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadRealData();
    console.log('🔴 AdminReportsComponent loaded');

  }

  loadRealData() {
    this.isLoading = true;

    forkJoin({
      authStats: this.adminService.getDashboardStats(),
      courseStats: this.adminService.getAllCoursesWithStats(),
      revenueStats: this.adminService.getMonthlyRevenue(),
    }).subscribe({
      next: (data) => {
        console.group('🚀 Admin Analytics - Syncing Data');

        // 1. Auth Data (Students & Instructors)
        const totalStudents = data.authStats.totalStudents || 0;
        const totalInstructors = data.authStats.totalInstructors || 0;
        this.overviewStats[2].value = totalStudents.toLocaleString();
        this.updateUserRoles(totalStudents, totalInstructors);

        // 2. Course & Enrollment Data
        const courses = data.courseStats;
        const totalEnrolled = courses.reduce((sum: number, c: any) => sum + (c.studentCount || 0), 0);
        const totalRev = courses.reduce((sum: number, c: any) => sum + (c.totalEarnings || 0), 0);

        this.overviewStats[0].value = `LKR ${totalRev.toLocaleString()}`;
        this.overviewStats[1].value = totalEnrolled.toLocaleString();
        this.overviewStats[3].value = courses.length.toString();

        //  Table Logic (Mapping Course Performance)
        this.topCourses = [...courses]
          .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
          .slice(0, 5)
          .map((c) => ({
            title: c.title,
            instructor: c.instructorName || 'Expert',
            revenue: c.totalEarnings || 0,
            enrollments: c.studentCount || 0,
          }));

        //  Chart Logic (Monthly Bars)
        const maxVal = Math.max(...data.revenueStats.map((d: any) => d.revenue), 1);
        this.monthlyEarnings = data.revenueStats.map((item: any) => ({
          month: item.month,
          value: (item.revenue / maxVal) * 100,
          label: `LKR ${item.revenue.toLocaleString()}`,
        }));

        console.log('Updated Top Courses:', this.topCourses);
        console.groupEnd();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(' API Load Error:', err);
        this.isLoading = false;
      },
    });
  }

  updateUserRoles(students: number, instructors: number) {
    const total = students + instructors + 1;
    if (total > 0) {
      this.userRoles = [
        { role: 'Student', count: students, percent: Math.round((students / total) * 100), color: 'bg-primary' },
        { role: 'Instructor', count: instructors, percent: Math.round((instructors / total) * 100), color: 'bg-warning' },
        { role: 'Admin', count: 1, percent: Math.round((1 / total) * 100), color: 'bg-danger' }
      ];
    }
  }
}
