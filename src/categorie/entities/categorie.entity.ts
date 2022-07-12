import { TimesTampEntities } from 'src/commons/generics/timestamps';
import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Categorie extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    type: String,
  })
  @Column({
    length: 30,
    unique: true,
  })
  name: string;
  @ApiProperty({ type: String })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true })
  image_url: string;

  @ApiProperty({ type: Number, default: 1 })
  @Column({ default: 1 })
  status: number;

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true })
  store_id: string;

  @OneToMany(() => Product, (product) => product.categorie)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'id',
  })
  products: Product[];

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
}
