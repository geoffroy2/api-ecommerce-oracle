import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  status: number;
}
