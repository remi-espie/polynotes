import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PageDocument = Page & Document;

@Schema()
export class Page {
  @Prop({ required: true, index: true })
  owner: string;

  @Prop({ required: true })
  reader: string[];

  @Prop({ required: true })
  writer: string[];

  @Prop({ required: true })
  modified: Date;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  parentId: string;

  @Prop()
  subContent: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
