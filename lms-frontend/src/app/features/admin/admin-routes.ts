import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { DashboardComponent } from './dashboard/dashboard';
import { CoursesComponent } from './courses/courses';
import { UsersComponent } from './users/users';
import { ReportsComponent } from '../instructor/reports/reports';
import { AdminReportsComponent } from './reports/reports';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'courses', component: CoursesComponent },
      {path:'users', component: UsersComponent },
      { path: 'reports', component: AdminReportsComponent } ,
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
