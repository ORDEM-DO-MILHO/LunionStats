import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { Roles } from '../types/role.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async createUserTeacher(userData: CreateUserDto) {
    try {
      userData.role = Roles.Teacher;
      const user = new this.userModel(userData);
      return await user.save();
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

  public async createUserStudent(userData: CreateUserDto) {
    try {
      userData.role = Roles.Student;
      const user = new this.userModel(userData);
      return await user.save();
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

  public async createUserAdmin(userData: CreateUserDto) {
    try {
      userData.role = Roles.Admin;
      const user = new this.userModel(userData);
      return await user.save();
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

  public async findUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (err) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    }
  }

  public async findUserBySummoner(data: any) {
    try {
      const user = await this.userModel.findOne({
        summoner: data,
      });
      return user;
    } catch (err) {
      throw new HttpException('did_not_find_any_student', HttpStatus.NOT_FOUND);
    }
  }

  public async findAllUsers() {
    const users = await this.userModel.find();
    users.map(u => (u.password = undefined));
    return users;
  }

  public async roleByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    }
  }

  public async findUserById(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException('user_not_found', HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(id: string, userData: any) {
    try {
      if (userData.password) {
        userData.password = await this.encryptPassword(userData.password);
      }
      return await this.userModel.findOneAndUpdate({ id }, userData).exec();
    } catch (err) {
      throw new HttpException('user_not_updated', HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteUser(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
      }
      await this.userModel.deleteOne({ _id: user.id });
      return new HttpException('user_deleted!', HttpStatus.OK);
    } catch (err) {
      throw new HttpException('could_not_delete_user', HttpStatus.BAD_REQUEST);
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
