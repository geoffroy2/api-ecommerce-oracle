import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import { Scent } from './entities/scent.entity';

@Injectable()
export class ScentService {
  constructor(
    @InjectRepository(Scent)
    private scentRepository: Repository<Scent>,
  ) {}
  async create(createScentDto: CreateScentDto): Promise<Scent> {
    const newScent = this.scentRepository.create({ ...createScentDto });
    try {
      return await this.scentRepository.save(newScent);
    } catch (error) {
      throw new ConflictException('Scent already exist');
    }
  }

  async findAll(): Promise<Scent[]> {
    return await this.scentRepository.find();
  }

  async findOne(id: string): Promise<Scent> {
    const scent = await this.scentRepository.findOneBy({ id: id });
    if (!scent) {
      throw new NotFoundException('Scent doesnt exist');
    }
    return scent;
  }

  async update(id: string, updateScentDto: UpdateScentDto) {
    const scent = await this.findOne(id);
    const status = updateScentDto.status;
    const title = updateScentDto.title;
    return await this.scentRepository.update(
      { id: id },
      { status: status, title: title },
    );
  }

  async remove(id: string) {
    const scent = await this.findOne(id);
    await this.scentRepository.remove(scent);
    return {
      message: 'Scent deleted',
    };
  }
}
