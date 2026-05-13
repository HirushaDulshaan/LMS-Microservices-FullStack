import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    contactNumber: [''],
    addressLine1: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  isLoading = true;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (user: any) => {
        console.log('Profile Data Received:', user);
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.mobileNumber,
          addressLine1: user.address?.streetAddress,
          city: user.address?.city,
          postalCode: user.address?.postalCode,
          country: user.address?.country,
        });
        this.isLoading = false;
        this.cdr.detectChanges();

        console.log('isLoading set to false, form should show now');
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const rawValues = this.profileForm.getRawValue();

      const updatePayload = {
        firstName: rawValues.firstName,
        lastName: rawValues.lastName,
        mobileNumber: rawValues.contactNumber,
        address: {
          streetAddress: rawValues.addressLine1,
          city: rawValues.city,
          postalCode: rawValues.postalCode,
          country: rawValues.country,
        },
      };

      this.userService.updateProfile(updatePayload).subscribe({
        next: () => {
          Swal.fire('Success', 'Profile updated successfully!', 'success');
        },
        error: (err) => {
          console.error('Update error:', err);
          Swal.fire('Error', 'Failed to update profile', 'error');
        },
      });
    }
  }

  requestInstructor() {
    Swal.fire({
      title: 'Become an Instructor',
      input: 'textarea',
      inputLabel: 'Why do you want to teach?',
      inputPlaceholder: 'Tell us about your experience...',
      showCancelButton: true,
      confirmButtonText: 'Submit Request',
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason');
          return;
        }
        return this.userService
          .requestInstructorRole(reason)
          .toPromise()
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error.error || 'Unknown error'}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success', 'Your request has been sent to the admin.', 'success');
      }
    });
  }
}
