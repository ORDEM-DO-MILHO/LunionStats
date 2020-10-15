import { Document } from 'mongoose';

export interface IAnnotation extends Document {
  id?: string;
  content: string;
  matchId: string;
  teacherId: string;
}
