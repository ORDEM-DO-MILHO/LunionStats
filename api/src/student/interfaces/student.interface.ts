import { Document } from 'mongoose';
import { Status } from 'src/auth/types/status.type';
import { IAnnotation } from './annotation.interface';

export interface IStudent extends Document {
  id?: string;
  name: string;
  summoner: string;
  email: string;
  status: Status;
  password: string;
  annotations: IAnnotation[];
}
