import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './entities/picture.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/picture')
@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post()
  async create(@Body() body: any): Promise<Picture> {
    const title = body.title;
    const product_id = body.product_id;
    const image_url = body.image_url;
    return this.pictureService.create(title, image_url, product_id);
  }

  @Get()
  findAll() {
    return this.pictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pictureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.pictureService.update(id, updatePictureDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pictureService.remove(id);
  // }

  @Delete('delete-all')
  async removeAll() {
    return await this.pictureService.removeAll();
  }
}
