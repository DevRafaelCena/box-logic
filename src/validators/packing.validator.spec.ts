import { PackingValidator } from "./packing.validator";
import { Produto, Caixa } from "../types/types";

describe("PackingValidator", () => {
  const caixaTeste: Caixa = {
    nome: "Caixa Teste",
    altura: 50,
    largura: 50,
    comprimento: 40,
    volume: 100000,
  };

  const produtoTeste: Produto = {
    produto_id: "PRODUTO_TESTE",
    dimensoes: { altura: 40, largura: 30, comprimento: 25 },
    volume: 30000,
  };

  describe("produtoCabeNaCaixa", () => {
    it("deve retornar true quando produto cabe na orientação original", () => {
      const produto: Produto = {
        produto_id: "PS5",
        dimensoes: { altura: 40, largura: 30, comprimento: 25 },
        volume: 30000,
      };

      const resultado = PackingValidator.produtoCabeNaCaixa(
        produto,
        caixaTeste
      );

      expect(resultado).toBe(true);
    });

    it("deve retornar true quando produto cabe em orientação alternativa", () => {
      const produto: Produto = {
        produto_id: "PRODUTO_ROTACIONADO",
        dimensoes: { altura: 25, largura: 35, comprimento: 30 },
        volume: 26250,
      };

      const resultado = PackingValidator.produtoCabeNaCaixa(
        produto,
        caixaTeste
      );

      // Assert - deve caber em alguma orientação
      expect(resultado).toBe(true);
    });

    it("deve retornar false quando produto não cabe em nenhuma orientação", () => {
      const produtoGrande: Produto = {
        produto_id: "PRODUTO_MUITO_GRANDE",
        dimensoes: { altura: 60, largura: 60, comprimento: 50 },
        volume: 180000,
      };

      const resultado = PackingValidator.produtoCabeNaCaixa(
        produtoGrande,
        caixaTeste
      );

      expect(resultado).toBe(false);
    });

    it("deve testar todas as orientações possíveis", () => {
      const produto: Produto = {
        produto_id: "ORIENTACAO_ESPECIFICA",
        dimensoes: { altura: 50, largura: 40, comprimento: 30 },
        volume: 60000,
      };

      const resultado = PackingValidator.produtoCabeNaCaixa(
        produto,
        caixaTeste
      );

      expect(resultado).toBe(true);
    });
  });

  describe("combinacaoCabeNaCaixa", () => {
    it("deve retornar true quando produtos cabem individualmente e volume total é válido", () => {
      const produtos: Produto[] = [
        {
          produto_id: "PRODUTO1",
          dimensoes: { altura: 20, largura: 20, comprimento: 20 },
          volume: 8000,
        },
        {
          produto_id: "PRODUTO2",
          dimensoes: { altura: 25, largura: 25, comprimento: 15 },
          volume: 9375,
        },
      ];

      // Act
      const resultado = PackingValidator.combinacaoCabeNaCaixa(
        produtos,
        caixaTeste
      );

      expect(resultado).toBe(true);
    });

    it("deve retornar false quando volume total excede capacidade da caixa", () => {
      const produtos: Produto[] = [
        {
          produto_id: "PRODUTO1",
          dimensoes: { altura: 40, largura: 40, comprimento: 30 },
          volume: 48000,
        },
        {
          produto_id: "PRODUTO2",
          dimensoes: { altura: 40, largura: 35, comprimento: 30 },
          volume: 42000,
        },
        {
          produto_id: "PRODUTO3",
          dimensoes: { altura: 30, largura: 30, comprimento: 20 },
          volume: 18000,
        },
      ];

      const resultado = PackingValidator.combinacaoCabeNaCaixa(
        produtos,
        caixaTeste
      );

      expect(resultado).toBe(false);
    });

    it("deve retornar false quando algum produto não cabe individualmente", () => {
      const produtos: Produto[] = [
        {
          produto_id: "PRODUTO_PEQUENO",
          dimensoes: { altura: 20, largura: 20, comprimento: 20 },
          volume: 8000,
        },
        {
          produto_id: "PRODUTO_MUITO_GRANDE",
          dimensoes: { altura: 60, largura: 60, comprimento: 60 },
          volume: 216000,
        },
      ];

      // Act
      const resultado = PackingValidator.combinacaoCabeNaCaixa(
        produtos,
        caixaTeste
      );

      expect(resultado).toBe(false);
    });

    it("deve retornar true para lista vazia", () => {
      const produtos: Produto[] = [];

      const resultado = PackingValidator.combinacaoCabeNaCaixa(
        produtos,
        caixaTeste
      );

      expect(resultado).toBe(true);
    });
  });

  describe("validarProduto", () => {
    it("deve retornar true para produto válido", () => {
      const resultado = PackingValidator.validarProduto(produtoTeste);

      expect(resultado).toBe(true);
    });

    it("deve retornar false quando produto_id estiver vazio", () => {
      const produtoInvalido: Produto = {
        ...produtoTeste,
        produto_id: "",
      };

      const resultado = PackingValidator.validarProduto(produtoInvalido);

      expect(resultado).toBe(false);
    });

    it("deve retornar false quando altura for zero ou negativa", () => {
      const produtoInvalido: Produto = {
        ...produtoTeste,
        dimensoes: { ...produtoTeste.dimensoes, altura: 0 },
      };

      const resultado = PackingValidator.validarProduto(produtoInvalido);

      expect(resultado).toBe(false);
    });

    it("deve retornar false quando largura for zero ou negativa", () => {
      const produtoInvalido: Produto = {
        ...produtoTeste,
        dimensoes: { ...produtoTeste.dimensoes, largura: -5 },
      };

      const resultado = PackingValidator.validarProduto(produtoInvalido);

      expect(resultado).toBe(false);
    });

    it("deve retornar false quando comprimento for zero ou negativo", () => {
      const produtoInvalido: Produto = {
        ...produtoTeste,
        dimensoes: { ...produtoTeste.dimensoes, comprimento: 0 },
      };

      const resultado = PackingValidator.validarProduto(produtoInvalido);

      expect(resultado).toBe(false);
    });
  });
});
