import { Component, inject, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Livro, NovoLivro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  imports: [FormsModule],
  selector: "app-adicionar-livros",
  standalone: true,
  styleUrl: "./adicionar-livros.css",
  templateUrl: "./adicionar-livros.html",
})
export class AdicionarLivros {
  // O componente usa o serviço para salvar o formulário preenchido.
  private readonly livrosService = inject(LivrosService);

  // Outputs permitem que a página saiba se o usuário cancelou ou criou um livro.
  readonly cancelado = output<void>();
  readonly adicionado = output<Livro>();

  // Valores usados para montar as opções dos campos select.
  readonly statusDisponiveis: StatusLivro[] = [
    "disponível",
    "indisponível"
  ];

  // Estado inicial ligado aos campos do formulário por meio de [(ngModel)].
  novoLivro: NovoLivro = {
    titulo: "",
    autor: "",
    categoria: "",
    anoPublicacao: 2026,
    descricao: "",
    status: "disponível"
    
  };


  salvando = false;
  erro: string | null = null;

  async adicionar(): Promise<void> {
    // Impede o envio repetido enquanto a operação assíncrona está em andamento.
    this.salvando = true;
    this.erro = null;

    try {
      // O trim remove espaços acidentais no início ou fim do nome do responsável.
      const autor = this.novoLivro.autor ?? "";
      const livro = await this.livrosService.adicionar({
        ...this.novoLivro,
        autor: autor.trim()
      });
      // Entrega o livro criado para a página atualizar sua própria lista.
      this.adicionado.emit(livro);
    } catch {
      this.erro = "Não foi possível criar o livro.";
    } finally {
      // Libera o botão tanto em caso de sucesso quanto de erro.
      this.salvando = false;
    }
  }

  cancelar(): void {
    // A página decide como fechar o formulário ao receber este evento.
    this.cancelado.emit();
  }
}
