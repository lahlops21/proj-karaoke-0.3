// src/app/components/gerenciar-musica/gerenciar-musica.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MusicaAdminService } from '../service/musica-admin.service';
import { TokenService } from '../service/token.service';
import { MusicaLista, MusicaDetalhada } from '../models/musica-admin.model';
import { MusicaSearch } from '../models/musica-search.model';

@Component({
  standalone: true,
  selector: 'app-gerenciar-musica',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './gerenciar-musica.component.html',
  styleUrls: ['./gerenciar-musica.component.css']
})
export class GerenciarMusicaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private musicaService = inject(MusicaAdminService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // Estados
  codigoBusca = signal('');
  musicaCarregada = signal<MusicaDetalhada | null>(null);
  buscando = signal(false);
  salvando = signal(false);
  excluindo = signal(false);
  sucesso = signal(false);
  erro = signal<string | null>(null);
  
  // Modals
  modalConfirmarEdicao = signal(false);
  modalConfirmarExclusao = signal(false);

  // Formulário de busca
  formBusca = this.fb.nonNullable.group({
    codigo: ['', Validators.required]
  });

  // Formulário de edição
  formEdicao = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    codigo_musica: [''],
    interprete_musica: [''],
    letra_musica: ['']
  });

  ngOnInit(): void {
    // Verifica se tem token
    const token = this.tokenService.get();
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }
  }

  // Volta para o painel
  voltarParaPainel(): void {
    this.router.navigate(['/admin/painel']);
  }

  // Busca música pelo código
  async buscarMusica(): Promise<void> {
    if (this.formBusca.invalid) return;

    const codigo = this.formBusca.value.codigo!.trim();
    this.buscando.set(true);
    this.erro.set(null);
    this.sucesso.set(false);

    try {
      // Busca a música pelo código
      const musica = await this.musicaService.buscarPorCodigo(codigo);

      if (!musica) {
        this.erro.set('Música não encontrada com este código.');
        this.musicaCarregada.set(null);
        this.formEdicao.reset();
        return;
      }

      // Busca detalhes completos da música
      const musicaDetalhada = await this.musicaService.obterMusicaPorId(musica.id_musica);
      
      this.musicaCarregada.set(musicaDetalhada);

      // Preenche o formulário de edição
      this.formEdicao.patchValue({
        titulo: musicaDetalhada.titulo,
        codigo_musica: musicaDetalhada.codigo,
        interprete_musica: musicaDetalhada.interprete || '',
        letra_musica: musicaDetalhada.letra || ''
      });

    } catch (err: any) {
      console.error('Erro ao buscar música:', err);

      if (err.status === 401 || err.message?.includes('Sessão expirada')) {
        this.tokenService.set(null);
        this.router.navigate(['/admin/login']);
        return;
      }

      this.erro.set('Erro ao buscar música. Tente novamente.');
    } finally {
      this.buscando.set(false);
    }
  }

  // Abre modal de confirmação de edição
  abrirModalEdicao(): void {
    if (this.formEdicao.invalid || !this.musicaCarregada()) return;
    this.modalConfirmarEdicao.set(true);
  }

  // Fecha modal de edição
  fecharModalEdicao(): void {
    this.modalConfirmarEdicao.set(false);
  }

  // Confirma e salva alterações
async confirmarEdicao(): Promise<void> {
  this.modalConfirmarEdicao.set(false);
  if (this.formEdicao.invalid || !this.musicaCarregada()) return;

  this.salvando.set(true);
  this.erro.set(null);
  this.sucesso.set(false);

  try {
    // --- GARANTIA: pega id de forma segura (suporta id ou id_musica)
    const carregada = this.musicaCarregada();
    console.log('Debug - musicaCarregada antes do PUT:', carregada);

    const musicaId = (carregada && ( (carregada as any).id_musica ?? (carregada as any).id )) as number | undefined;

    if (!musicaId || isNaN(musicaId as any)) {
      console.error('ID da música inválido:', musicaId, carregada);
      this.erro.set('ID da música inválido. Recarregue a música e tente novamente.');
      return;
    }

    const dadosAtualizados = {
      titulo: this.formEdicao.value.titulo!,
      codigo_musica: this.formEdicao.value.codigo_musica!,
      interprete_musica: this.formEdicao.value.interprete_musica!,
      letra_musica: this.formEdicao.value.letra_musica?.trim() || null
    };

    await this.musicaService.atualizarMusica(musicaId, dadosAtualizados);

    // Sucesso!
    this.sucesso.set(true);
    this.limparFormularios();

    // Remove mensagem após 5s
    setTimeout(() => {
      this.sucesso.set(false);
    }, 5000);

  } catch (err: any) {
    console.error('Erro ao atualizar música:', err);

    if (err.status === 401 || err.message?.includes('Sessão expirada')) {
      this.tokenService.set(null);
      this.router.navigate(['/admin/login']);
      return;
    }

    this.erro.set('Erro ao salvar alterações. Tente novamente.');

    setTimeout(() => {
      this.erro.set(null);
    }, 6000);

  } finally {
    this.salvando.set(false);
  }
}


  // Abre modal de confirmação de exclusão
  abrirModalExclusao(): void {
    if (!this.musicaCarregada()) return;
    this.modalConfirmarExclusao.set(true);
  }

  // Fecha modal de exclusão
  fecharModalExclusao(): void {
    this.modalConfirmarExclusao.set(false);
  }

  // Confirma e exclui música
  async confirmarExclusao(): Promise<void> {
    this.modalConfirmarExclusao.set(false);
    
    if (!this.musicaCarregada()) return;

    this.excluindo.set(true);
    this.erro.set(null);
    this.sucesso.set(false);

    try {
      const musicaId = this.musicaCarregada()!.id;

      await this.musicaService.excluirMusica(musicaId);

      // Sucesso!
      this.sucesso.set(true);
      this.limparFormularios();

      // Remove mensagem após 5s
      setTimeout(() => {
        this.sucesso.set(false);
      }, 5000);

    } catch (err: any) {
      console.error('Erro ao excluir música:', err);

      if (err.status === 401 || err.message?.includes('Sessão expirada')) {
        this.tokenService.set(null);
        this.router.navigate(['/admin/login']);
        return;
      }

      this.erro.set('Erro ao excluir música. Tente novamente.');
      
      setTimeout(() => {
        this.erro.set(null);
      }, 6000);

    } finally {
      this.excluindo.set(false);
    }
  }

  // Limpa todos os formulários
  limparFormularios(): void {
    this.formBusca.reset();
    this.formEdicao.reset();
    this.musicaCarregada.set(null);
  }

  // Cancela e volta pro painel
  cancelar(): void {
    this.router.navigate(['/admin/painel']);
  }
}