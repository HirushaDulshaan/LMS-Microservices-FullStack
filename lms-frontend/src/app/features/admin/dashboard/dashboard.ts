import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { forkJoin } from 'rxjs';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalStudents = 0;
  totalInstructors = 0;
  totalCourses = 0;
  totalRevenue = 0;
  totalEnrollments = 0;
  recentActivities: any[] = [];
  topInstructors: any[] = [];
  isLoading = true;

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Revenue (LKR)', backgroundColor: '#4f46e5', borderRadius: 5 },
      { data: [], label: 'Enrollments', backgroundColor: '#10b981', borderRadius: 5 },
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } },
    scales: { y: { beginAtZero: true } },
  };

  ngOnInit() {
    this.loadRealDashboardData();
  }

  loadRealDashboardData() {
    this.isLoading = true;

    forkJoin({
      userStats: this.adminService.getDashboardStats(),
      coursesWithStats: this.adminService.getAllCoursesWithStats(),
      monthlyRev: this.adminService.getMonthlyRevenue(),
    }).subscribe({
      next: (res) => {
        // 1. User Stats
        this.totalStudents = res.userStats.totalStudents || 0;
        this.totalInstructors = res.userStats.totalInstructors || 0;

        // 2. Course & Enrollment Stats
        const courses = res.coursesWithStats;
        this.totalCourses = courses.length;
        this.totalEnrollments = courses.reduce(
          (sum: number, c: any) => sum + (c.studentCount || 0),
          0,
        );
        this.totalRevenue = courses.reduce(
          (sum: number, c: any) => sum + (c.totalEarnings || 0),
          0,
        );

        // 3. Process UI Helpers
        this.processRecentActivity(courses);
        this.processTopInstructors(courses);

        // 4. Update Chart & Force Detection
        this.updateChart(res.monthlyRev);

        this.isLoading = false;

        this.cdr.detectChanges();

        this.chart?.update();
      },
      error: (err) => {
        console.error('Dashboard Load Error:', err);
        this.isLoading = false;
      },
    });
  }

  processRecentActivity(courses: any[]) {
    if (!courses || courses.length === 0) {
      this.recentActivities = [];
      return;
    }

    this.recentActivities = [...courses]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((c) => ({
        title: 'New Course Published',
        desc: c.title,
        time: this.formatDate(c.createdAt),
        icon: 'publish',
      }));

    this.cdr.detectChanges();
  }

  private formatDate(dateStr: any): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString();
  }

  processTopInstructors(courses: any[]) {
    const instructorMap: any = {};
    courses.forEach((c) => {
      const name = c.instructorName || 'Unknown';
      if (!instructorMap[name]) {
        instructorMap[name] = {
          name,
          subject: c.category || 'General',
          courses: 0,
          students: 0,
          rating: 4.8,
        };
      }
      instructorMap[name].courses++;
      instructorMap[name].students += c.studentCount || 0;
    });
    this.topInstructors = Object.values(instructorMap)
      .sort((a: any, b: any) => b.students - a.students)
      .slice(0, 5);
  }

  updateChart(revData: any[]) {
    if (!revData || revData.length === 0) return;

    this.barChartData = {
      labels: revData.map((d) => d.month),
      datasets: [
        { data: revData.map((d) => d.revenue), label: 'Revenue (LKR)', backgroundColor: '#4f46e5' },
        {
          data: revData.map((d) => Math.floor(d.revenue / 5000)),
          label: 'Est. Enrollments',
          backgroundColor: '#10b981',
        },
      ],
    };
  }
}
