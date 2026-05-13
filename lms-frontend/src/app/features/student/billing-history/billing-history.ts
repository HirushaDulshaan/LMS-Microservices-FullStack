import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // ✅ CDR ඇඩ් කළා
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './billing-history.html',
  styleUrl: './billing-history.scss',
})
export class BillingComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  billingHistory: any[] = [];
  displayedColumns: string[] = ['invoice', 'date', 'course', 'amount', 'status', 'action'];
  isLoading = true;

  ngOnInit() {
    console.log('🚀 BillingComponent Initialized');
    this.loadBilling();
  }

  loadBilling() {
    this.isLoading = true;
    console.log('📡 Calling getBillingHistory API...');

    this.userService.getBillingHistory().subscribe({
      next: (res) => {
        console.log('✅ API Response Received:', res);

        if (res && Array.isArray(res)) {
          this.billingHistory = res;
          console.log('📊 billingHistory array length:', this.billingHistory.length);
        } else {
          console.warn('⚠️ Response is not an array or it is empty:', res);
          this.billingHistory = [];
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(' Error loading billing from API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  downloadInvoice(id: string) {
    console.log('📥 Download requested for Invoice:', id);
    alert(`Downloading invoice ${id}... (Feature coming soon)`);
  }
}
