import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    StudentModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
