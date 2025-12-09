// src/app/services/categoria.service.ts

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "../../enviroments/enviroments";
import { Categoria, MusicasCategoriaResponse } from "../models/categoria.model";

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private http = inject(HttpClient);
  private apiUrl = enviroment.apiKaraoke;

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
   * @param categoriaId - ID da categoria
   * @param page - Número da página (padrão: 1)
   * @param limit - Limite de resultados por página (padrão: 100)
   */
  listarMusicasPorCategoria(
    categoriaId: number, 
    page: number = 1, 
    limit: number = 100
  ): Observable<MusicasCategoriaResponse> {
    return this.http.get<MusicasCategoriaResponse>(
      `${this.apiUrl}/categorias/${categoriaId}/musicas?page=${page}&limit=${limit}`
    );
  }
}