import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { GoogleOAuthGuard } from '../guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/admin')
  async registerAdmin(@Body() createUser: CreateUserDto) {
    return await this.authService.registerUserAdmin(createUser);
  }

  @Get('/google/teacher')
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuthCallback(@Req() req) {
    return await this.authService.googleLogin(req);
  }

  @Post('/register/teacher')
  async registerTeacher(@Body() createUser: CreateUserDto) {
    return await this.authService.registerUserTeacher(createUser);
  }

  @Post('/register/student')
  async registerStudent(@Body() createUser: CreateUserDto) {
    return await this.authService.registerUserStudent(createUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() credentials: LoginUserDto) {
    return this.authService.signIn(credentials);
  }
}
