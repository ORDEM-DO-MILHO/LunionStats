import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from 'src/student/student.module';
import { Annotation, AnnotationSchema } from './schema/annotation.schema';
import { AnnotationService } from './services/annotation.service';

@Module({
  imports: [
    StudentModule,
    MongooseModule.forFeature([
      { name: Annotation.name, schema: AnnotationSchema },
    ]),
  ],
  providers: [AnnotationService],
  exports: [AnnotationService],
})
export class AnnotationModule {}
