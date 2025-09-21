import { ApiProperty } from "@nestjs/swagger";

export class CaixaResponseDto {
  @ApiProperty({
    description: "ID da caixa selecionada ou null se produto não couber",
    example: "Caixa 1",
    nullable: true,
  })
  caixa_id: string | null;

  @ApiProperty({
    description: "Lista de IDs dos produtos alocados nesta caixa",
    type: [String],
    example: ["PRODUTO1", "PRODUTO2"],
  })
  produtos: string[];

  @ApiProperty({
    description: "Observação quando há problemas no empacotamento",
    example: "Produto não cabe em nenhuma caixa disponível.",
    required: false,
  })
  observacao?: string;
}

export class PedidoResponseDto {
  @ApiProperty({
    description: "ID do pedido processado",
    example: 1,
  })
  pedido_id: number;

  @ApiProperty({
    description: "Lista de caixas otimizadas para este pedido",
    type: [CaixaResponseDto],
  })
  caixas: CaixaResponseDto[];
}

export class PedidosResponseDto {
  @ApiProperty({
    description:
      "Lista de pedidos processados com suas respectivas otimizações",
    type: [PedidoResponseDto],
  })
  pedidos: PedidoResponseDto[];
}
