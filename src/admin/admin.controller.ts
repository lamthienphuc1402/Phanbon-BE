import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  Patch, 
  Post, 
  Put, 
  UseGuards, 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { DeleteAdminDto } from './dto/deleteAdmin.dto'; 
import { BlockAdminDto } from './dto/blockAdmin.dto';
import { 
  ApiBadRequestResponse, 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { PermissionGuard } from '../gaurd/permission.gaurd';
import { Subject, Action } from 'src/decorator/casl.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,

  ) {}

  @Subject('admin')
  @Action('create')
  @UseGuards(PermissionGuard)
  @ApiCreatedResponse({description: 'Admin created successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(201)
  @Post()
  async createAdminController(@Body() createAdminDto: CreateAdminDto) {
    const result = await this.adminService.createAdminService(
      createAdminDto.nameAdmin, 
      createAdminDto.userName, 
      createAdminDto.password, 
      createAdminDto.roleId,
    );
  
    return result;
  }

  @Action('update')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin updated successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Put()
  async updateAdmincontroller(@Body() updateAdminDto: UpdateAdminDto) {
    const result = await this.adminService.updateAdminService(
      updateAdminDto.id, 
      updateAdminDto.nameAdmin, 
      updateAdminDto.userName, 
      updateAdminDto.password, 
      updateAdminDto.roleId
    );

    return result;
  }

  @Action('delete')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin deleted successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @Delete()
  async deleteAdminController(@Body() deleteAdminDto: DeleteAdminDto) {
    const result = await this.adminService.deleteAdminService(deleteAdminDto.id);
    return result;
  }

  @Action('read')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin listed successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Get()
  async listAdminController() {

    const result = await this.adminService.listAdminService();
    // Cache the list of admins in Redis
    return result;
  }

  @Action('block')
  @Subject('admin')
  @UseGuards(PermissionGuard)
  @ApiOkResponse({description: 'Admin blocked successfully'})
  @ApiBadRequestResponse({description: 'bad request'})
  @HttpCode(200)
  @Patch('update-block')
  async blockAdminController(@Body() blockAdminDto: BlockAdminDto) {
    const result = await this.adminService.blockAdminService(
      blockAdminDto.id, 
      blockAdminDto.isBlock
    );
    return result;
  }
}
