import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/auth/types/status.type';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({
    type: String,
    required: [true, 'name cannot be empty'],
    unique: false,
  })
  name: string;

  @Prop({
    type: String,
    unique: [true, 'summoner already exists'],
    required: [true, 'summoner cannot be empty'],
  })
  summoner: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', unique: true })
  user: mongoose.Types.ObjectId;

  @Prop({ enum: Object.values(Status) })
  status: string;

  @Prop()
  specialties: string[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
