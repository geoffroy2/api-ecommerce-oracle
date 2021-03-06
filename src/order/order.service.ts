import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Color } from 'src/colors/entities/color.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Scent } from 'src/scent/entities/scent.entity';

import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_items';

@Injectable()
export class OrderService {
  color: Color;
  scent: Scent;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = this.orderRepository.create({
      code: Math.random().toString(36).substring(10),
      // total_order: createOrderDto.total_order,
      status: createOrderDto.status,
      statut: createOrderDto.statut,
      user_number: createOrderDto.user_number,
    });
    try {
      const order = await this.orderRepository.save(newOrder);
      for (const p of createOrderDto.products) {
        const product: Product = await this.productService.findOne(
          p.product_id,
        );

        if (p.scent_id != undefined || p.scent_id != '') {
          this.scent = await this.productService.getOneScent(p.scent_id);
        }

        if (p.color_id != undefined || p.color_id != '') {
          this.color = await this.productService.getOneColor(p.color_id);
        }

        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.product_code = product.code;
        orderItem.categorie = product.categorie.name;
        orderItem.color = this.color ? this.color.title : '';
        orderItem.scent = this.scent ? this.scent.title : '';
        orderItem.product_title = product.title;
        orderItem.price = product.price;
        orderItem.product_title = product.title;
        orderItem.quantity = p.quantity;
        orderItem.total = p.quantity * product.price;
        this.orderItemRepository.save(orderItem);
      }
      return order;
    } catch (error) {
      console.log(error);
      throw new ConflictException('Order Already exists');
    }
  }

  async findAll(): Promise<any> {
    const orders = await this.orderRepository.find({
      where: {
        // is_active: true,
      },
    });

    return orders.map(function (order: Order) {
      order.valueTotal = order.total;
      return order;
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException('Order  not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const data = Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(data);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    return await this.orderRepository.remove(order);
  }

  async changeStatus(id: string, statut: number) {
    try {
      return await this.orderRepository.update({ id: id }, { statut: statut });
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
