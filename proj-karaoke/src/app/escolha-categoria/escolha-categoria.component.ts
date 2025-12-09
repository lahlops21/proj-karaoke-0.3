// src/app/components/escolha-categoria/escolha-categoria.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../service/categoria.service';
import { Categoria, MusicaCategoria } from '../models/categoria.model';

@Component({
  standalone: true,
  selector: 'app-escolha-categoria',
  imports: [CommonModule, RouterModule],
  templateUrl: './escolha-categoria.component.html',
  styleUrls: ['./escolha-categoria.component.css']
})
export class EscolhaCategoriaComponent implements OnInit {

  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  // Estados
  categorias = signal<Categoria[]>([]);
  carregandoCategorias = signal(false);
  categoriaSelecionada = signal<Categoria | null>(null);
  musicas = signal<MusicaCategoria[]>([]);
  carregandoMusicas = signal(false);
  modalAberto = signal(false);
  erro = signal<string | null>(null);

  // Mapa de ícones por categoria (emoji ou SVG)
  iconesCategoria: { [key: string]: string } = {
    'Anos 80': '🎸',
    'Axé': '🥁',
    'Axé e Carnaval': '🎉',
    'Bossa Nova': '🎹',
    'Brega e Arrocha': '💘',
    'Clássicos 90s e 2000s': '💿',
    'Dance & Eletrônica': '🎧',
    'Forró e Piseiro': '🪗',
    'Funk': '🔊',
    'Hip-Hop/Rap': '🎤',
    'Hits Animados': '⚡',
    'Latino/Reggaeton': '🌶️',
    'MPB': '🎼',
    'Música Country': '🤠',
    'Músicas de Natal': '🎄',
    'Pagode': '🍻',
    'Pop': '🌟',
    'Rock': '🎸',
    'Românticas': '❤️',
    'Samba': '🥁',
    'Sertanejo': '🐴'
  };

  // Mapa de gradientes por categoria
  gradientesCategoria: { [key: string]: string } = {
    'Anos 80': 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
    'Axé': 'linear-gradient(135deg, #FFA751 0%, #FFE259 100%)',
    'Axé e Carnaval': 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
    'Bossa Nova': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'Brega e Arrocha': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    'Clássicos 90s e 2000s': 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    'Dance & Eletrônica': 'linear-gradient(135deg, #D299C2 0%, #FEF9D7 100%)',
    'Forró e Piseiro': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    'Funk': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    'Hip-Hop/Rap': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'Hits Animados': 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
    'Latino/Reggaeton': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    'MPB': 'linear-gradient(135deg, #5EE7DF 0%, #B490CA 100%)',
    'Música Country': 'linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)',
    'Músicas de Natal': 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 0%, #2BFF88 100%)',
    'Pagode': 'linear-gradient(135deg, #FFD26F 0%, #3677FF 100%)',
    'Pop': 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    'Rock': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    'Românticas': 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
    'Samba': 'linear-gradient(135deg, #FFA751 0%, #FFE259 100%)',
    'Sertanejo': 'linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)'
  };

  ngOnInit(): void {
    this.carregarCategorias();
  }

  // Carrega categorias do backend
  carregarCategorias(): void {
    this.carregandoCategorias.set(true);
    
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregandoCategorias.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.erro.set('Erro ao carregar categorias');
        this.carregandoCategorias.set(false);
      }
    });
  }

  // Retorna ícone da categoria
  obterIcone(nomeCategoria: string): string {
    return this.iconesCategoria[nomeCategoria] || '🎵';
  }

  // Retorna gradiente da categoria
  obterGradiente(nomeCategoria: string): string {
    return this.gradientesCategoria[nomeCategoria] || 
           'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';
  }

  // Abre modal com músicas da categoria
  abrirCategoria(categoria: Categoria): void {
    this.categoriaSelecionada.set(categoria);
    this.modalAberto.set(true);
    this.carregarMusicas(categoria.id_categoria);
  }

  // Carrega músicas da categoria
  carregarMusicas(categoriaId: number): void {
    this.carregandoMusicas.set(true);
    this.musicas.set([]);
    
    this.categoriaService.listarMusicasPorCategoria(categoriaId).subscribe({
      next: (response) => {
        this.musicas.set(response.items);
        this.carregandoMusicas.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar músicas:', err);
        this.erro.set('Erro ao carregar músicas');
        this.carregandoMusicas.set(false);
      }
    });
  }

  // Fecha modal
  fecharModal(): void {
    this.modalAberto.set(false);
    this.categoriaSelecionada.set(null);
    this.musicas.set([]);
  }

  // Volta para home
  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}
