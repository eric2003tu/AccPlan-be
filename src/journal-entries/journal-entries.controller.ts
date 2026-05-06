import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { DeleteJournalEntryDto } from './dto/delete-journal-entry.dto';
import { JournalEntryDto } from './dto/journal-entry.dto';

@ApiTags('Journal Entries')
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({
    status: 201,
    description: 'Journal entry created successfully',
    type: JournalEntryDto,
  })
  create(@Body() createJournalEntryDto: CreateJournalEntryDto) {
    return this.journalEntriesService.create(createJournalEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal entries' })
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
  @ApiOperation({ summary: 'Update a journal entry' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry updated successfully',
    type: JournalEntryDto,
  })
  update(@Param('id') id: string, @Body() updateJournalEntryDto: UpdateJournalEntryDto) {
    return this.journalEntriesService.update(id, updateJournalEntryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry deleted successfully',
  })
  remove(@Param() deleteJournalEntryDto: DeleteJournalEntryDto) {
    return this.journalEntriesService.remove(deleteJournalEntryDto.id);
  }
}
