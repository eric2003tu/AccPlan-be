import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DeleteBusinessDto } from './dto/delete-business.dto';
import { BusinessDto } from './dto/business.dto';

@ApiTags('Business')
@ApiBearerAuth('access-token')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new business', description: 'System Admin only - for creating business entities' })
  @ApiResponse({
    status: 201,
    description: 'Business created successfully',
    type: BusinessDto,
  })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Get all businesses', description: 'Owner/Manager can see their businesses, Admin can see all' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of businesses',
    isArray: true,
    type: BusinessDto,
  })
  findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.businessService.findAll(+skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiResponse({
    status: 200,
    description: 'Business found',
    type: BusinessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Business not found',
  })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a business', description: 'System Admin only' })
  @ApiResponse({
    status: 200,
    description: 'Business updated successfully',
    type: BusinessDto,
  })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a business', description: 'System Admin only' })
  @ApiResponse({
    status: 200,
    description: 'Business deleted successfully',
  })
  remove(@Param() deleteBusinessDto: DeleteBusinessDto) {
    return this.businessService.remove(deleteBusinessDto.id);
  }
}
