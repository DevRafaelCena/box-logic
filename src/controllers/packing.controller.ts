import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { PackingService } from "../services/packing.service";
import { PedidosRequestDto } from "../dtos/pedidos-request.dto";
import { PedidosResponseDto } from "../dtos/pedidos-response.dto";
import { PedidosResponse } from "../types/types";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";

@ApiTags("embalagem")
@ApiSecurity("X-API-Key")
@ApiSecurity("Bearer")
@Controller("api/embalagem")
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post("processar")
  @ApiOperation({
    summary: "Processar pedidos para otimização de embalagem",
    description:
      "Recebe uma lista de pedidos com produtos e suas dimensões, retornando a otimização de caixas para cada pedido usando algoritmos de empacotamento inteligente.",
  })
  @ApiResponse({
    status: 200,
    description: "Pedidos processados com sucesso",
    type: PedidosResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Dados de entrada inválidos",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          type: "array",
          items: { type: "string" },
          example: [
            "pedido_id must be a positive number",
            "dimensoes.altura must be a positive number",
          ],
        },
        error: { type: "string", example: "Bad Request" },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "API Key inválida ou ausente",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Token de acesso inválido" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Erro interno do servidor",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 500 },
        message: {
          type: "string",
          example: "Lista de pedidos não pode estar vazia",
        },
        error: { type: "string", example: "Internal Server Error" },
      },
    },
  })
  processPedidos(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    pedidosRequest: PedidosRequestDto
  ): PedidosResponse {
    return this.packingService.processPedidos(pedidosRequest);
  }
}
