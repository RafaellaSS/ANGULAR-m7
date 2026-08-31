import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";

import {
    Injectable,
    inject
} from "@angular/core";

import {
    firstValueFrom
} from "rxjs";

import {
    Livro,
    NovoLivro,
    StatusLivro
} from "../models/livro";

@Injectable({
    providedIn: "root"
})

export class LivrosService {
    private readonly http =
        inject(HttpClient);
    private readonly apiUrl =
        "https://api-m7-aj9s.onrender.com/api/livros";

    // métodos serão adicionados aqui
    listar(): Promise<Livro[]> {
        return firstValueFrom(
            this.http.get<Livro[]>(
                this.apiUrl
            )
        );
    }

    adicionar(
        livro: NovoLivro
    ): Promise<Livro> {
        return firstValueFrom(
            this.http.post<Livro>(
                this.apiUrl,
                livro
            )
        );
    }

    atualizarStatus(
        id: number,
        status: StatusLivro
    ): Promise<Livro> {
        return firstValueFrom(
            this.http.patch<Livro>(
                `${this.apiUrl}/${id}`,
                { status }
            )
        );
    }

    remover(id: number): Promise<void> {
        return firstValueFrom(
            this.http.delete<void>(
                `${this.apiUrl}/${id}`
            )
        );
    }

    async buscarPorId(
        id: number
    ): Promise<Livro | undefined> {
        
        try {
            return await firstValueFrom(
                this.http.get<Livro>(
                    `${this.apiUrl}/${id}`
                )
            );
        } catch (erro) {
            if (
                erro instanceof HttpErrorResponse && erro.status === 404
            ) {
                return undefined;
            }
            
            throw erro;
        }
    }

}