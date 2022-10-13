import { ApiProperty } from '@nestjs/swagger';
import { Store } from 'src/store/entities/store.entity';
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

  @Column({ nullable: true })
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

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
  })
  category_id: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    nullable: true,
  })
  store_id: string;

  @ManyToOne(() => Store, (store) => store.id, {
    createForeignKeyConstraints: false,
    // eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'store_id',
    referencedColumnName: 'id',
  })
  store: Store;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
