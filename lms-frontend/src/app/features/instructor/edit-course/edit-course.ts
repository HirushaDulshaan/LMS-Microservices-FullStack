import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-course',
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
    MatCardModule
  ],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.scss'
})
export class EditCourseComponent implements OnInit {

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseId!: number;
  levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  categories: any[] = [];

  editForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    category: ['', Validators.required],
    level: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    thumbnailUrl: ['', Validators.required]
  });

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCategories();

    if (this.courseId) {
      this.loadCourseData();
    }
  }

  loadCategories() {
    this.courseService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = res.map(subject => ({
          value: subject.id,
          label: subject.name
        }));
      }
    });
  }


  loadCourseData() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        console.log('Course Data Received:', res);
        this.editForm.patchValue({
          title: res.title,
          description: res.description,
          category: res.subject ? res.subject.id : null,
          level: res.level,
          price: res.price,
          thumbnailUrl: res.thumbnailUrl
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Could not load course details', 'error');
      }
    });
  }

  private formatCategory(cat: string): string {
    return cat.replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, c => c.toUpperCase());
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.courseService.updateCourse(this.courseId, this.editForm.value).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Updated!',
            text: 'Course details updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/instructor/dashboard']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Failed to update course', 'error');
        }
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }
}
