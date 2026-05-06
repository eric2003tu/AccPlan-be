import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { BusinessUsersService } from './business-users.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { DeleteBusinessUserDto } from './dto/delete-business-user.dto';
import { BusinessUserDto } from './dto/business-user.dto';

@ApiTags('Business Users')
@ApiBearerAuth('access-token')
@Controller('business-users')
export class BusinessUsersController {
  constructor(private readonly businessUsersService: BusinessUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Assign user to business' })
  @ApiResponse({
    status: 201,
    description: 'User assigned to business successfully',
    type: BusinessUserDto,
  })
  create(@Body() createBusinessUserDto: CreateBusinessUserDto) {
    return this.businessUsersService.create(createBusinessUserDto);
  }

  @Get()
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Get all business users' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of business users',
    isArray: true,
    type: BusinessUserDto,
  })
  findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.businessUsersService.findAll(+skip, +take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Business user found',
    type: BusinessUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Business user not found',
  })
  findOne(@Param('id') id: string) {
    return this.businessUsersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business user role' })
  @ApiResponse({
    status: 200,
    description: 'Business user updated successfully',
    type: BusinessUserDto,
  })
  update(@Param('id') id: string, @Body() updateBusinessUserDto: UpdateBusinessUserDto) {
    return this.businessUsersService.update(id, updateBusinessUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user from business' })
  @ApiResponse({
    status: 200,
    description: 'User removed from business successfully',
  })
  remove(@Param() deleteBusinessUserDto: DeleteBusinessUserDto) {
    return this.businessUsersService.remove(deleteBusinessUserDto.id);
  }
}
