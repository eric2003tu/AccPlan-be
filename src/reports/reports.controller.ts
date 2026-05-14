import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { DeleteReportDto } from './dto/delete-report.dto';
import { GenerateDailyReportsDto } from './dto/generate-daily-reports.dto';
import { ReportDto } from './dto/report.dto';

@ApiTags('Reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate-daily')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Generate daily financial statements from journal entries', description: 'Only Owner and Manager are allowed' })
  @ApiBody({ type: GenerateDailyReportsDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Daily financial statements generated successfully',
    isArray: true,
    type: ReportDto,
  })
  generateDaily(@Body() generateDailyReportsDto: GenerateDailyReportsDto) {
    return this.reportsService.generateDailyFinancialStatements(generateDailyReportsDto.asOfDate);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new report', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: ReportDto,
  })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all reports', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of reports',
    isArray: true,
    type: ReportDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.reportsService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get a report by ID', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Report found',
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a report', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: ReportDto,
  })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a report', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Report deleted successfully',
  })
  remove(@Param() deleteReportDto: DeleteReportDto) {
    return this.reportsService.remove(deleteReportDto.id);
  }
}
