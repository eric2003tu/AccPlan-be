import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReceivablesService } from './receivables.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { DeleteReceivableDto } from './dto/delete-receivable.dto';
import { ReceivableDto } from './dto/receivable.dto';

@ApiTags('Receivables')
@Controller('receivables')
export class ReceivablesController {
  constructor(private readonly receivablesService: ReceivablesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new receivable' })
  @ApiResponse({
    status: 201,
    description: 'Receivable created successfully',
    type: ReceivableDto,
  })
  create(@Body() createReceivableDto: CreateReceivableDto) {
    return this.receivablesService.create(createReceivableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all receivables' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of receivables',
    isArray: true,
    type: ReceivableDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.receivablesService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a receivable by ID' })
  @ApiResponse({
    status: 200,
    description: 'Receivable found',
    type: ReceivableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Receivable not found',
  })
  findOne(@Param('id') id: string) {
    return this.receivablesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a receivable' })
  @ApiResponse({
    status: 200,
    description: 'Receivable updated successfully',
    type: ReceivableDto,
  })
  update(@Param('id') id: string, @Body() updateReceivableDto: UpdateReceivableDto) {
    return this.receivablesService.update(id, updateReceivableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a receivable' })
  @ApiResponse({
    status: 200,
    description: 'Receivable deleted successfully',
  })
  remove(@Param() deleteReceivableDto: DeleteReceivableDto) {
    return this.receivablesService.remove(deleteReceivableDto.id);
  }
}
