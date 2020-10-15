import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from '../types/status-type';
import { Annotation } from './annotation.schema';

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};
@Schema({
  timestamps: true,
  toObject: {
    transform,
  },
  toJSON: {
    transform,
  },
})
export class Student extends Document {
  @Prop({
    type: String,
    require: [true, 'name cannot be empty'],
    unique: false,
  })
  name: string;

  @Prop({
    type: String,
    unique: [true, 'summoner already exists'],
    require: [true, 'summoner cannot be empty'],
  })
  summoner: string;

  @Prop({
    type: String,
    required: [true, 'Email can not be empty'],
    unique: [true, 'email already exists'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email should be valid',
    ],
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({ enum: Object.values(Status) })
  status: string;

  @Prop({ type: Annotation })
  annotations: Annotation[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
