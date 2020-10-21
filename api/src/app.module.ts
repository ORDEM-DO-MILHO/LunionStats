import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { TeacherModule } from './teacher/teacher.module';
import { UserModule } from './user/user.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './user/types/role.type';
import { AdminModule } from './admin/admin.module';
import { SummonerModule } from './summoner/summoner.module';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccessControlModule.forRoles(roles),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    StudentModule,
    AuthModule,
    TeacherModule,
    UserModule,
    AdminModule,
    SummonerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
