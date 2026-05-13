import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonService } from '../../../core/services/Lesson.service';
import { CourseService } from '../../../core/services/course.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private courseService = inject(CourseService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  course: any = null;
  lessons: any[] = [];
  selectedLesson: any = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  isLoading = true;

  progressPercentage: number = 0;

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourseData(courseId);
      this.loadLessons(courseId);
    }
  }

  loadCourseData(id: number) {
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadLessons(id: number) {
    this.isLoading = true;
    this.lessonService.getLessons(id).subscribe({
      next: (data) => {
        this.lessons = data || [];
        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0]);
        }
        this.calculateOverallProgress();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading lessons', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
    if (lesson.video_url || lesson.videoUrl) {
      const url = lesson.video_url || lesson.videoUrl;
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    this.cdr.detectChanges();
  }

  markAsComplete(lesson: any) {
    if (!lesson || lesson.isCompleted) return;

    const courseId = this.course.id;
    const lessonId = lesson.id;

    const totalLessons = this.lessons.length;

    this.lessonService.completeLesson(courseId, lessonId, totalLessons).subscribe({
      next: (res) => {
        console.log('Progress updated from backend:', res.progress);

        lesson.isCompleted = true;
        this.progressPercentage = res.progress;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating progress:', err);
      },
    });
  }

  calculateOverallProgress() {
    if (this.lessons.length === 0) return;
    const total = this.lessons.length;
    const completed = this.lessons.filter((l) => l.isCompleted).length;
    this.progressPercentage = Math.round((completed / total) * 100);
  }
}
