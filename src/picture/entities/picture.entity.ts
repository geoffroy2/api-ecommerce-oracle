import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pictures')
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column({ unique: true })
  title: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: String, nullable: true })
  image_url: string;

  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.pictures, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'product_id',
  })
  product: Product;
}
