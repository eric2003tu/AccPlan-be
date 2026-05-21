import { Controller, Get, Post, Patch, Body, Put, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DeleteBusinessDto } from './dto/delete-business.dto';
import { BusinessDto } from './dto/business.dto';
import { AdminDashboardDto } from './dto/admin-dashboard.dto';
import { OwnedBusinessResponseDto } from './dto/owned-business-response.dto';
import { OwnerApplicationsResponseDto } from './dto/owner-applications-response.dto';
import { UserIdDto } from './dto/user-id.dto';

@ApiTags('Business')
@ApiBearerAuth('access-token')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business', description: 'Authenticated users create a business and become its owner' })
  @ApiResponse({
    status: 201,
    description: 'Business created successfully',
    type: BusinessDto,
  })
  create(@Body() createBusinessDto: CreateBusinessDto, @Req() req: { user: { id: string } }) {
    return this.businessService.create(createBusinessDto, req.user.id);
  }

  @Post('apply-owner')
  @ApiOperation({ summary: 'Apply to be owner', description: 'Authenticated users can apply to become an owner using the access token only' })
  applyToBeOwner(@Req() req: { user: { id: string } }) {
    return this.businessService.applyToBeOwner(req.user.id);
  }

  @Patch('admin/owner-applications/:id/approve')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Approve an owner application', description: 'System admin approves an owner application using the application id only' })
  approveOwnerApplication(@Param('id') id: string) {
    return this.businessService.adminApproveOwnerApplication(id);
  }

  @Patch('admin/owner-applications/:id/reject')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Reject an owner application', description: 'System admin rejects an owner application using the application id only' })
  rejectOwnerApplication(@Param('id') id: string) {
    return this.businessService.adminRejectOwnerApplication(id);
  }

  @Post(':id/assign-manager')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Owner assign manager', description: "Business owner assigns a user as manager; user's system role is updated" })
  assignManager(@Param('id') id: string, @Body() body: UserIdDto, @Req() req: { user: { id: string } }) {
    return this.businessService.assignManager(id, req.user.id, body.userId);
  }

  @Get()
  @Roles('OWNER', 'MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Get all businesses', description: 'Owner/Manager can see their businesses, Admin can see all' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of businesses',
    isArray: true,
    type: BusinessDto,
  })
  findAll(@Query('skip') skip = 0, @Query('take') take = 10, @Req() req: { user: { id: string; system_role?: string } }) {
    // Admins should see all businesses; owners/managers see only their businesses
    const isAdmin = req.user?.system_role === 'ADMIN';

    return this.businessService.findAll(+skip, +take, isAdmin ? undefined : req.user.id).then((businesses) => ({
      count: Array.isArray(businesses) ? businesses.length : 0,
      status: 'ok',
      data: businesses,
    }));
  }

  @Get('owned/my-business')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Get my owned business', description: 'Owner only - returns the business they own' })
  @ApiResponse({
    status: 200,
    description: 'Owned business details',
    type: OwnedBusinessResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No owned business found',
  })
  getOwnedBusiness(@Req() req: { user: { id: string } }) {
    return this.businessService.getOwnedBusiness(req.user.id);
  }

  @Get('owned/dashboard')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: "Owner's portfolio dashboard", description: 'Aggregated portfolio metrics for the authenticated owner' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  getOwnerDashboard(@Req() req: { user: { id: string } }) {
    return this.businessService.getOwnerDashboard(req.user.id);
  }

  @Get('admin/dashboard')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin platform dashboard', description: 'Platform overview with users, access, billing, and health metrics' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data', type: AdminDashboardDto })
  getAdminDashboard() {
    return this.businessService.getAdminDashboard();
  }

  @Get('admin/owner-applications')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all owner applications', description: 'System admin can view every application to become a business owner' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Owner applications list', type: OwnerApplicationsResponseDto })
  getOwnerApplications(@Query('skip') skip?: string, @Query('take') take?: string) {
    const parsedSkip = Number.isFinite(Number(skip)) ? Number(skip) : 0;
    const parsedTake = Number.isFinite(Number(take)) && Number(take) > 0 ? Number(take) : undefined;

    return this.businessService.getOwnerApplications(parsedSkip, parsedTake);
  }

  @Get('admin/businesses/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get business details for admin', description: 'System admin can view business details by business ID' })
  @ApiResponse({
    status: 200,
    description: 'Business found',
    type: BusinessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Business not found',
  })
  getBusinessDetailsForAdmin(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Get('managed/my-business')
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Get my managed business', description: 'Manager only - returns the business they manage' })
  @ApiResponse({
    status: 200,
    description: 'Managed business details',
    type: BusinessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No managed business found',
  })
  getManagedBusiness(@Req() req: { user: { id: string } }) {
    return this.businessService.getManagedBusiness(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiResponse({
    status: 200,
    description: 'Business found',
    type: BusinessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Business not found',
  })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business', description: 'System Admin only' })
  @ApiResponse({
    status: 200,
    description: 'Business updated successfully',
    type: BusinessDto,
  })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business', description: 'System Admin only' })
  @ApiResponse({
    status: 200,
    description: 'Business deleted successfully',
  })
  remove(@Param() deleteBusinessDto: DeleteBusinessDto) {
    return this.businessService.remove(deleteBusinessDto.id);
  }
}
