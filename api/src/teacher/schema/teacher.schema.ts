import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/student/types/status-type';

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
    min: [6, 'password must have at least 6 characters'],
    required: [true, 'must include a password'],
  })
  password: string;

  @Prop({ type: Object.values(Status) })
  status: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
