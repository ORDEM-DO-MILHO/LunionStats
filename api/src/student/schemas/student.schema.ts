import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/auth/types/status.type';
import * as mongoose from 'mongoose';
import { Annotation } from 'src/annotation/schema/annotation.schema';

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
    required: [true, 'name cannot be empty'],
    unique: false,
  })
  name: string;

  @Prop({ enum: Object.values(Status) })
  status: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', unique: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Annotation' })
  annotations: mongoose.Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
