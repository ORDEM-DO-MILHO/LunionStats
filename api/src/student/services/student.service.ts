import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ILoginStudentDto } from '../dto/login-student.dto';
import { Student } from '../schemas/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
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

  async createStudent(student: any) {
    const studentModel = new this.studentModel(student);
    try {
      studentModel.password = await this.encryptPassword(studentModel.password);
      return await studentModel.save();
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async findAll() {
    return await this.studentModel.find();
  }

  async findStudentById(id: any) {
    try {
      return await this.studentModel.findById(id).exec();
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async updateStudent(id: string, studentData: any) {
    try {
      await this.studentModel.findByIdAndUpdate(id, studentData).exec();
      return await this.studentModel.findById(id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async deleteById(id: string) {
    try {
      await this.studentModel.findByIdAndDelete(id).exec();
      return { message: 'student_deleted!' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  // TODO NESTED ANNOTATIONS
  async createStudentAnnotation(studentId: string, annotation: any) {
    // try {
    //   let student = await this.studentModel.findById(studentId);
    //   student.annotations = annotation;
    //   console.log(student);
    //   return await student.save();
    // } catch (err) {
    //   console.log(err);
    //   throw new BadRequestException();
    // }
  }

  async updateStudentAnnotation(id: string, annotation: any) {
    //   try {
    //     const s = await this.studentModel.findOneAndUpdate(
    //       { _id:
    //         'annotations._id': annotation._id,
    //       },
    //       { $addToSet: { annotations_id: annotation } },
    //     );
    //     console.log(s);
    //   } catch (err) {
    //     console.log(err);
    //     throw new BadRequestException();
    //   }
  }

  async deleteStudentAnnotation(id: string, annotation: any) {
    //   try {
    //     const student = await this.studentModel.findById(id);
    //     await student.annotations
    //       .id(mongoose.Types.ObjectId(annotation._id))
    //       .remove();
    //     return await student.save();
    //   } catch (err) {
    //     console.log(err);
    //     throw new BadRequestException();
    //   }
  }

  // Private funcionts&methods

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
