import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../schemas/student.schema';
import { CreateStudentDto } from '../dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async createStudent(student: CreateStudentDto) {
    const studentModel = new this.studentModel(student);
    try {
      return await studentModel.save();
    } catch (err) {
      throw new HttpException(
        'could_not_create_student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      const students = await this.studentModel.find();
      students.map(s => (s.password = undefined));
      return students;
    } catch (err) {
      throw new HttpException(
        'could_not_find_any_student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findStudentById(id: string) {
    try {
      return await this.studentModel.findById(id).exec();
    } catch (err) {
      throw new HttpException('student_not_found', HttpStatus.NOT_FOUND);
    }
  }

  async findStudentByEmail(email: string) {
    try {
      return await this.studentModel.findOne({ email }).exec();
    } catch (err) {
      throw new HttpException('email_not_found', HttpStatus.NOT_FOUND);
    }
  }

  async updateStudent(id: string, studentData: any) {
    try {
      await this.studentModel.findByIdAndUpdate(id, studentData).exec();
      return await this.studentModel.findById(id);
    } catch (err) {
      throw new HttpException(
        'could_not_update_student',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async deleteById(id: string) {
    try {
      await this.studentModel.findByIdAndDelete(id).exec();
      return { message: 'student_deleted' };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'could_not_delete_student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // TODO NESTED ANNOTATIONS
  // async createStudentAnnotation(studentId: string, annotation: any) {
  //   // try {
  //   //   let student = await this.studentModel.findById(studentId);
  //   //   student.annotations = annotation;
  //   //   console.log(student);
  //   //   return await student.save();
  //   // } catch (err) {
  //   //   console.log(err);
  //   //   throw new BadRequestException();
  //   // }
  // }

  // async updateStudentAnnotation(id: string, annotation: any) {
  //   //   try {
  //   //     const s = await this.studentModel.findOneAndUpdate(
  //   //       { _id:
  //   //         'annotations._id': annotation._id,
  //   //       },
  //   //       { $addToSet: { annotations_id: annotation } },
  //   //     );
  //   //     console.log(s);
  //   //   } catch (err) {
  //   //     console.log(err);
  //   //     throw new BadRequestException();
  //   //   }
  // }

  // async deleteStudentAnnotation(id: string, annotation: any) {
  //   //   try {
  //   //     const student = await this.studentModel.findById(id);
  //   //     await student.annotations
  //   //       .id(mongoose.Types.ObjectId(annotation._id))
  //   //       .remove();
  //   //     return await student.save();
  //   //   } catch (err) {
  //   //     console.log(err);
  //   //     throw new BadRequestException();
  //   //   }
  // }
}