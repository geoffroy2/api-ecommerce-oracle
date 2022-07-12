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

@Entity('colors')
export class Color extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    type: String,
  })
  @Column({
    unique: true,
  })
  title: string;

  //   @ManyToMany(() => Product)
  //   @JoinTable({
  //     name: 'colors_products',
  //     joinColumn: { name: 'color_id', referencedColumnName: 'id' },
  //     inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  //   })
  //   product: Product[];
}
