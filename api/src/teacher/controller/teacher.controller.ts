import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  public async findAll() {
    return await this.teacherService.findAllTeachers();
  }

  @Get('/:_id')
  public async findById(@Param() id: string) {
    return await this.teacherService.findTeacherById(id);
  }

  @Get('/:summoner')
  public async findBySummoner(@Param() summoner: string) {
    return await this.teacherService.findTeacherBySummoner(summoner);
  }

  @Put('/:_id')
  public async upTeacher(
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
