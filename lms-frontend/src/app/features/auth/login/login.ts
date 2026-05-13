import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);


  onLogin() {
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (token: string) => {
        let cleanToken = token;

        if (token.startsWith('{')) {
          const obj = JSON.parse(token);
          cleanToken = obj.token;
        }

        this.authService.saveToken(cleanToken);

        try {
          const payload = JSON.parse(atob(cleanToken.split('.')[1]));
          const userId = payload.userId;

          if (userId) {
            sessionStorage.setItem('userId', userId.toString());
            console.log('--- 🆔 User ID Saved to Session:', userId);
          }
        } catch (e) {
          console.error('Failed to decode token for userId', e);
        }

        const role = this.authService.getUserRole() as string;

        this.userService.getProfile().subscribe({
          next: (profile: any) => {
            sessionStorage.setItem('firstName', profile.firstName || '');
            sessionStorage.setItem('lastName', profile.lastName || '');
            console.log('--- 👤 Session Data Saved:', profile.firstName, profile.lastName);

            this.showSuccessAlert(role);
          },
          error: (err: any) => {
            console.error('Failed to fetch profile during login', err);
            this.showSuccessAlert(role);
          },
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Oops! Invalid email or password.';
        Swal.fire({
          title: 'Error!',
          text: 'Check your credentials and try again.',
          icon: 'error',
          confirmButtonColor: '#0d6efd',
        });
      },
    });
  }
  private showSuccessAlert(role: string) {
    Swal.fire({
      title: 'Login Successful!',
      text: `Welcome back!`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    });

    setTimeout(() => {
      console.log('🚀 Redirecting user with role:', role);
      if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
      else if (role === 'TEACHER') this.router.navigate(['/instructor/dashboard']);
      else if (role === 'STUDENT') this.router.navigate(['/student/dashboard']);
      else this.router.navigate(['/home']);
    }, 1500);
  }
}
