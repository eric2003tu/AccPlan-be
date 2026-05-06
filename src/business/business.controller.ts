import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DeleteBusinessDto } from './dto/delete-business.dto';
import { BusinessDto } from './dto/business.dto';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({
    status: 201,
    description: 'Business created successfully',
    type: BusinessDto,
  })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
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
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({
    status: 200,
    description: 'Business updated successfully',
    type: BusinessDto,
  })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({
    status: 200,
    description: 'Business deleted successfully',
  })
  remove(@Param() deleteBusinessDto: DeleteBusinessDto) {
    return this.businessService.remove(deleteBusinessDto.id);
  }
}
