import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserCtx } from 'src/auth/interfaces/user-ctx.interface';
import { CreateAnnotationDto } from '../../teacher/dto/create-annotation.dto';
import { Annotation } from '../schema/annotation.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class AnnotationService {
  constructor(
    @InjectModel(Annotation.name)
    private readonly annotationModel: Model<Annotation>,
  ) {}

  async createAnnotation(data: CreateAnnotationDto, user: IUserCtx) {
    try {
      const annotation = new this.annotationModel({
        teacherId: mongoose.Types.ObjectId(user._id),
        studentId: mongoose.Types.ObjectId(data.studentId),
        ...data,
      });
      return await annotation.save();
    } catch (error) {
      return error;
    }
  }

  async findAnnotationById(id: any) {
    try {
      const annotation = await this.annotationModel.findById(id);
      if (!annotation) return null;
      return annotation;
    } catch (error) {
      return error;
    }
  }

  async findAnnotationByStudentId(id: any) {
    try {
      const annotation = await this.annotationModel
        .find({
          studentId: id,
        })
        .exec();

      if (!annotation) return null;

      return annotation;
    } catch (error) {
      return error;
    }
  }

  // TODO
  async findAnnotationByTeacherId(teacherId: any) {
    try {
      console.log(teacherId._id);
      const annotation = await this.annotationModel
        .findOne({
          teacherId: teacherId._id,
        })
        .exec();
      // .populate([
      //   {
      //     path: 'teacherId',
      //   },
      //   {
      //     path: 'studentId',
      //   },
      // ])
      // .exec();
      if (!annotation) return null;
      return annotation;
    } catch (error) {
      return error;
    }
  }

  async findAnnotationByMatchId(matId: any) {
    try {
      const matchId = matId.toString();
      const annotation = await this.annotationModel.findOne({ matchId });
      return annotation;
    } catch (error) {
      return error;
    }
  }

  async updateAnnotationById(id: any, content: any) {
    try {
      const annotation = await this.annotationModel.findByIdAndUpdate(id, {
        content,
      });

      return annotation;
    } catch (error) {
      return error;
    }
  }

  async deleteAnnotation(id: any) {
    try {
      await this.annotationModel.findByIdAndDelete(id);
      return { message: 'annotation_deleted' };
    } catch (error) {
      return error;
    }
  }
}
