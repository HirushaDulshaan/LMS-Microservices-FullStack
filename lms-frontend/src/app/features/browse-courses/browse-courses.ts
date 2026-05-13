import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';

interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
  level: string;
  rating: number;
  reviews: number;
  price: number;
  bestseller?: boolean;
}

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatExpansionModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
  ],
  templateUrl: './browse-courses.html',
  styleUrls: ['./browse-courses.scss'],
})
export class BrowseCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  // UI State
  isLoading = false;
  searchQuery: string = '';
  selectedSort: string = '';
  maxPriceFilter: number = 10000;

  // Filters (Loaded via API)
  categories: { name: string; selected: boolean }[] = [];
  levels = [
    { name: 'Beginner', selected: false },
    { name: 'Intermediate', selected: false },
    { name: 'Advanced', selected: false },
  ];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalItems: number = 0;
  paginatedCourses: Course[] = [];

  // Data storage
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];

  ngOnInit() {

    this.loadSubjects();
    this.loadCourses();
  }

  loadSubjects() {
    this.courseService.getSubjects().subscribe({
      next: (data: any[]) => {
        this.categories = data.map((sub) => ({
          name: sub.name,
          selected: false,
        }));
        console.log(' Categories Loaded from API:', this.categories);
      },
      error: (err) => console.error('Failed to load subjects', err),
    });
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data: any[]) => {
        this.isLoading = false;
        console.log('RAW Courses received:', data);

        this.allCourses = data.map((course) => ({
          id: course.id,
          title: course.title || '',
          instructor: course.instructorName || 'Hirusha Dulshan',
          thumbnail: this.transformImage(course.thumbnailUrl),
          category: course.subject?.name || 'General',
          level: course.level || 'BEGINNER',
          rating: course.rating || 4.5,
          reviews: course.reviews || 10,
          price: course.price || 0,
          bestseller: course.price > 5000,
        }));

        this.applyFilters();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('API Error loading courses:', err);
      },
    });
  }

  applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();

    const selectedCatNames = this.categories
      .filter((c) => c.selected)
      .map((c) => c.name.toUpperCase());

    const selectedLvlNames = this.levels.filter((l) => l.selected).map((l) => l.name.toUpperCase());

    this.filteredCourses = this.allCourses.filter((course) => {
      const matchesSearch = !query || course.title.toLowerCase().includes(query);

      const matchesCat =
        selectedCatNames.length === 0 || selectedCatNames.includes(course.category.toUpperCase());

      const matchesLvl =
        selectedLvlNames.length === 0 || selectedLvlNames.includes(course.level.toUpperCase());

      const matchesPrice = course.price <= this.maxPriceFilter;

      return matchesSearch && matchesCat && matchesLvl && matchesPrice;
    });

    this.totalItems = this.filteredCourses.length;
    this.currentPage = 1;
    this.sortCourses();
  }

  sortCourses() {
    if (this.selectedSort) {
      switch (this.selectedSort) {
        case 'price-low':
          this.filteredCourses.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          this.filteredCourses.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          this.filteredCourses.sort((a, b) => b.id - a.id);
          break;
        case 'popular':
          this.filteredCourses.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
    this.updatePagination();
  }

  resetFilters() {
    this.searchQuery = '';
    this.maxPriceFilter = 10000;
    this.categories.forEach((c) => (c.selected = false));
    this.levels.forEach((l) => (l.selected = false));
    this.selectedSort = '';
    this.applyFilters();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCourses = this.filteredCourses.slice(start, end);

    this.cdr.detectChanges();

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992;
  }
  isLargeScreen = true;
}
