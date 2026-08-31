export type StatusLivro =
    "disponível" | "indisponível";

export interface Livro {
    id: number; 
    titulo: string; 
    autor: string; 
    categoria: string; 
    anoPublicacao: number; 
    status: StatusLivro; 
    descricao?: string;
}

// Ao criar um livro, o usuário informa estes campos; id são gerados pelo serviço.
export type NovoLivro = Omit<Livro, "id">;