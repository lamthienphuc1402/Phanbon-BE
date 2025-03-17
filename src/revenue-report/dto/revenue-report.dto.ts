import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsNumber, IsString } from 'class-validator';

export class ProductReportDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Tổng doanh thu của sản phẩm' })
  @IsNumber()
  totalRevenue: number;

  @ApiProperty({ description: 'Tổng doanh số bán của sản phẩm' })
  @IsNumber()
  totalSales: number;

  @ApiProperty({ description: 'Tổng chi phí mua của sản phẩm' })
  @IsNumber()
  totalPurchases: number;

  @ApiProperty({ description: 'Tổng số đơn hàng bán của sản phẩm' })
  @IsNumber()
  totalOrders: number;

  @ApiProperty({ description: 'Giá trị trung bình đơn hàng của sản phẩm' })
  @IsNumber()
  averageOrderValue: number;

  @ApiProperty({ description: 'Số lượng sản phẩm đã bán' })
  @IsNumber()
  quantitySold: number;
}

export class GenerateDailyReportDto {
  @ApiProperty({ 
    description: 'Date for generating report (optional, defaults to current date)',
    example: '2024-09-06',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}

export class GetReportByDateRangeDto {
  @ApiProperty({ 
    description: 'Start date for report range',
    example: '2023-05-01',
    required: true 
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'End date for report range',
    example: '2023-05-31',
    required: true 
  })
  @IsDateString()
  endDate: string;
}

export class RevenueReportResponseDto {
  @ApiProperty({ description: 'Ngày báo cáo' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Tổng doanh thu' })
  @IsNumber()
  totalRevenue: number;

  @ApiProperty({ description: 'Tổng doanh số bán' })
  @IsNumber()
  totalSales: number;

  @ApiProperty({ description: 'Tổng chi phí mua' })
  @IsNumber()
  totalPurchases: number;

  @ApiProperty({ description: 'Tổng số đơn hàng' })
  @IsNumber()
  totalOrders: number;

  @ApiProperty({ description: 'Giá trị trung bình đơn hàng' })
  @IsNumber()
  averageOrderValue: number;

  @ApiProperty({ type: [ProductReportDto], description: 'Báo cáo chi tiết theo sản phẩm' })
  productReports: ProductReportDto[];
}
