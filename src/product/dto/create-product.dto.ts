import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { Color } from 'src/colors/entities/color.entity';
import { Scent } from 'src/scent/entities/scent.entity';
import { Store } from 'src/store/entities/store.entity';
import { Product } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  image: string;

  @IsOptional()
  status: number;

  @IsNotEmpty()
  categorie: Categorie;

  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  store: Store;

  @IsNotEmpty()
  store_id: string;

  @IsOptional()
  colors_id: [];

  @IsOptional()
  colors: Color[];

  @IsOptional()
  scents_id: [];

  @IsOptional()
  scents: Scent[];

  @IsOptional()
  image_url: string;
}
