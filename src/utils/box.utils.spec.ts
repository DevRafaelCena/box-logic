import { BoxUtils } from "./box.utils";

describe("BoxUtils", () => {
  describe("calcularVolume", () => {
    it("deve calcular volume corretamente com dimensões válidas", () => {
      const altura = 10;
      const largura = 20;
      const comprimento = 30;
      const volumeEsperado = 6000;

      const resultado = BoxUtils.calcularVolume(altura, largura, comprimento);

      expect(resultado).toBe(volumeEsperado);
    });

    it("deve lançar erro quando altura for zero ou negativa", () => {
      expect(() => BoxUtils.calcularVolume(0, 20, 30)).toThrow(
        "Dimensões devem ser valores positivos"
      );

      expect(() => BoxUtils.calcularVolume(-5, 20, 30)).toThrow(
        "Dimensões devem ser valores positivos"
      );
    });

    it("deve lançar erro quando largura for zero ou negativa", () => {
      expect(() => BoxUtils.calcularVolume(10, 0, 30)).toThrow(
        "Dimensões devem ser valores positivos"
      );

      expect(() => BoxUtils.calcularVolume(10, -5, 30)).toThrow(
        "Dimensões devem ser valores positivos"
      );
    });

    it("deve lançar erro quando comprimento for zero ou negativo", () => {
      expect(() => BoxUtils.calcularVolume(10, 20, 0)).toThrow(
        "Dimensões devem ser valores positivos"
      );

      expect(() => BoxUtils.calcularVolume(10, 20, -5)).toThrow(
        "Dimensões devem ser valores positivos"
      );
    });
  });

  describe("obterCaixasDisponiveis", () => {
    it("deve retornar todas as caixas com volumes calculados", () => {
      // Act
      const caixas = BoxUtils.obterCaixasDisponiveis();

      expect(caixas).toHaveLength(3);

      expect(caixas[0]).toEqual({
        nome: "Caixa 1",
        altura: 30,
        largura: 40,
        comprimento: 80,
        volume: 96000,
      });

      expect(caixas[1]).toEqual({
        nome: "Caixa 2",
        altura: 50,
        largura: 50,
        comprimento: 40,
        volume: 100000,
      });

      expect(caixas[2]).toEqual({
        nome: "Caixa 3",
        altura: 50,
        largura: 80,
        comprimento: 60,
        volume: 240000,
      });
    });
  });

  describe("obterCaixasOrdenadasPorVolume", () => {
    it("deve retornar caixas ordenadas por volume crescente", () => {
      const caixas = BoxUtils.obterCaixasOrdenadasPorVolume();

      expect(caixas).toHaveLength(3);
      expect(caixas[0].volume).toBeLessThan(caixas[1].volume);
      expect(caixas[1].volume).toBeLessThan(caixas[2].volume);

      expect(caixas[0].nome).toBe("Caixa 1");
      expect(caixas[1].nome).toBe("Caixa 2");
      expect(caixas[2].nome).toBe("Caixa 3");
    });

    it("não deve modificar o array original", () => {
      // Arrange
      const caixasOriginais = BoxUtils.obterCaixasDisponiveis();
      const ordemOriginal = caixasOriginais.map((c) => c.nome);

      BoxUtils.obterCaixasOrdenadasPorVolume();

      const caixasDepois = BoxUtils.obterCaixasDisponiveis();
      const ordemDepois = caixasDepois.map((c) => c.nome);

      expect(ordemDepois).toEqual(ordemOriginal);
    });
  });
});
