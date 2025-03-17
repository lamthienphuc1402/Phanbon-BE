import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { Supplier } from 'src/supplier/schema/supplier.schema';

@Schema({ timestamps: true })
export class PurchaseInvoice extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  purchaseInvoiceId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true})
  adminId: Admin;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: false,})
  supplierId: Supplier;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        quantity: {
          type: mongoose.Schema.Types.Number,
          required: true,
          default: 1,
        },
      },
    ],

    required: true,
  })
  purchaseProducts: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['payed', 'prepay'],
    default: 'payed',
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Number, required: false }) 
  paidAmount: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: false })
  amountOwed: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: false })
  payExtra: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: false })
  paymentTems: number;

  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  dueDate: Date;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending',
  })
  approveStatus: string;

  @Prop({ type: mongoose.Schema.Types.Number, required: true })
  totalAmount: number;
}
export type PurchaseInvoiceDocument = HydratedDocument<PurchaseInvoice>;
export const PurchaseInvoiceSchema =
  SchemaFactory.createForClass(PurchaseInvoice);
