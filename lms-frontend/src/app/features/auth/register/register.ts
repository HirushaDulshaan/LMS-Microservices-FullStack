import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // ✅ SweetAlert2 Install කරගන්න

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: 'STUDENT',
  };

  errorMessage = '';

  onRegister() {
    this.errorMessage = '';

    Swal.fire({
      title: 'Creating Account...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful! Please login.',
          icon: 'success',
          confirmButtonColor: '#0d6efd',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        Swal.close();
        this.errorMessage = 'Registration failed. This email might be already in use.';
        console.error(err);
      },
    });
  }
}
