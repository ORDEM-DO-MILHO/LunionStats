import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from '../services/admin.service';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async index() {
    return await this.adminService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('/create')
  async create(@Req() userData: any, @Body() studentData: CreateAdminDto) {
    try {
      return await this.adminService.createAdmin(studentData, userData.user);
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('/:_id')
  async findById(@Param() id: string) {
    return await this.adminService.findAdminById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Put('/:_id')
  async updStudent(
    @Param() id: string,
    @Body() studentData: UpdateAdminDto,
    @Req() userData: any,
  ) {
    return await this.adminService.updateAdmin(id, studentData, userData.user);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  async delStudent(@Param() id: string, @Req() userData: any) {
    return await this.adminService.deleteById(id, userData.user);
  }
}
