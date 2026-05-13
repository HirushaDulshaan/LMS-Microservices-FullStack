import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/payment'; // Backend Payment URL

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  cartTotal$ = this.cartItems$.pipe(
    map((items) => items.reduce((total, item) => total + item.price, 0)),
  );

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  getCartItemsValue() {
    return this.cartItemsSubject.value;
  }

  addToCart(course: any) {
    const currentItems = this.getCartItemsValue();
    const isExist = currentItems.find((item) => item.id === course.id);

    if (!isExist) {
      const updatedItems = [...currentItems, course];
      this.cartItemsSubject.next(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  }
  getCartTotalValue(): number {
    return this.getCartItemsValue().reduce((total, item) => total + item.price, 0);
  }

  removeFromCart(courseId: number) {
    const updatedItems = this.getCartItemsValue().filter((item) => item.id !== courseId);
    this.cartItemsSubject.next(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }


  checkoutCart(): Observable<any> {
    const items = this.getCartItemsValue();
    const studentId = sessionStorage.getItem('userId');

    const payload = {
      items: items,
      studentId: Number(studentId),
    };

    return this.http.post('http://localhost:8080/api/enroll/checkout', payload);
  }
}
