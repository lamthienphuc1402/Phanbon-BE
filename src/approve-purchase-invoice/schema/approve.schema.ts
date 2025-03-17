import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/categories/schema/categories.schema';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';
import { Supplier } from 'src/supplier/schema/supplier.schema';

@Schema({ timestamps: true })
export class Approve extends Document {
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseInvoice', required: true })
  purchaseInvoiceId: PurchaseInvoice;  

  @Prop({ type: mongoose.Schema.Types.String, enum: ['approved', 'rejected'], default: 'approved' })
  approveStatus: string;

}
export type ApproveDocument = HydratedDocument<Approve>;
export const ApproveSchema = SchemaFactory.createForClass(Approve); 