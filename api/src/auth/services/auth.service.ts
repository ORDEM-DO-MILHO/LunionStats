import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StudentService } from 'src/student/services/student.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  public async registerStudent(studentData: any) {
    try {
      studentData.password = await this.encryptPassword(studentData.password);
      const student = await this.studentService.createStudent(studentData);
      student.password = undefined;
      return student;
    } catch (err) {
      throw new HttpException(
        'student_create_something_went_wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(email: string, password: string) {
    try {
      const student = await this.studentService.findStudentByEmail(email);
      if (student && (await this.comparePassword(password, student.password))) {
        student.password = undefined;
        return student;
      }
      throw new HttpException('user_login_failed', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      throw new HttpException('user_login_failed', HttpStatus.UNAUTHORIZED);
    }
  }

  public async signIn(data: any) {
    const payload = { email: data.email, sub: data._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
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
