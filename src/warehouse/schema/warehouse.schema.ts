import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Products } from 'src/products/schema/products.schema';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';

@Schema({ timestamps: true })
export class WareHouse extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true, unique: true })
  productId: Products;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  wareHouseName: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false, unique: false })
  describeWareHouse: string;

  @Prop({ type: mongoose.Schema.Types.Number, required: false})
  quantityMin: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: false })
  quantityMax: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: true })
  quantityNow: number;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['show', 'hidden'], default: 'show' })
  status: string;
}  
export type WareHouseDocument = HydratedDocument<WareHouse>;
export const WareHouseSchema = SchemaFactory.createForClass(WareHouse);

@Schema({ timestamps: true })
export class importWareHouse extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'purchaseInvoice', required: true })
  purchaseInvoiceId: PurchaseInvoice;
  
  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  productionDate: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  expiry: Date;
 
}
export type importWareHouseDocument = HydratedDocument<importWareHouse>;
export const importWareHouseSchema = SchemaFactory.createForClass(importWareHouse);