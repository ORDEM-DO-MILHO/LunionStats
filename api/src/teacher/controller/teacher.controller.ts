import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Get()
  public async index() {
    return await this.teacherService.findAllTeachers();
  }

  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  @Get('/:_id')
  public async findById(@Param() id: string) {
    return await this.teacherService.findTeacherById(id);
  }

  @Get('/:summoner')
  public async findBySummoner(@Param() summoner: string) {
    return await this.teacherService.findTeacherBySummoner(summoner);
  }

  @Put('/:_id')
  public async updTeacher(
    @Param() id: string,
    @Body() teacherData: UpdateTeacherDto,
  ) {
    return await this.teacherService.updateTeacher(id, teacherData);
  }

  @Delete('/:_id')
  public async delTeacher(@Param() id: string) {
    return await this.teacherService.deleteTeacher(id);
  }
}
