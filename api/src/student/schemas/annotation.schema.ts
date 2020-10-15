import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Annotation {
  @Prop()
  content: string;

  @Prop()
  teacherId: string;

  @Prop()
  matchId: string;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
