import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';
@Schema({ timestamps: true })
export class HistoryS extends Document {
  
  @Prop({ type: mongoose.Schema.Types.Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseInvoice', required: true })
  purchaseInvoiceId: PurchaseInvoice;

}
export type HistoryDocument = HydratedDocument<HistoryS>;
export const HistorySchema = SchemaFactory.createForClass(HistoryS);