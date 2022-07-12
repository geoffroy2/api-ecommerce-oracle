import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>,
  ) {}
  async create(createColorDto: CreateColorDto): Promise<Color> {
    try {
      const newColor = this.colorRepository.create({ ...createColorDto });
      return await this.colorRepository.save(newColor);
    } catch (error) {
      throw new ConflictException('Color already exist');
    }
  }

  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOne(id: string): Promise<Color> {
    const color = await this.colorRepository.findOneBy({ id: id });
    if (!color) {
      throw new NotFoundException('Color doesnt existe');
    }
    return color;
  }

  async update(id: string, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = this.findOne(id);
    const data = Object.assign(color, updateColorDto);
    return await this.colorRepository.save(data);
  }

  async remove(id: string) {
    const color = this.findOne(id);
    return await this.colorRepository.delete(id);
  }
}
