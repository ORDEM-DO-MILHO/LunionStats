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
import { StudentService } from '../services/student.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateStudentDto } from '../dto/create-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Get()
  async index() {
    return await this.studentService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Post('/create')
  async create(@Req() userData: any, @Body() studentData: CreateStudentDto) {
    return await this.studentService.createStudent(studentData, userData.user);
  }

  @Roles('admin', 'teacher')
  @Get('/:_id')
  async findStdById(@Param() id: string) {
    return await this.studentService.findStudentById(id);
  }

  @Roles('admin', 'teacher')
  @Get('/summoner/:summoner')
  async findStdBySummoner(@Param() summoner: string) {
    return await this.studentService.findStudentBySummoner(summoner);
  }

  @Put('/:_id')
  async updStudent(@Param() id: string, @Body() data: UpdateStudentDto) {
    return await this.studentService.updateStudent(id, data);
  }

  @Delete('/:_id')
  async delStudent(@Param() id: string) {
    return await this.studentService.deleteById(id);
  }

  // Annotations Routes
  // @Post('/:_id/annotation/create')
  // async createAnnotation(
  //   @Param() studentId: string,
  //   @Body() annotation: ICreateAnnotationDto,
  // ) {
  //   return await this.studentService.createStudentAnnotation(
  //     studentId,
  //     annotation,
  //   );
  // }

  // @Put('/:_id/annotation/update')
  // async updateAnnotation(
  //   @Param() studentId: string,
  //   @Body() annotation: IUpdateAnnotationDto,
  // ) {
  //   return await this.studentService.updateStudentAnnotation(
  //     studentId,
  //     annotation,
  //   );
  // }

  // @Delete('/:_id/annotation/delete')
  // async deleteAnnotation(
  //   @Param() studentId: string,
  //   @Body() annotationId: string,
  // ) {
  //   return await this.studentService.deleteStudentAnnotation(
  //     studentId,
  //     annotationId,
  //   );
  // }
}
