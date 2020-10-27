import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from '../services/auth.service';
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    profile: any,
    refreshToken: string,
    done: VerifyCallback,
  ): Promise<any> {
    const userLogin = {
      email: done['emails'][0].value,
      password: done['id'],
      summoner: '',
    };

    let user = await this.userService.findUserByEmail(userLogin.email);
    if (!user) {
      user = await this.authService.registerUserTeacher(userLogin);
    }
    return this.authService.signIn(user);
  }
}
