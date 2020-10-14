import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ICreateStudentDto } from '../dto/create-student.dto';
import { ILoginStudentDto } from '../dto/login-student.dto';
import { StudentService } from '../services/student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('register')
  async register(@Body() createStudentDto: ICreateStudentDto) {
    return await this.studentService.createStudent(createStudentDto);
  }

  @Post('/login')
  async login(@Body() studentCredentials: ILoginStudentDto) {
    return await this.studentService.loginStudent(studentCredentials);
  }

  @Get()
  async findAllStudents() {
    return await this.studentService.findAll();
  }

  @Get('/:id')
  async findStdById(@Param() id: string) {
    return await this.studentService.findStudentById(id);
  }

  @Put('/:id')
  async updStudent(@Param() id: string, @Body() data) {
    return await this.studentService.updateStudent(id, data);
  }

  @Delete('/:id')
  async delStudent(@Param() id: string) {
    return await this.studentService.deleteById(id);
  }
}
