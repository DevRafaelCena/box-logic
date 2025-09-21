import { Produto, Caixa } from "../types/types";

/**
 * Utilitário simples para validações de empacotamento
 */
export class PackingValidator {
  /**
   * Verifica se um produto cabe em uma caixa específica
   * Considera todas as orientações possíveis do produto
   */
  static produtoCabeNaCaixa(produto: Produto, caixa: Caixa): boolean {
    const { altura, largura, comprimento } = produto.dimensoes;

    // Verifica todas as orientações possíveis do produto
    const orientacoes = [
      [altura, largura, comprimento],
      [altura, comprimento, largura],
      [largura, altura, comprimento],
      [largura, comprimento, altura],
      [comprimento, altura, largura],
      [comprimento, largura, altura],
    ];

    return orientacoes.some(
      ([h, w, l]) =>
        h <= caixa.altura && w <= caixa.largura && l <= caixa.comprimento
    );
  }

  /**
   * Verifica se uma combinação de produtos cabe em uma caixa
   */
  static combinacaoCabeNaCaixa(produtos: Produto[], caixa: Caixa): boolean {
    // Verifica se o volume total não excede a capacidade da caixa
    const volumeTotal = produtos.reduce((sum, p) => sum + p.volume, 0);

    if (volumeTotal > caixa.volume) {
      return false;
    }

    // Verifica se todos os produtos individualmente cabem na caixa
    return produtos.every((produto) =>
      PackingValidator.produtoCabeNaCaixa(produto, caixa)
    );
  }

  /**
   * Valida se os dados do produto são consistentes
   */
  static validarProduto(produto: Produto): boolean {
    if (!produto.produto_id) {
      return false;
    }

    const { altura, largura, comprimento } = produto.dimensoes;
    return altura > 0 && largura > 0 && comprimento > 0;
  }
}
