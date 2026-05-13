import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonService } from '../../../core/services/Lesson.service';
import Swal from 'sweetalert2';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-lessons',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './manage-lessons.html',
})
export class ManageLessonsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private lessonService = inject(LessonService);

  courseId!: number;
  lessons: any[] = [];

  isEditMode = false;
  selectedLessonId: number | null = null;

  lessonForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    videoUrl: ['', [Validators.required]],
    content: [''],
    orderIndex: [1, Validators.required],
    durationSeconds: [0],
  });

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.courseId) {
      this.loadLessons();
    }
  }

  loadLessons() {
    this.lessonService.getLessons(this.courseId).subscribe({
      next: (res: any[]) => {
        this.lessons = res;
        if (!this.isEditMode) {
          this.lessonForm.patchValue({ orderIndex: this.lessons.length + 1 });
        }
      },
      error: (err) => console.error('Error fetching lessons', err),
    });
  }

  onEdit(lesson: any) {
    this.isEditMode = true;
    this.selectedLessonId = lesson.id;
    this.lessonForm.patchValue({
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
      orderIndex: lesson.orderIndex,
      durationSeconds: lesson.durationSeconds,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.selectedLessonId = null;
    this.lessonForm.reset({
      orderIndex: this.lessons.length + 1,
      durationSeconds: 0,
    });
  }

  onSubmit() {
    if (this.lessonForm.valid) {
      if (this.isEditMode && this.selectedLessonId) {
        // Update Existing Lesson
        this.lessonService
          .updateLesson(this.courseId, this.selectedLessonId, this.lessonForm.value)
          .subscribe({
            next: () => {
              Swal.fire('Updated', 'Lesson updated successfully!', 'success');
              this.loadLessons();
              this.cancelEdit();
            },
            error: () => Swal.fire('Error', 'Failed to update lesson.', 'error'),
          });
      } else {
        // Add New Lesson
        this.lessonService.addLesson(this.courseId, this.lessonForm.value).subscribe({
          next: () => {
            Swal.fire('Success', 'Lesson added successfully!', 'success');
            this.loadLessons();
            this.lessonForm.reset({ orderIndex: this.lessons.length + 1 });
          },
          error: () => Swal.fire('Error', 'Failed to add lesson.', 'error'),
        });
      }
    }
  }
}
