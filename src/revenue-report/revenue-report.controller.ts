import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RevenueReportService } from './revenue-report.service';
import { PermissionGuard } from '../gaurd/permission.gaurd';
import { Action, Subject } from '../decorator/casl.decorator';
import { GenerateDailyReportDto, GetReportByDateRangeDto, RevenueReportResponseDto } from './dto/revenue-report.dto';

@ApiTags('Revenue Report')
@ApiTags('Revenue Report')
@ApiBearerAuth()
@Controller('revenue-report')
export class RevenueReportController {
  constructor(private readonly revenueReportService: RevenueReportService) {}

  @UseGuards(PermissionGuard)
  @Action('create')
  @Subject('revenue-report')
  @Post('generate-daily')
  @ApiOperation({ summary: 'Tạo báo cáo doanh thu hàng ngày' })
  @ApiResponse({ status: 201, description: 'Báo cáo đã được tạo thành công', type: RevenueReportResponseDto })
  async generateDailyReport(@Query() generateDailyReportDto: GenerateDailyReportDto): Promise<RevenueReportResponseDto> {
    let date: Date;
    if (generateDailyReportDto.date) {
      // Tạo ngày từ chuỗi ngày đầu vào, giả sử nó ở múi giờ UTC
      date = new Date(generateDailyReportDto.date + 'T00:00:00Z');
    } else {
      // Nếu không có ngày được cung cấp, sử dụng ngày hiện tại ở múi giờ UTC
      date = new Date();
      date.setUTCHours(0, 0, 0, 0);
    }
    return this.revenueReportService.generateDailyReport(date);
  }

  @UseGuards(PermissionGuard)
  @Action('read')
  @Subject('revenue-report')
  @Get('date-range')
  @ApiOperation({ summary: 'Lấy báo cáo doanh thu theo khoảng thời gian' })
  @ApiResponse({ status: 200, description: 'Danh sách báo cáo và tổng hợp', type: Object })
  async getReportByDateRange(@Query() getReportByDateRangeDto: GetReportByDateRangeDto): Promise<{ reports: RevenueReportResponseDto[], summary: any }> {
    const startDate = new Date(getReportByDateRangeDto.startDate);
    const endDate = new Date(getReportByDateRangeDto.endDate);
    return this.revenueReportService.getReportByDateRange(startDate, endDate);
  }
}
