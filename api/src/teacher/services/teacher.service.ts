import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../schema/teacher.schema';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UserService } from 'src/user/services/user.service';
import { Status } from 'src/auth/types/status.type';
import * as mongoose from 'mongoose';
import { UserRequestDto } from 'src/user/dto/user-request.dto';
@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
    private readonly userService: UserService,
  ) {}

  public async createTeacher(
    teacherData: CreateTeacherDto,
    userData: UserRequestDto,
  ) {
    const user = await this.userService.findUserById(userData._id);
    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }
    try {
      delete user.password;
      delete user.__v;
      const teacher = new this.teacherModel({
        ...teacherData,
        user: mongoose.Types.ObjectId(user._id),
        status: Status.Active,
      });

      return (await teacher.save())
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
        'teacher_create_bad_request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findAllTeachers() {
    try {
      return await this.teacherModel
        .find()
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .exec();
    } catch (err) {
      throw new HttpException(
        'could_not_find_any_teacher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findTeacherById(id: string) {
    try {
      const teacher = await this.teacherModel.findById(id).exec();
      return teacher
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .execPopulate();
    } catch (err) {
      throw new HttpException('teacher_not_found', HttpStatus.NOT_FOUND);
    }
  }

  public async updateTeacher(
    id: string,
    teacherData: UpdateTeacherDto,
    userData: UserRequestDto,
  ) {
    const user = await this.userService.findUserById(userData._id);
    const teacher = await this.teacherModel.findById(id);
    if (user._id.toString() === teacher.user.toString()) {
      try {
        await this.teacherModel.findByIdAndUpdate(id, teacherData).exec();
        const teacher = await this.teacherModel.findById(id);
        return teacher
          .populate({
            path: 'user',
            select: '-__v -password',
          })
          .execPopulate();
      } catch (err) {
        throw new HttpException(
          'could_not_update_teacher',
          HttpStatus.NOT_MODIFIED,
        );
      }
    }
    throw new HttpException('not_authorized', HttpStatus.UNAUTHORIZED);
  }

  public async deleteTeacher(id: string) {
    try {
      const teacher = await this.teacherModel.findById(id).exec();
      if (!teacher) {
        throw new HttpException('teacher_not_found', HttpStatus.NOT_FOUND);
      }
      await this.teacherModel.deleteOne({ _id: teacher.id });
      return new HttpException('teacher_deleted!', HttpStatus.OK);
    } catch (err) {
      throw new HttpException(
        'could_not_delete_teacher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
