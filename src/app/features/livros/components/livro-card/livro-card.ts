import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Livro, StatusLivro } from "../../models/livro";

@Component({
  selector: "app-livro-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./livro-card.html",
  styleUrl: "./livro-card.css"
})

export class LivroCard {
  livro = input.required<Livro>();
  statusChange = output<{ id: number; status: StatusLivro }>();
  excluir = output<number>();

  alternarStatus(): void {
    const livroAtual = this.livro();
    const novoStatus: StatusLivro =
      livroAtual.status === "disponível" ? "indisponível" : "disponível";

    this.statusChange.emit({
      id: livroAtual.id,
      status: novoStatus
    });
  }

  remover(): void {
    this.excluir.emit(this.livro().id);
  }
}
