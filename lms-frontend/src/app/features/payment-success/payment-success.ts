import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);

  sessionId: string | null = '';
  totalAmount: number = 0;
  isProcessing = true;

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (this.sessionId) {
      this.totalAmount = this.cartService.getCartTotalValue();

      this.confirmEnrollment(this.sessionId);
    } else {
      this.isProcessing = false;
    }
  }

  confirmEnrollment(sessionId: string) {
    this.http.post('http://localhost:8080/api/enroll/confirm-payment', { sessionId }).subscribe({
      next: (res: any) => {
        console.log('✅ Payments confirmed in DB:', res);

        this.cartService.clearCart();
        this.isProcessing = false;

        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed!',
          text: 'Your enrollment was successful. Enjoy your courses!',
          timer: 3000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Confirmation failed', err);
        this.isProcessing = false;
        Swal.fire(
          'Error',
          'Payment confirmed but enrollment update failed. Please contact support.',
          'error',
        );
      },
    });
  }
}
