import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { JournalLinesService } from './journal-lines.service';
import { CreateJournalLineDto } from './dto/create-journal-line.dto';
import { UpdateJournalLineDto } from './dto/update-journal-line.dto';
import { DeleteJournalLineDto } from './dto/delete-journal-line.dto';
import { JournalLineDto } from './dto/journal-line.dto';

@ApiTags('Journal Lines')
@ApiBearerAuth('access-token')
@Controller('journal-lines')
export class JournalLinesController {
  constructor(private readonly journalLinesService: JournalLinesService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new journal line' })
  @ApiResponse({
    status: 201,
    description: 'Journal line created successfully',
    type: JournalLineDto,
  })
  create(@Body() createJournalLineDto: CreateJournalLineDto) {
    return this.journalLinesService.create(createJournalLineDto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all journal lines' })
  @ApiQuery({ name: 'journalId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of journal lines',
    isArray: true,
    type: JournalLineDto,
  })
  findAll(
    @Query('journalId') journalId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.journalLinesService.findAll(journalId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal line by ID' })
  @ApiResponse({
    status: 200,
    description: 'Journal line found',
    type: JournalLineDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Journal line not found',
  })
  findOne(@Param('id') id: string) {
    return this.journalLinesService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update a journal line' })
  @ApiResponse({
    status: 200,
    description: 'Journal line updated successfully',
    type: JournalLineDto,
  })
  update(@Param('id') id: string, @Body() updateJournalLineDto: UpdateJournalLineDto) {
    return this.journalLinesService.update(id, updateJournalLineDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a journal line' })
  @ApiResponse({
    status: 200,
    description: 'Journal line deleted successfully',
  })
  remove(@Param() deleteJournalLineDto: DeleteJournalLineDto) {
    return this.journalLinesService.remove(deleteJournalLineDto.id);
  }
}
