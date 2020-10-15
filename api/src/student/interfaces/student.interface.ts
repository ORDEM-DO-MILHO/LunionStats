import { Document } from 'mongoose';
import { IAnnotation } from './annotation.interface';

export interface IStudent extends Document {
  id?: string;
  name: string;
  summoner: string;
  email: string;
  password: string;
  annotations: IAnnotation[];
}
