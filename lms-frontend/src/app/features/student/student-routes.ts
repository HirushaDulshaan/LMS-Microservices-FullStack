import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.ProfileComponent),
      },
      {
        path: 'enroller-cources',
        loadComponent: () =>
          import('./enroller-cources/enroller-cources').then((m) => m.EnrollerCourcesComponent),
      },
      {
        path: 'billing-history',
        loadComponent: () =>
          import('./billing-history/billing-history').then((m) => m.BillingComponent),
      },
      {
        path: 'course-view/:id',
        loadComponent: () => import('./course-view/course-view').then(m => m.CourseViewComponent),
      },
      {
        path: 'security',
        loadComponent: () => import('./security/security').then((m) => m.SecurityComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
