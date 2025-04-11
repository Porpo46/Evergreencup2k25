import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import emailjs from 'emailjs-com';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements AfterViewInit {
  name = '';
  email = '';
  address = '';
  taglie: string[] = [];
  groupedTaglie: { [key: string]: number } = {};
  cartCount = 0;
  shippingCost = 4.5; // 👈 Fissa le spese di spedizione
  prezzoPantaloncino = 15;

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

  get totalOrdine() {
    return this.totalPantaloncini + this.shippingCost;
  }

  ngAfterViewInit() {
    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      funding: {
        disallowed: [paypal.FUNDING.CARD, paypal.FUNDING.PAYLATER, paypal.FUNDING.MYBANK]
      },
      createOrder: (data: any, actions: any) => {
        if (!this.name || !this.email || !this.address || this.cartCount === 0) {
          alert('Compila tutti i campi e assicurati di avere prodotti nel carrello!');
          return actions.reject();
        }
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalOrdine.toFixed(2),
              breakdown: {
                item_total: { value: this.totalPantaloncini.toFixed(2), currency_code: "EUR" },
                shipping: { value: this.shippingCost.toFixed(2), currency_code: "EUR" }
              }
            },
            description: `Pantaloncini Evergreen - Taglie: ${this.taglie.join(', ')} (Spedizione inclusa)`
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.sendEmail(details);
          alert('Pagamento completato da ' + details.payer.name.given_name + ' ✅');
          localStorage.removeItem('selectedSizes');
          localStorage.removeItem('cartCount');
          this.router.navigate(['/shop']);
        });
      },
      onError: (err: any) => {
        console.error('Errore nel pagamento', err);
        alert('Errore durante il pagamento ❌');
      }
    }).render('#paypal-button-container');
  }

  groupSizes() {
    this.groupedTaglie = {};
    this.taglie.forEach(size => {
      if (this.groupedTaglie[size]) {
        this.groupedTaglie[size]++;
      } else {
        this.groupedTaglie[size] = 1;
      }
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

  sendEmail(details: any) {
    const templateParams = {
      from_name: this.name,
      from_email: this.email,
      address: this.address,
      taglia: this.taglie.join(', '),
      paypal_name: details.payer.name.given_name + ' ' + details.payer.surname,
      paypal_email: details.payer.email_address,
      amount: this.totalOrdine.toFixed(2)
    };

    emailjs.send(
      'service_dwtzfnn', 
      'template_4kiu6dm', 
      templateParams, 
      'ZXJXyJjWsghXvrrBI'
    )
    .then((response) => {
      console.log('Email inviata!', response.status, response.text);
    }, (err) => {
      console.error('Errore invio email', err);
    });
  }
}
