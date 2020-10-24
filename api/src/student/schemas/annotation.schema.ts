import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Annotation {
  @Prop({
    type: String,
    required: [true, 'Title cannot be empty'],
    minlength: [1, 'title is too short'],
    maxlength: [50, 'title is too long'],
  })
  title: string;

  @Prop({
    type: String,
    required: [true, 'Content cannot be empty'],
    minlength: [1, 'content is too short'],
  })
  content: string;

  @Prop({ type: String, required: [true, 'MatchId cannot be empty'] })
  matchId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Teacher' })
  teacherId: mongoose.Types.ObjectId;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
