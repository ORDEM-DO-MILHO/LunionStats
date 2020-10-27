import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationModule } from 'src/annotation/annotation.module';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';
import { TeacherController } from './controller/teacher.controller';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { TeacherService } from './services/teacher.service';

@Module({
  imports: [
    AnnotationModule,
    UserModule,
    StudentModule,
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
