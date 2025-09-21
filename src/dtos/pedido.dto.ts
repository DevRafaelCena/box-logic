import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProdutoDto } from "./produto.dto";

export class PedidoDto {
  @ApiProperty({
    description: "Identificador único do pedido",
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pedido_id: number;

  @ApiProperty({
    description: "Lista de produtos do pedido",
    type: [ProdutoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  @IsNotEmpty()
  produtos: ProdutoDto[];
}
