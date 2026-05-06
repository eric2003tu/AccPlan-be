import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { FiscalYearsService } from './fiscal-years.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { UpdateFiscalYearDto } from './dto/update-fiscal-year.dto';
import { DeleteFiscalYearDto } from './dto/delete-fiscal-year.dto';
import { FiscalYearDto } from './dto/fiscal-year.dto';

@ApiTags('Fiscal Years')
@ApiBearerAuth('access-token')
@Controller('fiscal-years')
export class FiscalYearsController {
  constructor(private readonly fiscalYearsService: FiscalYearsService) {}

  @Post()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new fiscal year' })
  @ApiResponse({
    status: 201,
    description: 'Fiscal year created successfully',
    type: FiscalYearDto,
  })
  create(@Body() createFiscalYearDto: CreateFiscalYearDto) {
    return this.fiscalYearsService.create(createFiscalYearDto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all fiscal years' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of fiscal years',
    isArray: true,
    type: FiscalYearDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.fiscalYearsService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fiscal year by ID' })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year found',
    type: FiscalYearDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  findOne(@Param('id') id: string) {
    return this.fiscalYearsService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update a fiscal year' })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year updated successfully',
    type: FiscalYearDto,
  })
  update(@Param('id') id: string, @Body() updateFiscalYearDto: UpdateFiscalYearDto) {
    return this.fiscalYearsService.update(id, updateFiscalYearDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a fiscal year' })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year deleted successfully',
  })
  remove(@Param() deleteFiscalYearDto: DeleteFiscalYearDto) {
    return this.fiscalYearsService.remove(deleteFiscalYearDto.id);
  }
}
