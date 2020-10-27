import { Document } from 'mongoose';
import { IAnnotation } from 'src/annotation/interfaces/annotation.interface';
import { Annotation } from 'src/annotation/schema/annotation.schema';
import { Status } from 'src/auth/types/status.type';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
export interface IStudent extends Document {
  id?: string;
  name: string;
  summoner: string;
  email: string;
  status: Status;
  password: string;
  user: User;
  annotations: [mongoose.Types.ObjectId];
}
