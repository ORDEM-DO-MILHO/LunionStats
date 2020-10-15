import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { ICreateAnnotationDto } from '../dto/create-annotation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IUpdateStudentDto } from '../dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllStudents() {
    return await this.studentService.findAll();
  }

  @Get('/:_id')
  async findStdById(@Param() id: string) {
    console.log(id);
    return await this.studentService.findStudentById(id);
  }

  @Put('/:_id')
  async updStudent(@Param() id: string, @Body() data: IUpdateStudentDto) {
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
