import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  categoryName: string;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['show', 'hidden'], default: 'show' })
  status: string;

  //   @Prop({ type: [{ type: mongoose.Schema.Types.Number, default: [] }] })
  //   permissionID: number[];
}
export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);