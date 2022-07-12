import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategorieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  image: string;

  @IsOptional()
  status: number;

  @IsNotEmpty()
  @IsString()
  store_id: string;

  @IsOptional()
  image_url: string;
}
