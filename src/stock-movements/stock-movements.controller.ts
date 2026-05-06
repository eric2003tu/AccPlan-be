import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { DeleteStockMovementDto } from './dto/delete-stock-movement.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@ApiTags('Stock Movements')
@ApiBearerAuth('access-token')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new stock movement' })
  @ApiResponse({
    status: 201,
    description: 'Stock movement created successfully',
    type: StockMovementDto,
  })
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of stock movements',
    isArray: true,
    type: StockMovementDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.stockMovementsService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock movement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock movement found',
    type: StockMovementDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Stock movement not found',
  })
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update a stock movement' })
  @ApiResponse({
    status: 200,
    description: 'Stock movement updated successfully',
    type: StockMovementDto,
  })
  update(@Param('id') id: string, @Body() updateStockMovementDto: UpdateStockMovementDto) {
    return this.stockMovementsService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a stock movement' })
  @ApiResponse({
    status: 200,
    description: 'Stock movement deleted successfully',
  })
  remove(@Param() deleteStockMovementDto: DeleteStockMovementDto) {
    return this.stockMovementsService.remove(deleteStockMovementDto.id);
  }
}
