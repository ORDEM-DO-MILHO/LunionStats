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
import { IStudent } from '../interfaces/student.interface';
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
        return {
          message: `${Object.keys(err.keyValue)} already exists!`,
          code: 400,
        };
      }
      return err.keyValue;
    }
  }

  async findAll() {
    try {
      return await this.studentModel
        .find()
        .populate([
          {
            path: 'user',
            select: '-__v -password',
          },
          {
            path: 'annotations',
          },
        ])
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
        .populate([
          {
            path: 'user',
            select: '-__v -password',
          },
          {
            path: 'annotations',
          },
        ])
        .execPopulate();
    } catch (err) {
      throw new HttpException('student_not_found', HttpStatus.NOT_FOUND);
    }
  }

  async updateStudent(id: string, studentData: any, userData: any) {
    const user = await this.userService.findUserById(userData._id);
    const student = await this.studentModel.findById(id);
    if (
      user._id.toString() === student.user.toString() ||
      user.role === 'teacher' ||
      user.role === 'admin'
    ) {
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
}
