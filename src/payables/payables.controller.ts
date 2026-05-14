import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { PayablesService } from './payables.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { DeletePayableDto } from './dto/delete-payable.dto';
import { PayableDto } from './dto/payable.dto';

@ApiTags('Payables')
@ApiBearerAuth('access-token')
@Controller('payables')
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new payable', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Payable created successfully',
    type: PayableDto,
  })
  create(@Body() createPayableDto: CreatePayableDto) {
    return this.payablesService.create(createPayableDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all payables', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of payables',
    isArray: true,
    type: PayableDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.payablesService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payable by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payable found',
    type: PayableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payable not found',
  })
  findOne(@Param('id') id: string) {
    return this.payablesService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a payable', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Payable updated successfully',
    type: PayableDto,
  })
  update(@Param('id') id: string, @Body() updatePayableDto: UpdatePayableDto) {
    return this.payablesService.update(id, updatePayableDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a payable', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Payable deleted successfully',
  })
  remove(@Param() deletePayableDto: DeletePayableDto) {
    return this.payablesService.remove(deletePayableDto.id);
  }
}
