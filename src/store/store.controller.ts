import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/commons/shared/helpers';
import { Request } from 'express';
import { Store } from './entities/store.entity';
import { join } from 'path';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('/store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiCreatedResponse({ type: Store })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        city: { type: 'string' },
        common: { type: 'string' },
        status: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Store' })
  @ApiOkResponse({ type: Store, description: 'Product Store' })
  @ApiBadRequestResponse()
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    createStoreDto.image = file.filename;
    createStoreDto.image_url = `${req.protocol}://${req.get('Host')}/store/${
      file.path
    }`;

    return this.storeService.create(createStoreDto);
  }

  @ApiOkResponse({ type: Store, isArray: true })
  @ApiOperation({ summary: 'Get All Store' })
  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Deleted All Store' })
  @Get('deleteall')
  deleteAll() {
    return this.storeService.deleteAll();
  }

  @Get('images/:image')
  async getImage(@Param('image') image: string, @Res() res) {
    console.log(this.storeService.getImage(image));
    const store: Store = await this.storeService.getImage(image);
    return res.sendFile(store.image, { root: './images' });
  }

  @ApiOkResponse({ type: Store })
  @ApiOperation({ summary: 'Get one Store' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @ApiCreatedResponse({ type: Store })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        city: { type: 'string' },
        common: { type: 'string' },
        status: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Store' })
  @ApiOkResponse({ type: Store, description: 'Product Store' })
  @ApiBadRequestResponse()
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      if (file.filename != '') {
        console.log(file.filename);
        updateStoreDto.image = file.filename;
      }
    }
    return this.storeService.update(id, updateStoreDto);
  }

  @ApiOperation({ summary: 'Remove Store' })
  @ApiResponse({ status: 204, description: 'Store remove' })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
