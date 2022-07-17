import { ApiProperty } from '@nestjs/swagger';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { TimesTampEntities } from 'src/commons/generics/timestamps';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Payment extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Column({ type: 'string' })
  order_id: string;

  @ApiProperty({
    type: Number,
  })
  @Column({})
  price: number;

  @ApiProperty({
    type: Number,
    default: 0,
  })
  @Column({ default: 0 })
  status: number;

  @ManyToOne(() => Order, (order) => order.payments, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: Order;
}
