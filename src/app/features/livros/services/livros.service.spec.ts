import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { LivrosService } from "./livros.service";

describe("LivrosService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it("deve ser criado", () => {
    const service = TestBed.inject(LivrosService);

    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(LivrosService);
  });
});
