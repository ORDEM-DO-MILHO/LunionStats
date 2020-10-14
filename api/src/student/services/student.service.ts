import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from '../interfaces/student.interface';
import * as bcrypt from 'bcrypt';
import { ILoginStudentDto } from '../dto/login-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student')
    private readonly studentModel: Model<IStudent>,
  ) {}

  async loginStudent(data: ILoginStudentDto) {
    try {
      const student = await this.studentModel.findOne({ email: data.email });

      if (
        student &&
        (await this.comparePassword(data.password, student.password))
      ) {
        return student;
      }
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  async createStudent(student: any): Promise<Partial<IStudent | null>> {
    const studentModel = new this.studentModel(student);
    try {
      studentModel.password = await this.encryptPassword(studentModel.password);
      return await studentModel.save();
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<IStudent[] | null> {
    return await this.studentModel.find();
  }

  async findStudentById(id: string) {
    try {
      console.log(id);
      return await this.studentModel.findById({ id });
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async updateStudent(id: string, studentData: any) {
    try {
      return await this.studentModel.findOneAndUpdate({ id }, { studentData });
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async deleteById(id: string) {
    try {
      await this.studentModel.findByIdAndDelete(id);
      return { message: 'student_deleted!' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(
    plainPassword: string,
    password: string,
  ): Promise<boolean> {
    const verify = await bcrypt.compare(plainPassword, password);
    if (!verify) return false;
    return true;
  }
}
