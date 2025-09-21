import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { PackingService } from "../services/packing.service";
import { PedidosRequestDto } from "../dtos/pedidos-request.dto";
import { PedidosResponse } from "../types/types";

/**
 * Controller para processamento de embalagem
 * Requer autenticação via API Key no header X-API-Key ou Authorization
 */
@Controller("api/embalagem")
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  /**
   * Processa pedidos e otimiza a distribuição em caixas
   *
   * @param pedidosRequest - Lista de pedidos com produtos e dimensões
   * @returns Resposta com caixas otimizadas para cada pedido
   *
   * Requer header: X-API-Key ou Authorization com uma API Key válida
   */
  @Post("processar")
  processPedidos(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    pedidosRequest: PedidosRequestDto
  ): PedidosResponse {
    return this.packingService.processPedidos(pedidosRequest);
  }
}
