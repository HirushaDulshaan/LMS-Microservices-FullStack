import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { LessonService } from '../../core/services/Lesson.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private lessonService = inject(LessonService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  course: any = null;
  lessons: any[] = [];
  isLoading = true;
  isEnrolled = false;
  error: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('--- 🔎 Route Param ID found:', id);

      if (id) {
        const courseId = Number(id);
        this.loadCourseDetails(courseId);
        this.loadLessons(courseId);
        this.checkEnrollment(courseId);
      } else {
        this.isLoading = false;
        this.error = 'Course ID not found in URL';
        this.cdr.detectChanges();
      }
    });
  }

  loadCourseDetails(id: number) {
    this.isLoading = true;
    console.log(' Starting to load Course Details...');

    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        console.log(' Course Data Received from Backend:', data);

        this.course = {
          ...data,
          title: data.title || 'Untitled Course',
          description: data.description || 'No description available.',
          thumbnailUrl: this.transformImage(data.thumbnailUrl || data.thumbnail),
          price: data.price || 0,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('--- isLoading set to false and UI update triggered.');
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.isLoading = false;
        this.error = 'Failed to load course details. Please try again.';
        this.cdr.detectChanges();
        Swal.fire('Error', 'Could not load course details', 'error');
      },
    });
  }

  loadLessons(courseId: number) {
    console.log('Fetching lessons for Course ID:', courseId);
    this.lessonService.getLessons(courseId).subscribe({
      next: (data) => {
        console.log('Lessons Received:', data);
        this.lessons = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
      },
    });
  }

  checkEnrollment(courseId: number) {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.courseService.checkEnrollment(courseId).subscribe({
      next: (res: { enrolled: boolean }) => {
        console.log('Enrollment Status Response:', res);
        this.isEnrolled = res.enrolled;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Enrollment Check Error:', err);
      },
    });
  }

  private transformImage(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1])
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    return url;
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      return this.promptLogin();
    }
    this.cartService.addToCart(this.course);
    Swal.fire({ title: 'Added to Cart', icon: 'success', timer: 1500, showConfirmButton: false });
  }

  promptLogin() {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login to continue.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Login Now',
    }).then((result) => {
      if (result.isConfirmed) this.router.navigate(['/auth/login']);
    });
  }

  enrollNow() {
    if (!this.authService.isLoggedIn()) return this.promptLogin();

    Swal.fire({
      title: 'Enrolling...',
      didOpen: () => Swal.showLoading(),
    });

    this.courseService.enrollCourse(this.course.id).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.cdr.detectChanges();
        Swal.fire('Success', 'You have enrolled successfully!', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to enroll', 'error'),
    });
  }
}
