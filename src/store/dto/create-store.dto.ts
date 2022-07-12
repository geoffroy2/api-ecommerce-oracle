import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  common: string;

  @IsOptional()
  image: string;

  @IsOptional()
  telephone_number: string;

  @IsOptional()
  status: number;

  @IsOptional()
  image_url: string;
}
