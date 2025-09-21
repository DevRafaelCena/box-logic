import { Injectable } from "@nestjs/common";
import { PedidosRequestDto } from "../dtos/pedidos-request.dto";
import {
  Produto,
  PedidosResponse,
  PedidoResponse,
  CaixaResponse,
  Caixa,
} from "../types/types";
import { BoxUtils } from "../utils/box.utils";
import { PackingValidator } from "../validators/packing.validator";

/**
 * Serviço de empacotamento simplificado
 * Responsável por processar pedidos e otimizar a distribuição em caixas
 */
@Injectable()
export class PackingService {
  private static readonly PESOS_ALGORITMO = {
    PRODUTOS: 1000, // Peso para quantidade de produtos
    EFICIENCIA: 500, // Peso para eficiência de espaço
    PENALIZACAO_TAMANHO: 100, // Penalização para caixas maiores
  } as const;

  /**
   * Processa uma lista de pedidos e retorna a otimização de embalagem
   */
  processPedidos(pedidosRequest: PedidosRequestDto): PedidosResponse {
    if (!pedidosRequest?.pedidos?.length) {
      throw new Error("Lista de pedidos não pode estar vazia");
    }

    const pedidosResponse: PedidoResponse[] = [];

    for (const pedido of pedidosRequest.pedidos) {
      const produtos = this.prepararProdutos(pedido.produtos);
      const caixasUsadas = this.otimizarEmbalagem(produtos);

      pedidosResponse.push({
        pedido_id: pedido.pedido_id,
        caixas: caixasUsadas,
      });
    }

    return { pedidos: pedidosResponse };
  }

  /**
   * Prepara os produtos do pedido, calculando volumes
   * @param produtosDtos - DTOs dos produtos
   * @returns Lista de produtos com volume calculado
   */
  private prepararProdutos(produtosDtos: any[]): Produto[] {
    return produtosDtos.map((p) => ({
      produto_id: p.produto_id,
      dimensoes: p.dimensoes,
      volume: BoxUtils.calcularVolume(
        p.dimensoes.altura,
        p.dimensoes.largura,
        p.dimensoes.comprimento
      ),
    }));
  }

  /**
   * Otimiza a embalagem de uma lista de produtos
   */
  private otimizarEmbalagem(produtos: Produto[]): CaixaResponse[] {
    const caixasUsadas: CaixaResponse[] = [];
    const produtosRestantes = [...produtos];

    // Ordena produtos por volume decrescente (estratégia gulosa)
    produtosRestantes.sort((a, b) => b.volume - a.volume);

    while (produtosRestantes.length > 0) {
      const melhorCombinacao =
        this.encontrarMelhorCombinacao(produtosRestantes);

      if (melhorCombinacao.caixa) {
        caixasUsadas.push({
          caixa_id: melhorCombinacao.caixa.nome,
          produtos: melhorCombinacao.produtos.map((p) => p.produto_id),
        });

        // Remove produtos empacotados
        this.removerProdutosEmpacotados(
          produtosRestantes,
          melhorCombinacao.produtos
        );
      } else {
        // Produto não cabe em nenhuma caixa
        const produto = produtosRestantes.shift();
        caixasUsadas.push({
          caixa_id: null,
          produtos: [produto.produto_id],
          observacao: "Produto não cabe em nenhuma caixa disponível.",
        });
      }
    }

    return caixasUsadas;
  }

  /**
   * Encontra a melhor combinação de caixa e produtos
   */
  private encontrarMelhorCombinacao(produtos: Produto[]): {
    caixa: Caixa | null;
    produtos: Produto[];
  } {
    let melhorCombinacao = { caixa: null, produtos: [] };
    let melhorScore = -1;

    const caixasOrdenadas = BoxUtils.obterCaixasOrdenadasPorVolume();

    for (const caixa of caixasOrdenadas) {
      const combinacao = this.encontrarCombinacaoParaCaixa(caixa, produtos);

      if (combinacao.produtos.length > 0) {
        const score = this.calcularScore(combinacao.produtos, caixa);

        if (score > melhorScore) {
          melhorCombinacao = { caixa, produtos: combinacao.produtos };
          melhorScore = score;
        }
      }
    }

    return melhorCombinacao;
  }

  /**
   * Encontra a melhor combinação de produtos para uma caixa específica
   */
  private encontrarCombinacaoParaCaixa(
    caixa: Caixa,
    produtos: Produto[]
  ): { produtos: Produto[] } {
    const produtosCabem: Produto[] = [];

    // Filtra produtos que cabem individualmente na caixa
    for (const produto of produtos) {
      if (PackingValidator.produtoCabeNaCaixa(produto, caixa)) {
        produtosCabem.push(produto);
      }
    }

    if (produtosCabem.length === 0) {
      return { produtos: [] };
    }

    return this.otimizarCombinacaoNaCaixa(caixa, produtosCabem);
  }

  /**
   * Otimiza a combinação de produtos dentro de uma caixa
   */
  private otimizarCombinacaoNaCaixa(
    caixa: Caixa,
    produtosCandidatos: Produto[]
  ): { produtos: Produto[] } {
    const produtosSelecionados: Produto[] = [];
    let volumeRestante = caixa.volume;

    // Ordena por densidade para otimizar empacotamento
    const produtosOrdenados = [...produtosCandidatos].sort((a, b) => {
      const densidadeA = a.volume / (a.dimensoes.altura * a.dimensoes.largura);
      const densidadeB = b.volume / (b.dimensoes.altura * b.dimensoes.largura);
      return densidadeB - densidadeA;
    });

    for (const produto of produtosOrdenados) {
      if (
        produto.volume <= volumeRestante &&
        PackingValidator.combinacaoCabeNaCaixa(
          [...produtosSelecionados, produto],
          caixa
        )
      ) {
        produtosSelecionados.push(produto);
        volumeRestante -= produto.volume;
      }
    }

    // Se nenhum produto foi selecionado, tenta pelo menos o primeiro
    if (produtosSelecionados.length === 0 && produtosCandidatos.length > 0) {
      const primeiroProduto = produtosCandidatos[0];
      if (PackingValidator.produtoCabeNaCaixa(primeiroProduto, caixa)) {
        produtosSelecionados.push(primeiroProduto);
      }
    }

    return { produtos: produtosSelecionados };
  }

  /**
   * Calcula o score de uma combinação (quanto maior, melhor)
   */
  private calcularScore(produtos: Produto[], caixa: Caixa): number {
    const volumeUsado = produtos.reduce((sum, p) => sum + p.volume, 0);
    const eficiencia = volumeUsado / caixa.volume;

    const bonusProdutos =
      produtos.length * PackingService.PESOS_ALGORITMO.PRODUTOS;
    const bonusEficiencia =
      eficiencia * PackingService.PESOS_ALGORITMO.EFICIENCIA;
    const penalizacaoTamanho =
      (1 / caixa.volume) * PackingService.PESOS_ALGORITMO.PENALIZACAO_TAMANHO;

    return bonusProdutos + bonusEficiencia + penalizacaoTamanho;
  }

  /**
   * Remove produtos empacotados da lista de produtos restantes
   */
  private removerProdutosEmpacotados(
    produtosRestantes: Produto[],
    produtosEmpacotados: Produto[]
  ): void {
    produtosEmpacotados.forEach((produto) => {
      const index = produtosRestantes.findIndex(
        (p) => p.produto_id === produto.produto_id
      );
      if (index > -1) {
        produtosRestantes.splice(index, 1);
      }
    });
  }
}
