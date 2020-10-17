import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './controller/admin.controller';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
