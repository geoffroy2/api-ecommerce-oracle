import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TimesTampEntities } from 'src/commons/generics/timestamps';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order_items';

@Entity('orders', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Order extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    unique: true,
  })
  code: string;

  @ApiProperty({
    type: String,
  })
  @Column()
  user_number: string;

  @ApiProperty({
    type: Number,
  })
  @Column({
    nullable: true,
  })
  total_order: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    default: 0,
  })
  status: number;

  @ApiProperty({
    type: Number,
  })
  @Column({ default: 0 })
  statut: number;

  //   @ManyToOne(() => Link, (link) => link.orders, {
  //     createForeignKeyConstraints: false,
  //   })
  //   @JoinColumn({
  //     referencedColumnName: 'code',
  //     name: 'code',
  //   })
  //   link: Link;

  //   @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  //   order_items: OrderItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  order_items: OrderItem[];

  @OneToMany(() => Payment, (payemnt) => payemnt.order, { eager: true })
  payments: Payment[];

  @Expose()
  get total(): number {
    if (this.order_items) {
      if (this.order_items.length > 0) {
        return this.order_items.reduce((s, i) => s + i.total, 0);
      }
    }
    return 0;
  }

  @Expose()
  set valueTotal(total: number) {
    this.total_order = total;
  }
}
