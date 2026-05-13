import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './create-course.html',
  styleUrl: './create-course.scss',
})
export class CreateCourseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);

  levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  categories: any[] = [];

  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    category: ['', Validators.required],
    level: ['BEGINNER', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    thumbnailUrl: ['', Validators.required],
  });

  currentThumbnail: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.courseService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res.map((subject) => ({
          value: subject.id,
          label: this.formatCategory(subject.name),
        }));
      },
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  private formatCategory(cat: string): string {
    return cat
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  onImageUrlChange() {
    const url = this.courseForm.get('thumbnailUrl')?.value;
    if (!url) {
      this.currentThumbnail = null;
      return;
    }

    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        this.currentThumbnail = `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
        return;
      }
    }
    this.currentThumbnail = url;
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;

      const fName = sessionStorage.getItem('firstName') || '';
      const lName = sessionStorage.getItem('lastName') || '';
      const fullName = (fName + ' ' + lName).trim();

      const coursePayload = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        level: formValue.level,
        thumbnailUrl: formValue.thumbnailUrl,
        instructorName: fullName || 'Unknown Instructor',
        subject: {
          id: formValue.category,
        },
      };

      console.log('Sending Payload with Instructor Name:', coursePayload);

      this.courseService.createCourse(coursePayload).subscribe({
        next: () => {
          Swal.fire('Success', 'Course Created Successfully', 'success');
          this.router.navigate(['/instructor/dashboard']);
        },
        error: (err) => {
          console.error('Frontend Error:', err);
          Swal.fire('Error', 'Failed to create course.', 'error');
        },
      });
    }
  }
}
