import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from 'src/commons/shared/helpers';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

// import * as bcrypt from 'bcryptjs';

import bcrypt = require('bcryptjs');

import { JwtService } from '@nestjs/jwt';
import JwtUtils from 'src/shared/utils/jwt.utils';
import { LoginStoreDto } from './dto/login-store.dto';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}
  async create(createStoreDto: CreateStoreDto): Promise<any> {
    await this.findOneByEmailOrPassword(
      createStoreDto.email,
      createStoreDto.telephone_number,
    );
    createStoreDto.password = await bcrypt.hash(createStoreDto.password, 10);
    console.log(createStoreDto.password);
    const newStore = this.storeRepository.create({
      name: createStoreDto.name,
      city: createStoreDto.city,
      email: createStoreDto.email,
      common: createStoreDto.common,
      status: createStoreDto.status,
      location: createStoreDto.location,
      telephone_number: createStoreDto.telephone_number,
      image: createStoreDto.image,
      image_url: createStoreDto.image_url,
      password: createStoreDto.password,
    });
    try {
      const store = await this.storeRepository.save(newStore);
      const token = await JwtUtils.assignJwtToken(store.id, this.jwtService);
      return { store, token };
    } catch (error) {
      throw new ConflictException(error);
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

  async findOneByEmailOrPassword(
    email: string,
    telephone_number: string,
  ): Promise<true> {
    const store = await this.storeRepository.find({
      where: [{ email }, { telephone_number }],
    });
    console.log('store', store);
    if (store && Array.isArray(store) && store.length > 0) {
      throw new ConflictException('Email Or Number  Exist already');
    }
    return true;
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

  async login(loginStoreDto: LoginStoreDto): Promise<{ token: string }> {
    const { email, password } = loginStoreDto;
    const foundStore = await this.storeRepository.findOne({ where: { email } });
    if (!foundStore) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foundStore.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await JwtUtils.assignJwtToken(foundStore.id, this.jwtService);

    return { token };
  }
}
