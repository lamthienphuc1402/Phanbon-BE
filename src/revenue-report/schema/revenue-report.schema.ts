import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProductReport {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, default: 'Unknown Product' })
  productName: string;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  totalSales: number;

  @Prop({ required: true })
  totalPurchases: number;

  @Prop({ required: true })
  totalOrders: number;

  @Prop({ required: true })
  averageOrderValue: number;

  @Prop({ required: true })
  quantitySold: number;
}

@Schema({ timestamps: true })
export class RevenueReport extends Document {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true })
  totalRevenue: number;

  @Prop({ type: Number, required: true })
  totalSales: number;

  @Prop({ type: Number, required: true })
  totalPurchases: number;

  @Prop({ type: Number, required: true })
  totalOrders: number;

  @Prop({ type: Number, required: true })
  averageOrderValue: number;

  @Prop({ type: [ProductReport] })
  productReports: ProductReport[];
}

export const RevenueReportSchema = SchemaFactory.createForClass(RevenueReport);
export const ProductReportSchema = SchemaFactory.createForClass(ProductReport);
