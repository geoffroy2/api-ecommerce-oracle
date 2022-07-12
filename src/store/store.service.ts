import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from 'src/commons/shared/helpers';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const newStore = this.storeRepository.create({
      name: createStoreDto.name,
      city: createStoreDto.city,
      common: createStoreDto.common,
      status: createStoreDto.status,
      location: createStoreDto.location,
      telephone_number: createStoreDto.telephone_number,
      image: createStoreDto.image,
      image_url: createStoreDto.image_url,
    });
    try {
      return await this.storeRepository.save(newStore);
    } catch (error) {
      throw new ConflictException('Store Already exists');
    }
  }

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find();
  }

  async findOne(id: string): Promise<Store> {
    const categorie = await this.storeRepository.findOne({
      where: { id: id },
    });
    if (!categorie) {
      throw new NotFoundException('Store  not found');
    }
    return categorie;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    if (updateStoreDto.image != '') {
      await Helper.deleteFile(store.image);
    }
    const data = Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(data);
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    await Helper.deleteFile(store.image);
    return await this.storeRepository.remove(store);
  }

  async getImage(name: string): Promise<Store> {
    return await this.storeRepository.findOneBy({ image: name });
  }

  async deleteAll() {
    return await this.storeRepository.delete({});
  }
}
