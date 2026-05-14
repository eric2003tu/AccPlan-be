import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DeleteSaleDto } from './dto/delete-sale.dto';
import { SaleDto } from './dto/sale.dto';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new sale', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Sale created successfully',
    type: SaleDto,
  })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all sales', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of sales',
    isArray: true,
    type: SaleDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.salesService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale found',
    type: SaleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sale not found',
  })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a sale', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Sale updated successfully',
    type: SaleDto,
  })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a sale', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Sale deleted successfully',
  })
  remove(@Param() deleteSaleDto: DeleteSaleDto) {
    return this.salesService.remove(deleteSaleDto.id);
  }
}
