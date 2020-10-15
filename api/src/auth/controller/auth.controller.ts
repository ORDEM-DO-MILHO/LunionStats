import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IRequestLogin } from '../interfaces/request-login.interface';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUser: any) {
    return await this.authService.registerStudent(createUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() credentials: IRequestLogin) {
    return this.authService.signIn(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/teste')
  async getteste() {
    return 'hi you are authenticated';
  }
}
