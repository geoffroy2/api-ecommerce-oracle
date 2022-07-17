import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './entities/picture.entity';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(Picture)
    private pictureRepositoy: Repository<Picture>,
  ) {}
  async create(
    title: string,
    image_url: string,
    product_id: string,
  ): Promise<Picture> {
    const newPicture = this.pictureRepositoy.create({
      title: title,
      image_url: image_url,
      product_id: product_id,
    });
    return await this.pictureRepositoy.save(newPicture);
  }

  async findAll(): Promise<Picture[]> {
    return await this.pictureRepositoy.find();
  }

  async findOne(id: string): Promise<Picture> {
    return await this.pictureRepositoy.findOneBy({ id: id });
  }

  update(id: string, updatePictureDto: UpdatePictureDto) {
    return `This action updates a #${id} picture`;
  }

  remove(id: string) {
    return `This action removes a #${id} picture`;
  }

  async removeAll() {
    await this.pictureRepositoy.delete({});
    return {
      message: 'deleted all picture',
    };
  }
}
