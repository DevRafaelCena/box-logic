import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DimensoesDto } from "./dimensoes.dto";

export class ProdutoDto {
  @ApiProperty({
    description: "Identificador único do produto",
    example: "PRODUTO1",
  })
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @ApiProperty({
    description: "Dimensões do produto",
    type: DimensoesDto,
  })
  @ValidateNested()
  @Type(() => DimensoesDto)
  @IsNotEmpty()
  dimensoes: DimensoesDto;
}
