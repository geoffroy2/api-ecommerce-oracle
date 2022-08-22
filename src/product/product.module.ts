import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieModule } from 'src/categorie/categorie.module';
import { CategorieService } from 'src/categorie/categorie.service';
import { StoreModule } from 'src/store/store.module';
import { PictureModule } from 'src/picture/picture.module';
import { ColorsModule } from 'src/colors/colors.module';
import { ScentModule } from 'src/scent/scent.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CategorieModule,
    StoreModule,
    PictureModule,
    ColorsModule,
    ScentModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
