import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/warehouse.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Ware House')
@ApiBearerAuth()
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  // Tao kho
  @Action('create')
  @Subject('warehouse')
  @UseGuards(PermissionGuard)
  @Post()
  async createWarehouseController(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<any> {
    return await this.warehouseService.createWarehouse(createWarehouseDto);
  }

  //xem tat ca kho
  @Action('read')
  @Subject('warehouse')
  @UseGuards(PermissionGuard)
  @Get()
  async findAllWarehouseController(): Promise<any> {
    return await this.warehouseService.getAllWarehouseService();
  }

  //xem chi tiet kho theo id
  @Action('read')
  @Subject('warehouse')
  @UseGuards(PermissionGuard)
  @Get(':id')
  async findOneWarehouseController(@Param('id') id: string): Promise<any> {
    return await this.warehouseService.getWarehouseByIdService(id);
  }
}
