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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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
import { Order } from './entities/order.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentStore } from 'src/shared/auth/decorators/current-store.decorators';

@ApiTags('/order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse({ type: Order })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        user_number: { type: 'string' },
        total_order: { type: 'number' },
        status: { type: 'number' },
        statut: { type: 'number' },
      },
    },
  })
  @ApiOperation({ summary: 'Create Order' })
  @ApiOkResponse({ type: Order, description: 'Order Create' })
  @ApiBadRequestResponse()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.latitude = Number(createOrderDto.latitude);
    createOrderDto.longitude = Number(createOrderDto.longitude);
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get All Order' })
  @ApiOkResponse({ type: Order, isArray: true })
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOkResponse()
  @ApiOperation({ summary: 'Deleted All Order' })
  @Get('deleteall')
  deleteAll() {
    return this.orderService.deleteAll();
  }

  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get All Order' })
  @ApiOkResponse({ type: Order, isArray: true })
  @Get('current-store-order')
  findCurrentStoreOrder(@CurrentStore() store) {
    return this.orderService.findCurrentStoreOrder(store.userId);
  }
  @ApiOperation({ summary: 'Get find Order' })
  @Get(':id')
  @ApiOkResponse({ type: Order, description: 'order found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ type: Order })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        user_number: { type: 'string' },
        total_order: { type: 'number' },
        status: { type: 'number' },
        statut: { type: 'number' },
      },
    },
  })
  @ApiOperation({ summary: 'Update Order' })
  @ApiOkResponse({ type: Order, description: 'Order Update' })
  @ApiBadRequestResponse()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentStore() store,
  ) {
    return this.orderService.update(id, updateOrderDto, store.userId);
  }

  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ type: Order })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        statut: { type: 'number' },
      },
    },
  })
  @ApiOperation({ summary: 'Update statut Order' })
  @ApiOkResponse({ type: Order, description: 'Order Update statut' })
  @ApiBadRequestResponse()
  @Patch('change_status/:id')
  changeStatus(
    @Param('id') id: string,
    @Body() statut: number,
    @CurrentStore() store,
  ) {
    return this.orderService.changeStatus(id, statut, store.userId);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Order' })
  @ApiResponse({ status: 204, description: 'Order remove' })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  remove(@Param('id') id: string, @CurrentStore() store) {
    return this.orderService.remove(id, store.userId);
  }
}
