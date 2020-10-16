import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from 'src/student/student.module';
import { TeacherController } from './controller/teacher.controller';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { TeacherService } from './services/teacher.service';

@Module({
  imports: [
    StudentModule,
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
