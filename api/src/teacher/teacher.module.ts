import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';
import { TeacherController } from './controller/teacher.controller';
import { Teacher, TeacherSchema } from './schema/teacher.schema';
import { TeacherService } from './services/teacher.service';

@Module({
  imports: [
    UserModule,
    StudentModule,
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
