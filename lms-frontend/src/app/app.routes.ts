import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout';
import { authGuard } from './core/guards/auth.guard';
import {StudentSideBar} from './features/student/sidebar/sidebar';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'STUDENT' },
    loadChildren: () => import('./features/student/student-routes').then((m) => m.STUDENT_ROUTES),
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home-routes').then((m) => m.HOME_ROUTES),
      },

      {
        path: 'courses',
        loadComponent: () =>
          import('./features/browse-courses/browse-courses').then((m) => m.BrowseCoursesComponent),
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then((m) => m.CartComponent),
      },
      {
        path: 'course/:id',
        loadComponent: () =>
          import('./features/course-details/course-details').then((m) => m.CourseDetailsComponent),
      },
      {
        path: 'payment-success',
        loadComponent: () =>
          import('./features/payment-success/payment-success').then(
            (m) => m.PaymentSuccessComponent,
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  {
    path: 'instructor',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    data: { role: 'TEACHER' },
    loadChildren: () =>
      import('./features/instructor/instructor-routes').then((m) => m.INSTRUCTOR_ROUTES),
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./features/admin/admin-routes').then((m) => m.ADMIN_ROUTES),
  },

  { path: '**', redirectTo: 'home' },
];
