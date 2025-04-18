import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CheckoutComponent {
  name = '';
  surname = '';
  email = '';
  address = '';
  comune = '';
  provincia = '';
  civico = '';
  cap = '';
  taglie: string[] = [];
  groupedTaglie: { [key: string]: number } = {};
  cartCount = 0;
  prezzoPantaloncino = 15;
  successMessage = '';

  constructor(private router: Router) {
    const sizes = localStorage.getItem('selectedSizes');
    const count = localStorage.getItem('cartCount');

    if (sizes) {
      this.taglie = JSON.parse(sizes);
      this.groupSizes();
    }
    if (count) {
      this.cartCount = parseInt(count, 10);
    }
  }

  get totalPantaloncini() {
    return this.cartCount * this.prezzoPantaloncino;
  }

  groupSizes() {
    this.groupedTaglie = {};
    this.taglie.forEach(size => {
      this.groupedTaglie[size] = (this.groupedTaglie[size] || 0) + 1;
    });
  }

  taglieUniche() {
    return Object.keys(this.groupedTaglie);
  }

  removeItem(taglia: string) {
    const index = this.taglie.indexOf(taglia);
    if (index > -1) {
      this.taglie.splice(index, 1);
      this.cartCount--;

      this.groupSizes();

      localStorage.setItem('selectedSizes', JSON.stringify(this.taglie));
      localStorage.setItem('cartCount', this.cartCount.toString());
    }
  }

  completaOrdine() {
    if (!this.name || !this.surname || !this.email || !this.address || !this.comune || !this.provincia || !this.civico || !this.cap) {
      alert('Per favore compila tutti i campi.');
      return;
    }

    if (this.cartCount === 0) {
      alert('Il carrello è vuoto!');
      return;
    }

    const templateParams = {
      from_name: `${this.name} ${this.surname}`,
      from_email: this.email,
      address: `${this.address}, ${this.civico}`,
      comune: `${this.comune}, ${this.cap}`,
      provincia: this.provincia,
      taglia: this.taglie.join(', '),
      amount: this.totalPantaloncini.toFixed(2)
    };

    emailjs.send(
      'service_m0aqf24',
      'template_iyl5ikk',
      templateParams,
      'kpqwgS0evOptWc23D'
    ).then((response) => {
      console.log('Email inviata!', response.status, response.text);
      this.successMessage = '✅ Ordine inviato! Lo staff Evergreen ti contatterà a breve per effettuare il pagamento.';
      localStorage.removeItem('selectedSizes');
      localStorage.removeItem('cartCount');
      this.taglie = [];
      this.groupSizes();
      this.cartCount = 0;
    }, (err) => {
      console.error('Errore invio email', err);
      alert('Errore durante l\'invio dell\'ordine. Riprova.');
    });
  }
}
