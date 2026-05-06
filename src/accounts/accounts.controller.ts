import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { AccountDto } from './dto/account.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AccountDto,
  })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiQuery({ name: 'businessId', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    isArray: true,
    type: AccountDto,
  })
  findAll(
    @Query('businessId') businessId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.accountsService.findAll(businessId, +skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({
    status: 200,
    description: 'Account found',
    type: AccountDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: AccountDto,
  })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  remove(@Param() deleteAccountDto: DeleteAccountDto) {
    return this.accountsService.remove(deleteAccountDto.id);
  }
}
