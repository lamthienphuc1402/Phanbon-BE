import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryWareHouseService } from './history-ware-house.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';


@ApiTags('History')
@ApiBearerAuth()
@Controller('history-ware-house')
export class HistoryWareHouseController {
    constructor(private readonly historyWareHouseService: HistoryWareHouseService) {}   

    //lấu danh sách lịch sử nhập kho
    @Action('read')
    @Subject('history')
    @UseGuards(PermissionGuard)
    @Get()
    async getHistory(): Promise<any> {
        return await this.historyWareHouseService.getHistory();
    }

    //lấy lịch sử nhập kho theo id
    @Action('read')
    @Subject('history')
    @UseGuards(PermissionGuard)
    @Get(':id')
    async getHistoryById(@Param('id') id: string): Promise<any> {
        return await this.historyWareHouseService.getHistoryById(id);
    }
}

