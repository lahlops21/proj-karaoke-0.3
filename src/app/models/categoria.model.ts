// src/app/models/categoria.model.ts

/**
 * Interface para Categoria
 */
export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao_categoria?: string | null;
  icone?: string | null;
}

/**
 * Interface para Música resumida (lista de categoria)
 */
export interface MusicaCategoria {
  id_musica: number;
  titulo: string;
  codigo_musica: string;
}

/**
 * Interface para resposta paginada de músicas por categoria
 */
export interface MusicasCategoriaResponse {
  page: number;
  limit: number;
  items: MusicaCategoria[];
}