import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_code: string;
  @Column()
  product_title: string;

  @Column({})
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  scent: string;

  @Column()
  categorie: string;

  @Column()
  total: number;

  @Column({ default: null })
  last_name: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  zip: string;

  @Column({
    default: false,
  })
  complete: boolean;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
