import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // ✅ CDR ඇඩ් කළාimport { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { UserService } from '../../../core/services/user.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  userName: string = 'Student';
  myEnrollments: any[] = [];
  recentTransactions: any[] = [];
  isLoading = true;

  stats = [
    { label: 'Enrolled', value: 0, icon: 'school', color: 'text-primary', bg: 'bg-primary-subtle' },
    {
      label: 'In Progress',
      value: 0,
      icon: 'hourglass_empty',
      color: 'text-warning',
      bg: 'bg-warning-subtle',
    },
    {
      label: 'Completed',
      value: 0,
      icon: 'check_circle',
      color: 'text-success',
      bg: 'bg-success-subtle',
    },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    console.log('Dashboard loading started...');

    // 1. Get User Name
    this.userService.getProfile().subscribe({
      next: (user: any) => {
        this.userName = user.firstName || 'Student';
        this.cdr.detectChanges();
      },
      error: () => {
        this.userName = 'Student';
        this.cdr.detectChanges();
      },
    });

    // 2. Get Enrollments
    this.courseService.getStudentEnrollments().subscribe({
      next: (enrollments: any[]) => {
        console.log('Enrollments loaded:', enrollments.length);
        this.myEnrollments = enrollments;
        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading enrollments', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });

    // 3. Get Recent Billing
    this.userService.getBillingHistory().subscribe({
      next: (history: any[]) => {
        this.recentTransactions = history.slice(0, 3);
        console.log('Recent transactions loaded');
        this.cdr.detectChanges();
      },
    });
  }

  calculateStats() {
    const total = this.myEnrollments.length;
    const completed = this.myEnrollments.filter((e) => (e.progressPercent || 0) === 100).length;
    const inProgress = total - completed;

    this.stats[0].value = total;
    this.stats[1].value = inProgress;
    this.stats[2].value = completed;

    console.log(
      'Stats updated:',
      this.stats.map((s) => `${s.label}: ${s.value}`),
    );
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return 'accent';
    return 'primary';
  }
}
