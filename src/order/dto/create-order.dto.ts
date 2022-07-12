import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  user_number: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  statut: number;

  @IsNotEmpty()
  @IsArray()
  products: {
    product_id: string;
    quantity: number;
    color_id: string;
    scent_id: string;
  }[];
}
