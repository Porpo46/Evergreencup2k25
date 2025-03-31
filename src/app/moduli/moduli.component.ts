import { Component } from '@angular/core';

@Component({
  selector: 'app-moduli',
  templateUrl: './moduli.component.html',
  styleUrls: ['./moduli.component.css']
})
export class ModuliComponent {

  apriRegolamento(): void {
    window.open('assets/pdf/regolamento_EVG.pdf', '_blank');
  }

  apriIscrizioni(): void {
    window.open('assets/pdf/iscrizioni_EVG.pdf', '_blank');
  }

}
