import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ReceivableService } from './receivable.service';
import { Receivable } from './schema/receivable.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { addReceivableDto, updateReceivableDto } from './dto/receivable.dto';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('receivable')
@ApiBearerAuth()
@Controller('receivable')
export class ReceivableController {
    constructor(private readonly ReceivableService: ReceivableService) { }

    @Action('read')
    @Subject('receivable')
    @UseGuards(PermissionGuard)
    @Get()
    async getAllReceivable(): Promise<{ message: string; invoices: Receivable[] }> {
        try {
            // Gọi dịch vụ để lấy tất cả các danh mục
            const invoices = await this.ReceivableService.getAllReceivable();

            if (invoices.length === 0) {
                // Nếu không có danh mục nào, trả về thông báo cùng danh sách rỗng
                return {
                    message: 'Receivable is emty',
                    invoices: []
                };
            }

            // Nếu có danh mục, trả về danh sách cùng thông báo thành công
            return {
                message: 'Danh sách các invoices',
                invoices
            };
        } catch (error) {
            // Xử lý lỗi không xác định
            console.error(error);
            throw new InternalServerErrorException('Failed to retrieve categories');
        }
    }



    // thêm hoa don moi
    @Action('create')
    @Subject('receivable')
    @UseGuards(PermissionGuard)
    @Post("create")
    @ApiOperation({ summary: 'Add a new receivable' })
    // @ApiResponse({ status: 201, description: 'The sale invoice has been successfully created.', type: SaleInvoice })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async createReceivableController(
        @Body() dto: addReceivableDto,
    ): Promise<any> {
        try {
            return await this.ReceivableService.addReceivable(dto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in add receivable invoice controller:', error);
            throw new InternalServerErrorException('Failed to add receivable invoice');
        }
    }
    // cập nhật nhà cung cấp
    @Action('update')
    @Subject('receivable')
    @UseGuards(PermissionGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update receivable' })
    @ApiResponse({ status: 200, description: 'The receivable has been successfully updated.', type: Receivable })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateReceivableController(
        @Param('id') id: string,
        @Body() dto: updateReceivableDto,
    ): Promise<any> {
        try {
            return await this.ReceivableService.updateReceivable(id, dto);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in update receivable controller:', error);
            throw new InternalServerErrorException('Failed to update receivable');
        }
    }
    //lấy chi tiết nhà cung cấp
    @Action('read')
    @Subject('receivable')
    @UseGuards(PermissionGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get receivable detail' })
    @ApiResponse({ status: 200, description: 'Return receivable detail.', type: Receivable })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getDetailReceivableController(
        @Param('id') id: string,
    ): Promise<Receivable> {
        try {
            return await this.ReceivableService.getDetailReceivableByIdService(id);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in getDetail Receivable controller:', error);
            throw new InternalServerErrorException('Failed to get Receivable detail');
        }
    }
    //tìm kiếm nhà cung cấp
    @Action('read')
    @Subject('receivable')
    @UseGuards(PermissionGuard)
    @Get('/search/:searchKey')
    @ApiOperation({ summary: 'Search Receivable' })
    @ApiResponse({ status: 200, description: 'Return Receivable.', type: Receivable })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async searchReceivableController(
        @Param('searchKey') searchKey: string): Promise<{ message: string; receivable: Receivable[] }> {
                
        try {
            const result = await this.ReceivableService.searchReceivableService(searchKey);
            return result;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in searchReceivable controller:', error);
            throw new InternalServerErrorException('Failed to search Receivable');
        }
    }
}
