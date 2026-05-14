import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { PurchaseItemsService } from './purchase-items.service';
import { CreatePurchaseItemDto } from './dto/create-purchase-item.dto';
import { UpdatePurchaseItemDto } from './dto/update-purchase-item.dto';
import { DeletePurchaseItemDto } from './dto/delete-purchase-item.dto';
import { PurchaseItemDto } from './dto/purchase-item.dto';

@ApiTags('Purchase Items')
@ApiBearerAuth('access-token')
@Controller('purchase-items')
export class PurchaseItemsController {
  constructor(private readonly purchaseItemsService: PurchaseItemsService) {}

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new purchase item', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Purchase item created successfully',
    type: PurchaseItemDto,
  })
  create(@Body() createPurchaseItemDto: CreatePurchaseItemDto) {
    return this.purchaseItemsService.create(createPurchaseItemDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all purchase items', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'purchaseId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of purchase items',
    isArray: true,
    type: PurchaseItemDto,
  })
  findAll(
    @Query('purchaseId') purchaseId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.purchaseItemsService.findAll(purchaseId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Purchase item found',
    type: PurchaseItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchase item not found',
  })
  findOne(@Param('id') id: string) {
    return this.purchaseItemsService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a purchase item', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Purchase item updated successfully',
    type: PurchaseItemDto,
  })
  update(@Param('id') id: string, @Body() updatePurchaseItemDto: UpdatePurchaseItemDto) {
    return this.purchaseItemsService.update(id, updatePurchaseItemDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a purchase item', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Purchase item deleted successfully',
  })
  remove(@Param() deletePurchaseItemDto: DeletePurchaseItemDto) {
    return this.purchaseItemsService.remove(deletePurchaseItemDto.id);
  }
}
