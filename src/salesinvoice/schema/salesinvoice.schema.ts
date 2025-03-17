import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { Products } from 'src/products/schema/products.schema';
import { User } from 'src/user/schema/user.schema';



@Schema()
export class SalesProducts {
  _id: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: Products;

  @Prop({ type: mongoose.Schema.Types.String, required: false})
  sumPrice: number;
  
  @Prop({ type: mongoose.Schema.Types.Number, required: true })
  quantityProduct: number;
}

export const SalesProductsSchema = SchemaFactory.createForClass(SalesProducts);


@Schema({ timestamps: true })
export class Salesinvoice extends Document {
  _id: ObjectId
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  salesInvoiceId: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, unique: false })
  userId: User;

  @Prop({ type: [SalesProductsSchema], required: true })
  saleProduct: [SalesProducts];
  

  @Prop({ type: mongoose.Schema.Types.String, enum: ['active', 'inactive'], default: 'active' })
  statusSalesInvoice: string;

  @Prop({type: Date, required: false})
  createdAt?: Date

  @Prop({type: Date, required: false})
  updatedAt?: Date
  

  @Prop({ type: Number, required: true })
  sumBill: number;
}
export type SalesinvoiceDocument = HydratedDocument<Salesinvoice>;
export const SalesinvoiceSchema = SchemaFactory.createForClass(Salesinvoice);