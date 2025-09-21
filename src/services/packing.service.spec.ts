import { Test, TestingModule } from "@nestjs/testing";
import { PackingService } from "./packing.service";
import { BoxUtils } from "../utils/box.utils";
import { PackingValidator } from "../validators/packing.validator";
import { PedidosRequestDto } from "../dtos/pedidos-request.dto";

jest.mock("../utils/box.utils");
jest.mock("../validators/packing.validator");

describe("PackingService", () => {
  let service: PackingService;
  let mockBoxUtils: jest.Mocked<typeof BoxUtils>;
  let mockPackingValidator: jest.Mocked<typeof PackingValidator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
    mockBoxUtils = BoxUtils as jest.Mocked<typeof BoxUtils>;
    mockPackingValidator = PackingValidator as jest.Mocked<
      typeof PackingValidator
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("processPedidos", () => {
    const pedidosRequest: PedidosRequestDto = {
      pedidos: [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: "PRODUTO1",
              dimensoes: { altura: 30, largura: 20, comprimento: 15 },
            },
          ],
        },
      ],
    };

    const caixasDisponiveis = [
      {
        nome: "Caixa 1",
        altura: 30,
        largura: 40,
        comprimento: 80,
        volume: 96000,
      },
      {
        nome: "Caixa 2",
        altura: 80,
        largura: 50,
        comprimento: 40,
        volume: 160000,
      },
    ];

    beforeEach(() => {
      mockBoxUtils.obterCaixasOrdenadasPorVolume.mockReturnValue(
        caixasDisponiveis
      );
      mockBoxUtils.calcularVolume.mockReturnValue(9000);
      mockPackingValidator.produtoCabeNaCaixa.mockReturnValue(true);
      mockPackingValidator.combinacaoCabeNaCaixa.mockReturnValue(true);
    });

    it("deve processar pedido com sucesso quando há caixas disponíveis", () => {
      const resultado = service.processPedidos(pedidosRequest);

      expect(resultado.pedidos).toHaveLength(1);
      expect(resultado.pedidos[0].pedido_id).toBe(1);
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBe("Caixa 1");
      expect(resultado.pedidos[0].caixas[0].produtos).toEqual(["PRODUTO1"]);
      expect(mockBoxUtils.obterCaixasOrdenadasPorVolume).toHaveBeenCalled();
      expect(mockBoxUtils.calcularVolume).toHaveBeenCalledWith(30, 20, 15);
    });

    it("deve usar múltiplas caixas quando produtos não cabem juntos", () => {
      const pedidosComMuitosProdutos: PedidosRequestDto = {
        pedidos: [
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: "PRODUTO1",
                dimensoes: { altura: 70, largura: 40, comprimento: 30 },
              },
              {
                produto_id: "PRODUTO2",
                dimensoes: { altura: 60, largura: 35, comprimento: 25 },
              },
            ],
          },
        ],
      };

      mockBoxUtils.calcularVolume
        .mockReturnValueOnce(84000)
        .mockReturnValueOnce(52500);

      mockPackingValidator.produtoCabeNaCaixa.mockReturnValue(true);
      mockPackingValidator.combinacaoCabeNaCaixa
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);

      const resultado = service.processPedidos(pedidosComMuitosProdutos);

      expect(resultado.pedidos).toHaveLength(1);
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].produtos).toContain("PRODUTO1");
      expect(resultado.pedidos[0].caixas[0].produtos).toContain("PRODUTO2");
    });

    it("deve retornar caixa null quando produto não cabe em nenhuma caixa", () => {
      mockPackingValidator.produtoCabeNaCaixa.mockReturnValue(false);
      mockPackingValidator.combinacaoCabeNaCaixa.mockReturnValue(false);

      const resultado = service.processPedidos(pedidosRequest);

      expect(resultado.pedidos).toHaveLength(1);
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(resultado.pedidos[0].caixas[0].observacao).toBeDefined();
      expect(resultado.pedidos[0].caixas[0].observacao).toContain(
        "não cabe em nenhuma caixa"
      );
    });

    it("deve processar múltiplos pedidos independentemente", () => {
      const multiplospedidos: PedidosRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: "PRODUTO1",
                dimensoes: { altura: 20, largura: 20, comprimento: 20 },
              },
            ],
          },
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: "PRODUTO2",
                dimensoes: { altura: 25, largura: 25, comprimento: 25 },
              },
            ],
          },
        ],
      };

      mockBoxUtils.calcularVolume
        .mockReturnValueOnce(8000)
        .mockReturnValueOnce(15625);

      const resultado = service.processPedidos(multiplospedidos);

      expect(resultado.pedidos).toHaveLength(2);
      expect(resultado.pedidos[0].pedido_id).toBe(1);
      expect(resultado.pedidos[1].pedido_id).toBe(2);
      expect(resultado.pedidos[0].caixas).toBeDefined();
      expect(resultado.pedidos[1].caixas).toBeDefined();
    });

    it("deve lançar erro quando lista de pedidos estiver vazia", () => {
      const pedidosVazios: PedidosRequestDto = { pedidos: [] };

      expect(() => service.processPedidos(pedidosVazios)).toThrow(
        "Lista de pedidos não pode estar vazia"
      );
    });

    it("deve lançar erro quando pedidosRequest for null", () => {
      expect(() => service.processPedidos(null)).toThrow(
        "Lista de pedidos não pode estar vazia"
      );
    });
  });
});
