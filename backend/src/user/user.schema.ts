import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  validated: Boolean;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
