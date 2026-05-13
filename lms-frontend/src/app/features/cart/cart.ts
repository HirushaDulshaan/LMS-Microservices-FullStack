import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import Swal from 'sweetalert2';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {

  private cartService = inject(CartService);
  private router = inject(Router);

  // Observables for reactive UI
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartTotal$;

  removeItem(courseId: number) {
    this.cartService.removeFromCart(courseId);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
    Toast.fire({ icon: 'success', title: 'Item removed' });
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove all items from your cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire('Cleared!', 'Your cart is now empty.', 'success');
      }
    });
  }


  checkout() {
    const items = this.cartService.getCartItemsValue();
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire('Please Login', 'You need to login before purchasing a course.', 'info');
      this.router.navigate(['/login']);
      return;
    }

    if (items.length === 0) {
      Swal.fire('Empty Cart', 'Please add courses before checking out.', 'info');
      return;
    }

    Swal.fire({
      title: 'Redirecting to Stripe...',
      text: 'Please wait while we set up your secure payment session.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.cartService.checkoutCart().subscribe({
      next: (response: any) => {
        if (response.url) {
          window.location.href = response.url;
        }
      },
      error: (err) => {
        console.error('Checkout error:', err);
        Swal.fire('Error', 'Payment service is currently unavailable. Check if Enrollment Service is running!', 'error');
      }
    });
  }
}
