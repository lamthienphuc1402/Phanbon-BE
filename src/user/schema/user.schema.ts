import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Salesinvoice, SalesinvoiceSchema } from 'src/salesinvoice/schema/salesinvoice.schema';



@Schema({ timestamps: true })
export class User extends Document {
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  userId: string;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  userName: string;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false, unique: false })
  userAddress: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  userPhone: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false, unique: true })
  userEmail: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, required: false, unique: false }])
  listSaleinvoice: [Salesinvoice];

}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);