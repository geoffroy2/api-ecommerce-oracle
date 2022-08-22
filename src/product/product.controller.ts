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
  UploadedFiles,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Helper } from 'src/commons/shared/helpers';
import { diskStorage } from 'multer';
import { CategorieService } from 'src/categorie/categorie.service';
import { StoreService } from 'src/store/store.service';
import { PictureService } from 'src/picture/picture.service';
import { Color } from 'src/colors/entities/color.entity';
import { ColorsService } from 'src/colors/colors.service';
import { ScentService } from 'src/scent/scent.service';
import { Scent } from 'src/scent/entities/scent.entity';
import { Request } from 'express';
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
import { Product } from './entities/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentStore } from 'src/shared/auth/decorators/current-store.decorators';

@ApiTags('/product')
@Controller('product')
export class ProductController {
  private colors: Color[] = [];
  private scents: Scent[] = [];
  constructor(
    private readonly productService: ProductService,
    private categorieService: CategorieService,
    private pictureService: PictureService,
    private colorsService: ColorsService,
    private scentService: ScentService,
  ) {}

  @ApiCreatedResponse({ type: Product })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        scents_id: { type: 'string' },
        color_id: { type: 'string' },
        category_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        image_url: { type: 'string' },
        price: { type: 'integer' },
        status: { type: 'integer' },
        quantity: { type: 'integer' },
        // outletId: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
        pictures: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create Product' })
  @ApiOkResponse({ type: Product, description: 'Product Create' })
  @ApiBadRequestResponse()
  @Post()
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: Helper.destinationPath,
  //       filename: Helper.customFileName,
  //     }),
  //   }),
  // )
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pictures', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: Helper.destinationPath,
          filename: Helper.customFileName,
        }),
      },
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    // @UploadedFile() file: Express.Multer.File,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    // const categorie = await this.categorieService.findOne(
    //   createProductDto.category_id,
    // );

    //Find COLOR
    const colorsArray = createProductDto.colors_id;
    if (colorsArray != undefined) {
      for (let index = 0; index < colorsArray.length; index++) {
        const color_id = colorsArray[index];
        const color = await this.colorsService.findOne(color_id);
        this.colors.push(color);
      }
      createProductDto.colors = this.colors;
    }

    //Find Scent
    const scentsArray = createProductDto.scents_id;
    console.log('-----');
    console.log(scentsArray);
    if (scentsArray != undefined) {
      for (let index = 0; index < scentsArray.length; index++) {
        const scent_id = scentsArray[index];
        const scent = await this.scentService.findOne(scent_id);
        this.scents.push(scent);
      }
      createProductDto.scents = this.scents;
    }

    //Insert product
    // createProductDto.categorie = categorie;
    if (files.image.length != 0) {
      createProductDto.image = files.image[0].filename;
      createProductDto.image_url = `${req.protocol}://${req.get(
        'Host',
      )}/product/${files.image[0].path}`;
    }

    const product = await this.productService.create(createProductDto);

    // insert picture
    for (let index = 0; index < files.pictures.length; index++) {
      const filename = files.pictures[index].filename;
      const image_url = `${req.protocol}://${req.get('Host')}/product/${
        files.pictures[index].path
      }`;
      await this.pictureService.create(filename, image_url, product.id);
    }

    return product;
  }

  @ApiOkResponse({ type: Product, isArray: true })
  @ApiOperation({ summary: 'Get All Product' })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: Product, isArray: true })
  @ApiOperation({ summary: 'Get All Product by current Store' })
  @Get('current-store-product')
  findProductByCurrentStore(@CurrentStore() store) {
    const storeId = store.userId;
    return this.productService.findProductByCurrentStore(storeId);
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Deleted All Categorie' })
  @Get('deleteAll')
  deleteAll() {
    return this.productService.deleteAll();
  }

  @ApiOkResponse({ type: Product })
  @ApiOperation({ summary: 'Get one Product' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('images/:image')
  async getImage(@Param('image') image: string, @Res() res) {
    console.log(this.productService.getImage(image));
    console.log('test');
    const product: Product = await this.productService.getImage(image);

    return res.sendFile(product.image, { root: './images' });
  }

  @ApiOkResponse({ type: Product })
  @ApiOperation({ summary: 'Get  product by categorie' })
  @Get('categorie/:id')
  productByCtagorie(@Param('id') id: string) {
    return this.productService.getProductByCategorie(id);
  }

  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ type: Product })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        scents_id: { type: 'string' },
        color_id: { type: 'string' },
        category_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        image_url: { type: 'string' },
        price: { type: 'integer' },
        status: { type: 'integer' },
        quantity: { type: 'integer' },
        // outletId: { type: 'integer' },
        image: {
          type: 'string',
          format: 'binary',
        },
        pictures: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Updated Product' })
  @ApiOkResponse({ type: Product, description: 'Product Updated' })
  @ApiBadRequestResponse()
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pictures', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: Helper.destinationPath,
          filename: Helper.customFileName,
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
    },
    @Req() req: Request,
    @CurrentStore() store,
  ) {
    if (files) {
      if (files.image[0].filename != '') {
        updateProductDto.image = files.image[0].filename;
        updateProductDto.image_url = `${req.protocol}://${req.get(
          'Host',
        )}/product/${files.image[0].path}`;
      }
    }
    //Find COLOR
    console.log('---------------------');
    console.log(updateProductDto.colors_id);
    if (updateProductDto.colors_id != undefined) {
      const colorsArray = updateProductDto.colors_id;
      for (let index = 0; index < colorsArray.length; index++) {
        const color_id = colorsArray[index];
        const color = await this.colorsService.findOne(color_id);
        this.colors.push(color);
      }
      updateProductDto.colors = this.colors;
    }

    //Find Scent
    const scentsArray = updateProductDto.scents_id;
    console.log('-----');
    console.log(scentsArray);
    if (scentsArray != undefined) {
      for (let index = 0; index < scentsArray.length; index++) {
        const scent_id = scentsArray[index];
        const scent = await this.scentService.findOne(scent_id);
        this.scents.push(scent);
      }
      updateProductDto.scents = this.scents;
    }
    const storeId = store.userId;
    return this.productService.update(id, updateProductDto, storeId);
  }

  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Remove Product' })
  @ApiResponse({ status: 204, description: 'Product remove' })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentStore() store) {
    const storeId = store.userId;
    return this.productService.remove(id, storeId);
  }
}
