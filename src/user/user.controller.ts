import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { addUserDto, updateUserDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // thêm nhà cung cấp mới
    @Action('create')
    @Subject('user')
    @UseGuards(PermissionGuard)
    @Post()
    @ApiOperation({ summary: 'Add a new user' })
    // @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async createUserController(
        @Body() dto: addUserDto,
    ): Promise<any> {
        return await this.userService.createUserService(dto);
    }
    // cập nhật nhà cung cấp
    @Action('update')
    @Subject('user')
    @UseGuards(PermissionGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateUserController(
        @Param('id') id: string,
        @Body() dto: updateUserDto,
    ): Promise<any> {
        return await this.userService.updateUserService(id, dto);
    }
    //lấy tất cả nhà cung cấp
    @Action('read')
    @Subject('user')
    @UseGuards(PermissionGuard)
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllUsersController(): Promise<User[]> {
        try {
            return await this.userService.getAllUserService();
        } catch (error) {
            console.error('Error occurred in getAllUsers controller:', error);
            throw new InternalServerErrorException('Failed to get users');
        }
    }
    //lấy chi tiết nhà cung cấp
    @Action('read')
    @Subject('user')
    @UseGuards(PermissionGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get user detail' })
    @ApiResponse({ status: 200, description: 'Return user detail.', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getDetailUserController(
        @Param('id') id: string,
    ): Promise<User> {
        try {
            return await this.userService.getDetailUserByIdService(id);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in getDetailUser controller:', error);
            throw new InternalServerErrorException('Failed to get User detail');
        }
    }
    //tìm kiếm nhà cung cấp
    @Action('read')
    @Subject('user')
    @UseGuards(PermissionGuard)
    @Get('/search/:searchKey')
    @ApiOperation({ summary: 'Search user' })
    @ApiResponse({ status: 200, description: 'Return user.', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async searchUserController(
        @Param('searchKey') searchKey: string): Promise<{ message: string; user: User[] }> {

        try {
            const result = await this.userService.searchUserService(searchKey);
            return result;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in search user controller:', error);
            throw new InternalServerErrorException('Failed to search user');
        }
    }


}
