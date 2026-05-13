import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-instructor-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {

  private reportService = inject(ReportService);

  stats = [
    { label: 'Total Revenue', value: '$0', icon: 'attach_money', color: 'text-success' },
    { label: 'Total Enrollments', value: '0', icon: 'group', color: 'text-primary' },
    { label: 'Avg. Course Rating', value: '0.0', icon: 'star', color: 'text-warning' },
    { label: 'Courses Published', value: '0', icon: 'library_books', color: 'text-info' }
  ];

  coursePerformance: any[] = [];

  displayedColumns: string[] = ['title', 'students', 'revenue', 'rating'];

  monthlySales = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 90 },
    { month: 'Jun', value: 100 }
  ];

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportService.getInstructorReports().subscribe({
      next: (res: any) => {
        console.log('✅ Real Report Data:', res);

        this.stats[0].value = `$${res.totalRevenue || 0}`;
        this.stats[1].value = (res.totalEnrollments || 0).toString();
        this.stats[2].value = (res.avgRating || 0).toFixed(1);
        this.stats[3].value = (res.totalCourses || 0).toString();

        this.coursePerformance = res.coursePerformance || [];
      },
      error: (err: any) => {
        console.error('Failed to load reports', err);
      }
    });
  }
}
