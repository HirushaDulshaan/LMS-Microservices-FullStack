import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { StudentSideBar } from '../../features/student/sidebar/sidebar';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, StudentSideBar],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss',
})
export class StudentLayoutComponent {}
