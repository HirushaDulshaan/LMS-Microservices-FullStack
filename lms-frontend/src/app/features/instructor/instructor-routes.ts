import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MyCoursesComponent } from './my-courses/my-courses';
import { CreateCourseComponent } from './create-course/create-course';
import { EditCourseComponent } from './edit-course/edit-course';
import { ManageLessonsComponent } from './manage-lessons/manage-lessons';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-courses', component: MyCoursesComponent },
      { path: 'create-course', component: CreateCourseComponent },
      { path: 'edit-course/:id', component: EditCourseComponent },
      { path: 'manage-lessons/:id', component: ManageLessonsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
