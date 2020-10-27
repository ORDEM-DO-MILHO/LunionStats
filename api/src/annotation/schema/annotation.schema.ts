import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Annotation extends Document {
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

  @Prop({
    type: Number,
    required: [true, 'you must provide a rating'],
    min: [0, 'the lowest value is 0'],
    max: [5, 'the highest value is 5'],
  })
  rating: number;

  @Prop({ type: String, required: [true, 'MatchId cannot be empty'] })
  matchId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Teacher' })
  teacherId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Student' })
  studentId: mongoose.Types.ObjectId;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
