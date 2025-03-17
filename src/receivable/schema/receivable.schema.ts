import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { Salesinvoice } from 'src/salesinvoice/schema/salesinvoice.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Receivable extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  ReceivableId: String;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, unique: false })
  salesInvoiceId: Salesinvoice;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, unique: false })
  userId: User;
  
  @Prop({ type: mongoose.Schema.Types.String, enum: ['30 days', '60 days', '90 days'], default: '30 days' })
  paymentTerm: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  dueDate: Date;
  @Prop({ type: mongoose.Schema.Types.String, required: true})
  paid: number;
  @Prop({ type: mongoose.Schema.Types.String, required: true})
  debt: number;
}
export type ReceivableDocument = HydratedDocument<Receivable>;
export const ReceivableSchema = SchemaFactory.createForClass(Receivable);