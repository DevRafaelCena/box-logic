import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { ProdutoDto } from "./produto.dto";

export class PedidoDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pedido_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  @IsNotEmpty()
  produtos: ProdutoDto[];
}
