import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { DimensoesDto } from "./dimensoes.dto";

export class ProdutoDto {
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @ValidateNested()
  @Type(() => DimensoesDto)
  @IsNotEmpty()
  dimensoes: DimensoesDto;
}
