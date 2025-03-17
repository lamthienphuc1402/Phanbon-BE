import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';
@Schema({ timestamps: true })
export class Payable extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseInvoice', required: true })
  purchaseInvoiceId: PurchaseInvoice;

  // @Prop({ type: mongoose.Schema.Types.String, required: true })
  // payableId: string;

}
export type PayableDocument = HydratedDocument<Payable>;
export const PayableSchema = SchemaFactory.createForClass(Payable);