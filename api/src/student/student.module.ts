import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentController } from './controller/student.controller';
import { StudentService } from './services/student.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}