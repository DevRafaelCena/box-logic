import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PedidoDto } from "./pedido.dto";

export class PedidosRequestDto {
  @ApiProperty({
    description: "Lista de pedidos para processamento",
    type: [PedidoDto],
    example: [
      {
        pedido_id: 1,
        produtos: [
          {
            produto_id: "PRODUTO1",
            dimensoes: {
              altura: 30,
              largura: 20,
              comprimento: 15,
            },
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  @IsNotEmpty()
  pedidos: PedidoDto[];
}
