import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { formRow } from './form.dto';

export type FormDocument = Form & Document;

@Schema()
export class Form {
  @Prop({ required: true, index: true })
  formId: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  formRows: formRow[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
