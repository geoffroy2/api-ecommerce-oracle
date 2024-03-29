import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScentService } from './scent.service';
import { CreateScentDto } from './dto/create-scent.dto';
import { UpdateScentDto } from './dto/update-scent.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Scent } from './entities/scent.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentStore } from 'src/shared/auth/decorators/current-store.decorators';
import { Store } from 'src/store/entities/store.entity';

@ApiTags('/scent')
@Controller('scent')
export class ScentController {
  constructor(private readonly scentService: ScentService) {}

  @ApiCreatedResponse({ type: Scent })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Scent Color' })
  @ApiOkResponse({ type: Scent, description: 'Color Scent' })
  @ApiBadRequestResponse()
  @Post()
  create(@Body() createScentDto: CreateScentDto) {
    return this.scentService.create(createScentDto);
  }

  @ApiOkResponse({ type: Scent, isArray: true })
  @Get()
  findAll() {
    return this.scentService.findAll();
  }

  @ApiOkResponse({ type: Scent, description: 'color found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scentService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: Scent, description: 'Scent updated' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScentDto: UpdateScentDto,
    @CurrentStore() store,
  ) {
    const storeId = store.userId;
    return this.scentService.update(id, updateScentDto, storeId);
  }

  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Remove Scent' })
  @ApiResponse({ status: 204, description: 'Scent remove' })
  @ApiResponse({
    status: 404,
    description: 'Scent not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentStore() store) {
    const storeId = store.userId;
    return this.scentService.remove(id, storeId);
  }
}
