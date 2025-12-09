// src/app/services/busca.service.ts

import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MusicaSearch } from "../models/musica-search.model";

@Injectable({ providedIn: 'root' })
export class MusicaService {

    private httpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:3000';

    /**
     * Busca músicas por título, artista ou código
     * @param termo - Termo de busca digitado pelo usuário
     * @returns Observable com array de músicas encontradas
     */
    buscar(termo: string): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('q', termo.trim());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/search`,
            { params }
        );
    }

    /**
     * Busca músicas especificamente por título
     * @param titulo - Título da música
     * @returns Observable com array de músicas encontradas
     */
    buscarPorTitulo(titulo: string): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('titulo', titulo.trim());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/search?titulo=${titulo.trim()}`,
        );
    }

    /**
     * Busca músicas por artista
     * @param artista - Nome do artista
     * @returns Observable com array de músicas encontradas
     */
    buscarPorArtista(artista: string): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('artista', artista.trim());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/search`,
            { params }
        );
    }

    /**
     * Busca músicas por trecho da letra
     * @param letra - Trecho da letra
     * @returns Observable com array de músicas encontradas
     */
    buscarPorLetra(letra: string): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('letra', letra.trim());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/search`,
            { params }
        );
    }

    /**
     * Busca música por código específico
     * @param codigo - Código da música na máquina de karaokê
     * @returns Observable com array de músicas encontradas
     */
    buscarPorCodigo(codigo: string): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('codigo', codigo.trim());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/search`,
            { params }
        );
    }

    /**
     * Registra evento de busca no histórico
     * @param termo - Termo que foi buscado
     * @param resultadoEncontrado - Se encontrou resultado ou não
     * @param musicaId - ID da música clicada (opcional)
     */
    registrarBusca(termo: string, resultadoEncontrado: boolean, musicaId?: number): void {
        const eventoBusca = {
            termo: termo.trim(),
            resultadoEncontrado,
            musicaId
        };

        try {
            this.httpClient.post(
                `${this.apiUrl}/events/search`,
                eventoBusca
            ).subscribe();
        } catch (err) {
            console.error('Erro ao registrar busca:', err);
        }
    }

    /**
     * Obtém as músicas mais populares
     * @param limit - Quantidade de músicas a retornar (padrão: 10)
     * @returns Observable com array das músicas mais populares
     */
    obterMusicasPopulares(limit: number = 10): Observable<MusicaSearch[]> {
        const params = new HttpParams()
            .set('limit', limit.toString());

        return this.httpClient.get<MusicaSearch[]>(
            `${this.apiUrl}/musicas/populares`,
            { params }
        );
    }
}


