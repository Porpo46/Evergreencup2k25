// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet], // Importa RouterModule e RouterOutlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'evergreen';
  isMenuOpen: boolean = false; // Aggiungi una variabile per tenere traccia dello stato del menu
  currentPage: string = 'home'; // Variabile per tenere traccia della pagina attiva

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setCurrentPage(event.urlAfterRedirects);
      }
    });
  }

  // Metodo per aprire o chiudere il burger menu
  toggleMenu() {
    const header = document.querySelector('.header');
    const menuItems = document.querySelectorAll('.header ul.main-menu li');
    if (header) {
      header.classList.toggle('active');
      this.isMenuOpen = !this.isMenuOpen; // Aggiorna lo stato del menu
      if (this.isMenuOpen) {
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('show');
          }, index * 200); // Delay per l'animazione a cascata
        });
      } else {
        menuItems.forEach(item => {
          item.classList.remove('show');
        });
      }
    }
  }

  // Metodo per chiudere il burger menu quando si fa clic su un link
  closeMenu() {
    if (this.isMenuOpen) {
      this.toggleMenu(); // Chiudi il menu solo se è aperto
    }
  }

  // Metodo per scorrere fino all'inizio della pagina
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Metodo per impostare la pagina attiva
  setCurrentPage(url: string) {
    if (url.includes('/home')) {
      this.currentPage = 'home';
    } else if (url.includes('/moduli')) {
      this.currentPage = 'moduli';
    } else if (url.includes('/about')) {
      this.currentPage = 'about';
    } else if (url.includes('/shop') || url.includes('/checkout')) {  /* 👈 AGGIUNGIAMO QUI */
      this.currentPage = 'shop';
    } else if (url.includes('/sponsor')) {
      this.currentPage = 'sponsor';
    }
  }
  
}
