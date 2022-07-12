import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get All Order' })
  @ApiOkResponse({ type: Order, isArray: true })
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'Get find Order' })
  @Get(':id')
  @ApiOkResponse({ type: Order, description: 'order found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

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
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

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
  changeStatus(@Param('id') id: string, @Body() statut: number) {
    return this.orderService.changeStatus(id, statut);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Order' })
  @ApiResponse({ status: 204, description: 'Order remove' })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
