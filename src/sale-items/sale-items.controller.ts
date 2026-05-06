import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SaleItemsService } from './sale-items.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { DeleteSaleItemDto } from './dto/delete-sale-item.dto';
import { SaleItemDto } from './dto/sale-item.dto';

@ApiTags('Sale Items')
@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale item' })
  @ApiResponse({
    status: 201,
    description: 'Sale item created successfully',
    type: SaleItemDto,
  })
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    return this.saleItemsService.create(createSaleItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sale items' })
  @ApiQuery({ name: 'saleId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of sale items',
    isArray: true,
    type: SaleItemDto,
  })
  findAll(
    @Query('saleId') saleId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.saleItemsService.findAll(saleId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale item found',
    type: SaleItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sale item not found',
  })
  findOne(@Param('id') id: string) {
    return this.saleItemsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sale item' })
  @ApiResponse({
    status: 200,
    description: 'Sale item updated successfully',
    type: SaleItemDto,
  })
  update(@Param('id') id: string, @Body() updateSaleItemDto: UpdateSaleItemDto) {
    return this.saleItemsService.update(id, updateSaleItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale item' })
  @ApiResponse({
    status: 200,
    description: 'Sale item deleted successfully',
  })
  remove(@Param() deleteSaleItemDto: DeleteSaleItemDto) {
    return this.saleItemsService.remove(deleteSaleItemDto.id);
  }
}
