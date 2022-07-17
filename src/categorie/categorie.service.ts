import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from 'src/commons/shared/helpers';
import { Repository } from 'typeorm';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { Categorie } from './entities/categorie.entity';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
  ) {}
  async create(createCategorieDto: CreateCategorieDto): Promise<Categorie> {
    const newCategorie = this.categorieRepository.create({
      name: createCategorieDto.name,
      image: createCategorieDto.image,
      status: createCategorieDto.status,
      store_id: createCategorieDto.store_id,
      image_url: createCategorieDto.image_url,
    });
    try {
      return await this.categorieRepository.save(newCategorie);
    } catch (error) {
      console.log(error);
      throw new ConflictException('Catégorie Already exists');
    }
  }

  async findAll(): Promise<Categorie[]> {
    return await this.categorieRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: string): Promise<Categorie> {
    const categorie = await this.categorieRepository.findOne({
      where: { id: id },
    });
    if (!categorie) {
      throw new NotFoundException('Categorie  not found');
    }
    return categorie;
  }

  async update(
    id: string,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<Categorie> {
    const categorie = await this.findOne(id);
    if (updateCategorieDto.image != '') {
      console.log('deleted categories');
      await Helper.deleteFile(categorie.image);
    }
    const data = Object.assign(categorie, updateCategorieDto);
    return await this.categorieRepository.save(data);
  }

  async remove(id: string) {
    const categorie = await this.findOne(id);
    await Helper.deleteFile(categorie.image);
    return await this.categorieRepository.remove(categorie);
  }

  async getImage(name: string): Promise<Categorie> {
    return await this.categorieRepository.findOneBy({ image: name });
  }
}
