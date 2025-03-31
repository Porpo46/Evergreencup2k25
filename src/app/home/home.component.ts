import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  targetDate: Date = new Date('2025-07-05T08:00:00');
  remainingTime: string;

  constructor() { 
    this.remainingTime = this.calculateRemainingTime();
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  calculateRemainingTime(): string {
    const now = new Date();
    const timeDifference = this.targetDate.getTime() - now.getTime();

    // Calcola giorni, ore, minuti e secondi
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Formatta il risultato nel formato desiderato
    return `${this.formatTwoDigits(days)}:${this.formatTwoDigits(hours)}:${this.formatTwoDigits(minutes)}:${this.formatTwoDigits(seconds)}`;
  }

  formatTwoDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.remainingTime !== '00:00:00:00') {
        this.remainingTime = this.calculateRemainingTime();
      } else {
        clearInterval(interval);
        // Puoi inserire qui logica aggiuntiva quando il conto alla rovescia raggiunge zero
      }
    }, 1000);
  }
}
