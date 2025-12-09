// src/app/services/musica-admin.service.ts

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { enviroment } from "../../enviroments/enviroments";
import { TokenService } from "./token.service";
import { 
  MusicaCadastroRequest, 
  MusicaCadastroResponse, 
  MusicaLista, 
  MusicasListaResponse, 
  Categoria,
  MusicaAtualizarRequest,
  MusicaDetalhada,
  Artista,
  ArtistaCadastroRequest
} from "../models/musica-admin.model";

@Injectable({ providedIn: 'root' })
export class MusicaAdminService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = enviroment.apiKaraoke;

  /**
   * Lista todos os artistas (público)
   * GET /artistas
   */
  listarArtistas(): Observable<Artista[]> {
    return this.http.get<Artista[]>(
      `${this.apiUrl}/artistas/`
    );
  }

  /**
   * Cadastra novo artista (admin)
   * POST /admin/artistas
   */
  async cadastrarArtista(artista: ArtistaCadastroRequest): Promise<Artista> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de cadastrar um artista.");
    }

    try {
      const response = await firstValueFrom(
        this.http.post<Artista>(
          `${this.apiUrl}/admin/artistas`,
          artista
        )
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao cadastrar artista:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Adiciona uma nova música ao catálogo
   * POST /admin/musicas
   */
  async adicionarMusica(musica: MusicaCadastroRequest): Promise<MusicaCadastroResponse> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de adicionar uma música.");
    }

    try {
      const response = await firstValueFrom(
        this.http.post<MusicaCadastroResponse>(
          `${this.apiUrl}/admin/musicas`,
          musica
        )
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao adicionar música:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Busca música por código
   * GET /admin/musicas (filtra pelo código)
   */
  async buscarPorCodigo(codigo: string): Promise<MusicaLista | null> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de buscar músicas.");
    }

    try {
      const response = await firstValueFrom(
        this.http.get<MusicasListaResponse>(
          `${this.apiUrl}/admin/musicas?page=1&limit=100`
        )
      );

      const musica = response.items.find(
        m => m.codigo_musica.toLowerCase() === codigo.toLowerCase()
      );

      return musica || null;
    } catch (error: any) {
      console.error('Erro ao buscar música:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Obtém detalhes completos da música por ID
   * GET /admin/musicas/{id}
   */
  async obterMusicaPorId(id: number): Promise<MusicaDetalhada> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de obter detalhes.");
    }

    try {
      const response = await firstValueFrom(
        this.http.get<MusicaDetalhada>(
          `${this.apiUrl}/musicas/${id}`
        )
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao obter música:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Atualiza uma música existente
   * PUT /admin/musicas/{id}
   */
  async atualizarMusica(id: number, musica: MusicaAtualizarRequest): Promise<void> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de atualizar uma música.");
    }

    try {
      await firstValueFrom(
        this.http.put<void>(
          `${this.apiUrl}/admin/musicas/${id}`,
          musica
        )
      );
    } catch (error: any) {
      console.error('Erro ao atualizar música:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Exclui uma música do catálogo
   * DELETE /admin/musicas/{id}
   */
  async excluirMusica(id: number): Promise<void> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de excluir uma música.");
    }

    try {
      await firstValueFrom(
        this.http.delete<void>(
          `${this.apiUrl}/admin/musicas/${id}`
        )
      );
    } catch (error: any) {
      console.error('Erro ao excluir música:', error);
      if (error.status === 401) {
        this.tokenService.set(null);
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw error;
    }
  }

  /**
   * Lista todas as músicas (admin)
   * GET /admin/musicas
   */
  listarMusicas(page: number = 1, limit: number = 20): Observable<MusicasListaResponse> {
    const token = this.tokenService.get();

    if (!token) {
      throw new Error("Token ausente. Faça login antes de listar músicas.");
    }

    return this.http.get<MusicasListaResponse>(
      `${this.apiUrl}/admin/musicas?page=${page}&limit=${limit}`
    );
  }

  /**
   * Lista todas as categorias (público)
   * GET /categorias
   */
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      `${this.apiUrl}/categorias`
    );
  }

  /**
   * Lista músicas por categoria (público)
   * GET /categorias/{id}/musicas
   */
  listarMusicasPorCategoria(
    categoriaId: number, 
    page: number = 1, 
    limit: number = 20
  ): Observable<MusicasListaResponse> {
    return this.http.get<MusicasListaResponse>(
      `${this.apiUrl}/categorias/${categoriaId}/musicas?page=${page}&limit=${limit}`
    );
  }
}