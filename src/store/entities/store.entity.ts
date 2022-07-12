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
  @Column({
    length: 30,
    unique: true,
  })
  name: string;
  @Column({
    length: 80,
    nullable: true,
  })
  location: string;
  @Column({
    length: 30,
  })
  city: string;
  @Column({
    length: 30,
    nullable: true,
  })
  common: string;
  @Column({
    default: 1,
  })
  status: number;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  image_url: string;
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
