// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'evergreen';
  isMenuOpen: boolean = false;
  currentPage: string = 'home';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setCurrentPage(event.urlAfterRedirects);
        this.closeMenu(); // 🔥 forza la chiusura menu a ogni cambio pagina
      }
    });
  }

  toggleMenu() {
    const header = document.querySelector('.header');
    const menuItems = document.querySelectorAll('.header ul.main-menu li');
    if (header) {
      header.classList.toggle('active');
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('show');
          }, index * 200);
        });
      } else {
        menuItems.forEach(item => {
          item.classList.remove('show');
        });
      }
    }
  }

  closeMenu() {
    const header = document.querySelector('.header');
    const menuItems = document.querySelectorAll('.header ul.main-menu li');
    if (this.isMenuOpen && header) {
      header.classList.remove('active');
      this.isMenuOpen = false;
      menuItems.forEach(item => {
        item.classList.remove('show');
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCurrentPage(url: string) {
    if (url.includes('/home')) {
      this.currentPage = 'home';
    } else if (url.includes('/moduli')) {
      this.currentPage = 'moduli';
    } else if (url.includes('/about')) {
      this.currentPage = 'about';
    } else if (url.includes('/shop') || url.includes('/checkout')) {
      this.currentPage = 'shop';
    } else if (url.includes('/sponsor')) {
      this.currentPage = 'sponsor';
    }
  }
}
