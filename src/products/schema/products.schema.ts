import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/categories/schema/categories.schema';

@Schema({ timestamps: true })
export class Products extends Document {
  static productId(productId: any) {
      throw new Error('Method not implemented.');
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: Category;  
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  productId: string;
  
  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: true })
  productName: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false, unique: false })
  describeProduct: string;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['show', 'hidden'], default: 'show' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, unique: false })
  unit: string;

  @Prop({ type: mongoose.Schema.Types.Number, required: true, unique: false })
  purchasePrice: number;

  @Prop({ type: mongoose.Schema.Types.Number, required: true, unique: false })
  salePice: number;
}
export type ProductsDocument = HydratedDocument<Products>;
export const ProductsSchema = SchemaFactory.createForClass(Products);
