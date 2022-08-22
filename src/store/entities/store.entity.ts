import { ApiProperty } from '@nestjs/swagger';
import { Categorie } from 'src/categorie/entities/categorie.entity';
import { TimesTampEntities } from 'src/commons/generics/timestamps';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Store extends TimesTampEntities {
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

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({
    length: 80,
    nullable: true,
  })
  location: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    length: 30,
    nullable: true,
  })
  city: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({
    length: 30,
    nullable: true,
  })
  common: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Column({
    length: 30,
    nullable: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Column({
    length: 200,
    nullable: true,
  })
  password: string;

  @ApiProperty({
    type: Number,
    default: 1,
  })
  @Column({
    default: 1,
  })
  status: number;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({ nullable: true })
  image_url: string;

  @ApiProperty({
    type: String,
  })
  @Column({})
  telephone_number: string;

  @OneToMany(() => Categorie, (categorie) => categorie.store, {
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'id',
  })
  categories: Categorie[];
}
