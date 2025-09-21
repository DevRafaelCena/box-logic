import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class DimensoesDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  altura: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  largura: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  comprimento: number;
}
