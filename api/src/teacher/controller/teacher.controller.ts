import {
  Body,
  Controller,
  Delete,
  Get,
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
    return await this.teacherService.createTeacher(teacherData, userData.user);
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get('/:_id')
  public async findById(@Param() id: string) {
    return await this.teacherService.findTeacherById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get('/summoner/:summoner')
  public async findBySummoner(@Param() summoner: string) {
    return await this.teacherService.findTeacherBySummoner(summoner);
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

  // TODO
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  public async delTeacher(@Param() id: string) {
    return await this.teacherService.deleteTeacher(id);
  }
}