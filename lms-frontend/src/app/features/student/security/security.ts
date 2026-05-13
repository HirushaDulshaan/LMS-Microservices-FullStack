import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './security.html',
  styleUrl: './security.scss'
})
export class SecurityComponent implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  otpSent = false;
  isLoading = false;
  hidePassword = signal(true);

  currentEmail: string = 'Loading...';

  securityForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.currentEmail = res.email || 'Unknown';
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.currentEmail = 'Unavailable';
      }
    });
  }

  clickEvent(event: MouseEvent) {
    this.hidePassword.update(value => !value);
    event.stopPropagation();
  }

  // Password Change OTP
  sendOtp() {
    this.isLoading = true;
    this.userService.sendOtp().subscribe({
      next: () => {
        this.isLoading = false;
        this.otpSent = true;
        Swal.fire('OTP Sent', 'Check your email (or console) for the code.', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', 'Failed to send OTP.', 'error');
      }
    });
  }

  // Password Change Submit
  onSubmit() {
    if (this.securityForm.valid) {
      this.isLoading = true;
      const { otp, newPassword } = this.securityForm.value;

      this.userService.changePassword(otp, newPassword).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Password changed successfully.', 'success').then(() => {
            this.otpSent = false;
            this.securityForm.reset();
          });
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Error', 'Invalid OTP or Server Error', 'error');
        }
      });
    }
  }

  changeEmail() {
    Swal.fire({
      title: 'Update Email Address',
      text: 'Enter the new email address you want to use.',
      input: 'email',
      inputLabel: 'New Email Address',
      inputValue: '',
      showCancelButton: true,
      confirmButtonText: 'Next',
      showLoaderOnConfirm: true,
      footer: '<a href="javascript:void(0)" id="lost-email-link">Lost access to your current email?</a>',
      didOpen: () => {
        const link = document.getElementById('lost-email-link');
        if (link) {
          link.onclick = () => {
            Swal.close();
            this.requestLostEmailAccess();
          };
        }
      },
      preConfirm: (newEmail) => {
        if (!newEmail || newEmail === this.currentEmail) {
          Swal.showValidationMessage('Please enter a valid, different email');
          return false;
        }

        return this.userService.sendOtp().toPromise()
          .then(() => newEmail)
          .catch(error => {
             Swal.showValidationMessage(`Failed to send OTP: ${error.message || 'Unknown error'}`);
          });
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newEmail = result.value;

        Swal.fire({
          title: 'Verify Identity',
          text: `We sent an OTP to your CURRENT email (${this.currentEmail}). Enter it below to confirm the change to ${newEmail}.`,
          input: 'text',
          inputLabel: 'Enter 6-Digit OTP',
          inputAttributes: { maxlength: '6' },
          showCancelButton: true,
          confirmButtonText: 'Verify & Update',
          showLoaderOnConfirm: true,
          preConfirm: (otp) => {
            if (!otp || otp.length < 6) {
              Swal.showValidationMessage('Invalid OTP');
              return false;
            }

            // Call Change Email API with OTP & New Email
            return this.userService.changeEmail(otp, newEmail).toPromise()
              .catch(error => {
                 const msg = error.error || 'Failed to verify OTP';
                 Swal.showValidationMessage(`Request failed: ${msg}`);
              });
          }
        }).then((finalResult) => {
          if (finalResult.isConfirmed) {
            // Success! Logout user
            this.authService.logout();
            this.router.navigate(['/login']);
            Swal.fire('Email Updated!', 'Please login with your new email.', 'success');
          }
        });
      }
    });
  }

  // 👇 NEW: Handle Manual Request to Admin
  requestLostEmailAccess() {
    Swal.fire({
      title: 'Request Email Change',
      html: `
        <p class="text-muted small">Since you cannot access your current email, please submit a request to the admin.</p>
        <input id="new-req-email" class="swal2-input" placeholder="New Email Address">
        <textarea id="req-reason" class="swal2-textarea" placeholder="Reason (e.g. Lost password to old email)" rows="3"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const newEmail = (document.getElementById('new-req-email') as HTMLInputElement).value;
        const reason = (document.getElementById('req-reason') as HTMLTextAreaElement).value;

        if (!newEmail || !reason) {
          Swal.showValidationMessage('Please fill in both fields');
          return false;
        }

        // Call Service to save request
        // Ensure you have added requestEmailChange to UserService!
        return (this.userService as any).requestEmailChange(newEmail, reason).toPromise()
          .catch((error: any) => {
            Swal.showValidationMessage(`Request failed: ${error.error || 'Unknown error'}`);
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Request Submitted', 'The admin will review your request. You will be contacted at your new email.', 'success');
      }
    });
  }
}
