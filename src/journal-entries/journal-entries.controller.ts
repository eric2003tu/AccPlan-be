import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { DeleteJournalEntryDto } from './dto/delete-journal-entry.dto';
import { JournalEntryDto } from './dto/journal-entry.dto';

@ApiTags('Journal Entries')
@ApiBearerAuth('access-token')
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new journal entry', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Journal entry created successfully',
    type: JournalEntryDto,
  })
  create(@Body() createJournalEntryDto: CreateJournalEntryDto) {
    return this.journalEntriesService.create(createJournalEntryDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all journal entries', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of journal entries',
    isArray: true,
    type: JournalEntryDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.journalEntriesService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry found',
    type: JournalEntryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Journal entry not found',
  })
  findOne(@Param('id') id: string) {
    return this.journalEntriesService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a journal entry', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry updated successfully',
    type: JournalEntryDto,
  })
  update(@Param('id') id: string, @Body() updateJournalEntryDto: UpdateJournalEntryDto) {
    return this.journalEntriesService.update(id, updateJournalEntryDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a journal entry', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry deleted successfully',
  })
  remove(@Param() deleteJournalEntryDto: DeleteJournalEntryDto) {
    return this.journalEntriesService.remove(deleteJournalEntryDto.id);
  }
}
