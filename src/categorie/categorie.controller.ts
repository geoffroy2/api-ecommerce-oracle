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
import { FileInterceptor } from '@nestjs/platform-express';
import { Helper } from 'src/commons/shared/helpers';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { diskStorage } from 'multer';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Categorie } from './entities/categorie.entity';
import { Request } from 'express';

@ApiTags('/categories')
@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @ApiCreatedResponse({ type: Categorie })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        status: { type: 'integer', default: 1 },
        store_id: { type: 'string' },
        // outletId: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Categorie' })
  @ApiOkResponse({ type: Categorie, description: 'Categorie Create' })
  @ApiBadRequestResponse()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  @Post()
  create(
    @Body() createCategorieDto: CreateCategorieDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log(file);
    console.log(createCategorieDto);
    createCategorieDto.image = file.filename;
    createCategorieDto.image_url = `${req.protocol}://${req.get(
      'Host',
    )}/categorie/${file.path}`;
    return this.categorieService.create(createCategorieDto);
  }

  @ApiOkResponse({ type: Categorie, isArray: true })
  @ApiOperation({ summary: 'Get All Categorie' })
  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Categorie, description: 'categorie found' })
  @ApiOperation({ summary: 'Get find Categorie' })
  // @ApiQuery({ name: 'id', required: true, type: 'string' })
  findOne(@Param('id') id: string) {
    console.log('identifiant', id);
    return this.categorieService.findOne(id);
  }

  @Get('images/:image')
  async getImage(@Param('image') image: string, @Res() res) {
    console.log(this.categorieService.getImage(image));
    const categorie: Categorie = await this.categorieService.getImage(image);
    return res.sendFile(categorie.image, { root: './images' });
  }

  @Get('store/:id')
  @ApiOkResponse({
    type: Categorie,
    isArray: true,
    description: 'categorie found',
  })
  @ApiOperation({ summary: 'Get find Categorie by Store' })
  categoryByStore(@Param('id') id: string) {
    return this.categorieService.getCategorieByStore(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        status: { type: 'integer', default: 1 },
        store_id: { type: 'string' },
        // outletId: { type: 'integer' },
        image: {
          type: 'string',
          nullable: true,
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: Categorie, description: 'categorie updated' })
  @ApiOperation({ summary: 'Updated Categorie' })
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
    @Body() updateCategorieDto: UpdateCategorieDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (file) {
      if (file.filename != '') {
        updateCategorieDto.image = file.filename;
        updateCategorieDto.image_url = `${req.protocol}://${req.get(
          'Host',
        )}/categorie/${file.path}`;
      }
    }
    return this.categorieService.update(id, updateCategorieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Categorie' })
  @ApiResponse({ status: 204, description: 'Categorie remove' })
  @ApiResponse({
    status: 404,
    description: 'Categorie not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorieService.remove(id);
  }
}
