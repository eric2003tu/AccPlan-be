import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { BusinessUsersService } from './business-users.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserRoleDto } from './dto/update-business-user-role.dto';
import { DeleteBusinessUserDto } from './dto/delete-business-user.dto';
import { BusinessUserDto } from './dto/business-user.dto';

@ApiTags('Business Users')
@ApiBearerAuth('access-token')
@Controller('business-users')
export class BusinessUsersController {
  constructor(private readonly businessUsersService: BusinessUsersService) {}

  @Post()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Assign user to business', description: 'Business owner only - limited to their own business' })
  @ApiResponse({
    status: 201,
    description: 'User assigned to business successfully',
    type: BusinessUserDto,
  })
  async create(
    @Body() createBusinessUserDto: CreateBusinessUserDto,
    @Req() req: { user: { id: string; system_role?: string } },
  ) {
    if (req.user.system_role !== 'ADMIN') {
      await this.businessUsersService.ensureUserOwnsBusiness(req.user.id, createBusinessUserDto.business_id);
    }

    return this.businessUsersService.create(createBusinessUserDto);
  }

  @Get()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Get business users', description: 'Business owner only - limited to their own business' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of business users',
    isArray: true,
    type: BusinessUserDto,
  })
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 10,
    @Req() req: { user: { id: string; system_role?: string } },
  ) {
    if (req.user.system_role === 'ADMIN') {
      return this.businessUsersService.findAll(+skip, +take);
    }

    const ownedBusinessId = await this.businessUsersService.getOwnedBusinessId(req.user.id);

    return this.businessUsersService.findAll(+skip, +take, ownedBusinessId);
  }

  @Get(':id')
  @Roles('OWNER')
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
  async findOne(@Param('id') id: string, @Req() req: { user: { id: string; system_role?: string } }) {
    const businessUser =
      req.user.system_role === 'ADMIN'
        ? await this.businessUsersService.findOne(id)
        : await this.businessUsersService.findManagedBusinessUserForOwner(req.user.id, id);

    return businessUser;
  }

  @Put(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Update business user role', description: 'Business owner only - limited to their own business' })
  @ApiResponse({
    status: 200,
    description: 'Business user updated successfully',
    type: BusinessUserDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessUserDto: UpdateBusinessUserRoleDto,
    @Req() req: { user: { id: string; system_role?: string } },
  ) {
    if (req.user.system_role !== 'ADMIN') {
      await this.businessUsersService.ensureUserOwnsBusiness(req.user.id, updateBusinessUserDto.business_id);
    }

    const businessUser =
      req.user.system_role === 'ADMIN'
        ? await this.businessUsersService.findOne(id)
        : await this.businessUsersService.findManagedBusinessUserForOwner(updateBusinessUserDto.business_id, id);

    return this.businessUsersService.updateRole(businessUser.id, updateBusinessUserDto.role);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Remove user from business', description: 'Business owner only - limited to their own business' })
  @ApiResponse({
    status: 200,
    description: 'User removed from business successfully',
  })
  async remove(
    @Param() deleteBusinessUserDto: DeleteBusinessUserDto,
    @Req() req: { user: { id: string; system_role?: string } },
  ) {
    const businessUser =
      req.user.system_role === 'ADMIN'
        ? await this.businessUsersService.findOne(deleteBusinessUserDto.id)
        : await this.businessUsersService.findManagedBusinessUserForOwner(req.user.id, deleteBusinessUserDto.id);

    return this.businessUsersService.remove(businessUser.id);
  }
}
