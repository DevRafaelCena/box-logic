import { Test, TestingModule } from "@nestjs/testing";
import { PackingController } from "./packing.controller";
import { PackingService } from "../services/packing.service";
import { PedidosRequestDto } from "../dtos/pedidos-request.dto";
import { ValidationPipe } from "@nestjs/common";

describe("PackingController", () => {
  let controller: PackingController;
  let mockPackingService: jest.Mocked<PackingService>;

  beforeEach(async () => {
    mockPackingService = {
      processPedidos: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackingController],
      providers: [
        {
          provide: PackingService,
          useValue: mockPackingService,
        },
      ],
    }).compile();

    controller = module.get<PackingController>(PackingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("processPedidos", () => {
    it("deve processar pedidos e retornar resposta do service", () => {
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

      const respostaEsperada = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: "Caixa 1",
                produtos: ["PRODUTO1"],
              },
            ],
          },
        ],
      };

      mockPackingService.processPedidos.mockReturnValue(respostaEsperada);

      const resultado = controller.processPedidos(pedidosRequest);

      expect(resultado).toEqual(respostaEsperada);
      expect(mockPackingService.processPedidos).toHaveBeenCalledWith(
        pedidosRequest
      );
      expect(mockPackingService.processPedidos).toHaveBeenCalledTimes(1);
    });

    it("deve repassar erros do service", () => {
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

      const erro = new Error("Erro no processamento");
      mockPackingService.processPedidos.mockImplementation(() => {
        throw erro;
      });

      expect(() => {
        controller.processPedidos(pedidosRequest);
      }).toThrow("Erro no processamento");
      expect(mockPackingService.processPedidos).toHaveBeenCalledWith(
        pedidosRequest
      );
    });

    it("deve funcionar com múltiplos pedidos", () => {
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

      const respostaEsperada = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: "Caixa 1",
                produtos: ["PRODUTO1"],
              },
            ],
          },
          {
            pedido_id: 2,
            caixas: [
              {
                caixa_id: "Caixa 1",
                produtos: ["PRODUTO2"],
              },
            ],
          },
        ],
      };

      mockPackingService.processPedidos.mockReturnValue(respostaEsperada);

      const resultado = controller.processPedidos(pedidosRequest);

      expect(resultado).toEqual(respostaEsperada);
      expect(mockPackingService.processPedidos).toHaveBeenCalledWith(
        pedidosRequest
      );
    });
  });
});
