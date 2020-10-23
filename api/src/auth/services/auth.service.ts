import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { StudentService } from 'src/student/services/student.service';
import { TeacherService } from 'src/teacher/services/teacher.service';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUserTeacher(userData: CreateUserDto) {
    try {
      userData.password = await this.encryptPassword(userData.password);
      const user = await this.userService.createUserTeacher(userData);
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException(
        'student_create_went_wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async registerUserStudent(userData: CreateUserDto) {
    try {
      userData.password = await this.encryptPassword(userData.password);
      const user = await this.userService.createUserStudent(userData);
      user.password = undefined;

      return user;
    } catch (err) {
      throw new HttpException(
        'student_create_went_wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async registerUserAdmin(userData: CreateUserDto) {
    try {
      userData.password = await this.encryptPassword(userData.password);
      const user = await this.userService.createUserAdmin(userData);
      user.password = undefined;

      return user;
    } catch (err) {
      throw new HttpException(
        'student_create_went_wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async authenticaUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (user && (await this.comparePassword(password, user.password))) {
        user.password = undefined;
        return user;
      }
      throw new HttpException('user_login_failed', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      throw new HttpException('user_login_failed', HttpStatus.UNAUTHORIZED);
    }
  }

  public async signIn(data: any) {
    const user = await this.userService.findUserByEmail(data.email);
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req) {
    if (!req.user) return 'no user';
    return req.user;
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
