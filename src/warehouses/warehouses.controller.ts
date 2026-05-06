import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';
import { WarehouseDto } from './dto/warehouse.dto';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseDto,
  })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of warehouses',
    isArray: true,
    type: WarehouseDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.warehousesService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse found',
    type: WarehouseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found',
  })
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    type: WarehouseDto,
  })
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse deleted successfully',
  })
  remove(@Param() deleteWarehouseDto: DeleteWarehouseDto) {
    return this.warehousesService.remove(deleteWarehouseDto.id);
  }
}
