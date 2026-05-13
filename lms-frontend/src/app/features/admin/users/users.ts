import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);

  usersDataSource = new MatTableDataSource<any>([]);
  userColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];

  instructorRequests: any[] = [];
  requests: any[] = [];
  requestColumns: string[] = ['user', 'newEmail', 'reason', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.usersDataSource.data = res;
        this.isLoading = false;
      },
    });

    // 2. Instructor Requests
    this.adminService.getInstructorRequests().subscribe({
      next: (res) => {
        this.instructorRequests = res;
      },
    });

    // 3. Email Update Requests
    this.adminService.getPendingRequests().subscribe({
      next: (res) => {
        this.requests = res;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserDetails(user: any) {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '550px',
      data: user,
      panelClass: 'premium-dialog',
    });
  }

  approveAsInstructor(user: any) {
    Swal.fire({
      title: 'Promote User?',
      text: `Do you want to approve ${user.firstName} as an Instructor?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, Approve',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.approveInstructor(user.id).subscribe({
          next: () => {
            Swal.fire('Approved!', `${user.firstName} is now an instructor.`, 'success');
            this.loadData();
          },
          error: (err) => {
            Swal.fire('Error', 'Could not update role.', 'error');
          },
        });
      }
    });
  }

  deleteUser(user: any, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${user.firstName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User removed.', 'success');
            this.loadData();
          },
        });
      }
    });
  }
}


@Component({
  selector: 'app-user-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="p-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fw-bold m-0" style="color: #4f46e5">User Information</h2>
        <button mat-icon-button mat-dialog-close><mat-icon>close</mat-icon></button>
      </div>

      <div class="text-center mb-4 pt-3">
        <div class="user-avatar-big mx-auto mb-3">
          {{ data.firstName[0] }}{{ data.lastName[0] }}
        </div>
        <h3 class="fw-bold mb-1">{{ data.firstName }} {{ data.lastName }}</h3>
        <mat-chip
          [style.background-color]="data.role === 'ADMIN' ? '#ef4444' : '#4f46e5'"
          style="color: white"
        >
          {{ data.role }}
        </mat-chip>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <mat-icon>email</mat-icon>
          <div>
            <label>Email Address</label>
            <p>{{ data.email }}</p>
          </div>
        </div>
        <div class="info-item">
          <mat-icon>phone</mat-icon>
          <div>
            <label>Contact Number</label>
            <p>{{ data.mobileNumber || 'Not Provided' }}</p>
          </div>
        </div>
        <div class="info-item full-width" *ngIf="data.address">
          <mat-icon>location_on</mat-icon>
          <div>
            <label>Residential Address</label>
            <p>
              {{ data.address.streetAddress }}, {{ data.address.city }}, {{ data.address.country }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-top text-end">
        <button mat-flat-button mat-dialog-close color="primary" class="px-4 rounded-pill">
          Close Details
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .user-avatar-big {
        width: 90px;
        height: 90px;
        background: linear-gradient(135deg, #4f46e5, #3b82f6);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        background: #f8fafc;
        padding: 20px;
        border-radius: 15px;
      }
      .info-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        mat-icon {
          color: #64748b;
          font-size: 20px;
        }
        label {
          display: block;
          font-size: 11px;
          font-weight: bold;
          text-uppercase: uppercase;
          color: #94a3b8;
          margin-bottom: 2px;
        }
        p {
          margin: 0;
          font-weight: 600;
          color: #1e293b;
        }
      }
      .full-width {
        grid-column: span 2;
      }
    `,
  ],
})
export class UserDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
