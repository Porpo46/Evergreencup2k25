import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  targetDate: Date = new Date('2025-07-05T08:00:00');
  remainingTime: string;

  stats = {
    teams: 44,
    athletes: 180,
    matches: 110
  };

  private animated = false;

  constructor() {
    this.remainingTime = this.calculateRemainingTime();
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    const statsSection = document.querySelector('.stats-box');

    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.animated) {
          this.animated = true;

          const duration = 1500; // tutti i numeri si animano in 1.5 secondi
          const steps = 60;      // numero di step sincronizzati

          this.animateCount('teamsCount', this.stats.teams, duration, steps);
          this.animateCount('athletesCount', this.stats.athletes, duration, steps);
          this.animateCount('matchesCount', this.stats.matches, duration, steps);

          observer.disconnect();
        }
      }, { threshold: 0.5 });

      observer.observe(statsSection);
    }
  }

  calculateRemainingTime(): string {
    const now = new Date();
    const timeDifference = this.targetDate.getTime() - now.getTime();

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${this.formatTwoDigits(days)}:${this.formatTwoDigits(hours)}:${this.formatTwoDigits(minutes)}:${this.formatTwoDigits(seconds)}`;
  }

  formatTwoDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      if (this.remainingTime !== '00:00:00:00') {
        this.remainingTime = this.calculateRemainingTime();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  animateCount(id: string, target: number, totalDuration: number = 2000, steps: number = 100): void {
    const el = document.getElementById(id);
    if (!el) return;

    let currentStep = 0;
    const increment = target / steps;
    const intervalTime = totalDuration / steps;
    let currentValue = 0;

    const timer = setInterval(() => {
      currentStep++;
      currentValue += increment;
      el.textContent = Math.round(currentValue).toString();

      if (currentStep >= steps) {
        el.textContent = target.toString(); // assicura il valore esatto
        clearInterval(timer);
      }
    }, intervalTime);
  }
}
