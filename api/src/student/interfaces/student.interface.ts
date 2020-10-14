import { Document } from 'mongoose';

export interface IStudent extends Document {
  id?: string;
  name: string;
  summoner: string;
  email: string;
  password: string;
  annotations: { [key: string]: any };
}
