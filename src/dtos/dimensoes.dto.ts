import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DimensoesDto {
  @ApiProperty({
    description: "Altura do produto em centímetros",
    example: 30,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  altura: number;

  @ApiProperty({
    description: "Largura do produto em centímetros",
    example: 20,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  largura: number;

  @ApiProperty({
    description: "Comprimento do produto em centímetros",
    example: 15,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  comprimento: number;
}
