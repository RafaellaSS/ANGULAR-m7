import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";

import { FiltroLivros } from "../../components/filtro-livros/filtro-livros";
import { AdicionarLivros } from "../../components/adicionar-livros/adicionar-livros";
import { ListaLivros } from "../../components/lista-livros/lista-livros";
import { Livro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livros-page",
  standalone: true,
  imports: [
    FiltroLivros,
    AdicionarLivros,
    ListaLivros
  ],
  templateUrl: "./livros-page.html",
  styleUrl: "./livros-page.css"
})

export class LivrosPage implements OnInit {
  // A página coordena o carregamento e a atualização da lista de livros.
  private readonly livrosService =
    inject(LivrosService);

  readonly livros =
    signal<Livro[]>([]);

  readonly pesquisa =
    signal("");

  readonly filtroStatus =
    signal<StatusLivro | "todos">("todos");

  readonly carregando =
    signal(false);

  readonly erro =
    signal<string | null>(null);

  // Controla a exibição do formulário sem trocar de rota.
  readonly exibindoFormulario = signal(false);

  // Recalcula a lista sempre que os livros, a pesquisa ou o filtro mudam.
  readonly livrosFiltrados =
    computed(() => {
      const termo =
        this.pesquisa().trim().toLowerCase();

      const status =
        this.filtroStatus();

      return this.livros().filter(livro => {
        const correspondeTexto =
          termo === "" ||
          livro.titulo.toLowerCase().includes(termo) ||
          livro.descricao?.toLowerCase().includes(termo);

        const correspondeStatus =
          status === "todos" ||
          livro.status === status;

        return correspondeTexto &&
          correspondeStatus;
      });
    });

  ngOnInit(): void {
    void this.carregarLivros();
  }

  async carregarLivros(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados =
        await this.livrosService.listar();

      this.livros.set(dados);
    } catch {
      this.erro.set(
        "Não foi possível carregar os livros."
      );
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(
    valor: StatusLivro | "todos"
  ): void {
    this.filtroStatus.set(valor);
  }

  abrirFormulario(): void {
    this.exibindoFormulario.set(true);
  }

  fecharFormulario(): void {
    this.exibindoFormulario.set(false);
  }

  adicionarLivro(livro: Livro): void {
    // Inclui o novo livro no início e fecha o formulário após o sucesso.
    this.livros.update(livros => [livro, ...livros]);
    this.fecharFormulario();
  }

  async alterarStatusLivro(payload: { id: number; status: StatusLivro }): Promise<void> {
    const livroAtual = this.livros().find(item => item.id === payload.id);

    if (!livroAtual) {
      return;
    }

    const statusAnterior = livroAtual.status;
    const novoStatus = payload.status;

    this.erro.set(null);

    this.livros.update(livros =>
      livros.map(item =>
        item.id === payload.id
          ? { ...item, status: novoStatus }
          : item
      )
    );

    try {
      const atualizado = await this.livrosService.atualizarStatus(
        payload.id,
        novoStatus
      );

      this.livros.update(livros =>
        livros.map(item =>
          item.id === atualizado.id ? atualizado : item
        )
      );
    } catch {
      this.livros.update(livros =>
        livros.map(item =>
          item.id === payload.id
            ? { ...item, status: statusAnterior }
            : item
        )
      );

      this.erro.set("Não foi possível alterar o status do livro.");
    }
  }

  async excluirLivro(id: number): Promise<void> {
    this.erro.set(null);

    try {
      await this.livrosService.remover(id);

      this.livros.update(livros =>
        livros.filter(livro => livro.id !== id)
      );
    } catch {
      this.erro.set("Não foi possível excluir o livro.");
    }
  }
}