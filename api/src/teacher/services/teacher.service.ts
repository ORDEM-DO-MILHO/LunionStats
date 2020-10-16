import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { Teacher } from '../schema/teacher.schema';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
  ) {}

  public async createTeacher(teacherData: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(teacherData);
    try {
      return await teacher.save();
    } catch (err) {
      throw new HttpException(
        'could_not_create_teacher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findAllTeachers() {
    try {
      const teachers = await this.teacherModel.find();
      return teachers.map(t => (t.password = undefined));
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
      teacher.password = undefined;
      return teacher;
    } catch (err) {
      throw new HttpException('did_not_find_any_teacher', HttpStatus.NOT_FOUND);
    }
  }

  public async findTeacherByEmail(email: string) {
    try {
      const teacher = await this.teacherModel.findOne({ email }).exec();
      teacher.password = undefined;
      return teacher;
    } catch (err) {
      throw new HttpException('did_not_find_any_teacher', HttpStatus.NOT_FOUND);
    }
  }

  public async findTeacherBySummoner(summoner: string) {
    try {
      const teacher = await this.teacherModel.findOne({ summoner }).exec();
      teacher.password = undefined;
      return teacher;
    } catch (err) {
      throw new HttpException('did_not_find_any_teacher', HttpStatus.NOT_FOUND);
    }
  }

  public async updateTeacher(id: string, teacherData: UpdateTeacherDto) {
    try {
      const teacher = await this.teacherModel
        .findOneAndUpdate({ id }, { teacherData })
        .exec();
      teacher.password = undefined;
      return teacher;
    } catch (err) {
      throw new HttpException(
        'could_not_update_teacher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async deleteTeacher(id: string) {
    try {
      await this.teacherModel.findOneAndDelete({ id });
      return { message: 'teacher_deleted' };
    } catch (err) {
      throw new HttpException(
        'could_not_delete_teacher',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
