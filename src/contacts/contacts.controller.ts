import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { DeleteContactDto } from './dto/delete-contact.dto';
import { ContactDto } from './dto/contact.dto';

@ApiTags('Contacts')
@ApiBearerAuth('access-token')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create a new contact', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully',
    type: ContactDto,
  })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all contacts', description: 'Only Owner and Manager are allowed' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of contacts',
    isArray: true,
    type: ContactDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.contactsService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact found',
    type: ContactDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update a contact', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Contact updated successfully',
    type: ContactDto,
  })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Delete a contact', description: 'Only Owner and Manager are allowed' })
  @ApiResponse({
    status: 200,
    description: 'Contact deleted successfully',
  })
  remove(@Param() deleteContactDto: DeleteContactDto) {
    return this.contactsService.remove(deleteContactDto.id);
  }
}
