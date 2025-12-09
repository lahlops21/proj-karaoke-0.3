// src/app/models/musica-admin.model.ts

/**
 * Interface para cadastro de música (Request body)
 */
export interface MusicaCadastroRequest {
  titulo: string;
  codigo_musica: string;
  letra_musica?: string | null;
  interprete_musica?: string | null;
  artistaIds?: number[];
  categoriaIds?: number[];
}

/**
 * Interface para resposta do cadastro de música
 */
export interface MusicaCadastroResponse {
  id: number;
}

/**
 * Interface para item da lista de músicas
 */
export interface MusicaLista {
  id_musica: number;
  titulo: string;
  codigo_musica: string;
}

/**
 * Interface para resposta paginada de músicas
 */
export interface MusicasListaResponse {
  page: number;
  limit: number;
  items: MusicaLista[];
}

/**
 * Interface para Categoria completa
 */
export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao_categoria?: string | null;
  icone?: string | null;
}

/**
 * Interface para atualização de música (opcional - para futuro)
 */
export interface MusicaAtualizarRequest {
  titulo?: string;
  codigo_musica?: string;
  letra_musica?: string | null;
  interprete_musica?: string | null;
  artistaIds?: number[];
  categoriaIds?: number[];
}

/**
 * Interface para música detalhada (opcional - para futuro)
 */
export interface MusicaDetalhada {
  id: number;
  titulo: string;
  codigo: string;
  letra?: string | null;
  interprete?: string | null;
  artistas?: Artista[];
  categorias?: Categoria[];
}

/**
 * Interface para Artista
 */
export interface Artista {
  id: number;
  nome: string;
}

/**
 * Interface para cadastro de Artista (Request body)
 */
export interface ArtistaCadastroRequest {
  nome_artista: string;
}