import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_items';
import { ScentModule } from 'src/scent/scent.module';
import { ColorsModule } from 'src/colors/colors.module';
import { ProductModule } from 'src/product/product.module';
import { PassportModule } from '@nestjs/passport';
import { CategorieModule } from 'src/categorie/categorie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule,
    CategorieModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
