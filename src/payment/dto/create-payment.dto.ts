import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
