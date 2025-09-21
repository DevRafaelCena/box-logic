import { Caixa } from "../types/types";

/**
 * Utilitário simples para gerenciar caixas disponíveis
 */
export class BoxUtils {
  // Configurações das caixas - facilita manutenção
  private static readonly CAIXAS_CONFIG = [
    { nome: "Caixa 1", altura: 30, largura: 40, comprimento: 80 },
    { nome: "Caixa 2", altura: 50, largura: 50, comprimento: 40 },
    { nome: "Caixa 3", altura: 50, largura: 80, comprimento: 60 },
  ] as const;

  /**
   * Calcula o volume com base nas dimensões
   */
  static calcularVolume(
    altura: number,
    largura: number,
    comprimento: number
  ): number {
    if (altura <= 0 || largura <= 0 || comprimento <= 0) {
      throw new Error("Dimensões devem ser valores positivos");
    }
    return altura * largura * comprimento;
  }

  /**
   * Obtém todas as caixas disponíveis com volume calculado
   */
  static obterCaixasDisponiveis(): Caixa[] {
    return BoxUtils.CAIXAS_CONFIG.map((config) => ({
      ...config,
      volume: BoxUtils.calcularVolume(
        config.altura,
        config.largura,
        config.comprimento
      ),
    }));
  }

  /**
   * Obtém caixas ordenadas por volume (menores primeiro)
   */
  static obterCaixasOrdenadasPorVolume(): Caixa[] {
    const caixas = BoxUtils.obterCaixasDisponiveis();
    return caixas.sort((a, b) => a.volume - b.volume);
  }
}
