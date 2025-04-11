import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  cartCount = 0;
  selectedSize = '';
  selectedSizes: string[] = [];

  @ViewChild('cartSection') cartSection!: ElementRef;

  short = {
    id: 1,
    name: 'Pantaloncini Evergreen',
    originalPrice: 20.00,
    discountedPrice: 15.00,
    image: 'assets/images/shorts.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  };

  ngOnInit(): void {
    const count = localStorage.getItem('cartCount');
    const sizes = localStorage.getItem('selectedSizes');

    if (count) this.cartCount = parseInt(count, 10);
    if (sizes) this.selectedSizes = JSON.parse(sizes);
  }

  addToCart() {
    if (!this.selectedSize) {
      alert('Per favore seleziona una taglia!');
      return;
    }

    this.cartCount++;
    this.selectedSizes.push(this.selectedSize);

    // Salva su localStorage
    localStorage.setItem('cartCount', this.cartCount.toString());
    localStorage.setItem('selectedSizes', JSON.stringify(this.selectedSizes));

    // Animazione bounce sul numero carrello
    const badgeNumber = document.getElementById('cart-count');
    if (badgeNumber) {
      badgeNumber.classList.remove('bounce');
      void badgeNumber.offsetWidth;
      badgeNumber.classList.add('bounce');
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }
}
