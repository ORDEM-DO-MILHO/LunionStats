import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from 'src/auth/types/status.type';
import * as mongoose from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { UserRequestDto } from 'src/user/dto/user-request.dto';
import { Admin } from '../schema/admin.schema';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private readonly userService: UserService,
  ) {}

  async createAdmin(adminData: CreateAdminDto, userData: UserRequestDto) {
    const user = await this.userService.findUserById(userData._id);
    if (!user) {
      throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
    }
    try {
      delete user.password;
      delete user.__v;
      const admin = new this.adminModel({
        ...adminData,
        user: mongoose.Types.ObjectId(user._id),
        status: Status.Active,
      });

      return (await admin.save())
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
        'admin_create_bad_request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.adminModel
        .find()
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .exec();
    } catch (err) {
      throw new HttpException(
        'could_not_find_any_admin',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAdminById(id: string) {
    try {
      const admin = await this.adminModel.findById(id).exec();
      return admin
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .execPopulate();
    } catch (err) {
      throw new HttpException('admin_not_found', HttpStatus.NOT_FOUND);
    }
  }

  public async findAdminByUser(data: any) {
    try {
      const admin = await this.adminModel.findOne({
        user: data.user,
      });
      return admin
        .populate({
          path: 'user',
          select: '-__v -password',
        })
        .execPopulate();
    } catch (err) {
      throw new HttpException('did_not_find_any_admin', HttpStatus.NOT_FOUND);
    }
  }

  async updateAdmin(
    id: string,
    adminData: UpdateAdminDto,
    userData: UserRequestDto,
  ) {
    const user = await this.userService.findUserById(userData._id);
    const admin = await this.adminModel.findById(id);
    if (user._id.toString() === admin.user.toString()) {
      try {
        await this.adminModel.findByIdAndUpdate(id, adminData).exec();
        const admin = await this.adminModel.findById(id);
        return admin
          .populate({
            path: 'user',
            select: '-__v -password',
          })
          .execPopulate();
      } catch (err) {
        throw new HttpException(
          'could_not_update_admin',
          HttpStatus.NOT_MODIFIED,
        );
      }
    }
    throw new HttpException('not_authorized', HttpStatus.UNAUTHORIZED);
  }

  async deleteById(id: string, userData: any) {
    const user = await this.userService.findUserById(userData._id);
    const admin = await this.adminModel.findById(id);

    if (user._id.toString() === admin.user.toString()) {
      try {
        const admin = await this.adminModel.findById(id).exec();
        if (!admin) {
          throw new HttpException('admin_not_found', HttpStatus.NOT_FOUND);
        }
        await this.adminModel.deleteOne({ _id: admin.id });
        return new HttpException('admin_deleted!', HttpStatus.OK);
      } catch (err) {
        throw new HttpException(
          'could_not_delete_admin',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
