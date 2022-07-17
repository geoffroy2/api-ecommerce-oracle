import { ApiProperty } from '@nestjs/swagger';
import { TimesTampEntities } from 'src/commons/generics/timestamps';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Scent extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column({ unique: true })
  title: string;

  @ApiProperty({
    type: Number,
    default: 1,
  })
  @Column({ default: 1 })
  status: number;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'scent_products',
    joinColumn: { name: 'scent_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
