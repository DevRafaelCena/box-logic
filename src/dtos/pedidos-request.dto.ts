import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { PedidoDto } from "./pedido.dto";

export class PedidosRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  @IsNotEmpty()
  pedidos: PedidoDto[];
}
