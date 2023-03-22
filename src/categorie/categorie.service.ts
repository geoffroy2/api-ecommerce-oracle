import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from '../commons/shared/helpers';
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

    const verifyName = this.verifyNameDoesNoExist(createCategorieDto.name);
    if (verifyName) {
      return await this.categorieRepository.save(newCategorie);
    }
    // try {
    //   return await this.categorieRepository.save(newCategorie);
    // } catch (error) {
    //   console.log(error);
    //   throw new ConflictException('Catégorie Already exists');
    // }
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

  async verifyNameDoesNoExist(name: string): Promise<boolean> {
    const categorie = await this.categorieRepository.findOne({
      where: { name: name },
    });
    if (categorie) {
      throw new ConflictException('Categorie does exist');
    }
    return true;
  }

  async update(
    id: string,
    updateCategorieDto: UpdateCategorieDto,
    storeId: string,
  ): Promise<Categorie> {
    const categorie = await this.findOne(id);
    if (storeId == categorie.store_id) {
      if (updateCategorieDto.image != '') {
        console.log('deleted categories');
        await Helper.deleteFile(categorie.image);
      }
      const data = Object.assign(categorie, updateCategorieDto);
      return await this.categorieRepository.save(data);
    } else {
      throw new ForbiddenException(
        'Vous etes pas autoriser à modifier cette catégorie',
      );
    }
  }

  async remove(id: string, storeId: string) {
    const categorie = await this.findOne(id);
    if (storeId == categorie.store_id) {
      await Helper.deleteFile(categorie.image);
      return await this.categorieRepository.remove(categorie);
    } else {
      throw new ForbiddenException(
        'Vous etes pas autoriser à supprimer cette catégorie',
      );
    }
  }

  async getCategorieByStore(store_id: string): Promise<Categorie[]> {
    return await this.categorieRepository.find({
      where: {
        store_id: store_id,
      },
    });
  }

  async getCategorieCurrentStore(store_id: string): Promise<Categorie[]> {
    return await this.categorieRepository.find({
      where: {
        store_id: store_id,
      },
    });
  }

  async getImage(name: string): Promise<Categorie> {
    return await this.categorieRepository.findOneBy({ image: name });
  }
}
