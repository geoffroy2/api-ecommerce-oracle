import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorsService } from 'src/colors/colors.service';
import { Color } from 'src/colors/entities/color.entity';
import { Helper } from 'src/commons/shared/helpers';
import { Scent } from 'src/scent/entities/scent.entity';
import { ScentService } from 'src/scent/scent.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private colorService: ColorsService,
    private scentService: ScentService,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const unique_code = Math.random().toString(36).substring(8);
    const newStore = this.productRepository.create({
      code: unique_code,
      key: unique_code,
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
      status: createProductDto.status,
      quantity: createProductDto.quantity,
      image: createProductDto.image,
      image_url: createProductDto.image_url,
      category_id: createProductDto.category_id,
      colors: createProductDto.colors,
      scents: createProductDto.scents,
    });
    try {
      const product = await this.productRepository.save(newStore);
      return product;
    } catch (error) {
      console.log(error);
      throw new ConflictException('Product Already exists');
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: {
        colors: true,
      },
      where: {
        status: 1,
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      relations: {
        colors: true,
      },
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException('Product  not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (updateProductDto.image != '') {
      await Helper.deleteFile(product.image);
    }
    const data = Object.assign(product, updateProductDto);
    return await this.productRepository.save(data);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await Helper.deleteFile(product.image);
    return await this.productRepository.remove(product);
  }

  async deleteAll() {
    await this.productRepository.delete({
      status: 1,
    });

    return {
      message: 'Delete All',
    };
  }

  async getOneColor(id: string): Promise<Color> {
    return await this.colorService.findOne(id);
  }

  async getOneScent(id: string): Promise<Scent> {
    return await this.scentService.findOne(id);
  }

  async getImage(name: string): Promise<Product> {
    const product: Product = await this.productRepository.findOneBy({
      image: name,
    });
    if (!product) throw new NotFoundException('Product  not found');
    return product;
  }

  async getProductByCategorie(category_id: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        category_id: category_id,
      },
    });
  }
}
