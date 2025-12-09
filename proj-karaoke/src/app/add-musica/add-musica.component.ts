// src/app/components/add-musica/add-musica.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MusicaAdminService } from '../service/musica-admin.service';
import { TokenService } from '../service/token.service';
import { Artista, Categoria } from '../models/musica-admin.model';

@Component({
  standalone: true,
  selector: 'app-add-musica',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-musica.component.html',
  styleUrls: ['./add-musica.component.css']
})
export class AddMusicaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private musicaService = inject(MusicaAdminService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // Estados
  artistas = signal<Artista[]>([]);
  categorias = signal<Categoria[]>([]);
  categoriasSelecionadas = signal<Categoria[]>([]);
  carregandoArtistas = signal(false);
  carregandoCategorias = signal(false);
  dropdownCategoriasAberto = signal(false);
  loading = signal(false);
  sucesso = signal(false);
  erro = signal<string | null>(null);
  avisoLetra = signal(false);

  // Modals
  modalNovoArtista = signal(false);
  modalConfirmarArtista = signal(false);
  modalConfirmarSemCategoria = signal(false);
  novoArtistaTemp = signal('');

  // Formulário principal
  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    codigo_musica: ['', Validators.required],
    interprete_musica: ['', Validators.required],
    letra_musica: [''],
    artista_id: ['', Validators.required]
  });

  // Formulário de novo artista
  formNovoArtista = this.fb.nonNullable.group({
    nome_artista: ['', Validators.required]
  });

  ngOnInit(): void {
    // Verifica token
    const token = this.tokenService.get();
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }

    // Carrega lista de artistas e categorias
    this.carregarArtistas();
    this.carregarCategorias();
  }

  // Carrega artistas do backend
  carregarArtistas(): void {
    this.carregandoArtistas.set(true);
    
    this.musicaService.listarArtistas().subscribe({
      next: (artistas) => {
        this.artistas.set(artistas);
        this.carregandoArtistas.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar artistas:', err);
        this.erro.set('Erro ao carregar lista de artistas');
        this.carregandoArtistas.set(false);
      }
    });
  }

  // Carrega categorias do backend
  carregarCategorias(): void {
    this.carregandoCategorias.set(true);
    
    this.musicaService.listarCategorias().subscribe({
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

  // Toggle dropdown de categorias
  toggleDropdownCategorias(): void {
    this.dropdownCategoriasAberto.set(!this.dropdownCategoriasAberto());
  }

  // Fecha dropdown
  fecharDropdownCategorias(): void {
    this.dropdownCategoriasAberto.set(false);
  }

  // Verifica se categoria está selecionada
  isCategoriaSelected(categoria: Categoria): boolean {
    return this.categoriasSelecionadas().some(
      c => c.id_categoria === categoria.id_categoria
    );
  }

  // Verifica se pode adicionar mais categorias (limite 3)
  podeAdicionarCategoria(): boolean {
    return this.categoriasSelecionadas().length < 3;
  }

  // Toggle categoria (adiciona ou remove)
  toggleCategoria(categoria: Categoria): void {
    const selecionadas = this.categoriasSelecionadas();
    const index = selecionadas.findIndex(
      c => c.id_categoria === categoria.id_categoria
    );

    if (index > -1) {
      // Remove categoria
      const novaSelecao = selecionadas.filter(
        c => c.id_categoria !== categoria.id_categoria
      );
      this.categoriasSelecionadas.set(novaSelecao);
    } else {
      // Adiciona categoria (se não atingiu o limite)
      if (this.podeAdicionarCategoria()) {
        this.categoriasSelecionadas.set([...selecionadas, categoria]);
      }
    }
  }

  // Remove categoria pela tag
  removerCategoria(categoria: Categoria): void {
    const novaSelecao = this.categoriasSelecionadas().filter(
      c => c.id_categoria !== categoria.id_categoria
    );
    this.categoriasSelecionadas.set(novaSelecao);
  }

  // Abre modal de novo artista
  abrirModalNovoArtista(): void {
    this.modalNovoArtista.set(true);
    this.formNovoArtista.reset();
  }

  // Fecha modal de novo artista
  fecharModalNovoArtista(): void {
    this.modalNovoArtista.set(false);
    this.formNovoArtista.reset();
  }

  // Prepara confirmação do novo artista
  prepararConfirmacaoArtista(): void {
    if (this.formNovoArtista.invalid) return;

    this.novoArtistaTemp.set(this.formNovoArtista.value.nome_artista!);
    this.modalNovoArtista.set(false);
    this.modalConfirmarArtista.set(true);
  }

  // Fecha modal de confirmação de artista
  fecharModalConfirmarArtista(): void {
    this.modalConfirmarArtista.set(false);
    this.novoArtistaTemp.set('');
  }

  // Confirma e cadastra novo artista
  async confirmarCadastroArtista(): Promise<void> {
    this.modalConfirmarArtista.set(false);

    const nomeArtista = this.novoArtistaTemp();
    if (!nomeArtista) return;

    try {
      const novoArtista = await this.musicaService.cadastrarArtista({
        nome_artista: nomeArtista
      });

      this.artistas.update(lista => [...lista, novoArtista]);
      this.form.patchValue({ artista_id: novoArtista.id.toString() });
      this.novoArtistaTemp.set('');

    } catch (err: any) {
      console.error('Erro ao cadastrar artista:', err);

      if (err.status === 401 || err.message?.includes('Sessão expirada')) {
        this.tokenService.set(null);
        this.router.navigate(['/admin/login']);
        return;
      }

      this.erro.set('Erro ao cadastrar artista. Tente novamente.');
      setTimeout(() => this.erro.set(null), 5000);
    }
  }

  // Volta para o painel
  voltarParaPainel(): void {
    this.router.navigate(['/admin/painel']);
  }

  // Cancela e volta pro painel
  cancelar(): void {
    this.router.navigate(['/admin/painel']);
  }

  // Limpa o formulário
  limparFormulario(): void {
    this.form.reset();
    this.categoriasSelecionadas.set([]);
    this.avisoLetra.set(false);
  }

  // Prepara submit (verifica categorias)
  prepararSubmit(): void {
    if (this.form.invalid) return;

    // Se não tem categorias, mostra modal de confirmação
    if (this.categoriasSelecionadas().length === 0) {
      this.modalConfirmarSemCategoria.set(true);
    } else {
      // Se tem categorias, submete direto
      this.onSubmit();
    }
  }

  // Fecha modal de confirmação sem categoria
  fecharModalSemCategoria(): void {
    this.modalConfirmarSemCategoria.set(false);
  }

  // Confirma cadastro sem categoria
  confirmarSemCategoria(): void {
    this.modalConfirmarSemCategoria.set(false);
    this.onSubmit();
  }

  // Submit do formulário
  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    // Verifica se tem letra
    const letraMusica = this.form.value.letra_musica?.trim();
    
    // Mostra aviso se não tiver letra
    if (!letraMusica) {
      this.avisoLetra.set(true);
      setTimeout(() => this.avisoLetra.set(false), 4000);
    }

    this.loading.set(true);
    this.erro.set(null);
    this.sucesso.set(false);

    try {
      const artistaId = parseInt(this.form.value.artista_id!);
      const categoriaIds = this.categoriasSelecionadas().map(c => c.id_categoria);

      const musica = {
        titulo: this.form.value.titulo!,
        codigo_musica: this.form.value.codigo_musica!,
        interprete_musica: this.form.value.interprete_musica!,
        letra_musica: letraMusica || null,
        artistaIds: [artistaId],
        categoriaIds: categoriaIds.length > 0 ? categoriaIds : undefined
      };

      await this.musicaService.adicionarMusica(musica);

      // Sucesso!
      this.sucesso.set(true);
      this.limparFormulario();

      setTimeout(() => {
        this.sucesso.set(false);
      }, 5000);

    } catch (err: any) {
      console.error('Erro ao adicionar música:', err);

      if (err.status === 401 || err.message?.includes('Sessão expirada')) {
        this.tokenService.set(null);
        this.router.navigate(['/admin/login']);
        return;
      }

      this.erro.set(err.error?.message || err.message || 'Erro ao adicionar música. Tente novamente.');
      
      setTimeout(() => {
        this.erro.set(null);
      }, 6000);

    } finally {
      this.loading.set(false);
    }
  }
}