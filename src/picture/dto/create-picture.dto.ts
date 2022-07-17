import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePictureDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  image_url: string;
}
