import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payment } from './entities/payment.entity';

@ApiTags('/payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiCreatedResponse({ type: Payment })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        order_id: { type: 'string' },
        price: { type: 'integer' },
        status: { type: 'integer' },
      },
    },
  })
  @ApiOperation({ summary: 'Create Payment' })
  @ApiOkResponse({ type: Payment, description: 'Payment Create' })
  @ApiBadRequestResponse()
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOkResponse({ type: Payment, isArray: true })
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiOkResponse({ type: Payment, description: 'color found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @ApiCreatedResponse({ type: Payment })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        order_id: { type: 'string' },
        price: { type: 'integer' },
        status: { type: 'integer' },
      },
    },
  })
  @ApiOperation({ summary: 'Updated Payment' })
  @ApiOkResponse({ type: Payment, description: 'Payment Updated' })
  @ApiBadRequestResponse()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiOperation({ summary: 'Remove Payment' })
  @ApiResponse({ status: 204, description: 'Payment remove' })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
