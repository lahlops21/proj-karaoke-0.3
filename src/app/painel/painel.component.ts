import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../service/token.service';

@Component({
  standalone: true,
  selector: 'app-painel',
  imports: [CommonModule, RouterModule],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit {

  private router = inject(Router);
  private tokenService = inject(TokenService);

  ngOnInit(): void {
    const token = this.tokenService.get();

    // Se o usuário tentar acessar o painel sem estar logado, redireciona
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }
  }

  // --- Navegações dos botões ---
  navegarParaAdicionarMusica() {
    this.router.navigate(['/admin/adicionar-musica']);
  }

  navegarParaGerenciarMusicas() {
    this.router.navigate(['/admin/gerenciar-musica']);
  }

  navegarParaHistorico() {
    this.router.navigate(['/admin/historico']);
  }

  logout() {
    this.tokenService.set(null);
    this.router.navigate(['']);
  }
}
