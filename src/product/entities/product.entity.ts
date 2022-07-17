import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { Color } from 'src/colors/entities/color.entity';
import { TimesTampEntities } from 'src/commons/generics/timestamps';
import { Picture } from 'src/picture/entities/picture.entity';
import { Scent } from 'src/scent/entities/scent.entity';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Product extends TimesTampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    type: String,
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    type: String,
  })
  @Column()
  title: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: true })
  image_url: string;

  @ApiProperty({
    type: Number,
  })
  @Column({})
  price: number;

  @ApiProperty({
    type: Number,
    default: 1,
  })
  @Column({
    default: 1,
  })
  status: number;

  @ApiProperty({
    type: Number,
    default: 0,
  })
  @Column({ default: 0 })
  quantity: number;

  @OneToMany(() => Picture, (picture) => picture.product)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'id',
  })
  pictures: Picture[];

  @Column({ nullable: true })
  category_id: string;

  @ManyToOne(() => Categorie, (categorie) => categorie.products, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  categorie: Categorie;

  @ManyToMany(() => Color)
  @JoinTable({
    name: 'color_products',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' },
  })
  colors: Color[];

  @ManyToMany(() => Scent, { eager: true })
  @JoinTable({
    name: 'scent_products',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'scent_id', referencedColumnName: 'id' },
  })
  scents: Scent[];
}
