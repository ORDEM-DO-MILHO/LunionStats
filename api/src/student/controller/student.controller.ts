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
import { StudentService } from '../services/student.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateStudentDto } from '../dto/create-student.dto';

@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Get()
  async index() {
    return await this.studentService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles('student')
  @Post('/create')
  async create(@Req() userData: any, @Body() studentData: CreateStudentDto) {
    try {
      return await this.studentService.createStudent(
        studentData,
        userData.user,
      );
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'teacher')
  @Get('/:_id')
  async findById(@Param() id: string) {
    return await this.studentService.findStudentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:_id')
  async updStudent(
    @Param() id: string,
    @Body() studentData: UpdateStudentDto,
    @Req() userData: any,
  ) {
    return await this.studentService.updateStudent(
      id,
      studentData,
      userData.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('/:_id')
  async delStudent(@Param() id: string) {
    return await this.studentService.deleteById(id);
  }

  // TODO ANNOTATIONS
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
