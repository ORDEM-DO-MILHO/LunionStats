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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { CreateAnnotationDto } from '../dto/create-annotation.dto';
@UseGuards(JwtAuthGuard)
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get()
  public async index() {
    return await this.teacherService.findAllTeachers();
  }

  @UseGuards(RolesGuard)
  @Roles('teacher')
  @Post('/create')
  async create(@Req() userData: any, @Body() teacherData: CreateTeacherDto) {
    try {
      return await this.teacherService.createTeacher(
        teacherData,
        userData.user,
      );
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get('/:_id')
  public async findById(@Param() id: string) {
    return await this.teacherService.findTeacherById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Put('/:_id')
  public async updTeacher(
    @Param() id: string,
    @Body() teacherData: UpdateTeacherDto,
    @Req() userData: any,
  ) {
    return await this.teacherService.updateTeacher(
      id,
      teacherData,
      userData.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  public async delTeacher(@Param() id: string) {
    return await this.teacherService.deleteTeacher(id);
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Post('annotation')
  public async createStudentAnnotation(
    @Body() data: CreateAnnotationDto,
    @Req() userData: any,
  ) {
    return await this.teacherService.createAnnotation(data, userData.user);
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get('annotation/:_id')
  public async findAnnotationTeacherId(@Param() id: any) {
    return await this.teacherService.findAnnotationByTeacherId(id);
  }
}
