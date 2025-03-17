import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Supplier extends Document {
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  supplierId: string;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  supplierName: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false, unique: false })
  describeSupplier: string;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: false })
  supplierAddress: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  supplierPhone: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  supplierEmail: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, required: false,ref:'Products',default:null }])
  listProductId: mongoose.Schema.Types.ObjectId[];

}
export type SupplierDocument = HydratedDocument<Supplier>;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);