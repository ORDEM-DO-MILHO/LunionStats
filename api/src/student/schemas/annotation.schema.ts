import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Annotation {
  @Prop()
  content: string;

  @Prop()
  matchId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Teacher' })
  teacherId: mongoose.Types.ObjectId;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
