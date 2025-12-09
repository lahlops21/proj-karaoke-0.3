import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css']
})
export class TelaInicialComponent {
  termoBusca: string = '';
  placeholderAtual: string = '';
  private placeholders: string[] = [
    'Evidências',
    'Asa Branca',
    'Garota de Ipanema',
    'Só os Loucos Sabem',
    'Cheia de Manias'
  ];
  private placeholderIndex: number = 0;

  constructor(public router: Router) {
  this.animarPlaceholder();
}

  private animarPlaceholder(): void {
    const textoCompleto = this.placeholders[this.placeholderIndex];
    let indiceCaractere = 0;

    const intervalo = setInterval(() => {
      if (indiceCaractere <= textoCompleto.length) {
        this.placeholderAtual = textoCompleto.substring(0, indiceCaractere);
        indiceCaractere++;
      } else {
        clearInterval(intervalo);
        setTimeout(() => {
          this.apagarPlaceholder();
        }, 2000);
      }
    }, 100);
  }

  private apagarPlaceholder(): void {
    const intervalo = setInterval(() => {
      if (this.placeholderAtual.length > 0) {
        this.placeholderAtual = this.placeholderAtual.slice(0, -1);
      } else {
        clearInterval(intervalo);
        this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholders.length;
        setTimeout(() => {
          this.animarPlaceholder();
        }, 500);
      }
    }, 50);
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      // Navegar para página de resultados com o termo de busca
      this.router.navigate(['/resultado-busca'], {
        queryParams:{ termo: this.termoBusca.trim()}
      });
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.buscar();
    }
  }
}