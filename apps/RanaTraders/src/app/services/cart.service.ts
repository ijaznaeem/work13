import { Injectable } from '@angular/core';

export interface CartItem {
  Image: string;
  ProductID: number;
  ProductName: string;
  Price: number;
  Discount: number;
  Qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];

  constructor() {}

  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(i => i.ProductID === item.ProductID);
    if (existingItem) {
      existingItem.Qty += item.Qty;
    } else {
      this.cartItems.push(item);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  updateCartItem(item: CartItem): void {
    const index = this.cartItems.findIndex(i => i.ProductID === item.ProductID);
    if (index !== -1) {
      this.cartItems[index] = item;
    }
  }

  deleteCartItem(id: number): void {
    this.cartItems = this.cartItems.filter(item => item.ProductID !== id);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.Price * item.Qty, 0);
  }
  getTotalItems(): number {
    return this.cartItems.length ;
  }
}
