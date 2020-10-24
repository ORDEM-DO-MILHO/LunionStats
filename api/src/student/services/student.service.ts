import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from 'src/auth/types/status.type';
import { CreateStudentDto } from '../dto/create-student.dto';
import { Student } from '../schemas/student.schema';
import * as mongoose from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { UserRequestDto } from 'src/user/dto/user-request.dto';
@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
    private readonly userService: UserService,
  ) {}

  async createStudent(studentData: CreateStudentDto, userData: UserRequestDto) {
    const user = await this.userService.findUserById(userData._id);
    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }
    try {
      delete user.password;
      delete user.__v;
      const student = new this.studentModel({
        ...studentData,
        user: mongoose.Types.ObjectId(user._id),
        status: Status.Active,
      });

      return (await student.save())
        .populate({ path: 'user', select: '-__v -password' })
        .execPopulate();
    } catch (err) {
      if (err.code === 11000) {
        const message = err.message.split('{')[1];
        return {
          message: `{${message} already exists`,
        };
      }
      throw new HttpException(
        'student_create_bad_request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentModel
        .find()
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .exec();
    } catch (err) {
      throw new HttpException(
        'could_not_find_any_student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findStudentById(id: string) {
    try {
      const student = await this.studentModel.findById(id).exec();
      return student
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .execPopulate();
    } catch (err) {
      throw new HttpException('student_not_found', HttpStatus.NOT_FOUND);
    }
  }

  async updateStudent(
    id: string,
    studentData: UpdateStudentDto,
    userData: UserRequestDto,
  ) {
    const user = await this.userService.findUserById(userData._id);
    const student = await this.studentModel.findById(id);
    if (user._id.toString() === student.user.toString()) {
      try {
        await this.studentModel.findByIdAndUpdate(id, studentData).exec();
        const student = await this.studentModel.findById(id);
        return student
          .populate({
            path: 'user',
            select: '-__v -password',
          })
          .execPopulate();
      } catch (err) {
        throw new HttpException(
          'could_not_update_student',
          HttpStatus.NOT_MODIFIED,
        );
      }
    }
    throw new HttpException('not_authorized', HttpStatus.UNAUTHORIZED);
  }

  async deleteById(id: string) {
    try {
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new HttpException('student_not_found', HttpStatus.NOT_FOUND);
      }
      await this.studentModel.deleteOne({ _id: student.id });
      return new HttpException('student_deleted!', HttpStatus.OK);
    } catch (err) {
      throw new HttpException(
        'could_not_delete_student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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
