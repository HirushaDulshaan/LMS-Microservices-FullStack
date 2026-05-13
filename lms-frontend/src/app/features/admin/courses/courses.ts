import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminService} from '../../../core/services/admin.service';
import Swal from 'sweetalert2';


import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class CoursesComponent implements OnInit {
  private adminService = inject(AdminService);

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'title', 'instructor', 'students', 'revenue', 'actions'];

  selectedCourse: any = null; // The course to show in the right panel
  isLoading = true;

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.adminService.getAllCoursesWithStats().subscribe({
      next: (combinedData) => {
        this.dataSource.data = combinedData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching combined data', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Show Details in Right Panel
  viewDetails(course: any) {
    this.selectedCourse = course;
  }

  closeDetails() {
    this.selectedCourse = null;
  }

  deleteCourse(course: any) {
    Swal.fire({
      title: 'Delete Course?',
      text: `This will remove "${course.title}" and unenroll all students.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCourse(course.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Course has been removed.', 'success');
            this.loadCourses();
            this.closeDetails();
          },
        });
      }
    });
  }
  editCourse(course: any) {
    Swal.fire({
      title: 'Edit Course Title',
      input: 'text',
      inputValue: course.title,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: (newTitle) => {
        if (!newTitle) {
          Swal.showValidationMessage('Title is required');
        }
        return newTitle;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = { ...course, title: result.value };
        this.adminService.updateCourseByAdmin(course.id, updatedData).subscribe({
          next: () => {
            Swal.fire('Updated!', 'Course title has been changed.', 'success');
            this.loadCourses();
          },
        });
      }
    });
  }
}
