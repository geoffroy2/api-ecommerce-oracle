import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './entities/order.entity';
import { LinkModule } from 'src/link/link.module';
import { OrderItem } from './entities/order_items';
import { ScentModule } from 'src/scent/scent.module';
import { ColorsModule } from 'src/colors/colors.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
