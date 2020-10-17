import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
